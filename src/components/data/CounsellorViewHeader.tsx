import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const CounsellorViewHeader = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-[#1A1F2C] backdrop-blur-lg z-10 p-4 w-full rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
          alt="YMR Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white">Counsellor Details</h1>
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
  );
};