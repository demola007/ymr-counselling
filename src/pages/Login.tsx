import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - replace with actual API call later
    if (email === "superadmin@example.com" && password === "superadmin") {
      localStorage.setItem("userRole", "super-admin");
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login successful",
        description: "Welcome back, Super Admin!",
      });
      navigate("/upload");
    } else if (email === "admin@example.com" && password === "admin") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("isAuthenticated", "true");
      toast({
        title: "Login successful",
        description: "Welcome back, Admin!",
      });
      navigate("/upload");
    } else if (email === "user@example.com" && password === "user") {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-white">
      <div className="w-full max-w-md p-8 glass-panel rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-purple-900 hover:bg-purple-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">YMR Global</h1>
          <p className="text-muted-foreground">Counselling Data Capture System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <div className="mt-4 text-sm text-center text-muted-foreground">
          <p>Demo Credentials:</p>
          <p>Super Admin: superadmin@example.com / superadmin</p>
          <p>Admin: admin@example.com / admin</p>
          <p>User: user@example.com / user</p>
        </div>
      </div>
    </div>
  );
};

export default Login;