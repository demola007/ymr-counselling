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
    }
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
      const response = await apiClient.post("/converts", payload);
      if (response.status === 201 && response.data?.status === "success") {
        toast({ 
          title: "Success", 
          description: "Convert data saved successfully" 
        });
        navigate(isFromDataPage ? "/data" : "/");
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to save convert data. Please try again."
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

  const handleCancel = () => {
    navigate(isFromDataPage ? "/data" : "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8">
      {(isFromDataPage || isFromIndexPage) && (
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2 ml-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {isFromDataPage ? 'Back to Data' : 'Back to Home'}
        </Button>
      )}

      <ConvertFormHeader />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
          <ConvertFormFields isOnlineConvert={isOnlineConvert} />

          <div className="flex justify-end gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};