import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, AlertTriangle, Scale, Globe, Lock, BadgeCheck, Ban, CreditCard,
  Eye, Database, Share2, UserCheck, Bell, Trash2,
  Cookie, Settings, BarChart3, Clock, ToggleLeft
} from "lucide-react";

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

const cookieTypes = [
  {
    icon: Shield,
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure login, and access to secure areas.",
    required: true,
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    description: "We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience.",
    required: false,
  },
  {
    icon: Settings,
    title: "Functional Cookies",
    description: "These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.",
    required: false,
  },
];

const cookieInfo = [
  {
    icon: Clock,
    title: "Cookie Duration",
    description: "Session cookies are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them manually.",
  },
  {
    icon: ToggleLeft,
    title: "Managing Cookies",
    description: "You can control and manage cookies through your browser settings. Note that disabling certain cookies may affect website functionality.",
  },
  {
    icon: Cookie,
    title: "Third-Party Cookies",
    description: "Some cookies are placed by third-party services that appear on our pages. We do not control these cookies.",
  },
];

const PolicyCard = ({ items, gradient = "gradient-primary" }: { items: typeof termsItems; gradient?: string }) => (
  <div className="grid gap-4">
    {items.map((item, index) => (
      <div
        key={index}
        className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${gradient} flex items-center justify-center`}>
          <item.icon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold mb-1">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Terms, Privacy & <span className="text-gradient">Policies</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using FoundrX. By using our platform, you agree to these conditions.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </div>

          <Tabs defaultValue="terms" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
            </TabsList>

            {/* Terms Tab */}
            <TabsContent value="terms" className="space-y-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Shield className="w-6 h-6 text-primary" />
                    Terms of Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PolicyCard items={termsItems} />
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Globe className="w-6 h-6 text-primary" />
                    International Expansion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PolicyCard items={internationalItems} gradient="gradient-secondary" />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Shield className="w-6 h-6 text-primary" />
                    Our Commitment to Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PolicyCard items={privacyItems} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cookies Tab */}
            <TabsContent value="cookies" className="space-y-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Cookie className="w-6 h-6 text-primary" />
                    What Are Cookies?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and provide a better user experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Settings className="w-6 h-6 text-primary" />
                    Types of Cookies We Use
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {cookieTypes.map((cookie, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <cookie.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{cookie.title}</h3>
                            {cookie.required && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{cookie.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Shield className="w-6 h-6 text-primary" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PolicyCard items={cookieInfo} gradient="gradient-secondary" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact */}
          <div className="text-center p-8 rounded-xl bg-primary/10 border border-primary/20 mt-8">
            <h3 className="text-xl font-semibold mb-2">Questions?</h3>
            <p className="text-muted-foreground">
              Contact us at foundrxofficial@gmail.com for any inquiries about our terms and policies.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
