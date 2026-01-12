import { useState, useRef, useEffect } from "react";
import { useChatMessages, Message } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Send,
  Phone,
  Link2,
  Store,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ChatWindowProps {
  conversationId: string;
  participantName?: string;
  participantAvatar?: string | null;
  onBack?: () => void;
}

const ChatWindow = ({
  conversationId,
  participantName,
  participantAvatar,
  onBack,
}: ChatWindowProps) => {
  const { user } = useAuth();
  const { messages, loading, addOptimisticMessage, removeOptimisticMessage } = useChatMessages(conversationId);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessages, setSendingMessages] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    const tempId = `temp-${Date.now()}`;
    const messageContent = newMessage.trim();
    
    // Optimistic update - add message immediately
    const optimisticMessage: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: user.id,
      content: messageContent,
      message_type: "text",
      metadata: null,
      created_at: new Date().toISOString(),
      is_read: false,
      sender_profile: null,
      isOptimistic: true,
    };
    
    addOptimisticMessage(optimisticMessage);
    setNewMessage("");
    setSendingMessages(prev => new Set(prev).add(tempId));

    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: messageContent,
        message_type: "text",
      });

      if (error) throw error;

      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);
      
      // Remove the optimistic message (realtime will add the real one)
      removeOptimisticMessage(tempId);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      // Remove optimistic message on error
      removeOptimisticMessage(tempId);
    } finally {
      setSendingMessages(prev => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  const sendResourceMessage = async (type: "vendor" | "link" | "contact") => {
    const content = prompt(
      type === "vendor"
        ? "Enter vendor details (Name, Contact, Services):"
        : type === "link"
        ? "Enter the link/resource URL:"
        : "Enter contact details:"
    );

    if (!content || !user) return;

    try {
      await supabase.from("chat_messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: type,
        metadata: { type },
      });

      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} shared!`);
    } catch (error) {
      console.error("Error sharing resource:", error);
      toast.error("Failed to share resource");
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "vendor":
        return <Store className="w-4 h-4 text-primary" />;
      case "link":
        return <Link2 className="w-4 h-4 text-primary" />;
      case "contact":
        return <Phone className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "" : "justify-end"}`}>
              <Skeleton className="h-16 w-48 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <Avatar className="w-10 h-10">
          <AvatarImage src={participantAvatar || undefined} />
          <AvatarFallback className="gradient-primary text-primary-foreground">
            {participantName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{participantName || "Chat"}</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
              <p className="text-sm mt-2">
                Share vendor contacts, resources, or just chat.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender_id === user?.id;
              const isOptimistic = msg.isOptimistic;
              const isSending = sendingMessages.has(msg.id);
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} ${isOptimistic ? "animate-in fade-in-50 duration-200" : ""}`}
                >
                  <div className={`flex gap-2 max-w-[75%] ${isOwn ? "flex-row-reverse" : ""}`}>
                    {!isOwn && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={msg.sender_profile?.avatar_url || undefined} />
                        <AvatarFallback className="gradient-secondary text-secondary-foreground text-xs">
                          {msg.sender_profile?.full_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwn
                            ? "gradient-primary text-primary-foreground"
                            : "bg-muted"
                        } ${isOptimistic ? "opacity-70" : ""}`}
                      >
                        {msg.message_type !== "text" && (
                          <div className="flex items-center gap-2 mb-1">
                            {getMessageTypeIcon(msg.message_type)}
                            <Badge variant="secondary" className="text-xs">
                              {msg.message_type}
                            </Badge>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(msg.created_at), "HH:mm")}
                        </p>
                        {isSending && (
                          <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => sendResourceMessage("vendor")}
          className="flex-shrink-0"
        >
          <Store className="w-4 h-4 mr-1" />
          Share Vendor
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => sendResourceMessage("link")}
          className="flex-shrink-0"
        >
          <Link2 className="w-4 h-4 mr-1" />
          Share Link
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => sendResourceMessage("contact")}
          className="flex-shrink-0"
        >
          <Phone className="w-4 h-4 mr-1" />
          Share Contact
        </Button>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-muted border-border"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sendingMessages.size > 0}
            className="gradient-primary text-primary-foreground"
          >
            {sendingMessages.size > 0 ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
