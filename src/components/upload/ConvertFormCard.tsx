import { useForm, FormProvider } from "react-hook-form";
import { Convert } from "@/types/convert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { EditConvertFormFields } from "@/components/data/EditConvertFormFields";
import { useEffect } from "react";

interface ConvertFormCardProps {
  convert: Convert;
  index: number;
  onUpdate: (index: number, data: Convert) => void;
  isValid: boolean;
  onValidationChange: (index: number, isValid: boolean) => void;
}

export const ConvertFormCard = ({ 
  convert, 
  index, 
  onUpdate, 
  isValid,
  onValidationChange 
}: ConvertFormCardProps) => {
  const methods = useForm({
    defaultValues: convert,
    mode: "onChange"
  });

  const { watch, formState } = methods;

  // Watch all form changes
  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate(index, value as Convert);
    });
    return () => subscription.unsubscribe();
  }, [watch, index, onUpdate]);

  // Track validation state
  useEffect(() => {
    onValidationChange(index, formState.isValid);
  }, [formState.isValid, index, onValidationChange]);

  return (
    <Card className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/40 hover:border-army-gold/50 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-army-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-army-gold/10 text-army-gold font-bold">
              {index + 1}
            </div>
            <div>
              <CardTitle className="text-lg">{convert.name || "Unnamed Convert"}</CardTitle>
              <p className="text-sm text-muted-foreground">{convert.email || "No email"}</p>
            </div>
          </div>
          <Badge 
            variant={isValid ? "default" : "destructive"}
            className={isValid ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
          >
            {isValid ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Valid
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 mr-1" />
                Check Required Fields
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <FormProvider {...methods}>
          <form className="space-y-4">
            <EditConvertFormFields />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
