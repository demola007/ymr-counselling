import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const MainNavigation = () => {
  const { userRole, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-[#1A1F2C] text-white p-4 rounded-lg mb-8 shadow-lg">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
            alt="YMR Logo" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl md:text-2xl font-bold text-white">FLOODGATES</h1>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 md:space-x-4">
          {(userRole === "admin" || userRole === "super-admin") && (
            <>
              <Link to="/data" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className={`${isActive('/data') ? 'bg-purple-100' : 'bg-white'} w-full sm:w-auto text-[#1A1F2C] hover:bg-gray-100`}
                >
                  Converts Portal
                </Button>
              </Link>
              <Link to="/counsellors" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className={`${isActive('/counsellors') ? 'bg-purple-100' : 'bg-white'} w-full sm:w-auto text-[#1A1F2C] hover:bg-gray-100`}
                >
                  Counsellors Portal
                </Button>
              </Link>
              <Link to="/counsellee" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className={`${isActive('/counsellee') ? 'bg-purple-100' : 'bg-white'} w-full sm:w-auto text-[#1A1F2C] hover:bg-gray-100`}
                >
                  Counsellee Portal
                </Button>
              </Link>
              <Link to="/notifications" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  className={`${isActive('/notifications') ? 'bg-purple-100' : 'bg-white'} w-full sm:w-auto text-[#1A1F2C] hover:bg-gray-100`}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
              </Link>
            </>
          )}
          <Button 
            variant="destructive"
            onClick={logout}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};