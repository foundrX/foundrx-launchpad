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
  GraduationCap,
  Lightbulb,
  Users,
  BookOpen,
  MessageSquare,
  Plus,
  ArrowRight,
  Sparkles,
  Target,
  Rocket,
} from "lucide-react";

const menuItems = [
  { title: "Explore Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Post Idea", url: "/ideas/new", icon: Plus },
  { title: "Find Mentors", url: "/dashboard/student/mentors", icon: Users },
  { title: "Workshops", url: "/dashboard/student/workshops", icon: BookOpen },
  { title: "Collaborations", url: "/collaborations", icon: MessageSquare },
];

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: myIdeas } = useQuery({
    queryKey: ["myIdeas", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: upcomingWorkshops } = useQuery({
    queryKey: ["upcomingWorkshops"],
    queryFn: async () => {
      const { data } = await supabase
        .from("workshops")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(3);
      return data || [];
    },
  });

  const { data: collaborationRequests } = useQuery({
    queryKey: ["collaborationRequests", user?.id],
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
    <DashboardLayout menuItems={menuItems} roleLabel="Student Founder" roleIcon={GraduationCap}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl gradient-primary p-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, Young Founder! 🚀</h2>
              <p className="opacity-90 max-w-xl">
                Ready to build something amazing? Explore ideas, connect with mentors, and join workshops to accelerate your startup journey.
              </p>
            </div>
            <Rocket className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myIdeas?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">My Ideas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{collaborationRequests?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingWorkshops?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Upcoming Workshops</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Ideas */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  My Ideas
                </CardTitle>
                <CardDescription>Your startup ideas and projects</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/ideas/new">
                  <Plus className="w-4 h-4 mr-1" /> New Idea
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {myIdeas && myIdeas.length > 0 ? (
                <div className="space-y-3">
                  {myIdeas.map((idea) => (
                    <Link
                      key={idea.id}
                      to={`/ideas/${idea.id}`}
                      className="block p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{idea.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {idea.description}
                          </p>
                        </div>
                        <Badge variant="secondary">{idea.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No ideas yet. Start your journey!</p>
                  <Button asChild className="gradient-primary text-primary-foreground border-0">
                    <Link to="/ideas/new">Post Your First Idea</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Workshops */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Upcoming Workshops
                </CardTitle>
                <CardDescription>Learn from industry experts</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/student/workshops">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingWorkshops && upcomingWorkshops.length > 0 ? (
                <div className="space-y-3">
                  {upcomingWorkshops.map((workshop) => (
                    <Link
                      key={workshop.id}
                      to={`/workshop/${workshop.id}`}
                      className="block p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <h4 className="font-medium">{workshop.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workshop.date).toLocaleDateString()} • {workshop.host_name}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming workshops</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/ideas">
                  <Lightbulb className="w-6 h-6" />
                  <span>Explore Ideas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/dashboard/student/mentors">
                  <Users className="w-6 h-6" />
                  <span>Find Mentors</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/dashboard/student/workshops">
                  <BookOpen className="w-6 h-6" />
                  <span>Workshops</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                <Link to="/collaborations">
                  <MessageSquare className="w-6 h-6" />
                  <span>Collaborations</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
