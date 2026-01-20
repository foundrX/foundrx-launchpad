import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/sections/HeroCarousel";
import HowWeHelp from "@/components/sections/HowWeHelp";
import WorkshopsList from "@/components/sections/WorkshopsList";
import PricingSection from "@/components/sections/PricingSection";
import ReviewsCarousel from "@/components/sections/ReviewsCarousel";
import CTA from "@/components/sections/CTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <section id="how-we-help">
        <HowWeHelp />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="workshops">
        <WorkshopsList />
      </section>
      <section id="testimonials">
        <ReviewsCarousel />
      </section>
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
