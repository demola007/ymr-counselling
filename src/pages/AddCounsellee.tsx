import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CounselleeFormFields } from "@/components/counsellee/CounselleeFormFields";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AddCounsellee = () => {
  const { toast } = useToast();
  const form = useForm();
  const isLoading = false;
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

  const onSubmit = async (data: any) => {
    try {
      // Submit data to your API or backend
      toast({
        title: "Success",
        description: "Counsellee registered successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error registering the counsellee.",
      });
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