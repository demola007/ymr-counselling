import { createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { login as authLogin, logout as authLogout } from "./authUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const result = authLogin(email, password);
    if (result.success) {
      setUserRole(result.role);
      setIsAuthenticated(true);
      localStorage.setItem("userRole", result.role);
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login successful",
        description: `Welcome back${result.role === "super-admin" ? ", Super Admin" : result.role === "admin" ? ", Admin" : ""}!`,
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
    authLogout();
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