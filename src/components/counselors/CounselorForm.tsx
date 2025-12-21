import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useForm, FormProvider } from "react-hook-form";
import { CounselorFormHeader } from "./CounselorFormHeader";
import { CounselorFormFields } from "./CounselorFormFields";
import { CounselorFormData } from "@/types/counselor";
import apiClient from "@/utils/apiClient";

export const CounselorForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const methods = useForm<CounselorFormData>({
    mode: "onChange"
  });

  const handleSubmit = async (data: CounselorFormData) => {
    setIsLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all text fields
      formData.append("name", data.name);
      formData.append("gender", data.gender);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("country", data.country);
      formData.append("state", data.state);
      formData.append("address", data.address);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("years_of_experience", String(data.years_of_experience));
      formData.append("has_certification", data.has_certification);
      formData.append("denomination", data.denomination);
      formData.append("will_attend_ymr_2024", data.will_attend_ymr_2024);
      formData.append("is_available_for_training", data.is_available_for_training);
      
      // Handle picture - convert base64 to blob if needed
      if (data.picture_url) {
        if (data.picture_url.startsWith("data:")) {
          // Convert base64 to blob
          const response = await fetch(data.picture_url);
          const blob = await response.blob();
          formData.append("picture", blob, "profile.jpg");
        }
      }
      
      console.log("Submitting counsellor with FormData");
      
      const response = await apiClient.post("counsellors/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.status === 201 || response.data?.status === "success") {
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

  const isFromCounsellorsPage = location.pathname.includes("/counsellors");

  const handleCancel = () => {
    if (isAuthenticated) {
      navigate(isFromCounsellorsPage ? "/counsellors" : "/upload");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-army-black to-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(40 100% 50%) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      {/* Back button */}
      <div className="container mx-auto px-4 pt-6 relative z-10">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2 hover:bg-card/50 backdrop-blur-sm border border-army-gold/20 text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {isAuthenticated ? (isFromCounsellorsPage ? 'Back to Counsellors' : 'Back to Dashboard') : 'Back to Home'}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <CounselorFormHeader />

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="max-w-4xl mx-auto">
            <div className="relative bg-card/40 backdrop-blur-xl border border-army-gold/30 rounded-2xl shadow-[0_8px_32px_rgba(255,215,0,0.15)] overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-army-gold to-transparent opacity-60" />
              
              <div className="p-6 md:p-8 lg:p-10">
                <CounselorFormFields />
              </div>

              <div className="bg-card/60 backdrop-blur-sm px-6 py-5 md:px-8 md:py-6 border-t border-army-gold/20 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto border-army-gold/30 hover:bg-card/70 hover:border-army-gold/50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-army-gold hover:bg-army-gold/90 text-army-black shadow-[0_0_20px_hsl(40_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(40_100%_50%/0.4)] transition-all duration-300 font-semibold"
                >
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
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};