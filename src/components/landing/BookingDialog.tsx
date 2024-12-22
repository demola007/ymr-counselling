import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, UserPlus, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/utils/apiClient";

export const BookingDialog = () => {
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/counsellee/${email}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        // Success case - open Calendly
        const calendlyWindow = window.open("https://calendly.com/your-link", "_blank");
        if (calendlyWindow) {
          calendlyWindow.focus();
        }
        resetDialogStates();
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Please register for counselling session first",
        className: "fixed top-4 right-4 bg-white text-black border border-red-500 z-[9999] max-w-[90vw] md:max-w-md",
      });

      // Delay the navigation and state reset to ensure the toast is visible
      setTimeout(() => {
        resetDialogStates();
        navigate("/", { replace: true });
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const resetDialogStates = () => {
    setIsVerificationOpen(false);
    setIsDialogOpen(false);
    setEmail("");
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleVerificationOpen = () => {
    setIsVerificationOpen(true);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    setEmail(e.target.value);
  };

  return (
    <Dialog 
      open={isDialogOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetDialogStates();
        } else {
          setIsDialogOpen(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full md:w-auto border-white text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-[#1A1F2C]"
          onClick={handleDialogOpen}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Book a Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95vw] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent pb-2">
            Book Your Counselling Session
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100 shadow-sm">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              </div>
            </div>
            <p className="text-gray-700 text-center leading-relaxed">
              <span className="font-semibold text-purple-600 block mb-2">Step 1: Register</span>
              Complete your counselling registration
              <span className="block my-2 text-gray-400">then</span>
              <span className="font-semibold text-blue-600 block mb-2">Step 2: Schedule</span>
              Book your preferred time slot
            </p>
          </div>
          <div className="mt-4"></div>
          <Link to="/add-counsellee">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
              <UserPlus className="mr-2 h-4 w-4" />
              Register for Counseling Session
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full border-2 hover:bg-gray-50 transition-all duration-300"
            onClick={handleVerificationOpen}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </div>
      </DialogContent>

      <AlertDialog 
        open={isVerificationOpen} 
        onOpenChange={(open) => {
          if (!open) {
            resetDialogStates();
          } else {
            setIsVerificationOpen(open);
          }
        }}
      >
        <AlertDialogContent className="w-[95vw] mx-auto max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-center">Verify Your Registration</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please enter the email address you used when registering for counselling session
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleEmailVerification} className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              required
              className="w-full"
              onClick={(e) => e.stopPropagation()}
            />
            <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <AlertDialogCancel 
                onClick={resetDialogStates}
                className="w-full sm:w-auto"
              >
                Cancel
              </AlertDialogCancel>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};