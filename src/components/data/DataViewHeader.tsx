import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const DataViewHeader = () => {
  return (
    <nav className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sticky top-0 bg-[#1A1F2C] backdrop-blur-lg z-10 p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/fea97e0c-ca99-4275-aa6e-653e80cd7ec1.png" 
          alt="YMR Global Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white">Counselling Data</h1>
      </div>
      <Link to="/upload">
        <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
      </Link>
    </nav>
  );
};