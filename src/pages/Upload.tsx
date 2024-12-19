import { MainNavigation } from "@/components/MainNavigation";
import { PageHeader } from "@/components/PageHeader";
import { UploadForm } from "@/components/upload/UploadForm";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <MainNavigation />
        <PageHeader 
          title="AI-Powered Data Capture System"
          description="Upload and manage counselling session data securely."
        />
        <UploadForm />
      </div>
    </div>
  );
};

export default Upload;