import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { Rocket, User, Mail, Phone, School, Briefcase, Sparkles, Link, Loader2, CheckCircle2 } from "lucide-react";

const applicationSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().optional(),
  age: z.number().min(10, "Age must be at least 10").max(100).optional().nullable(),
  school: z.string().optional(),
  role: z.string().min(1, "Please select a role"),
  experience_level: z.string().min(1, "Please select your experience level"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  business_idea: z.string().optional(),
  why_join: z.string().trim().min(20, "Please tell us more (at least 20 characters)").max(1000),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  availability: z.string().optional(),
});

const roles = [
  "Student Founder",
  "Aspiring Entrepreneur",
  "Developer",
  "Designer",
  "Marketer",
  "Business Strategist",
  "Mentor",
  "Investor",
  "Other",
];

const experienceLevels = [
  "Just starting out",
  "Have some experience",
  "Built projects before",
  "Running a startup",
  "Serial entrepreneur",
];

const skillOptions = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Marketing",
  "Social Media",
  "Content Writing",
  "Video Editing",
  "Finance",
  "Sales",
  "Public Speaking",
  "Leadership",
  "Project Management",
  "Data Analysis",
];

const availabilityOptions = [
  "Full-time",
  "Part-time (10-20 hrs/week)",
  "Few hours a week",
  "Weekends only",
  "Flexible",
];

const Apply = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "" as string | number,
    school: "",
    role: "",
    experience_level: "",
    skills: [] as string[],
    business_idea: "",
    why_join: "",
    portfolio_url: "",
    linkedin_url: "",
    availability: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const dataToValidate = {
      ...formData,
      age: formData.age ? Number(formData.age) : null,
      portfolio_url: formData.portfolio_url || undefined,
      linkedin_url: formData.linkedin_url || undefined,
    };

    const result = applicationSchema.safeParse(dataToValidate);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("applications").insert({
        user_id: user!.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        age: formData.age ? Number(formData.age) : null,
        school: formData.school || null,
        role: formData.role,
        experience_level: formData.experience_level,
        skills: formData.skills,
        business_idea: formData.business_idea || null,
        why_join: formData.why_join,
        portfolio_url: formData.portfolio_url || null,
        linkedin_url: formData.linkedin_url || null,
        availability: formData.availability || null,
      });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke("send-application-notification", {
          body: {
            userEmail: formData.email,
            userName: formData.full_name,
            role: formData.role,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      setSubmitted(true);
      toast({
        title: "Application submitted!",
        description: "We'll review your application and get back to you soon.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
          <Card className="w-full max-w-md text-center border-border bg-card">
            <CardContent className="pt-10 pb-10">
              <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Application Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for applying to FoundrX. We'll review your application and get back to you within 48 hours.
              </p>
              <Button onClick={() => navigate("/")} className="gradient-primary text-primary-foreground border-0">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 py-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Join the Community</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Apply to FoundrX</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us about yourself and why you want to join our community of young founders.
          </p>
        </div>

        <Card className="border-border bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              Application Form
            </CardTitle>
            <CardDescription>All fields marked with * are required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="full_name"
                        placeholder="Your full name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 234 567 890"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="16"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                    />
                    {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">School/University</Label>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="school"
                        placeholder="Your school"
                        value={formData.school}
                        onChange={(e) => handleInputChange("school", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Experience */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">Role & Experience</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>What role best describes you? *</Label>
                    <Select value={formData.role} onValueChange={(val) => handleInputChange("role", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Experience Level *</Label>
                    <Select value={formData.experience_level} onValueChange={(val) => handleInputChange("experience_level", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.experience_level && <p className="text-sm text-destructive">{errors.experience_level}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Skills *</Label>
                  <p className="text-sm text-muted-foreground mb-2">Select all that apply</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillOptions.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <label htmlFor={skill} className="text-sm cursor-pointer">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Availability</Label>
                  <Select value={formData.availability} onValueChange={(val) => handleInputChange("availability", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* About You */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b border-border pb-2">About You</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="business_idea">Do you have a business idea? (Optional)</Label>
                  <Textarea
                    id="business_idea"
                    placeholder="Tell us about your startup idea or project..."
                    value={formData.business_idea}
                    onChange={(e) => handleInputChange("business_idea", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="why_join">Why do you want to join FoundrX? *</Label>
                  <Textarea
                    id="why_join"
                    placeholder="What do you hope to learn or achieve by joining our community?"
                    value={formData.why_join}
                    onChange={(e) => handleInputChange("why_join", e.target.value)}
                    rows={4}
                  />
                  {errors.why_join && <p className="text-sm text-destructive">{errors.why_join}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="portfolio_url"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolio_url}
                        onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.portfolio_url && <p className="text-sm text-destructive">{errors.portfolio_url}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="linkedin_url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedin_url}
                        onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.linkedin_url && <p className="text-sm text-destructive">{errors.linkedin_url}</p>}
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground border-0 py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Apply;
