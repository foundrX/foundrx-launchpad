import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, BarChart3, Shield, Clock, ToggleLeft } from "lucide-react";

const cookieTypes = [
  {
    icon: Shield,
    title: "Essential Cookies",
    description: "These cookies are necessary for the website to function properly. They enable basic features like page navigation, secure login, and access to secure areas. The website cannot function without these cookies.",
    required: true,
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    description: "We use analytics cookies to understand how visitors interact with our website. This helps us improve our services and user experience. These cookies collect anonymous information.",
    required: false,
  },
  {
    icon: Settings,
    title: "Functional Cookies",
    description: "These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or third-party providers.",
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
    description: "Some cookies are placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing their privacy policies.",
  },
];

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Cookie <span className="text-gradient">Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This policy explains how FoundrX uses cookies and similar technologies to recognize you when you visit our platform.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </div>

          <div className="space-y-8">
            {/* What Are Cookies */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Cookie className="w-6 h-6 text-primary" />
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and provide a better user experience. Cookies can be "session" cookies (deleted when you close your browser) or "persistent" cookies (remain until deleted or expired).
                </p>
              </CardContent>
            </Card>

            {/* Types of Cookies */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Settings className="w-6 h-6 text-primary" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
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

            {/* Additional Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {cookieInfo.map((item, index) => (
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
              <h3 className="text-xl font-semibold mb-2">Questions About Cookies?</h3>
              <p className="text-muted-foreground">
                Contact us at foundrxofficial@gmail.com for any cookie-related inquiries.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
