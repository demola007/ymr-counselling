import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("userRole")
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = (email: string, password: string) => {
    if (email === "superadmin@example.com" && password === "superadmin") {
      setUserRole("super-admin");
      setIsAuthenticated(true);
      localStorage.setItem("userRole", "super-admin");
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login successful",
        description: "Welcome back, Super Admin!",
      });
      navigate("/upload");
    } else if (email === "admin@example.com" && password === "admin") {
      setUserRole("admin");
      setIsAuthenticated(true);
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      navigate("/upload");
    } else if (email === "user@example.com" && password === "user") {
      setUserRole("user");
      setIsAuthenticated(true);
      localStorage.setItem("userRole", "user");
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/upload");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};