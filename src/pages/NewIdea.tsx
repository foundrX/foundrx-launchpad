import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lightbulb, Target, Users, ArrowLeft, Send } from "lucide-react";
import { z } from "zod";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description too long"),
  goals: z.string().max(1000, "Goals text too long").optional(),
  required_help: z.string().max(500, "Help text too long").optional(),
  video_url: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const NewIdea = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goals: "",
    required_help: "",
    video_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    try {
      ideaSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    if (!user) {
      toast.error("Please log in to post an idea");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("ideas")
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          goals: formData.goals.trim() || null,
          required_help: formData.required_help.trim() || null,
          video_url: formData.video_url.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Idea published successfully!");
      navigate(`/ideas/${data.id}`);
    } catch (error) {
      console.error("Error creating idea:", error);
      toast.error("Failed to publish idea");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/ideas")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ideas
          </Button>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="w-6 h-6 text-primary" />
                Share Your Idea
              </CardTitle>
              <CardDescription>
                Tell the community about your innovative idea and find collaborators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Give your idea a catchy title"
                    className="bg-background"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your idea in detail. What problem does it solve? How does it work?"
                    rows={6}
                    className="bg-background"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals" className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Goals (Optional)
                  </Label>
                  <Textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    placeholder="What are your goals for this idea? What milestones do you want to achieve?"
                    rows={3}
                    className="bg-background"
                  />
                  {errors.goals && (
                    <p className="text-sm text-destructive">{errors.goals}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="required_help" className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Looking For Help? (Optional)
                  </Label>
                  <Textarea
                    id="required_help"
                    name="required_help"
                    value={formData.required_help}
                    onChange={handleChange}
                    placeholder="What kind of help do you need? (e.g., designer, developer, mentor)"
                    rows={2}
                    className="bg-background"
                  />
                  {errors.required_help && (
                    <p className="text-sm text-destructive">{errors.required_help}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL (Optional)</Label>
                  <Input
                    id="video_url"
                    name="video_url"
                    value={formData.video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-background"
                  />
                  {errors.video_url && (
                    <p className="text-sm text-destructive">{errors.video_url}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Publishing..." : "Publish Idea"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewIdea;