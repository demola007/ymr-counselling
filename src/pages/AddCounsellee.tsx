import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CounselleeFormFields } from "@/components/counsellee/CounselleeFormFields";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/utils/apiClient";
import { useState } from "react";

interface CounselleeFormData {
  name: string;
  gender: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  relationship_status: string;
  country: string;
  state: string;
  address: string;
  nearest_bus_stop: string;
  is_student: string;  // Changed from boolean to string since form returns string
  age_group: string;
  school: string;
  occupation: string;
  denomination: string;
  counselling_reason: string;
  counsellor_name?: string;
  counsellor_comments?: string;
}

const AddCounsellee = () => {
  const { toast } = useToast();
  const form = useForm<CounselleeFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/counsellee');
    } else {
      navigate('/');
    }
  };

  const onSubmit = async (data: CounselleeFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/counsellee', {
        ...data,
        is_student: data.is_student === 'true',  // Now comparing string with string
        counsellor_name: "",
        counsellor_comments: ""
      });

      if (response.status === 201 && response.data?.status === "success") {
        toast({
          title: "Success",
          description: "Counsellee registered successfully!",
        });
        if (isAuthenticated) {
          navigate('/counsellee');
        } else {
          navigate('/');
        }
      } else {
        throw new Error(response.data?.message || "Failed to register counsellee");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "There was an error registering the counsellee.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Button 
          variant="outline"
          size="sm" 
          onClick={handleBack}
          className="mb-6 w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Register for Counselling
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Welcome to YMR Counselling Unit - Please fill this short form providing your details, thereafter you can schedule your counselling session. God bless you
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-lg border-gray-100">
              <CardHeader className="space-y-1 px-6 py-4 bg-gray-50 border-b">
                <CardTitle className="text-xl text-gray-900">Counsellee Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <CounselleeFormFields />
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleBack}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddCounsellee;