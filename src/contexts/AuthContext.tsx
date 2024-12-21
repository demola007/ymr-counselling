import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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
      try {
        // Decode the token to check its expiration
        const decoded: { exp: number } = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp > currentTime) {
          // Token is valid, set up API client
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          // Token has expired, log out and navigate to index
          setIsAuthenticated(false);
          setUserRole(null);
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
          setUserRole(null);
        navigate("/", { replace: true }); // In case of any error, treat it as an invalid token
      }
      // Set token for future API calls
      // apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // setIsAuthenticated(true);
      // setUserRole(role);
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