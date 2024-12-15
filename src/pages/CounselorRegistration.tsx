import { PageHeader } from "@/components/PageHeader";
import { CounselorForm } from "@/components/counselors/CounselorForm";

const CounselorRegistration = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <PageHeader 
          title="Join Our Counseling Team" 
          description="Apply to become part of our team of professionals and matured counselors."
        />
        <CounselorForm />
      </div>
    </div>
  );
};

export default CounselorRegistration;