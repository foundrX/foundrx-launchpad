import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  TrendingUp,
  Users,
  Leaf,
  Network,
  Target,
  Handshake,
  Package,
  Building2,
  Phone,
} from "lucide-react";

const menuItems = [
  { title: "Growth Strategies", url: "/dashboard/business/strategies", icon: TrendingUp },
  { title: "Vendor Contacts", url: "/dashboard/business/vendors", icon: Package },
  { title: "Eco-Friendly Suppliers", url: "/dashboard/business/eco", icon: Leaf },
  { title: "Network & Leads", url: "/dashboard/business/network", icon: Network },
  { title: "Hire Workers", url: "/dashboard/business/hire", icon: Users },
  { title: "Collaborations", url: "/collaborations", icon: Handshake },
];

const SmallBusinessDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user === null) {
      navigate("/auth", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const features = [
    {
      icon: TrendingUp,
      title: "Modern Strategies",
      description: "Learn cutting-edge business strategies to stay competitive in today's market.",
      link: "/dashboard/business/strategies",
      color: "bg-blue-500/20 text-blue-500",
    },
    {
      icon: Package,
      title: "Vendor Contacts",
      description: "Access a curated list of reliable vendors and suppliers for your business needs.",
      link: "/dashboard/business/vendors",
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Suppliers",
      description: "Find sustainable and eco-friendly suppliers to make your business greener.",
      link: "/dashboard/business/eco",
      color: "bg-emerald-500/20 text-emerald-500",
    },
    {
      icon: Network,
      title: "Better Network",
      description: "Connect with other businesses and expand your professional network.",
      link: "/dashboard/business/network",
      color: "bg-orange-500/20 text-orange-500",
    },
    {
      icon: Target,
      title: "Get Better Leads",
      description: "Find qualified leads and expand your customer base effectively.",
      link: "/dashboard/business/leads",
      color: "bg-pink-500/20 text-pink-500",
    },
    {
      icon: Users,
      title: "Workers to Hire",
      description: "Find talented workers and freelancers to help grow your business.",
      link: "/dashboard/business/hire",
      color: "bg-cyan-500/20 text-cyan-500",
    },
    {
      icon: Handshake,
      title: "Business Collaborations",
      description: "Partner with similar businesses that share your values and interests.",
      link: "/collaborations",
      color: "bg-amber-500/20 text-amber-500",
    },
    {
      icon: Phone,
      title: "Expert Consultation",
      description: "Get advice from chartered accountants, lawyers, and business experts.",
      link: "/dashboard/business/experts",
      color: "bg-indigo-500/20 text-indigo-500",
    },
  ];

  return (
    <DashboardLayout menuItems={menuItems} roleLabel="Small Business" roleIcon={Briefcase}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Business Growth Dashboard 📈</h2>
              <p className="opacity-90 max-w-xl">
                Access resources, find vendors, connect with suppliers, and grow your business with modern strategies and valuable connections.
              </p>
            </div>
            <Building2 className="w-16 h-16 opacity-20" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Vendor Contacts</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Eco Suppliers</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 flex items-center justify-center mb-3">
                <Network className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Connections</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
                <Handshake className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Collaborations</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={feature.link}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Scale Your Business?</h3>
            <p className="text-muted-foreground mb-4">
              Connect with other businesses, find resources, and grow together.
            </p>
            <Button className="gradient-primary text-primary-foreground border-0">
              Start Networking
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SmallBusinessDashboard;
