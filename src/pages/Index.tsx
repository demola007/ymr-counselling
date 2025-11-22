import { Toaster } from "@/components/ui/toaster";
import { HeroSection } from "@/components/landing/HeroSection";
import { ActionButtons } from "@/components/landing/ActionButtons";
import { Footer } from "@/components/landing/Footer";
import { Shield, Swords, Users, Calendar } from "lucide-react";
import theNewArmyImage from "@/assets/the-new-army.jpeg";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-army-green-dark/20 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-army-green rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-army-green-light rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black/80 backdrop-blur-xl border-b border-army-green/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png"
                alt="YMR Logo" 
                className="h-12 w-auto"
                loading="eager"
                fetchPriority="high"
              />
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-army-green-light tracking-wider">
                  YMR 2025
                </h1>
                <p className="text-xs text-army-green/80">THE NEW ARMY</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-army-green" />
              <span className="text-foreground">December 26-30, 2025</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
            <HeroSection />
            
            {/* Event Image */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-army-green via-army-green-light to-army-green rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-glow-pulse"></div>
              <div className="relative">
                <img 
                  src={theNewArmyImage}
                  alt="The New Army - YMR 2025"
                  className="w-full rounded-2xl shadow-2xl border border-army-green/30"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <ActionButtons />

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 mb-16">
            <div className="group bg-card/50 backdrop-blur-sm border border-army-green/30 rounded-xl p-6 hover:border-army-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,34,0.2)]">
              <div className="bg-army-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-army-green/20 transition-colors">
                <Shield className="w-6 h-6 text-army-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Spiritual Warfare</h3>
              <p className="text-muted-foreground text-sm">
                Equip yourself with the full armor of God for victorious Christian living
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-army-green/30 rounded-xl p-6 hover:border-army-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,34,0.2)]">
              <div className="bg-army-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-army-green/20 transition-colors">
                <Swords className="w-6 h-6 text-army-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Divine Training</h3>
              <p className="text-muted-foreground text-sm">
                Intensive training sessions to sharpen your spiritual weapons and skills
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-army-green/30 rounded-xl p-6 hover:border-army-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,34,0.2)]">
              <div className="bg-army-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-army-green/20 transition-colors">
                <Users className="w-6 h-6 text-army-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Join The Army</h3>
              <p className="text-muted-foreground text-sm">
                Connect with fellow soldiers and build lasting kingdom relationships
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gradient-to-r from-army-green-dark/30 via-army-green/10 to-army-green-dark/30 border border-army-green/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Join <span className="text-army-green-light">The New Army</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Old Auditorium, Redemption City of God
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-black/40 px-6 py-3 rounded-lg border border-army-green/30">
                <span className="text-army-green font-semibold">December 26-30</span>
              </div>
              <div className="bg-black/40 px-6 py-3 rounded-lg border border-army-green/30">
                <span className="text-army-green font-semibold">2025</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;
