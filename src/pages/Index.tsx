import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import HowWeHelp from "@/components/sections/HowWeHelp";
import Workshops from "@/components/sections/Workshops";
import CTA from "@/components/sections/CTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="how-we-help">
        <HowWeHelp />
      </section>
      <section id="workshops">
        <Workshops />
      </section>
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
