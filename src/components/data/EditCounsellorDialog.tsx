import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface EditCounsellorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSubmit: (e: React.FormEvent) => void;
  setEditingDocument: (doc: any) => void;
  isLoading?: boolean;
}

export const EditCounsellorDialog = ({
  open,
  onOpenChange,
  document,
  onSubmit,
  setEditingDocument,
  isLoading = false,
}: EditCounsellorDialogProps) => {
  if (!document) return null;

  const handleChange = (field: string, value: any) => {
    setEditingDocument({
      ...document,
      [field]: value,
    });
  };

  const counsellorFields = [
    { key: "name", label: "Full Name", type: "text" as const },
    { key: "email", label: "Email", type: "email" as const },
    { key: "phone_number", label: "Phone Number", type: "text" as const },
    { key: "gender", label: "Gender", type: "select" as const, options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]},
    { key: "date_of_birth", label: "Date of Birth", type: "date" as const },
    { key: "address", label: "Address", type: "text" as const },
    { key: "years_of_experience", label: "Years of Experience", type: "number" as const },
    { key: "has_certification", label: "Has Certification", type: "select" as const, options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" }
    ]},
    { key: "denomination", label: "Denomination", type: "text" as const },
    { key: "will_attend_ymr_2024", label: "Will Attend YMR 2024", type: "select" as const, options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" }
    ]},
    { key: "is_available_for_training", label: "Available for Training", type: "select" as const, options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" }
    ]}
  ];

  const renderField = (field: any) => {
    switch (field.type) {
      case "select":
        return (
          <Select
            value={String(document[field.key])}
            onValueChange={(value) => handleChange(field.key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            id={field.key}
            type={field.type}
            value={document[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Counsellor</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Counsellor Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counsellorFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
          </Card>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};