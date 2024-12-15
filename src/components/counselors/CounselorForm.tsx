import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormField, SelectField } from "@/components/converts/ConvertFormFields";

export const CounselorForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement form submission logic
      toast({
        title: "Success",
        description: "Your application has been submitted successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
      <div className="space-y-6">
        <FormField 
          label="Full Name" 
          id="fullName" 
          required 
        />
        <FormField 
          label="Address" 
          id="address" 
          required 
        />
        <FormField 
          label="Phone Number" 
          id="phone" 
          required 
          placeholder="+234 *********"
          hint="WhatsApp Enabled (e.g. +234 *********) Kindly include your country code"
        />
        <FormField 
          label="Email" 
          id="email" 
          type="email" 
          required 
        />
        <SelectField
          label="Years of Experience"
          id="experience"
          required
          placeholder="Select years of experience"
          options={[
            { value: "0-2", label: "0-2 years" },
            { value: "3-5", label: "3-5 years" },
            { value: "6-10", label: "6-10 years" },
            { value: "10+", label: "More than 10 years" }
          ]}
        />
        <SelectField
          label="Do you have a professional counselling certification?"
          id="hasCertification"
          required
          placeholder="Select option"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
        />
        <FormField 
          label="Denomination" 
          id="denomination" 
          required 
        />
        <SelectField
          label="Will you be present at YMR 2024 - FLOODGATES?"
          id="willAttendYMR"
          required
          placeholder="Select option"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
        />
        <SelectField
          label="Are you available for interactions and further trainings?"
          id="availableForTraining"
          required
          placeholder="Select option"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
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
  );
};