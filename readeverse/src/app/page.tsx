import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative selection:bg-primary/30">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </div>
      <Footer />
    </main>
  );
}
