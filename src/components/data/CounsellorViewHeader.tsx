import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CounsellorViewHeader = () => {
  const { logout } = useAuth();

  return (
    <div className="relative mb-6 md:mb-8">
      {/* Header Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-army-green/20 via-army-gold/10 to-army-green/20 rounded-2xl blur-xl" />
      
      <nav className="relative flex flex-col gap-4 p-4 md:p-6 bg-card/60 backdrop-blur-xl border border-army-green/30 rounded-2xl">
        {/* Top Row - Logo and Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-army-gold/30 rounded-full blur-md" />
              <img 
                src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
                alt="YMR Logo" 
                className="relative h-10 w-10 md:h-12 md:w-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-army-green via-army-gold to-army-green bg-clip-text text-transparent">
                Counsellors Portal
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Manage and track all registered counsellors
              </p>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/add-counsellor">
              <Button 
                className="bg-army-green hover:bg-army-green-light text-white shadow-[0_0_15px_hsl(var(--army-green)/0.3)]"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Counsellor
              </Button>
            </Link>
            <Link to="/upload">
              <Button 
                variant="outline"
                className="border-army-green/30 hover:bg-card/70 hover:border-army-green/50"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost"
              onClick={logout}
              className="text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/add-counsellor" className="flex-1">
            <Button 
              size="sm"
              className="w-full bg-army-green hover:bg-army-green-light text-white"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add
            </Button>
          </Link>
          <Link to="/upload" className="flex-1">
            <Button 
              size="sm"
              variant="outline"
              className="w-full border-army-green/30"
            >
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              Dashboard
            </Button>
          </Link>
          <Button 
            size="sm"
            variant="ghost"
            onClick={logout}
            className="text-destructive hover:bg-destructive/10 px-3"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </nav>
    </div>
  );
};