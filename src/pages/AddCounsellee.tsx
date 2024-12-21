import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FormField, SelectField } from "@/components/converts/FormField";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm, FormProvider } from "react-hook-form";
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Name" id="name" required />
                <SelectField
                  label="Gender"
                  id="gender"
                  required
                  placeholder="Select gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" }
                  ]}
                />
                <FormField label="Email" id="email" type="email" required />
                <FormField 
                  label="Phone Number" 
                  id="phone_number" 
                  required 
                  placeholder="+234 *********"
                  hint="WhatsApp Enabled (e.g. +234 *********) Kindly include your country code"
                />
                <FormField 
                  label="Date of Birth" 
                  id="date_of_birth" 
                  type="date" 
                  required 
                />
                <SelectField
                  label="Relationship Status"
                  id="relationship_status"
                  required
                  placeholder="Select status"
                  options={[
                    { value: "single", label: "Single" },
                    { value: "married", label: "Married" },
                    { value: "divorced", label: "Divorced" },
                    { value: "widowed", label: "Widowed" }
                  ]}
                />
                <FormField label="Country" id="country" required />
                <FormField label="State" id="state" required />
                <FormField label="Address" id="address" required />
                <FormField label="Nearest Bus Stop" id="nearest_bus_stop" required />
                <SelectField
                  label="Are you a student?"
                  id="is_student"
                  required
                  placeholder="Select option"
                  options={[
                    { value: "true", label: "Yes" },
                    { value: "false", label: "No" }
                  ]}
                />
                <SelectField
                  label="Age Group"
                  id="age_group"
                  required
                  placeholder="Select age group"
                  options={[
                    { value: "13-17", label: "13-17" },
                    { value: "18-24", label: "18-24" },
                    { value: "25-34", label: "25-34" },
                    { value: "35-44", label: "35-44" },
                    { value: "45+", label: "45+" }
                  ]}
                />
                <FormField label="School" id="school" />
                <FormField label="Occupation" id="occupation" required />
                <FormField label="Denomination" id="denomination" required />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Counselling Reason
                  </label>
                  <Textarea
                    {...methods.register("counselling_reason")}
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Counsellor Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <FormField label="Counsellor Name" id="counsellor_name" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Counsellor Comments
                  </label>
                  <Textarea
                    {...methods.register("counsellor_comments")}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
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