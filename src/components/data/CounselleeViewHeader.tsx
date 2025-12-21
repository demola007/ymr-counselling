import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, UserPlus, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CounselleeViewHeader = () => {
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sticky top-0 bg-gradient-to-r from-[#1A1F2C] via-[#2D1B4E] to-[#1A1F2C] backdrop-blur-xl z-10 p-4 w-full rounded-xl shadow-lg border border-white/10">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-full" />
          <img 
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
            alt="YMR Logo" 
            className="h-12 w-auto relative z-10"
          />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Counsellee Data
          </h1>
          <p className="text-xs text-gray-400 hidden sm:block">Manage counsellee records</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        <Link to="/add-counsellee">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/25"
          >
            <UserPlus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Counsellee</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
        <Link to="/upload">
          <Button 
            variant="outline"
            size="sm" 
            className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <LayoutDashboard className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </Link>
        <Button 
          variant="outline"
          size="sm"
          onClick={logout}
          className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
};