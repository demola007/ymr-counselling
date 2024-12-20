import { CounselorForm } from "@/components/counselors/CounselorForm";
import { useAuth } from "@/hooks/useAuth";

const CounselorRegistration = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <CounselorForm />
      </div>
    </div>
  );
};

export default CounselorRegistration;