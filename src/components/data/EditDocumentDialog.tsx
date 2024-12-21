import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Field {
  key: string;
  label: string;
  type: "text" | "email" | "date" | "select" | "textarea" | "checkbox";
  options?: { value: string; label: string }[];
}

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSubmit: (e: React.FormEvent) => void;
  setEditingDocument: (doc: any) => void;
  isLoading?: boolean;
  fields?: Field[];
}

export const EditDocumentDialog = ({
  open,
  onOpenChange,
  document,
  onSubmit,
  setEditingDocument,
  isLoading = false,
  fields,
}: EditDocumentDialogProps) => {
  if (!document) return null;

  const handleChange = (field: string, value: any) => {
    setEditingDocument({
      ...document,
      [field]: value,
    });
  };

  const counselleeFields = [
    { key: "name", label: "Name", type: "text" as const },
    { key: "gender", label: "Gender", type: "select" as const, options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]},
    { key: "email", label: "Email", type: "email" as const },
    { key: "phone_number", label: "Phone Number", type: "text" as const },
    { key: "date_of_birth", label: "Date of Birth", type: "date" as const },
    { key: "relationship_status", label: "Relationship Status", type: "select" as const, options: [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "other", label: "Other" }
    ]},
    { key: "country", label: "Country", type: "text" as const },
    { key: "state", label: "State", type: "text" as const },
    { key: "address", label: "Address", type: "text" as const },
    { key: "nearest_bus_stop", label: "Nearest Bus Stop", type: "text" as const },
    { key: "is_student", label: "Is Student", type: "select" as const, options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" }
    ]},
    { key: "age_group", label: "Age Group", type: "select" as const, options: [
      { value: "18-24", label: "18-24" },
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45+", label: "45+" }
    ]},
    { key: "school", label: "School", type: "text" as const },
    { key: "occupation", label: "Occupation", type: "text" as const },
    { key: "denomination", label: "Denomination", type: "text" as const },
    { key: "counselling_reason", label: "Counselling Reason", type: "textarea" as const }
  ];

  const counsellorFields = [
    { key: "counsellor_name", label: "Counsellor Name", type: "text" as const },
    { key: "counsellor_comments", label: "Counsellor Comments", type: "textarea" as const },
    { key: "attended_to", label: "Attended To", type: "checkbox" as const }
  ];

  const renderField = (field: Field) => {
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
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            id={field.key}
            value={document[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="min-h-[100px]"
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={document[field.key] || false}
              onCheckedChange={(checked) => handleChange(field.key, checked)}
            />
            <label
              htmlFor={field.key}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </label>
          </div>
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

  const fieldsToRender = fields || [...counselleeFields, ...counsellorFields];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Counsellee Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counselleeFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Counsellor Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {counsellorFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  {field.type === "checkbox" ? (
                    renderField(field)
                  ) : (
                    <>
                      <Label htmlFor={field.key}>{field.label}</Label>
                      {renderField(field)}
                    </>
                  )}
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