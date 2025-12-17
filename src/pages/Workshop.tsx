import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface Workshop {
  id: string;
  title: string;
  description: string;
  host_name: string;
  host_title: string | null;
  host_company: string | null;
  host_image_url: string | null;
  date: string;
  duration_minutes: number | null;
  max_participants: number | null;
  category: string | null;
}

const Workshop = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        toast({ title: "Workshop not found", variant: "destructive" });
        navigate("/");
        return;
      }

      setWorkshop(data);
      setLoading(false);

      // Check if user is registered
      if (user) {
        const { data: registration } = await supabase
          .from("workshop_registrations")
          .select("id")
          .eq("workshop_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        setIsRegistered(!!registration);
      }
    };

    fetchWorkshop();
  }, [id, user, navigate, toast]);

  const handleRegister = async () => {
    if (!user) {
      toast({ title: "Please sign in to register", description: "You need an account to join workshops" });
      navigate("/auth");
      return;
    }

    if (!workshop) return;

    setRegistering(true);
    const { error } = await supabase.from("workshop_registrations").insert({
      workshop_id: workshop.id,
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Successfully registered!", description: "You're all set for the workshop." });
      setIsRegistered(true);

      // Send email notification
      try {
        await supabase.functions.invoke("send-workshop-notification", {
          body: {
            userEmail: user.email,
            userName: user.user_metadata?.full_name || user.email?.split("@")[0],
            workshopTitle: workshop.title,
            workshopDate: format(new Date(workshop.date), "EEEE, MMMM d, yyyy 'at' h:mm a"),
            hostName: workshop.host_name,
          },
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    }
    setRegistering(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 container px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/2" />
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!workshop) return null;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5 blur-3xl" />

        <div className="container relative z-10 px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Workshops
          </Button>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              {workshop.category && (
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {workshop.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-bold">{workshop.title}</h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{format(new Date(workshop.date), "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{workshop.duration_minutes || 60} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Max {workshop.max_participants || 50} participants</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {workshop.description}
                </p>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About the Host</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                      {workshop.host_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{workshop.host_name}</div>
                      <div className="text-muted-foreground">
                        {workshop.host_title}
                        {workshop.host_company && ` at ${workshop.host_company}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-28 bg-card border-border">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient">Free</div>
                    <div className="text-muted-foreground">No cost to join</div>
                  </div>

                  {isRegistered ? (
                    <div className="flex items-center justify-center gap-2 py-4 text-green-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">You're registered!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleRegister}
                      disabled={registering}
                      className="w-full gradient-primary text-primary-foreground border-0 rounded-full py-6 text-lg"
                    >
                      {registering ? "Registering..." : "Register Now"}
                    </Button>
                  )}

                  <div className="text-center text-sm text-muted-foreground">
                    {user ? "Secure your spot today" : "Sign in to register"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Workshop;
