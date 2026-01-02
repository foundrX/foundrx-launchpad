import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    name: string;
    avatar: string | null;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSelectConversation = (id: string, name: string, avatar: string | null) => {
    setSelectedConversation({ id, name, avatar });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
              <Skeleton className="h-full" />
              <Skeleton className="h-full md:col-span-2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-8">
            <span className="text-gradient">Messages</span>
          </h1>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Conversation List */}
            <Card className={`bg-card border-border h-[600px] overflow-hidden ${
              selectedConversation ? "hidden md:block" : ""
            }`}>
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="h-[calc(100%-57px)] overflow-y-auto">
                <ConversationList
                  onSelectConversation={handleSelectConversation}
                  selectedId={selectedConversation?.id}
                />
              </div>
            </Card>

            {/* Chat Window */}
            <Card className={`bg-card border-border h-[600px] md:col-span-2 overflow-hidden ${
              !selectedConversation ? "hidden md:flex" : ""
            }`}>
              {selectedConversation ? (
                <ChatWindow
                  conversationId={selectedConversation.id}
                  participantName={selectedConversation.name}
                  participantAvatar={selectedConversation.avatar}
                  onBack={() => setSelectedConversation(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageCircle className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm">Choose a chat to start messaging</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
