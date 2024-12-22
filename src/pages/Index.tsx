import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";

const Landing = () => {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.get(`/counsellee/${email}`);
      if (response.data) {
        // Valid counsellee, redirect to Calendly
        window.location.href = "https://calendly.com/your-link";
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Please register for counselling session first",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
      setIsVerificationOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] via-[#2C3E50] to-[#1A1F2C]">
      {/* Navigation */}
      <nav className="bg-[#1A1F2C]/90 backdrop-blur-lg text-white py-4 fixed w-full z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
              alt="YMR Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">YMR 2024 - FLOODGATES</h1>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 flex-1 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start py-12">
            <div className="space-y-8 animate-fade-in lg:sticky lg:top-24">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Transform Your Life Through 
                <span className="text-blue-400"> Spiritually Sensitive</span> and 
                <span className="text-purple-400"> Professional Counseling</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Take the first step towards personal spiritual growth and emotional well-being with our experienced counsellors
              </p>
              <div className="flex flex-col md:flex-row gap-4 pb-8">
                <Link to="/login" className="w-full md:w-auto">
                  <Button className="w-full bg-white text-[#1A1F2C] hover:bg-gray-100">
                    <Upload className="mr-2 h-4 w-4" />
                    Access Portal
                  </Button>
                </Link>
                <Link to="/new-convert" className="w-full md:w-auto">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Converts
                  </Button>
                </Link>
                <Link to="/counselor-registration" className="w-full md:w-auto">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Our Team
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-[#1A1F2C]">
                      <Calendar className="mr-2 h-4 w-4" />
                      Book a Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Book Your Counselling Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-blue-800 font-medium text-center">
                          Register for Counselling Session then Schedule your session
                        </p>
                      </div>
                      <Link to="/add-counsellee">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register for Counseling Session
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full border-2"
                        onClick={() => setIsVerificationOpen(true)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Session
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AlertDialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Verify Your Registration</AlertDialogTitle>
                      <AlertDialogDescription>
                        Please enter the email address you used when registering for counselling session
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleEmailVerification} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Verifying..." : "Verify"}
                        </Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl"></div>
              <img 
                src="/lovable-uploads/c07ff30e-bbf7-4646-9939-5661fa0ccacb.png" 
                alt="YMR Floodgates" 
                className="relative rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C]/90 backdrop-blur-lg text-white py-8">
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