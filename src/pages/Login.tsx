import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
        navigate("/upload");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: `${error?.response?.data?.detail}`,
        variant: "destructive",
      });
      console.error("Login failed:", error?.response?.data?.detail);
    } finally {
      setLoading(false);
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
          <p className="text-muted-foreground">AI-Powered Data Capture System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Login
          </Button>
        </form>
        
        {loading && (
          <div className="loader-overlay">
            <ClipLoader color="#3498db" size={50} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;