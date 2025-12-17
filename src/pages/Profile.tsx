import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Calendar,
  Rocket,
  Mail,
  Phone,
  GraduationCap,
  BadgeCheck,
  Star,
  Edit2,
  Save,
  X,
  Link as LinkIcon,
  Lightbulb,
} from "lucide-react";

interface ProfileData {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  school: string | null;
  age: number | null;
  bio: string | null;
  skills: string[] | null;
  portfolio_url: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  behavior_score: number;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [workshopsCount, setWorkshopsCount] = useState(0);
  const [ideasCount, setIdeasCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    skills: "",
    portfolio_url: "",
    phone: "",
    school: "",
  });

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
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, phone, school, age, bio, skills, portfolio_url, avatar_url, is_verified, behavior_score")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile(profileData);
      if (profileData) {
        setEditForm({
          full_name: profileData.full_name || "",
          bio: profileData.bio || "",
          skills: profileData.skills?.join(", ") || "",
          portfolio_url: profileData.portfolio_url || "",
          phone: profileData.phone || "",
          school: profileData.school || "",
        });
      }

      const { count: workshopsAttended } = await supabase
        .from("workshop_registrations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setWorkshopsCount(workshopsAttended || 0);

      const { count: ideasPosted } = await supabase
        .from("ideas")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setIdeasCount(ideasPosted || 0);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const skillsArray = editForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name || null,
          bio: editForm.bio || null,
          skills: skillsArray.length > 0 ? skillsArray : null,
          portfolio_url: editForm.portfolio_url || null,
          phone: editForm.phone || null,
          school: editForm.school || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated!");
      setEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-display">
              My <span className="text-primary">Profile</span>
            </h1>
            {!editing ? (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gradient-primary text-primary-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Info Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar & Name Section */}
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-2xl">
                      {profile?.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {editing ? (
                      <Input
                        value={editForm.full_name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, full_name: e.target.value })
                        }
                        placeholder="Your name"
                        className="mb-2"
                      />
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-xl">
                          {profile?.full_name || "Not set"}
                        </h3>
                        {profile?.is_verified && (
                          <BadgeCheck className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {profile?.is_verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Behavior Score: {profile?.behavior_score || 100}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label className="text-sm text-muted-foreground">Bio</Label>
                  {editing ? (
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) =>
                        setEditForm({ ...editForm, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm mt-1">
                      {profile?.bio || "No bio yet"}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-sm text-muted-foreground">Skills</Label>
                  {editing ? (
                    <Input
                      value={editForm.skills}
                      onChange={(e) =>
                        setEditForm({ ...editForm, skills: e.target.value })
                      }
                      placeholder="Design, Development, Marketing (comma separated)"
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile?.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No skills added
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      {profile?.email || user?.email || "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    {editing ? (
                      <Input
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="Phone number"
                        className="h-8"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {profile?.phone || "Not set"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    {editing ? (
                      <Input
                        value={editForm.school}
                        onChange={(e) =>
                          setEditForm({ ...editForm, school: e.target.value })
                        }
                        placeholder="School/University"
                        className="h-8"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {profile?.school || "Not set"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <LinkIcon className="w-4 h-4 text-primary" />
                    {editing ? (
                      <Input
                        value={editForm.portfolio_url}
                        onChange={(e) =>
                          setEditForm({ ...editForm, portfolio_url: e.target.value })
                        }
                        placeholder="Portfolio URL"
                        className="h-8"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {profile?.portfolio_url ? (
                          <a
                            href={profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profile.portfolio_url}
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </span>
                    )}
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
                    <Lightbulb className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Ideas Posted</p>
                      <p className="text-sm text-muted-foreground">
                        Your innovative ideas
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    {ideasCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="font-medium">Behavior Score</p>
                      <p className="text-sm text-muted-foreground">
                        Based on your interactions
                      </p>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-primary">
                    {profile?.behavior_score || 100}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button
                    onClick={() => navigate("/ideas")}
                    className="gradient-primary text-primary-foreground"
                  >
                    Browse Ideas
                  </Button>
                  <Button
                    onClick={() => navigate("/#workshops")}
                    variant="outline"
                  >
                    Workshops
                  </Button>
                </div>
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