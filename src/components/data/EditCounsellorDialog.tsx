import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, ShieldAlert, UserCog } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  isSuperAdmin = true,
}: EditCounsellorDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
            className="w-full border border-input rounded-md px-3 py-2 bg-background"
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

          {/* Role Management - Super Admin Only */}
          {isSuperAdmin && (
            <Card className="border-2 border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-blue-800">
                  <UserCog className="h-4 w-4" />
                  Role Management
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Assign or change the counsellor's system role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="role">System Role</Label>
                  <Select
                    value={document.role || "counsellor"}
                    onValueChange={(value) => handleChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="counsellor">Counsellor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

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

          {/* Password Change Section - Super Admin Only */}
          {isSuperAdmin && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-amber-800">
                  <ShieldAlert className="h-4 w-4" />
                  Reset Password
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Leave blank to keep the current password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={document.password || ""}
                      onChange={(e) => handleChange("password", e.target.value)}
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
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

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
