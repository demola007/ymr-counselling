import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/converts/FormField";
import { SelectField } from "@/components/converts/SelectField";
import { useForm, FormProvider } from "react-hook-form";

interface EditConvertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSubmit: (data: any) => void;
  setEditingDocument: (doc: any) => void;
  isLoading: boolean;
}

export const EditConvertDialog = ({
  open,
  onOpenChange,
  document,
  onSubmit,
  setEditingDocument,
  isLoading,
}: EditConvertDialogProps) => {
  const methods = useForm({
    defaultValues: {
      name: document?.name || "",
      email: document?.email || "",
      gender: document?.gender || "",
      phone_number: document?.phone_number || "",
      date_of_birth: document?.date_of_birth || "",
      relationship_status: document?.relationship_status || "",
      country: document?.country || "",
      state: document?.state || "",
      address: document?.address || "",
      nearest_bus_stop: document?.nearest_bus_stop || "",
      is_student: document?.is_student || false,
      age_group: document?.age_group || "",
      school: document?.school || "",
      occupation: document?.occupation || "",
      denomination: document?.denomination || "",
      availability_for_follow_up: document?.availability_for_follow_up || true,
      online: document?.online || false,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Convert Data</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
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
                label="Phone Number" 
                id="phone_number" 
                required 
              />
              <FormField 
                label="Date of Birth" 
                id="date_of_birth" 
                type="date" 
                required 
              />
              <SelectField
                label="Relationship Status"
                id="relationship_status"
                required
                placeholder="Select status"
                options={[
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                  { value: "other", label: "Other" }
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
                id="nearest_bus_stop" 
                required 
              />
              <SelectField
                label="Are you a student?"
                id="is_student"
                required
                placeholder="Select option"
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" }
                ]}
              />
              <SelectField
                label="Age Group"
                id="age_group"
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
                id="availability_for_follow_up"
                required
                placeholder="Select option"
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" }
                ]}
              />
              <SelectField
                label="Online Convert"
                id="online"
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
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};