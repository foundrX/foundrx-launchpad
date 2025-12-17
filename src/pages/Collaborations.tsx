import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Users,
  Check,
  X,
  Clock,
  ArrowRight,
  Lightbulb,
  Send,
  Inbox,
} from "lucide-react";

interface CollaborationRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  idea_id: string | null;
  message: string;
  status: string;
  created_at: string;
  from_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  to_profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  idea?: {
    title: string;
  };
}

const Collaborations = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState<CollaborationRequest[]>([]);
  const [outgoing, setOutgoing] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchCollaborations();
    }
  }, [user, authLoading, navigate]);

  const fetchCollaborations = async () => {
    if (!user) return;

    try {
      // Fetch incoming requests
      const { data: incomingData } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("to_user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch outgoing requests
      const { data: outgoingData } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("from_user_id", user.id)
        .order("created_at", { ascending: false });

      // Enrich with profile and idea data
      const enrichRequests = async (requests: any[]) => {
        return Promise.all(
          (requests || []).map(async (req) => {
            const { data: fromProfile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("user_id", req.from_user_id)
              .maybeSingle();

            const { data: toProfile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("user_id", req.to_user_id)
              .maybeSingle();

            let idea = null;
            if (req.idea_id) {
              const { data: ideaData } = await supabase
                .from("ideas")
                .select("title")
                .eq("id", req.idea_id)
                .maybeSingle();
              idea = ideaData;
            }

            return {
              ...req,
              from_profile: fromProfile,
              to_profile: toProfile,
              idea,
            };
          })
        );
      };

      const enrichedIncoming = await enrichRequests(incomingData || []);
      const enrichedOutgoing = await enrichRequests(outgoingData || []);

      setIncoming(enrichedIncoming);
      setOutgoing(enrichedOutgoing);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (id: string, status: "accepted" | "rejected") => {
    try {
      const { error } = await supabase
        .from("collaboration_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Request ${status}!`);
      fetchCollaborations();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error("Failed to update request");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="text-green-500 border-green-500">
            <Check className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-3xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="h-12 w-full mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingIncoming = incoming.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-8">
            <span className="text-gradient">Collaborations</span>
          </h1>

          <Tabs defaultValue="incoming">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="incoming" className="flex-1">
                <Inbox className="w-4 h-4 mr-2" />
                Incoming
                {pendingIncoming > 0 && (
                  <Badge className="ml-2 gradient-primary">{pendingIncoming}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="outgoing" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incoming">
              {incoming.length === 0 ? (
                <Card className="bg-card border-border p-12 text-center">
                  <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No incoming requests</h3>
                  <p className="text-muted-foreground">
                    When someone wants to collaborate with you, their requests will appear here.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {incoming.map((request) => (
                    <Card key={request.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.from_profile?.avatar_url || undefined} />
                            <AvatarFallback className="gradient-primary text-primary-foreground">
                              {request.from_profile?.full_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">
                                {request.from_profile?.full_name || "Anonymous"}
                              </span>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.message}
                            </p>
                            {request.idea && (
                              <Link
                                to={`/ideas/${request.idea_id}`}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <Lightbulb className="w-3 h-3" />
                                {request.idea.title}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {request.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRequest(request.id, "accepted")}
                                className="gradient-primary text-primary-foreground"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRequest(request.id, "rejected")}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="outgoing">
              {outgoing.length === 0 ? (
                <Card className="bg-card border-border p-12 text-center">
                  <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No sent requests</h3>
                  <p className="text-muted-foreground mb-4">
                    Find ideas you'd like to collaborate on and send a request!
                  </p>
                  <Button
                    onClick={() => navigate("/ideas")}
                    className="gradient-primary text-primary-foreground"
                  >
                    Browse Ideas
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {outgoing.map((request) => (
                    <Card key={request.id} className="bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.to_profile?.avatar_url || undefined} />
                            <AvatarFallback className="gradient-primary text-primary-foreground">
                              {request.to_profile?.full_name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-muted-foreground">To:</span>
                              <span className="font-medium">
                                {request.to_profile?.full_name || "Anonymous"}
                              </span>
                              {getStatusBadge(request.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.message}
                            </p>
                            {request.idea && (
                              <Link
                                to={`/ideas/${request.idea_id}`}
                                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <Lightbulb className="w-3 h-3" />
                                {request.idea.title}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collaborations;