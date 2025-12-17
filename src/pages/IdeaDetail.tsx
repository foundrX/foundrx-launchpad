import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Lightbulb,
  Target,
  Users,
  MessageSquare,
  Send,
  UserPlus,
  Eye,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IdeaData {
  id: string;
  title: string;
  description: string;
  goals: string | null;
  required_help: string | null;
  images: string[] | null;
  video_url: string | null;
  views_count: number;
  created_at: string;
  user_id: string;
}

interface ProfileData {
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  bio: string | null;
}

interface Feedback {
  id: string;
  content: string;
  feedback_type: string;
  created_at: string;
  user_id: string;
  profile?: ProfileData;
}

const feedbackTypes = [
  { value: "comment", label: "Comment" },
  { value: "advice", label: "Advice" },
  { value: "question", label: "Question" },
  { value: "collaboration_offer", label: "Collaboration Offer" },
];

const IdeaDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<IdeaData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFeedback, setNewFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState("comment");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIdea();
      incrementViews();
    }
  }, [id]);

  const fetchIdea = async () => {
    try {
      const { data: ideaData, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setIdea(ideaData);

      // Fetch creator profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, is_verified, bio")
        .eq("user_id", ideaData.user_id)
        .maybeSingle();

      setProfile(profileData);

      // Fetch feedback
      const { data: feedbackData } = await supabase
        .from("idea_feedback")
        .select("*")
        .eq("idea_id", id)
        .order("created_at", { ascending: false });

      // Fetch profiles for each feedback
      const feedbackWithProfiles = await Promise.all(
        (feedbackData || []).map(async (fb) => {
          const { data: fbProfile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, is_verified, bio")
            .eq("user_id", fb.user_id)
            .maybeSingle();

          return { ...fb, profile: fbProfile };
        })
      );

      setFeedback(feedbackWithProfiles);
    } catch (error) {
      console.error("Error fetching idea:", error);
      toast.error("Failed to load idea");
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async () => {
    if (!id) return;
    try {
      // Increment views using update
      const { data: currentIdea } = await supabase
        .from("ideas")
        .select("views_count")
        .eq("id", id)
        .single();
      
      if (currentIdea) {
        await supabase
          .from("ideas")
          .update({ views_count: (currentIdea.views_count || 0) + 1 })
          .eq("id", id);
      }
    } catch {
      // Ignore errors for view counting
    }
  };

  const handleSubmitFeedback = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!newFeedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("idea_feedback").insert({
        idea_id: id,
        user_id: user.id,
        content: newFeedback.trim(),
        feedback_type: feedbackType,
      });

      if (error) throw error;

      toast.success("Feedback submitted!");
      setNewFeedback("");
      fetchIdea(); // Refresh feedback list
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCollaborationRequest = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!idea) return;

    try {
      const { error } = await supabase.from("collaboration_requests").insert({
        from_user_id: user.id,
        to_user_id: idea.user_id,
        idea_id: idea.id,
        message: `I'd like to collaborate on "${idea.title}"`,
      });

      if (error) throw error;
      toast.success("Collaboration request sent!");
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("You've already sent a collaboration request");
      } else {
        toast.error("Failed to send request");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-4xl">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-64 mb-6" />
            <Skeleton className="h-32" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Idea not found</h1>
            <Button onClick={() => navigate("/ideas")}>Back to Ideas</Button>
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
        <div className="container px-4 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/ideas")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ideas
          </Button>

          {/* Idea Header */}
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl md:text-3xl mb-2">
                    {idea.title}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {profile?.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {profile?.full_name || "Anonymous"}
                        </span>
                        {profile?.is_verified && (
                          <BadgeCheck className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{idea.views_count} views</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {idea.description}
                </p>
              </div>

              {idea.goals && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-primary" />
                    Goals
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {idea.goals}
                  </p>
                </div>
              )}

              {idea.required_help && (
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    Looking For
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {idea.required_help}
                  </p>
                </div>
              )}

              {user && user.id !== idea.user_id && (
                <Button
                  onClick={handleCollaborationRequest}
                  className="gradient-primary text-primary-foreground"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Request Collaboration
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Feedback & Comments ({feedback.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Feedback Form */}
              <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex gap-4">
                  <Select value={feedbackType} onValueChange={setFeedbackType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Share your thoughts, advice, or questions..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={submitting}
                  className="gradient-primary text-primary-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>

              {/* Feedback List */}
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No feedback yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  feedback.map((fb) => (
                    <div
                      key={fb.id}
                      className="p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={fb.profile?.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {fb.profile?.full_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {fb.profile?.full_name || "Anonymous"}
                            </span>
                            {fb.profile?.is_verified && (
                              <BadgeCheck className="w-3 h-3 text-primary" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {feedbackTypes.find((t) => t.value === fb.feedback_type)?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(fb.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {fb.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IdeaDetail;