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
  is_student: boolean;
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
        is_student: data.is_student === 'true',
        counsellor_name: "",
        counsellor_comments: ""
      });

      if (response.status === 201 && response.data?.status === "success") {
        toast({
          title: "Success",
          description: "Counsellee registered successfully!",
        });
        // Navigate based on where the user came from
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="outline"
        size="sm" 
        onClick={handleBack}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="text-center mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Register for Counselling</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to YMR Counselling Unit - Please fill this short form providing your details, thereafter you can schedule your counselling session. God bless you
        </p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Counsellee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CounselleeFormFields />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddCounsellee;