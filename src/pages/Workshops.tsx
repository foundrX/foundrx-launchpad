import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WorkshopsList from "@/components/sections/WorkshopsList";

const Workshops = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <WorkshopsList />
      </main>
      <Footer />
    </div>
  );
};

export default Workshops;