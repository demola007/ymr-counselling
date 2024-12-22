import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, UserPlus } from "lucide-react";
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
    console.log('Starting verification for email:', email);

    try {
      const response = await apiClient.get(`/counsellee/${email}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Verification response:', response);

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
            <AlertDialogTitle>Verify Your Registration</AlertDialogTitle>
            <AlertDialogDescription>
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
                className="w-full sm:w-auto"
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