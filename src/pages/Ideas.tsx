import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Plus, Eye, MessageSquare, Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IdeasGridSkeleton, PageHeaderSkeleton } from "@/components/skeletons/PageSkeletons";

interface Idea {
  id: string;
  title: string;
  description: string;
  goals: string | null;
  required_help: string | null;
  views_count: number;
  created_at: string;
  user_id: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    is_verified: boolean;
  };
  feedback_count?: number;
}

// Demo profiles for sample ideas
const demoProfiles: Record<string, { full_name: string; is_verified: boolean; age: number }> = {
  '11111111-1111-1111-1111-111111111111': { full_name: 'Arjun Mehta (14 yrs)', is_verified: true, age: 14 },
  '22222222-2222-2222-2222-222222222222': { full_name: 'Priya Sharma (16 yrs)', is_verified: true, age: 16 },
  '33333333-3333-3333-3333-333333333333': { full_name: 'Vikram Patel (22 yrs)', is_verified: false, age: 22 },
  '44444444-4444-4444-4444-444444444444': { full_name: 'Sneha Gupta (19 yrs)', is_verified: true, age: 19 },
  '55555555-5555-5555-5555-555555555555': { full_name: 'Rahul Joshi (28 yrs)', is_verified: true, age: 28 },
};

const Ideas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const { data: ideasData, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles and feedback counts for each idea
      const ideasWithDetails = await Promise.all(
        (ideasData || []).map(async (idea) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url, is_verified")
            .eq("user_id", idea.user_id)
            .maybeSingle();

          const { count: feedbackCount } = await supabase
            .from("idea_feedback")
            .select("*", { count: "exact", head: true })
            .eq("idea_id", idea.id);

          // Use demo profile if no real profile exists
          const demoProfile = demoProfiles[idea.user_id];
          const displayProfile = profile || (demoProfile ? {
            full_name: demoProfile.full_name,
            avatar_url: null,
            is_verified: demoProfile.is_verified,
          } : null);

          return {
            ...idea,
            profile: displayProfile,
            feedback_count: feedbackCount || 0,
          };
        })
      );

      setIdeas(ideasWithDetails);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
                Explore <span className="text-gradient">Ideas</span>
              </h1>
              <p className="text-muted-foreground">
                Discover innovative ideas and collaborate with creators
              </p>
            </div>
            <Button
              onClick={() => (user ? navigate("/ideas/new") : navigate("/auth"))}
              className="gradient-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Your Idea
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {loading ? (
            <IdeasGridSkeleton />
          ) : filteredIdeas.length === 0 ? (
            <Card className="bg-card border-border p-12 text-center">
              <Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No ideas yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your innovative idea!
              </p>
              <Button
                onClick={() => (user ? navigate("/ideas/new") : navigate("/auth"))}
                className="gradient-primary text-primary-foreground"
              >
                Post Your Idea
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <Link key={idea.id} to={`/ideas/${idea.id}`}>
                  <Card className="bg-card border-border h-full hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-2">{idea.title}</CardTitle>
                        {idea.profile?.is_verified && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        by {idea.profile?.full_name || "Anonymous"}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {idea.description}
                      </p>
                      {idea.required_help && (
                        <Badge variant="outline" className="mb-4">
                          <Users className="w-3 h-3 mr-1" />
                          Looking for help
                        </Badge>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {idea.views_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {idea.feedback_count}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ideas;