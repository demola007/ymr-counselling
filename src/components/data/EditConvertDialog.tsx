import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { EditConvertFormFields } from "./EditConvertFormFields";
import { Convert } from "@/types/convert";

interface EditConvertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Convert | null;
  onSubmit: (data: any) => void;
  setEditingDocument: (doc: Convert | null) => void;
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
  const methods = useForm();

  useEffect(() => {
    if (document && open) {
      methods.reset({
        name: document.name || "",
        email: document.email || "",
        gender: document.gender || "",
        phone_number: document.phone_number || "",
        date_of_birth: document.date_of_birth || "",
        country: document.country || "",
        state: document.state || "",
        address: document.address || "",
        relationship_status: document.relationship_status || "",
        occupation: document.occupation || "",
        nearest_bus_stop: document.nearest_bus_stop || "",
        is_student: document.is_student ? "true" : "false",
        school: document.school || "",
        age_group: document.age_group || "",
        denomination: document.denomination || "",
        availability_for_follow_up: document.availability_for_follow_up ? "true" : "false",
        online: document.online ? "true" : "false",
      });
    }
  }, [document, open, methods]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Convert Data</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <EditConvertFormFields />
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