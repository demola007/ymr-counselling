import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, UserPlus } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
      <Link to="/login" className="w-full sm:w-auto">
        <Button 
          size="lg"
          className="w-full sm:w-auto bg-army-green text-black hover:bg-army-green-light font-semibold shadow-[0_0_20px_rgba(34,255,34,0.3)] hover:shadow-[0_0_30px_rgba(34,255,34,0.5)] transition-all duration-300"
        >
          <Upload className="mr-2 h-5 w-5" />
          Access Portal
        </Button>
      </Link>
      <Link to="/new-convert" className="w-full sm:w-auto">
        <Button 
          size="lg"
          variant="outline"
          className="w-full sm:w-auto border-army-green text-army-green hover:bg-army-green/10 font-semibold"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          New Converts
        </Button>
      </Link>
      <Link to="/counselor-registration" className="w-full sm:w-auto">
        <Button 
          size="lg"
          variant="outline"
          className="w-full sm:w-auto border-army-gold text-army-gold hover:bg-army-gold/10 font-semibold"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Join Our Team
        </Button>
      </Link>
      <BookingDialog />
    </div>
  );
};