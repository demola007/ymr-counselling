import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Upload } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-purple-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/fea97e0c-ca99-4275-aa6e-653e80cd7ec1.png" 
              alt="YMR Global Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">YMR Global</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-purple-100 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-purple-900">
                Transform Your Life Through Professional Counselling
              </h1>
              <p className="text-lg text-gray-700">
                Take the first step towards personal growth and emotional well-being with our experienced counsellors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="w-full sm:w-auto bg-purple-900 hover:bg-purple-800">
                    <Upload className="mr-2 h-4 w-4" />
                    Access Portal
                  </Button>
                </Link>
                <a href="https://calendly.com/your-link" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full sm:w-auto border-purple-900 text-purple-900 hover:bg-purple-900 hover:text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Session
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80" 
                alt="Counselling Session" 
                className="rounded-lg shadow-xl animate-fade-in-up"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p className="mb-2">Phone: +2348069459084</p>
              <p className="mb-2">Email: ymrcounsellingfollowup@gmail.com</p>
            </div>
            <div className="text-right">
              <p className="mb-2">Powered by YMR Counselling Unit</p>
              <p className="font-bold">FLOODGATES</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;