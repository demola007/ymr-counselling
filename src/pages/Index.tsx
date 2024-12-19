import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, UserPlus } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#1A1F2C] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
              alt="YMR Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">YMR COUNSELLING</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-[#1A1F2C] to-[#2C3E50] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold">
                Transform your life through spiritually sensitive and professional counseling
              </h1>
              <p className="text-lg text-gray-300">
                Take the first step towards personal spiritual growth and emotional well-being with our experienced counsellors
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="w-full sm:w-auto bg-white text-[#1A1F2C] hover:bg-gray-100">
                    <Upload className="mr-2 h-4 w-4" />
                    Access Portal
                  </Button>
                </Link>
                <Link to="/new-convert">
                  <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Converts
                  </Button>
                </Link>
                <Link to="/counselor-registration">
                  <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Our Team
                  </Button>
                </Link>
                <a href="https://calendly.com/your-link" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full sm:w-auto border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-[#1A1F2C]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Session
                  </Button>
                </a>
              </div>
            </div>
            <div className="block">
              <img 
                src="/lovable-uploads/d98e5926-4e71-42da-ad1d-d3456c15fc86.png" 
                alt="Counselling Session" 
                className="rounded-lg shadow-xl animate-fade-in-up w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="font-medium">Counselling HOD:</span>
                  <a href="tel:+2348162495328" className="ml-2 hover:text-blue-300 transition-colors">
                    +234 816 249 5328
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Counselling AHOD:</span>
                  <a href="tel:+2348141689142" className="ml-2 hover:text-blue-300 transition-colors">
                    +234 814 168 9142
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Book Counselling Session</h3>
              <div className="space-y-2">
                <a 
                  href="https://calendly.com/your-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-blue-300 hover:text-blue-400 transition-colors"
                >
                  Schedule your session via Calendly
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} YMR Counselling Unit. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;