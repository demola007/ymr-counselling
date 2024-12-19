import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
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
      navigate("/counsellors");
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
    <div className="space-y-8">
      <nav className="flex items-center justify-between gap-4 mb-6 sticky top-0 bg-[#1A1F2C] backdrop-blur-lg z-10 p-4 w-full rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
            alt="YMR Logo" 
            className="h-10 w-auto"
          />
          <h1 className="text-xl md:text-2xl font-bold text-white">Add New Counsellor</h1>
        </div>
        <Button 
          variant="secondary"
          size="sm" 
          onClick={() => navigate("/counsellors")}
          className="bg-white text-[#1A1F2C] hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Counsellors
        </Button>
      </nav>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">Join Our Counseling Team</h2>
        <p className="text-gray-600">Apply to become part of our team of professionals and matured counselors.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <div className="space-y-6">
          <FormField label="Full Name" id="name" required />
          <FormField label="Email" id="email" type="email" required />
          <FormField 
            label="Phone Number" 
            id="phone_number" 
            required 
            placeholder="+234 *********"
            hint="WhatsApp Enabled (e.g. +234 *********) Kindly include your country code"
          />
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
          <FormField 
            label="Date of Birth" 
            id="date_of_birth" 
            type="date" 
            required 
            placeholder="DD/MM/YYYY"
          />
          <FormField label="Address" id="address" required />
          <SelectField
            label="Years of Experience"
            id="years_of_experience"
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
            id="has_certification"
            required
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
          />
          <FormField label="Denomination" id="denomination" required />
          <SelectField
            label="Will you be present at YMR 2024 - FLOODGATES?"
            id="will_attend_ymr_2024"
            required
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
          />
          <SelectField
            label="Are you available for interactions and further trainings?"
            id="is_available_for_training"
            required
            placeholder="Select option"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" }
            ]}
          />
        </div>

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
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};