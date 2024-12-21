import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, UserPlus, FilePlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const DataViewHeader = () => {
  const { logout } = useAuth();

  return (
    <nav className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-[#1A1F2C] w-full backdrop-blur-lg z-10 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
          alt="YMR Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white">Counselling Data</h1>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
        <div className="flex flex-row gap-2">
          <Link to="/new-convert-manual">
            <Button 
              variant="secondary"
              size="sm" 
              className="bg-white text-[#1A1F2C] hover:bg-gray-100 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 sm:mr-2" />
              <FilePlus className="w-4 h-4 mr-1 sm:hidden" />
              <span className="hidden sm:inline">Add Convert Manually</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
          <Link to="/upload">
            <Button 
              variant="secondary"
              size="sm" 
              className="bg-white text-[#1A1F2C] hover:bg-gray-100 whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Back to Upload</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
        <Button 
          variant="destructive"
          size="sm"
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 whitespace-nowrap"
        >
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
};