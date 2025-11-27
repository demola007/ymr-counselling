import { useState } from "react";
import { Convert } from "@/types/convert";
import { ConvertFormCard } from "./ConvertFormCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Upload, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultsReviewProps {
  converts: Convert[];
  onSubmitAll: (converts: Convert[]) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const ResultsReview = ({ converts, onSubmitAll, onCancel, isSubmitting }: ResultsReviewProps) => {
  const [editedConverts, setEditedConverts] = useState<Convert[]>(converts);
  const [validationState, setValidationState] = useState<boolean[]>(
    new Array(converts.length).fill(true)
  );

  const handleUpdate = (index: number, data: Convert) => {
    const newConverts = [...editedConverts];
    newConverts[index] = data;
    setEditedConverts(newConverts);
  };

  const handleValidationChange = (index: number, isValid: boolean) => {
    const newValidation = [...validationState];
    newValidation[index] = isValid;
    setValidationState(newValidation);
  };

  const allValid = validationState.every(v => v);
  const validCount = validationState.filter(v => v).length;
  const progressPercentage = (validCount / converts.length) * 100;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl border-border/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-army-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-army-gold/10 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-army-gold" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">Review AI Processed Forms</CardTitle>
              <CardDescription className="text-base">
                Verify and edit the extracted information before submitting to database
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {validCount} of {converts.length} forms validated
            </span>
            <span className={allValid ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
              {allValid ? "All forms ready" : "Review required fields"}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          {!allValid && (
            <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
              <p className="text-sm text-orange-600">
                Some forms have missing required fields. Please review and complete them before submitting.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Forms List */}
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-6">
          {editedConverts.map((convert, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
              <ConvertFormCard
                convert={convert}
                index={index}
                onUpdate={handleUpdate}
                isValid={validationState[index]}
                onValidationChange={handleValidationChange}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <Card className="bg-card/60 backdrop-blur-xl border-border/40 sticky bottom-0">
        <CardContent className="pt-6">
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              size="lg"
              onClick={onCancel}
              disabled={isSubmitting}
              className="min-w-32"
            >
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={() => onSubmitAll(editedConverts)}
              disabled={!allValid || isSubmitting}
              className="min-w-48 bg-army-gold hover:bg-army-gold/90 text-army-black font-semibold shadow-[0_0_20px_hsl(40_100%_50%/0.3)] hover:shadow-[0_0_30px_hsl(40_100%_50%/0.4)] transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-army-black/30 border-t-army-black rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Submit All ({converts.length})
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
