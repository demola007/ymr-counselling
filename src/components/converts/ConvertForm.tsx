import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { ConvertFormHeader } from "./ConvertFormHeader";
import { FormField } from "./ConvertFormFields";
import {
  PersonalInfoSection,
  LocationSection,
  StatusSection,
  AdditionalInfoSection,
} from "./ConvertFormSections";

interface ConvertFormProps {
  isOnlineConvert?: boolean;
}

export const ConvertForm = ({ isOnlineConvert = true }: ConvertFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isFromDataPage = location.pathname === "/new-convert-manual";

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
    <div 
      className="space-y-8 min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('/lovable-uploads/95ee6348-b0f6-45c4-8b3c-3a339a302852.png')`,
      }}
    >
      {isFromDataPage && (
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Data
        </Button>
      )}

      <ConvertFormHeader />

      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <PersonalInfoSection />
          </div>
          
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold">Location</h3>
            <LocationSection />
          </div>
          
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold">Status</h3>
            <StatusSection />
          </div>
          
          <div className="space-y-6 col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <AdditionalInfoSection />
          </div>

          <FormField 
            label="Online Convert" 
            id="onlineConvert" 
            value={isOnlineConvert ? "Yes" : "No"} 
            disabled 
            className="bg-gray-100 col-span-2"
          />
        </div>

        <div className="flex justify-end gap-4">
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
