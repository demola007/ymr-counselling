import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const NotificationsHeader = () => {
  const { logout } = useAuth();

  return (
    <div className="relative mb-8">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-army-gold via-army-olive to-army-black rounded-2xl opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.1),transparent)] rounded-2xl" />
      
      {/* Content */}
      <nav className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <img 
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
              alt="YMR Logo" 
              className="h-10 w-auto"
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 md:w-7 md:h-7" />
              Notifications
            </h1>
            <p className="text-sm text-white/70 mt-0.5">Send SMS and WhatsApp messages</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <Link to="/upload">
            <Button 
              variant="secondary"
              size="sm" 
              className="bg-white/20 text-white hover:bg-white/30 border border-white/20 backdrop-blur-sm whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <Button 
            variant="secondary"
            size="sm"
            onClick={logout}
            className="bg-red-500/20 text-white hover:bg-red-500/30 border border-red-500/30 backdrop-blur-sm whitespace-nowrap"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};
