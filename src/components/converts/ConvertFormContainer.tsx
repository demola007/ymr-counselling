import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { ConvertFormHeader } from "./ConvertFormHeader";
import { ConvertFormFields } from "./ConvertFormFields";
import apiClient from "@/utils/apiClient";
import { useForm, FormProvider } from "react-hook-form";

interface ConvertFormData {
  name: string;
  email: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
  relationship_status: string;
  country: string;
  state: string;
  address: string;
  nearest_bus_stop: string;
  is_student: boolean;
  age_group: string;
  school: string;
  occupation: string;
  denomination: string;
  availability_for_follow_up: boolean;
}

export const ConvertFormContainer = ({ isOnlineConvert = true }: { isOnlineConvert?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<ConvertFormData>({
    defaultValues: {
      is_student: false,
      availability_for_follow_up: false,
    },
    mode: "onChange"
  });

  const isFromDataPage = location.pathname === "/new-convert-manual";
  const isFromIndexPage = location.pathname === "/new-convert";

  const onSubmit = async (data: ConvertFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        online: isOnlineConvert
      };
      const response = await apiClient.post("/converts/", payload);
      if (response.status === 201 && response.data?.status === "success") {
        toast({ 
          title: "Success", 
          description: "Convert data saved successfully" 
        });
        navigate(isFromDataPage ? "/data" : "/");
      } else {
        toast({
          title: "Error",
          description: response.data?.detail || "Failed to save convert data. Please try again."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save convert data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formState = methods.formState;
    
    if (Object.keys(formState.errors).length > 0) {
      const errorFields = Object.keys(formState.errors)
        .map(field => {
          // Convert camelCase to Title Case with spaces
          const fieldName = field
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase());
          return fieldName;
        })
        .join(', ');

      toast({
        title: "Required Fields Missing",
        description: `Please fill in the following fields: ${errorFields}`,
        variant: "destructive",
      });
      return;
    }

    methods.handleSubmit(onSubmit)(e);
  };

  const handleCancel = () => {
    navigate(isFromDataPage ? "/data" : "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-card/80 via-background to-card/60 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--army-green)) 1px, transparent 0)',
        backgroundSize: '50px 50px'
      }} />
      
      {(isFromDataPage || isFromIndexPage) && (
        <div className="container mx-auto px-4 pt-6 relative z-10">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center gap-2 hover:bg-card/50 backdrop-blur-sm border border-army-green/20 text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {isFromDataPage ? 'Back to Data' : 'Back to Home'}
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <ConvertFormHeader />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative bg-card/40 backdrop-blur-xl border border-army-green/30 rounded-2xl shadow-[var(--shadow-army)] overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-army-green to-transparent opacity-60" />
              
              <div className="p-6 md:p-8 lg:p-10">
                <ConvertFormFields isOnlineConvert={isOnlineConvert} />
              </div>

              <div className="bg-card/60 backdrop-blur-sm px-6 py-5 md:px-8 md:py-6 border-t border-army-green/20 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto border-army-green/30 hover:bg-card/70 hover:border-army-green/50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-army-green hover:bg-army-green-light text-white shadow-[0_0_20px_hsl(120_100%_40%/0.3)] hover:shadow-[0_0_30px_hsl(120_100%_50%/0.4)] transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
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