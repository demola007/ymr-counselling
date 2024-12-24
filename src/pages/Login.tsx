import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/utils/apiClient";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiClient.post(
        "login",
        new URLSearchParams({
          username: email,
          password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        const data = await response.data;
        login(data?.access_token, data?.user?.role);
        // Use replace instead of push to prevent back navigation issues
        navigate("/upload", { replace: true });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white border-none",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: `${error?.response?.data?.detail}`,
        variant: "destructive",
        className: "bg-red-500 text-white border-none",
      });
      console.error("Login failed:", error?.response?.data?.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/c7337a42-2b96-45b9-b377-8e15df75f694.png")',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="w-full max-w-md p-8 backdrop-blur-md bg-white/10 rounded-lg shadow-2xl border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">YMR Global</h1>
          <p className="text-white/80">AI-Powered Data Capture System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
          </Button>
        </form>
        
        {loading && (
          <div className="loader-overlay">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;