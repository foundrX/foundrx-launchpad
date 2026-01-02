import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  metadata: any;
  created_at: string;
  is_read: boolean;
  sender_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface Conversation {
  id: string;
  name: string | null;
  is_group: boolean;
  collaboration_id: string | null;
  created_at: string;
  updated_at: string;
  participants?: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  }[];
  last_message?: Message | null;
  unread_count?: number;
}

export const useChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      // Get all conversations where user is a participant
      const { data: participantData } = await supabase
        .from("chat_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (!participantData || participantData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participantData.map((p) => p.conversation_id);

      const { data: convData } = await supabase
        .from("chat_conversations")
        .select("*")
        .in("id", conversationIds)
        .order("updated_at", { ascending: false });

      // Enrich with participants and last message
      const enrichedConversations = await Promise.all(
        (convData || []).map(async (conv) => {
          // Get participants
          const { data: participants } = await supabase
            .from("chat_participants")
            .select("user_id")
            .eq("conversation_id", conv.id);

          const participantProfiles = await Promise.all(
            (participants || []).map(async (p) => {
              const { data: profile } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("user_id", p.user_id)
                .maybeSingle();
              return {
                user_id: p.user_id,
                full_name: profile?.full_name || null,
                avatar_url: profile?.avatar_url || null,
              };
            })
          );

          // Get last message
          const { data: lastMessages } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          // Get unread count
          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("is_read", false)
            .neq("sender_id", user.id);

          return {
            ...conv,
            participants: participantProfiles,
            last_message: lastMessages?.[0] || null,
            unread_count: count || 0,
          };
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startConversation = async (otherUserId: string, collaborationId?: string) => {
    if (!user) return null;

    try {
      // Check if conversation already exists between these users
      const { data: existingParticipants } = await supabase
        .from("chat_participants")
        .select("conversation_id")
        .eq("user_id", user.id);

      if (existingParticipants) {
        for (const ep of existingParticipants) {
          const { data: otherParticipant } = await supabase
            .from("chat_participants")
            .select("*")
            .eq("conversation_id", ep.conversation_id)
            .eq("user_id", otherUserId)
            .maybeSingle();

          if (otherParticipant) {
            // Conversation already exists
            return ep.conversation_id;
          }
        }
      }

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          is_group: false,
          collaboration_id: collaborationId || null,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add both participants
      const { error: participantError } = await supabase
        .from("chat_participants")
        .insert([
          { conversation_id: newConv.id, user_id: user.id },
          { conversation_id: newConv.id, user_id: otherUserId },
        ]);

      if (participantError) throw participantError;

      await fetchConversations();
      return newConv.id;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return null;
    }
  };

  const sendMessage = async (conversationId: string, content: string, messageType = "text", metadata?: any) => {
    if (!user) return false;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType,
        metadata,
      });

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  return {
    conversations,
    loading,
    fetchConversations,
    startConversation,
    sendMessage,
  };
};

export const useChatMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      // Enrich with sender profiles
      const enrichedMessages = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", msg.sender_id)
            .maybeSingle();

          return {
            ...msg,
            sender_profile: profile,
          };
        })
      );

      setMessages(enrichedMessages);

      // Mark messages as read
      if (user) {
        await supabase
          .from("chat_messages")
          .update({ is_read: true })
          .eq("conversation_id", conversationId)
          .neq("sender_id", user.id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription
    if (conversationId) {
      const channel = supabase
        .channel(`messages-${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, fetchMessages]);

  return { messages, loading, fetchMessages };
};
