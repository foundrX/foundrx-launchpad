import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Users, BookOpen, Lightbulb } from "lucide-react";

const slides = [
  {
    icon: Rocket,
    title: "Launch Your",
    highlight: "Startup Journey",
    description: "Get the mentorship, resources, and community support you need to turn your ideas into reality.",
    cta: "Start Building",
  },
  {
    icon: Users,
    title: "Connect With",
    highlight: "Expert Mentors",
    description: "Learn from successful entrepreneurs, investors, and industry professionals who want to help you succeed.",
    cta: "Find Mentors",
  },
  {
    icon: BookOpen,
    title: "Master Essential",
    highlight: "Business Skills",
    description: "From pitching to finance, learn practical skills through hands-on workshops designed for young founders.",
    cta: "Browse Workshops",
  },
  {
    icon: Lightbulb,
    title: "Built By Students,",
    highlight: "For Students",
    description: "Created by 8th graders who believe ideas have no age limit. Start your entrepreneurship journey today.",
    cta: "Learn Our Story",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-primary rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-secondary rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-accent rounded-full opacity-5 blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            key={currentSlide} 
            className="animate-fade-in"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary mb-8">
              <Icon className="w-10 h-10 text-primary-foreground" />
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {slide.title}{" "}
              <span className="text-gradient">{slide.highlight}</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate(user ? "/apply" : "/join")}
                size="lg"
                className="gradient-primary text-primary-foreground border-0 rounded-full px-8 py-6 text-lg group"
              >
                {slide.cta}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/about")}
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-border hover:bg-muted"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center justify-center gap-3 mt-16">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-12 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
