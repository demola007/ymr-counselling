import { Toaster } from "@/components/ui/toaster";
import { HeroSection } from "@/components/landing/HeroSection";
import { ActionButtons } from "@/components/landing/ActionButtons";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] via-[#2C3E50] to-[#1A1F2C]">
      {/* Navigation */}
      <nav className="bg-[#1A1F2C]/90 backdrop-blur-lg text-white py-4 fixed w-full z-[48]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
              alt="YMR Logo" 
              className="h-12 w-auto"
              loading="eager"
              fetchpriority="high"
            />
            <h1 className="text-2xl font-bold">YMR 2024 - FLOODGATES</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 flex-1 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start py-12">
            <HeroSection />
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
              <img 
                src="/lovable-uploads/c07ff30e-bbf7-4646-9939-5661fa0ccacb.png" 
                alt="YMR Floodgates" 
                className="relative rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300 w-full"
                loading="eager"
                fetchpriority="high"
              />
            </div>
          </div>
          <ActionButtons />
        </div>
      </section>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;