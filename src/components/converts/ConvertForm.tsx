import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { ConvertFormHeader } from "./ConvertFormHeader";
import { FormField, SelectField } from "./ConvertFormFields";

export const ConvertForm = ({ isOnlineConvert = true }: { isOnlineConvert?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isFromDataPage = location.pathname === "/new-convert-manual";
  const isFromIndexPage = location.pathname === "/new-convert";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement form submission logic
      toast({
        title: "Success",
        description: "Convert data saved successfully",
      });
      navigate(isFromDataPage ? "/data" : "/");
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

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="Name" 
            id="name" 
            required 
          />
          <FormField 
            label="Email" 
            id="email" 
            type="email" 
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
            label="Date of Birth" 
            id="dob" 
            type="date" 
            required 
          />
          <SelectField
            label="Gender"
            id="gender"
            required
            placeholder="Select gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" }
            ]}
          />
          <FormField 
            label="Country" 
            id="country" 
            required 
          />
          <FormField 
            label="State" 
            id="state" 
            required 
          />
          <FormField 
            label="Address" 
            id="address" 
            required 
          />
          <FormField 
            label="Nearest Bus Stop" 
            id="busStop" 
            required 
          />
          <SelectField
            label="Relationship Status"
            id="relationship"
            required
            placeholder="Select status"
            options={[
              { value: "Single", label: "Single" },
              { value: "Married", label: "Married" },
              { value: "Divorced", label: "Divorced" }
            ]}
          />
          <SelectField
            label="Are you a student?"
            id="isStudent"
            required
            placeholder="Select option"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
          />
          <SelectField
            label="Age Group"
            id="ageGroup"
            required
            placeholder="Select age group"
            options={[
              { value: "18-24", label: "18-24" },
              { value: "25-34", label: "25-34" },
              { value: "35-44", label: "35-44" },
              { value: "45+", label: "45+" }
            ]}
          />
          <FormField 
            label="School" 
            id="school"
          />
          <FormField 
            label="Occupation" 
            id="occupation" 
            required 
          />
          <FormField 
            label="Denomination" 
            id="denomination" 
            required 
          />
          <SelectField
            label="Available for Follow-up"
            id="followUp"
            required
            placeholder="Select option"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
          />
          <FormField 
            label="Online Convert" 
            id="onlineConvert" 
            value={isOnlineConvert ? "Yes" : "No"} 
            disabled 
            className="bg-gray-100"
          />
        </div>

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
    </div>
  );
};
