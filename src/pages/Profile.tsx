import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Calendar, Rocket, Mail, Phone, GraduationCap } from "lucide-react";

interface ProfileData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  school: string | null;
  age: number | null;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [workshopsCount, setWorkshopsCount] = useState(0);
  const [startupsCount, setStartupsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchProfileData();
    }
  }, [user, authLoading, navigate]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, phone, school, age")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile(profileData);

      // Fetch workshops attended count
      const { count: workshopsAttended } = await supabase
        .from("workshop_registrations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setWorkshopsCount(workshopsAttended || 0);

      // For startups, we'll show 0 for now (no startups table exists yet)
      setStartupsCount(0);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container px-4 max-w-4xl">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-8">
            My <span className="text-primary">Profile</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Info Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {profile?.full_name || "Not set"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profile?.age ? `${profile.age} years old` : "Age not set"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {profile?.email || user?.email || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {profile?.phone || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {profile?.school || "Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  Your Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Workshops Attended</p>
                      <p className="text-sm text-muted-foreground">
                        Events you've participated in
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    {workshopsCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Rocket className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Startups Built</p>
                      <p className="text-sm text-muted-foreground">
                        Your entrepreneurial journey
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    {startupsCount}
                  </span>
                </div>

                <Button
                  onClick={() => navigate("/#workshops")}
                  className="w-full gradient-primary text-primary-foreground"
                >
                  Browse Workshops
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
