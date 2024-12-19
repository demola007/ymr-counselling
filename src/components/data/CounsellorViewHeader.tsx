import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CounsellorViewHeader = () => {
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sticky top-0 bg-[#1A1F2C] backdrop-blur-lg z-10 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
          alt="YMR Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white">Counsellor Data</h1>
      </div>
      <div className="flex gap-2">
        <Link to="/counselor-registration">
          <Button 
            variant="secondary"
            size="sm" 
            className="bg-white text-[#1A1F2C] hover:bg-gray-100"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Counsellor
          </Button>
        </Link>
        <Link to="/upload">
          <Button 
            variant="secondary"
            size="sm" 
            className="bg-white text-[#1A1F2C] hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload
          </Button>
        </Link>
        <Button 
          variant="destructive"
          size="sm"
          onClick={logout}
          className="bg-red-500 hover:bg-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  );
};