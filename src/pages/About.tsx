import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewsCarousel from "@/components/sections/ReviewsCarousel";

const About = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5 blur-3xl" />
        
        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              About <span className="text-gradient">FoundrX</span>
            </h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 text-lg text-muted-foreground leading-relaxed">
            <p>
              FoundrX is a student-led platform created by a team of 8th graders with a shared 
              passion for innovation and entrepreneurship. We started FoundrX to show that ideas 
              have no age limit and that students can begin building real-world skills from a young age.
            </p>
            
            <p>
              As young founders, we understand the challenges students face when exploring business 
              and creativity. FoundrX is designed to support this journey by connecting students 
              with mentorship, resources, and a community that encourages learning through hands-on experience.
            </p>
            
            <p>
              Our goal is to help students gain confidence, think creatively, and develop leadership 
              skills while turning ideas into action. Made by 8th graders, FoundrX represents the 
              belief that the next generation of innovators can start today.
            </p>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="text-4xl font-bold text-gradient mb-2">8th</div>
              <div className="text-muted-foreground">Graders</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="text-4xl font-bold text-gradient mb-2">∞</div>
              <div className="text-muted-foreground">Ideas</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-card border border-border">
              <div className="text-4xl font-bold text-gradient mb-2">1</div>
              <div className="text-muted-foreground">Mission</div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsCarousel />
      <Footer />
    </main>
  );
};

export default About;
