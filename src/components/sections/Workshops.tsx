import { GraduationCap, Target, Megaphone, Calculator, Leaf, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const workshops = [
  { icon: Target, title: "Startup Basics", color: "text-primary" },
  { icon: Megaphone, title: "Pitching & Public Speaking", color: "text-secondary" },
  { icon: Target, title: "Marketing & Design on a Budget", color: "text-accent" },
  { icon: Calculator, title: "Finance Made Simple", color: "text-primary" },
  { icon: Leaf, title: "Eco-Friendly Business Practices", color: "text-secondary" },
];

const impacts = [
  "Kids like us get proper guidance in one place.",
  "Students gain practical, future-ready skills.",
  "Startups and small businesses learn affordable growth strategies.",
];

const Workshops = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full gradient-primary opacity-5 blur-3xl" />
      
      <div className="container relative z-10 px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <GraduationCap className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium">Learn & Grow</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Workshops & <span className="text-gradient">Training</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              When kids like us were trying to raise a company, we often had to visit many 
              different websites to find help or guidance. That's why we made it our mission 
              to create one platform where young founders can learn and grow.
            </p>

            <div className="space-y-4 mb-8">
              {workshops.map((workshop, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <workshop.icon className={`w-5 h-5 ${workshop.color}`} />
                  </div>
                  <span className="font-medium">{workshop.title}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="gradient-primary text-primary-foreground border-0 rounded-full px-8">
              Browse Workshops
            </Button>
          </div>

          {/* Right column - Impact */}
          <div>
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-card to-muted/50 overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-secondary-foreground" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Impact</h3>
                
                <div className="space-y-6">
                  {impacts.map((impact, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                      </div>
                      <p className="text-foreground leading-relaxed">{impact}</p>
                    </div>
                  ))}
                </div>

                {/* Decorative element */}
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-10 h-10 rounded-full border-2 border-card gradient-primary opacity-80"
                          style={{ opacity: 1 - (i * 0.2) }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="font-bold">Join 500+ students</div>
                      <div className="text-sm text-muted-foreground">Learning together</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workshops;
