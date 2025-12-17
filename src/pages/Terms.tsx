import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Scale, Globe, Lock, BadgeCheck, Ban, CreditCard } from "lucide-react";

const termsItems = [
  {
    icon: Shield,
    title: "Accurate Information",
    description: "Users must provide accurate information when creating accounts and using our services.",
  },
  {
    icon: Ban,
    title: "No Illegal Activities",
    description: "No illegal activities are allowed on the platform. Any violation will result in immediate account termination.",
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description: "All disputes must be handled through FoundrX support. We are committed to fair resolution.",
  },
  {
    icon: AlertTriangle,
    title: "External Deals",
    description: "FoundrX is not liable for external deals made between users outside our platform.",
  },
  {
    icon: BadgeCheck,
    title: "Blue Tick Verification",
    description: "Blue tick only confirms identity verification, not behavior. Users are responsible for their actions.",
  },
  {
    icon: Lock,
    title: "Privacy Rules",
    description: "Users must respect privacy rules and not share personal information of others without consent.",
  },
  {
    icon: Ban,
    title: "Safety Tools Misuse",
    description: "Misuse of safety tools leads to account termination. These tools are designed to protect our community.",
  },
  {
    icon: CreditCard,
    title: "Premium Fees",
    description: "Premium fees are non-refundable unless required by law. Please review before purchasing.",
  },
];

const internationalItems = [
  {
    icon: Globe,
    title: "Multiple Languages",
    description: "We're expanding to support multiple languages for a global audience.",
  },
  {
    icon: CreditCard,
    title: "Local Pricing",
    description: "Subscriptions adjusted based on local pricing and currency billing.",
  },
  {
    icon: Shield,
    title: "Privacy Compliance",
    description: "We comply with country-specific privacy & safety laws in all regions we operate.",
  },
];

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Terms & <span className="text-gradient">Conditions</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using FoundrX. By using our platform, you agree to these conditions.
            </p>
          </div>

          <div className="space-y-8">
            {/* Terms Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                  Terms of Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {termsItems.map((item, index) => (
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

            {/* International Expansion */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Globe className="w-6 h-6 text-primary" />
                  International Expansion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {internationalItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center">
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

            {/* Contact */}
            <div className="text-center p-8 rounded-xl bg-primary/10 border border-primary/20">
              <h3 className="text-xl font-semibold mb-2">Questions?</h3>
              <p className="text-muted-foreground">
                If you have any questions about our terms, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;