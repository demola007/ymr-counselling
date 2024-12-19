import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FormField, SelectField } from "@/components/converts/ConvertFormFields";
import { Loader2 } from "lucide-react";
import apiClient from "@/utils/apiClient";

const AddCounsellee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <FormField label="Name" id="name" required />
        <SelectField
          label="Gender"
          id="gender"
          required
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]}
        />
        <FormField label="Email" id="email" type="email" required />
        <FormField label="Phone Number" id="phone_number" required />
        <FormField label="Date of Birth" id="date_of_birth" type="date" required />
        <SelectField
          label="Relationship Status"
          id="relationship_status"
          required
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
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
          ]}
        />
        <SelectField
          label="Age Group"
          id="age_group"
          required
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
        <FormField label="Counselling Reason" id="counselling_reason" required />
        <FormField label="Counsellor Name" id="counsellor_name" />
        <FormField label="Counsellor Comments" id="counsellor_comments" />

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
    </div>
  );
};

export default AddCounsellee;