import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  GraduationCap, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Scale, 
  Wrench,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import foundrxLogo from "@/assets/foundrx-logo.jpeg";

const dashboardOptions = [
  {
    role: "student_founder",
    path: "/dashboard/student",
    label: "Student Founder",
    description: "Explore and post startup ideas, find co-founders",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
  },
  {
    role: "investor",
    path: "/dashboard/investor",
    label: "Investor",
    description: "Track investments, discover opportunities",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
  },
  {
    role: "mentor",
    path: "/dashboard/mentor",
    label: "Mentor",
    description: "Guide founders, share expertise",
    icon: Users,
    color: "from-purple-500 to-violet-500",
  },
  {
    role: "small_business",
    path: "/dashboard/business",
    label: "Small Business",
    description: "Growth strategies, vendor connections",
    icon: Briefcase,
    color: "from-orange-500 to-amber-500",
  },
  {
    role: "expert_professional",
    path: "/dashboard/expert",
    label: "Expert Professional",
    description: "Legal, financial, and admin services",
    icon: Scale,
    color: "from-rose-500 to-pink-500",
  },
  {
    role: "freelancer",
    path: "/dashboard/freelancer",
    label: "Freelancer",
    description: "Find jobs, showcase skills",
    icon: Wrench,
    color: "from-indigo-500 to-blue-500",
  },
];

const SelectDashboard = () => {
  const { user } = useAuth();
  const { role } = useUserRole();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={foundrxLogo} 
              alt="FoundrX Logo" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            <span className="text-xl font-bold font-display">FoundrX</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Select Your Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose the dashboard that best fits your role
            </p>
            {role && (
              <p className="text-sm text-primary mt-2">
                Your current role: <span className="font-semibold capitalize">{role.replace("_", " ")}</span>
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardOptions.map((option) => (
              <Card 
                key={option.role}
                className={`group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 ${
                  role === option.role ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{option.label}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    asChild 
                    className="w-full group/btn"
                    variant={role === option.role ? "default" : "outline"}
                  >
                    <Link to={option.path}>
                      {role === option.role ? "Go to Dashboard" : "View Dashboard"}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="ghost" asChild>
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectDashboard;
