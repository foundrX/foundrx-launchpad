import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const PricingSection = () => {
  const freeFeatures = [
    { name: "Create Profile", included: true },
    { name: "Post Ideas", included: true },
    { name: "Join Workshops", included: true },
    { name: "Basic Collaboration", included: true },
    { name: "Community Access", included: true },
    { name: "Visibility Boost", included: false },
    { name: "Priority Collaboration", included: false },
    { name: "Advanced Analytics", included: false },
    { name: "Unlimited Idea Uploads", included: false },
    { name: "Faster Verification", included: false },
  ];

  const premiumFeatures = [
    { name: "Create Profile", included: true },
    { name: "Post Ideas", included: true },
    { name: "Join Workshops", included: true },
    { name: "Basic Collaboration", included: true },
    { name: "Community Access", included: true },
    { name: "Visibility Boost", included: true },
    { name: "Priority Collaboration", included: true },
    { name: "Advanced Analytics", included: true },
    { name: "Unlimited Idea Uploads", included: true },
    { name: "Faster Verification", included: true },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start for free or unlock premium features to accelerate your entrepreneurial journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/50" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground/50"}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/join">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-primary/50 bg-primary/5 hover:border-primary transition-all duration-300">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Premium</CardTitle>
              <CardDescription>For serious entrepreneurs</CardDescription>
              <div className="mt-4 space-y-1">
                <div>
                  <span className="text-4xl font-bold">₹150</span>
                  <span className="text-muted-foreground">/month</span>
                  <span className="text-sm text-muted-foreground ml-2">(India)</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  $25/month (US) • £20/month (UK)
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature.name}</span>
                  </li>
                ))}
              </ul>
              <Link to="/payment">
                <Button className="w-full">
                  Go Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
