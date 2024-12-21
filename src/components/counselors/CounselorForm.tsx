import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useForm, FormProvider } from "react-hook-form";
import { CounselorFormHeader } from "./CounselorFormHeader";
import { CounselorFormFields } from "./CounselorFormFields";
import { CounselorFormData } from "@/types/counselor";
import apiClient from "@/utils/apiClient";

export const CounselorForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const methods = useForm<CounselorFormData>();

  const handleSubmit = async (data: CounselorFormData) => {
    setIsLoading(true);
    
    try {
      // Parse years_of_experience to number before sending to API
      const formData = {
        ...data,
        years_of_experience: Number(data.years_of_experience)
      };
      console.log("formData", formData)
      
      const response = await apiClient.post("/counsellors", formData);
      
      if (response.status === 201 && response.data?.status === "success") {
        toast({
          title: "Success",
          description: "Your application has been submitted successfully",
        });
        navigate(isAuthenticated ? "/counsellors" : "/");
      } else {
        toast({
          title: "Error",
          description: response.data?.detail || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-8 mx-auto">
        <CounselorFormHeader />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-8 max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
            <CounselorFormFields />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isAuthenticated ? "/counsellors" : "/")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};