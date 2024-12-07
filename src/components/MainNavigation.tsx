import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MainNavigationProps {
  userRole: string | null;
}

export const MainNavigation = ({ userRole }: MainNavigationProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <nav className="bg-[#1A1F2C] text-white p-4 rounded-lg mb-8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/96b863b0-3c9e-4343-9797-a552ab5832f1.png" 
            alt="Floodgates Logo" 
            className="h-12 w-auto"
          />
          <h1 className="text-2xl font-bold text-white">FLOODGATES</h1>
        </div>
        <div className="flex flex-wrap gap-4">
          {userRole === "admin" && (
            <Link to="/data">
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white/10 hover:text-white"
              >
                View Documents
              </Button>
            </Link>
          )}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-white border-white hover:bg-white/10 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};