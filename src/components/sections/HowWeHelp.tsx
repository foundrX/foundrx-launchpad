import { Users, Mic, DollarSign, Briefcase, Share2, UserCheck, Laptop, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Users,
    title: "Collaboration & Co-Creation",
    description: "Students and entrepreneurs launch and grow businesses together.",
    gradient: "gradient-primary",
  },
  {
    icon: Mic,
    title: "Pitch & Funding",
    description: "Founders pitch ideas online; mentors, community, and micro-investors vote and invest small amounts.",
    gradient: "gradient-secondary",
  },
  {
    icon: DollarSign,
    title: "Affordable Expertise",
    description: "Entrepreneurs get affordable help, while students gain real-world experience.",
    gradient: "gradient-accent",
  },
  {
    icon: Briefcase,
    title: "Cost Savings",
    description: "Startups save money by connecting with interns and freelancers.",
    gradient: "gradient-primary",
  },
  {
    icon: Share2,
    title: "Resource Sharing",
    description: "Founders can swap services, share vendor contacts, and test products.",
    gradient: "gradient-secondary",
  },
  {
    icon: UserCheck,
    title: "Smarter Hiring",
    description: "Businesses hire talent based on verified skills.",
    gradient: "gradient-accent",
  },
  {
    icon: Laptop,
    title: "Freelancer Opportunities",
    description: "Freelancers find projects and build portfolios easily.",
    gradient: "gradient-primary",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Growth",
    description: "Entrepreneurs discover eco-conscious suppliers and partners.",
    gradient: "gradient-secondary",
  },
];

const HowWeHelp = () => {
  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-muted/50" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            How We <span className="text-gradient">Help</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything young entrepreneurs need to succeed, all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group border-0 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-2xl ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeHelp;
