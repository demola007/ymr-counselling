import { CounselorForm } from "@/components/counselors/CounselorForm";
import { useAuth } from "@/hooks/useAuth";

const CounselorRegistration = () => {
  const { isAuthenticated } = useAuth();

  return <CounselorForm />;
};

export default CounselorRegistration;