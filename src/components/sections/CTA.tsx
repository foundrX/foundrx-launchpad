import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-90" />
      
      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-foreground/10 blur-2xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-2xl" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Start Your Journey</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Ready to Build Your Future?
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join thousands of young founders who are turning their ideas into reality. 
            Your entrepreneurial journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join">
              <Button 
                size="lg" 
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 rounded-full"
              >
                Join FoundrX Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-full"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
