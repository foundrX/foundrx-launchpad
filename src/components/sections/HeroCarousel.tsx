import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Users, BookOpen, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  // Mouse handlers for drag
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <section 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 select-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-primary rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-secondary rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-accent rounded-full opacity-5 blur-3xl" />
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-muted transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-muted transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

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
                onClick={(e) => { e.stopPropagation(); navigate(user ? "/apply" : "/join"); }}
                size="lg"
                className="gradient-primary text-primary-foreground border-0 rounded-full px-8 py-6 text-lg group"
              >
                {slide.cta}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate("/about"); }}
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
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
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