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
        window.location.href = "https://calendly.com/your-link";
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: "Please register for counselling session first",
        className: "bg-white text-black border border-red-500 z-[9999]",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
      setIsVerificationOpen(false);
    }
  };

  return (
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
    </Dialog>
  );
};