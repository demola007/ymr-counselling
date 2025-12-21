import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/utils/apiClient";
import { useToast } from "@/components/ui/use-toast";

type LoginStep = "email" | "password" | "setup-password";

interface PasswordStatus {
  status: "not_found" | "inactive" | "needs_password" | "ready";
  message: string;
  needs_password_setup?: boolean;
  is_active?: boolean;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<LoginStep>("email");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordSetupSuccess, setPasswordSetupSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkPasswordStatus = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("counsellors/check-password-status", {
        email: email.trim(),
      });
      
      const data: PasswordStatus = response.data;
      
      switch (data.status) {
        case "not_found":
          toast({
            title: "Account not found",
            description: "No account exists with this email address.",
            variant: "destructive",
            className: "bg-red-500 text-white border-none",
          });
          break;
        case "inactive":
          toast({
            title: "Account not activated",
            description: "Your account has not been activated yet. Please contact an administrator.",
            variant: "destructive",
            className: "bg-red-500 text-white border-none",
          });
          break;
        case "needs_password":
          setStep("setup-password");
          toast({
            title: "Password setup required",
            description: "Please set up your password to continue.",
            className: "bg-blue-500 text-white border-none",
          });
          break;
        case "ready":
          setStep("password");
          break;
        default:
          setStep("password");
      }
    } catch (error: any) {
      console.error("Check password status error:", error);
      // If endpoint fails, fall back to normal login flow
      setStep("password");
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
        className: "bg-red-500 text-white border-none",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
        className: "bg-red-500 text-white border-none",
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiClient.post("counsellors/setup-password", {
        email: email.trim(),
        password: newPassword,
      });
      
      if (response.status === 200) {
        setPasswordSetupSuccess(true);
        toast({
          title: "Password set successfully",
          description: "You can now login with your new password.",
          className: "bg-green-500 text-white border-none",
        });
        
        // Reset and go to password step
        setTimeout(() => {
          setPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSetupSuccess(false);
          setStep("password");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Setup password error:", error);
      
      let errorMessage = "Failed to set password. Please try again.";
      
      if (error?.response?.status === 404) {
        errorMessage = "No account found with this email.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Your account has not been activated yet.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Password has already been set. Please login normally.";
        setStep("password");
      } else if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast({
        title: "Setup failed",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white border-none",
      });
    } finally {
      setLoading(false);
    }
  };

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
        const data = response.data;
        const token = data?.access_token;
        const role = data?.user?.role || "user";
        
        if (token) {
          login(token, role);
          navigate("/upload", { replace: true });
        } else {
          throw new Error("No access token received");
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
          className: "bg-red-500 text-white border-none",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error?.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white border-none",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      checkPasswordStatus();
    }
  };

  const goBackToEmail = () => {
    setStep("email");
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
          {step === "email" ? (
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
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 transition-all"
              onClick={goBackToEmail}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Email
            </Button>
          )}
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">YMR Global</h1>
          <p className="text-white/80">
            {step === "setup-password" 
              ? "Set up your password" 
              : "AI-Powered Data Capture System"}
          </p>
          {step !== "email" && (
            <p className="text-white/60 text-sm mt-2">{email}</p>
          )}
        </div>

        {/* Step 1: Email Entry */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
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
            <Button 
              type="submit" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Continue"}
            </Button>
          </form>
        )}

        {/* Step 2a: Password Setup for new users */}
        {step === "setup-password" && (
          <form onSubmit={handleSetupPassword} className="space-y-6">
            {passwordSetupSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-white text-lg">Password set successfully!</p>
                <p className="text-white/60 text-sm mt-2">Redirecting to login...</p>
              </div>
            ) : (
              <>
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    Your account has been activated. Please create a password to complete your setup.
                  </p>
                </div>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-white/50 text-xs">Password must be at least 8 characters</p>
                <Button 
                  type="submit" 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color="#ffffff" /> : "Set Password"}
                </Button>
              </>
            )}
          </form>
        )}

        {/* Step 2b: Normal Password Login */}
        {step === "password" && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Login"}
            </Button>
          </form>
        )}
        
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