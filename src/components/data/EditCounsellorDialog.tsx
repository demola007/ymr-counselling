import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/utils/apiClient";

interface EditCounsellorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: any;
  onSubmit: (e: React.FormEvent) => void;
  setEditingDocument: (doc: any) => void;
  isLoading?: boolean;
  isSuperAdmin?: boolean;
}

export const EditCounsellorDialog = ({
  open,
  onOpenChange,
  document,
  onSubmit,
  setEditingDocument,
  isLoading = false,
  isSuperAdmin = true, // Default to true for now - should come from auth context
}: EditCounsellorDialogProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!document) return null;

  const handleChange = (field: string, value: any) => {
    setEditingDocument({
      ...document,
      [field]: value,
    });
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      await apiClient.patch(`counsellors/${document.id}/password/`, {
        new_password: newPassword,
      });
      
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const counsellorFields = [
    { key: "name", label: "Full Name", type: "text" as const },
    { key: "email", label: "Email", type: "email" as const },
    { key: "phone_number", label: "Phone Number", type: "text" as const },
    { key: "gender", label: "Gender", type: "select" as const, options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" }
    ]},
    { key: "country", label: "Country", type: "text" as const },
    { key: "state", label: "State", type: "text" as const },
    { key: "date_of_birth", label: "Date of Birth", type: "date" as const },
    { key: "address", label: "Address", type: "text" as const },
    { key: "years_of_experience", label: "Years of Experience", type: "number" as const },
    { key: "denomination", label: "Denomination", type: "text" as const }
  ];

  const toggleFields = [
    { key: "has_certification", label: "Has Professional Counselling Certification" },
    { key: "will_attend_ymr_2024", label: "Will Attend YMR 2024 - FLOODGATES" },
    { key: "is_available_for_training", label: "Available for Training" }
  ];

  const renderField = (field: any) => {
    switch (field.type) {
      case "select":
        return (
          <select
            id={field.key}
            value={document[field.key] || ""}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select {field.label}</option>
            {field.options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          {/* Account Status Card */}
          <Card className="border-2 border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Account Status
              </CardTitle>
              <CardDescription>
                Control whether this counsellor can access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="space-y-1">
                  <Label htmlFor="is_active" className="text-sm font-medium">
                    Account Active
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {document.is_active 
                      ? "This counsellor can log in and use the system" 
                      : "This counsellor is deactivated and cannot log in"}
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={document.is_active || false}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                />
              </div>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {toggleFields.map((field) => (
                <div key={field.key} className="flex items-center justify-between">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  <Switch
                    id={field.key}
                    checked={document[field.key] || false}
                    onCheckedChange={(checked) => handleChange(field.key, checked)}
                  />
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

        {/* Password Change Section - Separate from main form */}
        {isSuperAdmin && (
          <>
            <Separator className="my-4" />
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <ShieldAlert className="h-4 w-4" />
                  Super Admin: Change Password
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Set a new password for this counsellor. They will need to use this new password to log in.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 8 characters)"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !newPassword}
                  className="w-full border-amber-300 hover:bg-amber-100"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};