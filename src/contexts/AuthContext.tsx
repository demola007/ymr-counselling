import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { login as authLogin, logout as authLogout } from "./authUtils";
import { AuthContext } from "./AuthContextDefinition";
import apiClient from "@/utils/apiClient";
import './loader.css';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem("userRole")
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Load token from localStorage on initialization
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("userRole");

    if (token && role) {
      // Set token for future API calls
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("isAuthenticated", "true");
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUserRole(role);
  };


  const logout = () => {
    // authLogout();
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};