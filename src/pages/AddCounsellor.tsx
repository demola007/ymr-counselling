import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FormField, SelectField } from "@/components/converts/ConvertFormFields";
import { Loader2 } from "lucide-react";
import apiClient from "@/utils/apiClient";

const AddCounsellor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await apiClient.post('counsellors', data);
      toast({
        title: "Success",
        description: "Counsellor added successfully",
      });
      navigate("/counsellors");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to add counsellor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Counsellor</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <FormField label="Name" id="name" required />
        <FormField label="Email" id="email" type="email" required />
        <FormField label="Phone Number" id="phone_number" required />
        <SelectField
          label="Gender"
          id="gender"
          required
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]}
        />
        <FormField label="Date of Birth" id="date_of_birth" type="date" required />
        <FormField label="Address" id="address" required />
        <SelectField
          label="Years of Experience"
          id="years_of_experience"
          required
          options={[
            { value: "0-2", label: "0-2 years" },
            { value: "3-5", label: "3-5 years" },
            { value: "6-10", label: "6-10 years" },
            { value: "10+", label: "More than 10 years" }
          ]}
        />
        <SelectField
          label="Do you have a professional counselling certification?"
          id="has_certification"
          required
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
          ]}
        />
        <FormField label="Denomination" id="denomination" required />
        <SelectField
          label="Will you attend YMR 2024?"
          id="will_attend_ymr_2024"
          required
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
          ]}
        />
        <SelectField
          label="Are you available for training?"
          id="is_available_for_training"
          required
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
          ]}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/counsellors")}
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
              "Add Counsellor"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCounsellor;