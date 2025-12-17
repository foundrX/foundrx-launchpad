import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, GraduationCap, Briefcase, TrendingUp, Users, Wrench, ArrowRight, Scale } from "lucide-react";

const roles = [
  { id: "student_founder", label: "Student Founder", description: "Young entrepreneurs building their first ventures", icon: GraduationCap, color: "from-blue-500 to-cyan-500" },
  { id: "mentor", label: "Mentor", description: "Experienced professionals guiding the next generation", icon: Users, color: "from-purple-500 to-pink-500" },
  { id: "investor", label: "Investor", description: "Looking to support promising young talent", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
  { id: "small_business", label: "Small Business Owner", description: "Growing your business with modern strategies", icon: Briefcase, color: "from-orange-500 to-amber-500" },
  { id: "expert_professional", label: "Expert Professional", description: "CAs, Lawyers & Administrative experts", icon: Scale, color: "from-red-500 to-rose-500" },
  { id: "freelancer", label: "Freelancer", description: "Independent professionals and contractors", icon: Wrench, color: "from-teal-500 to-cyan-500" },
];

const Join = () => {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-5 blur-3xl" />

      <div className="container relative z-10 px-4 py-12">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">FoundrX</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join <span className="text-gradient">FoundrX</span> Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your role to get started. Each role offers unique features tailored to your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link key={role.id} to={`/signup/${role.id}`}>
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {role.label}
                    </h3>
                    <p className="text-muted-foreground text-sm flex-grow">
                      {role.description}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Already have an account?{" "}
          <Link to="/auth" className="text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Join;
