import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, UserPlus, Heart } from "lucide-react";
import { CounselleeFormFields } from "@/components/counsellee/CounselleeFormFields";
import { useNavigate } from "react-router-dom";
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
  is_student: string;
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
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    if (isAuthenticated) {
      navigate("/counsellee");
    } else {
      navigate("/");
    }
  };

  const onSubmit = async (data: CounselleeFormData) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/counsellee/", {
        ...data,
        is_student: data.is_student === "true",
        counsellor_name: "",
        counsellor_comments: "",
      });

      if (response.status === 201 && response.data?.status === "success") {
        toast({
          title: "Success",
          description: "Counsellee registered successfully!",
        });
        if (isAuthenticated) {
          navigate("/counsellee");
        } else {
          navigate("/");
        }
      } else {
        throw new Error(response.data?.detail || "Failed to register counsellee");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "There was an error registering the counsellee.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-army-black to-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(40 100% 50%) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-army-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      {/* Back button */}
      <div className="container mx-auto px-4 pt-6 relative z-10">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 hover:bg-card/50 backdrop-blur-sm border border-army-gold/20 text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {isAuthenticated ? "Back to Counsellees" : "Back to Home"}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-10 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-army-gold/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-army-gold/20 to-purple-500/20 p-4 rounded-full border border-army-gold/30">
                <Heart className="h-12 w-12 text-army-gold" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Register for <span className="text-army-gold">Counselling</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              Welcome to YMR Counselling Unit - Please fill this short form providing your details, thereafter you can
              schedule your counselling session. God bless you
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-army-gold/20 border border-army-gold/40 flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-army-gold" />
              </div>
              <span className="text-sm text-muted-foreground">Fill Details</span>
            </div>
            <div className="w-8 h-[2px] bg-army-gold/30" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-card/50 border border-border/40 flex items-center justify-center">
                <Heart className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">Get Support</span>
            </div>
          </div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            <div className="relative bg-card/40 backdrop-blur-xl border border-army-gold/30 rounded-2xl shadow-[0_8px_32px_rgba(255,215,0,0.15)] overflow-hidden">
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-army-gold to-transparent opacity-60" />

              {/* Form Header */}
              <div className="bg-card/60 backdrop-blur-sm px-6 py-5 md:px-8 md:py-6 border-b border-army-gold/20">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-army-gold/10">
                    <UserPlus className="h-5 w-5 text-army-gold" />
                  </div>
                  Counsellee Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1 ml-12">
                  Please provide accurate information for better assistance
                </p>
              </div>

              <div className="p-6 md:p-8 lg:p-10">
                <CounselleeFormFields />
              </div>

              <div className="bg-card/60 backdrop-blur-sm px-6 py-5 md:px-8 md:py-6 border-t border-army-gold/20 flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto border-army-gold/30 hover:bg-card/70 hover:border-army-gold/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-army-gold hover:bg-army-gold/90 text-army-black shadow-[0_0_20px_hsl(40_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(40_100%_50%/0.4)] transition-all duration-300 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddCounsellee;
