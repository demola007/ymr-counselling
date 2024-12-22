import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, UserPlus } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export const ActionButtons = () => {
  return (
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
      <BookingDialog />
    </div>
  );
};