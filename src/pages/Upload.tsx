import { Link } from "react-router-dom";
import { MainNavigation } from "@/components/MainNavigation";
import { PageHeader } from "@/components/PageHeader";
import { UploadForm } from "@/components/upload/UploadForm";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <MainNavigation />
        <div className="flex justify-between items-center mb-8">
          <PageHeader 
            title="AI-Powered Data Capture System"
            description="Upload and manage counselling session data securely."
          />
          <Link to="/counselors">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              View Counselors
            </Button>
          </Link>
        </div>
        <UploadForm />
      </div>
    </div>
  );
};

export default Upload;