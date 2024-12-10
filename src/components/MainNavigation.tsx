import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface MainNavigationProps {
  userRole: string | null;
}

export const MainNavigation = ({ userRole }: MainNavigationProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-[#1A1F2C] text-white p-4 rounded-lg mb-8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
            alt="YMR Logo" 
            className="h-12 w-auto"
          />
          <h1 className="text-2xl font-bold text-white">FLOODGATES</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          {(userRole === "admin" || userRole === "super-admin") && (
            <Link to="/data">
              <Button 
                variant="secondary" 
                className="bg-white text-[#1A1F2C] hover:bg-gray-100"
              >
                View Documents
              </Button>
            </Link>
          )}
          <Button 
            variant="secondary"
            onClick={handleLogout}
            className="bg-white text-[#1A1F2C] hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};