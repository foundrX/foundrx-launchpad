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
  Scale,
  MessageSquare,
  FileText,
  Users,
  Shield,
  Gavel,
  Calculator,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

const menuItems = [
  { title: "Help Students", url: "/dashboard/expert/help", icon: HelpCircle },
  { title: "Legal Matters", url: "/dashboard/expert/legal", icon: Gavel },
  { title: "Financial Advice", url: "/dashboard/expert/finance", icon: Calculator },
  { title: "Dispute Resolution", url: "/dashboard/expert/disputes", icon: Shield },
  { title: "Consultations", url: "/collaborations", icon: MessageSquare },
];

const ExpertDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user === null) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const { data: consultationRequests } = useQuery({
    queryKey: ["expertRequests", user?.id],
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

  const services = [
    {
      icon: Gavel,
      title: "Legal Agreements",
      description: "Help students and businesses with legal documentation and agreements.",
      color: "bg-indigo-500/20 text-indigo-500",
    },
    {
      icon: Calculator,
      title: "Financial Guidance",
      description: "Provide advice on accounting, taxes, and financial planning.",
      color: "bg-emerald-500/20 text-emerald-500",
    },
    {
      icon: Shield,
      title: "Dispute Resolution",
      description: "Help resolve conflicts between users professionally and fairly.",
      color: "bg-amber-500/20 text-amber-500",
    },
    {
      icon: FileText,
      title: "Document Review",
      description: "Review and advise on contracts, agreements, and legal documents.",
      color: "bg-blue-500/20 text-blue-500",
    },
  ];

  return (
    <DashboardLayout menuItems={menuItems} roleLabel="Expert Professional" roleIcon={Scale}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Expert Professional Dashboard ⚖️</h2>
              <p className="opacity-90 max-w-xl">
                Provide expert guidance to students and businesses. Help with legal matters, financial advice, and dispute resolution.
              </p>
            </div>
            <Scale className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{consultationRequests?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Consultation Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Clients Helped</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Disputes Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Your Expert Services</CardTitle>
            <CardDescription>Areas where you can provide professional guidance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="p-6 rounded-xl bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Consultation Requests */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Consultation Requests
              </CardTitle>
              <CardDescription>Users seeking your professional advice</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/collaborations">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {consultationRequests && consultationRequests.length > 0 ? (
              <div className="space-y-3">
                {consultationRequests.map((request) => (
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
                    <Button size="sm">Respond</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No consultation requests yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ExpertDashboard;
