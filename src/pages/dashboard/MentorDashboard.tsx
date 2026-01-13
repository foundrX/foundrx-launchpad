import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Lightbulb,
  BookOpen,
  MessageSquare,
  ArrowRight,
  GraduationCap,
  Heart,
  Award,
  TrendingUp,
} from "lucide-react";

const menuItems = [
  { title: "Student Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Help Students", url: "/dashboard/mentor/students", icon: GraduationCap },
  { title: "Business Essentials", url: "/dashboard/mentor/essentials", icon: BookOpen },
  { title: "Share Tips", url: "/dashboard/mentor/tips", icon: Heart },
  { title: "Messages", url: "/collaborations", icon: MessageSquare },
];

const MentorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user === null) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const { data: publishedIdeas } = useQuery({
    queryKey: ["publishedIdeas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("ideas")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  const { data: collaborationRequests } = useQuery({
    queryKey: ["mentorRequests", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("to_user_id", user.id)
        .eq("status", "pending");
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems} roleLabel="Mentor" roleIcon={Users}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Mentor Dashboard 🎓</h2>
              <p className="opacity-90 max-w-xl">
                Guide the next generation of entrepreneurs. Help students refine their ideas, share your experience, and make a lasting impact.
              </p>
            </div>
            <Award className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-violet-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{collaborationRequests?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Mentorship Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Students Mentored</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Tips Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ideas to Review */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Student Ideas
                </CardTitle>
                <CardDescription>Ideas that could use your guidance</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/ideas">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {publishedIdeas && publishedIdeas.length > 0 ? (
                <div className="space-y-3">
                  {publishedIdeas.slice(0, 4).map((idea) => (
                    <Link
                      key={idea.id}
                      to={`/ideas/${idea.id}`}
                      className="block p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{idea.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {idea.description}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Give Feedback
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No ideas to review yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mentor Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Mentor Actions</CardTitle>
              <CardDescription>Ways to help students succeed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/mentor/students">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Find Students to Help
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/mentor/essentials">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Business Essentials Guide
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/mentor/tips">
                  <Heart className="w-4 h-4 mr-2" />
                  Share Your Tips
                </Link>
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Your experience can shape tomorrow's entrepreneurs.
                </p>
                <Button className="w-full gradient-primary text-primary-foreground border-0">
                  Start Mentoring
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorDashboard;
