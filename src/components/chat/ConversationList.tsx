import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ConversationListSkeleton } from "@/components/skeletons/PageSkeletons";

interface ConversationListProps {
  onSelectConversation: (conversationId: string, participantName: string, participantAvatar: string | null) => void;
  selectedId?: string;
}

const ConversationList = ({ onSelectConversation, selectedId }: ConversationListProps) => {
  const { user } = useAuth();
  const { conversations, loading } = useChat();

  if (loading) {
    return <ConversationListSkeleton />;
  }

  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>No conversations yet.</p>
        <p className="text-sm mt-2">Start a chat from the Collaborations page!</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conv) => {
        const otherParticipant = conv.participants?.find(
          (p) => p.user_id !== user?.id
        );
        const displayName = conv.name || otherParticipant?.full_name || "Unknown";
        const avatarUrl = otherParticipant?.avatar_url;
        const isSelected = selectedId === conv.id;

        return (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id, displayName, avatarUrl || null)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
              isSelected
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted"
            }`}
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground">
                  {displayName[0]}
                </AvatarFallback>
              </Avatar>
              {(conv.unread_count || 0) > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center gradient-primary text-primary-foreground text-xs">
                  {conv.unread_count}
                </Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{displayName}</span>
                {conv.last_message && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(conv.last_message.created_at), {
                      addSuffix: false,
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conv.last_message?.content || "No messages yet"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
