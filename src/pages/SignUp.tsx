import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Rocket, ArrowLeft, GraduationCap, Briefcase, TrendingUp, Users, Wrench, Scale, Phone, User } from "lucide-react";
import { z } from "zod";

const getDashboardPath = (role: string) => {
  switch (role) {
    case "student_founder": return "/dashboard/student";
    case "mentor": return "/dashboard/mentor";
    case "investor": return "/dashboard/investor";
    case "small_business": return "/dashboard/business";
    case "expert_professional": return "/dashboard/expert";
    case "freelancer": return "/dashboard/freelancer";
    default: return "/";
  }
};

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserRole = "student_founder" | "mentor" | "investor" | "small_business" | "expert_professional" | "freelancer";

const roleConfig: Record<UserRole, { label: string; description: string; icon: React.ElementType }> = {
  student_founder: { label: "Student Founder", description: "Young entrepreneurs building their first ventures", icon: GraduationCap },
  mentor: { label: "Mentor", description: "Experienced professionals guiding the next generation", icon: Users },
  investor: { label: "Investor", description: "Looking to support promising young talent", icon: TrendingUp },
  small_business: { label: "Small Business Owner", description: "Growing your business with modern strategies", icon: Briefcase },
  expert_professional: { label: "Expert Professional", description: "CAs, Lawyers & Administrative experts", icon: Scale },
  freelancer: { label: "Freelancer", description: "Independent professionals and contractors", icon: Wrench },
};

const SignUp = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const userRole = role as UserRole;
  const config = roleConfig[userRole];

  if (!config) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
            <p className="text-muted-foreground mb-6">Please select a valid registration type.</p>
            <Button onClick={() => navigate("/join")} className="gradient-primary text-primary-foreground border-0 rounded-full">
              Choose Your Role
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      },
    });

    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.user) {
      // Assign the role to the user
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: data.user.id,
        role: userRole,
      });

      if (roleError) {
        console.error("Failed to assign role:", roleError);
      }

      // Update the profile with full name and phone
      const { error: profileError } = await supabase.from("profiles").update({
        full_name: formData.fullName,
        phone: formData.phone || null,
      }).eq("user_id", data.user.id);

      if (profileError) {
        console.error("Failed to update profile:", profileError);
      }

      // Send welcome email
      try {
        await supabase.functions.invoke("send-welcome-email", {
          body: {
            userEmail: formData.email,
            userName: formData.fullName,
            role: userRole,
          },
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }

      toast({ title: "Account created!", description: "Welcome to FoundrX! Check your email." });
      navigate(getDashboardPath(userRole));
    }

    setLoading(false);
  };

  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-5 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/join" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to role selection
        </Link>

        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-2">
            <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">FoundrX</span>
            </Link>
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-secondary flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-secondary-foreground" />
            </div>
            <CardTitle className="text-2xl">{config.label}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-muted border-border pl-10"
                  />
                </div>
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-muted border-border"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-muted border-border pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-muted border-border"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="bg-muted border-border"
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-primary-foreground border-0 rounded-full py-6"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SignUp;
