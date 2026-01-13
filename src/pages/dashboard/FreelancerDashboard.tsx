import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  Briefcase,
  Search,
  Users,
  MessageSquare,
  Star,
  Target,
  ArrowRight,
  Code,
  Palette,
  PenTool,
  FileText,
} from "lucide-react";

const menuItems = [
  { title: "Find Work", url: "/dashboard/freelancer/jobs", icon: Search },
  { title: "My Services", url: "/dashboard/freelancer/services", icon: Briefcase },
  { title: "Help Others", url: "/dashboard/freelancer/help", icon: Users },
  { title: "Messages", url: "/collaborations", icon: MessageSquare },
];

const FreelancerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user === null) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const { data: workRequests } = useQuery({
    queryKey: ["freelancerRequests", user?.id],
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

  const skillCategories = [
    { icon: Code, title: "Development", description: "Web, Mobile, Software Development", color: "bg-blue-500/20 text-blue-500" },
    { icon: Palette, title: "Design", description: "UI/UX, Graphic Design, Branding", color: "bg-pink-500/20 text-pink-500" },
    { icon: PenTool, title: "Content", description: "Writing, Marketing, Social Media", color: "bg-purple-500/20 text-purple-500" },
    { icon: FileText, title: "Business", description: "Consulting, Strategy, Admin", color: "bg-emerald-500/20 text-emerald-500" },
  ];

  return (
    <DashboardLayout menuItems={menuItems} roleLabel="Freelancer" roleIcon={Wrench}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Freelancer Dashboard 💼</h2>
              <p className="opacity-90 max-w-xl">
                Find exciting work opportunities, showcase your skills, and connect with businesses looking for your expertise.
              </p>
            </div>
            <Wrench className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{workRequests?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Work Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0.0</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Categories */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle>Explore Opportunities</CardTitle>
              <CardDescription>Find work based on your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {skillCategories.map((category) => (
                  <Link
                    key={category.title}
                    to="/dashboard/freelancer/jobs"
                    className="p-6 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mb-4`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your freelance journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/freelancer/jobs">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/freelancer/services">
                  <Briefcase className="w-4 h-4 mr-2" />
                  List Your Services
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/profile">
                  <Star className="w-4 h-4 mr-2" />
                  Update Portfolio
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/freelancer/help">
                  <Users className="w-4 h-4 mr-2" />
                  Help Others
                </Link>
              </Button>

              <div className="pt-4 border-t border-border">
                <Button className="w-full gradient-primary text-primary-foreground border-0">
                  Find Work Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Work Requests */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Work Requests
              </CardTitle>
              <CardDescription>People looking to hire you</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/collaborations">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workRequests && workRequests.length > 0 ? (
              <div className="space-y-3">
                {workRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-lg bg-muted/50 border border-border flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{request.message.slice(0, 50)}...</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No work requests yet</p>
                <p className="text-sm text-muted-foreground">
                  Complete your profile and list your services to attract clients!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FreelancerDashboard;
