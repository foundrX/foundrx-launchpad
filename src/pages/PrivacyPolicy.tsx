import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, Share2, Lock, UserCheck, Bell, Trash2 } from "lucide-react";

const privacyItems = [
  {
    icon: Database,
    title: "Information We Collect",
    description: "We collect information you provide directly: name, email, phone number, school, skills, portfolio links, and business ideas when you create an account or submit applications.",
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    description: "We use your data to provide our services, facilitate collaborations, send notifications about workshops and updates, and improve your experience on FoundrX.",
  },
  {
    icon: Share2,
    title: "Information Sharing",
    description: "We share your profile information with other users for collaboration purposes. We never sell your personal data to third parties for marketing purposes.",
  },
  {
    icon: Lock,
    title: "Data Security",
    description: "We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    description: "You have the right to access, update, or delete your personal information at any time through your profile settings or by contacting our support team.",
  },
  {
    icon: Bell,
    title: "Communications",
    description: "We may send you emails about your account, workshops you've registered for, collaboration requests, and important platform updates.",
  },
  {
    icon: Trash2,
    title: "Data Retention",
    description: "We retain your data for as long as your account is active. You can request deletion of your account and associated data at any time.",
  },
  {
    icon: Shield,
    title: "Children's Privacy",
    description: "FoundrX is designed for students. We take extra care to protect the privacy of young users and comply with applicable child protection laws.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Privacy <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="w-6 h-6 text-primary" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {privacyItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center p-8 rounded-xl bg-primary/10 border border-primary/20 mt-8">
            <h3 className="text-xl font-semibold mb-2">Questions About Privacy?</h3>
            <p className="text-muted-foreground">
              Contact us at foundrxofficial@gmail.com for any privacy-related inquiries.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
