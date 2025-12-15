import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full gradient-primary opacity-20 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full gradient-secondary opacity-20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Empowering Young Founders</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Build Your Dream
            <span className="block text-gradient">Startup</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Where students and entrepreneurs come together to launch ideas, learn skills, 
            and grow businesses — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/apply" : "/auth"}>
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 text-lg px-8 py-6 rounded-full animate-pulse-glow">
                {user ? "Apply Now" : "Get Started Free"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full border-2">
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">500+</div>
              <div className="text-sm">Young Founders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">120+</div>
              <div className="text-sm">Startups Launched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">50+</div>
              <div className="text-sm">Expert Mentors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
