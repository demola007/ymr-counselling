import { PageHeader } from "@/components/PageHeader";
import { CounselorForm } from "@/components/counselors/CounselorForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CounselorRegistration = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        {!isAuthenticated && (
          <Button 
            variant="secondary"
            size="sm" 
            onClick={() => navigate("/")}
            className="mb-6 bg-white text-[#1A1F2C] hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}
        <CounselorForm />
      </div>
    </div>
  );
};

export default CounselorRegistration;