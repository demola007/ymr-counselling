import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Upload } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#1A1F2C] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/96b863b0-3c9e-4343-9797-a552ab5832f1.png" 
              alt="Floodgates Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">FLOODGATES</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-[#1A1F2C] to-[#2C3E50] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold">
                Transform Your Life Through Professional Counselling
              </h1>
              <p className="text-lg text-gray-300">
                Take the first step towards personal growth and emotional well-being with our experienced counsellors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Access Portal
                  </Button>
                </Link>
                <a href="https://calendly.com/your-link" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#1A1F2C]">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Session
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/lovable-uploads/d98e5926-4e71-42da-ad1d-d3456c15fc86.png" 
                alt="Floodgates Event" 
                className="rounded-lg shadow-xl animate-fade-in-up"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Phone:</span>
                  <a href="tel:+2348069459084" className="ml-2 hover:text-blue-300 transition-colors">
                    +234 806 945 9084
                  </a>
                </p>
                <p>
                  <span className="font-medium">Email:</span>
                  <a href="mailto:ymrcounsellingfollowup@gmail.com" className="ml-2 hover:text-blue-300 transition-colors">
                    ymrcounsellingfollowup@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">Services</a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 transition-colors">Resources</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours of Operation</h3>
              <div className="space-y-2">
                <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} FLOODGATES. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;