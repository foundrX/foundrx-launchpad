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
  TrendingUp,
  Lightbulb,
  BarChart3,
  Shield,
  Scale,
  ArrowRight,
  DollarSign,
  Eye,
  Target,
  PieChart,
} from "lucide-react";

const menuItems = [
  { title: "Explore Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Investment Tracking", url: "/dashboard/investor/tracking", icon: BarChart3 },
  { title: "Risk Analysis", url: "/dashboard/investor/risk", icon: Shield },
  { title: "Legal Advisors", url: "/dashboard/investor/legal", icon: Scale },
];

const InvestorDashboard = () => {
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
    queryKey: ["sentCollaborations", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("collaboration_requests")
        .select("*")
        .eq("from_user_id", user.id);
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
    <DashboardLayout menuItems={menuItems} roleLabel="Investor" roleIcon={TrendingUp}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Investment Dashboard 💰</h2>
              <p className="opacity-90 max-w-xl">
                Discover promising startups, track your investments, and connect with young entrepreneurs building the future.
              </p>
            </div>
            <TrendingUp className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publishedIdeas?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Ideas Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{collaborationRequests?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Connections Made</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Active Investments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹0</p>
                  <p className="text-sm text-muted-foreground">Total Invested</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Ideas */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Featured Startup Ideas
                </CardTitle>
                <CardDescription>Promising ideas looking for investment</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/ideas">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {publishedIdeas && publishedIdeas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publishedIdeas.slice(0, 4).map((idea) => (
                    <Link
                      key={idea.id}
                      to={`/ideas/${idea.id}`}
                      className="block p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <h4 className="font-medium mb-1">{idea.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {idea.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          {idea.views_count || 0} views
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No ideas available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tools */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Investor Tools</CardTitle>
              <CardDescription>Resources to help you invest wisely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/investor/tracking">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Investment Tracking
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/investor/risk">
                  <Shield className="w-4 h-4 mr-2" />
                  Risk Analysis Tools
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/dashboard/investor/legal">
                  <Scale className="w-4 h-4 mr-2" />
                  Legal Advisors
                </Link>
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Connect with expert professionals for legal and financial advice.
                </p>
                <Button className="w-full gradient-primary text-primary-foreground border-0">
                  Find Expert Advisor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
