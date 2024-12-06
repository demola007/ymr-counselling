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
    <nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/fea97e0c-ca99-4275-aa6e-653e80cd7ec1.png" 
          alt="YMR Global Logo" 
          className="h-12 w-auto"
        />
        <h1 className="text-2xl font-bold text-purple-800">YMR Global</h1>
      </div>
      <div className="flex gap-4">
        {userRole === "admin" && (
          <Link to="/data">
            <Button variant="outline">View Documents</Button>
          </Link>
        )}
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};