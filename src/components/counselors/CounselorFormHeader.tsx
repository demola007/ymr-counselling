import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const CounselorFormHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <>
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

      {isAuthenticated && (
        <nav className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-[#1A1F2C] backdrop-blur-lg z-10 p-4 w-full rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
              alt="YMR Logo" 
              className="h-10 w-auto"
            />
            <h1 className="text-xl md:text-2xl font-bold text-white">Add New Counsellor</h1>
          </div>
          <Button 
            variant="secondary"
            size="sm" 
            onClick={() => navigate("/counsellors")}
            className="bg-white text-[#1A1F2C] hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Counsellors
          </Button>
        </nav>
      )}

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Join Our Counseling Team</h2>
        <p className="text-gray-600">Apply to become part of our team of professionals and matured counselors.</p>
      </div>
    </>
  );
};