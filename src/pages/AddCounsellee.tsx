import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm, FormProvider } from "react-hook-form";
import { CounselleeFormFields } from "@/components/counsellee/CounselleeFormFields";
import { CounsellorRemarks } from "@/components/counsellee/CounsellorRemarks";
import apiClient from "@/utils/apiClient";

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
  counsellor_name: string;
  counsellor_comments: string;
}

const AddCounsellee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<CounselleeFormData>({
    defaultValues: {
      is_student: false,
    }
  });

  const onSubmit = async (data: CounselleeFormData) => {
    setIsLoading(true);
    try {
      await apiClient.post('counsellee', data);
      toast({
        title: "Success",
        description: "Counsellee added successfully",
      });
      navigate("/counsellee");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add counsellee",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Counsellee</h1>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Counsellee Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CounselleeFormFields />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Counsellor Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <CounsellorRemarks />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/counsellee")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Counsellee"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddCounsellee;