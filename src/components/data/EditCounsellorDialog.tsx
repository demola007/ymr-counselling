import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, ShieldAlert, UserCog, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

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
  const [showRoleSection, setShowRoleSection] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!document) return null;

  const handleChange = (field: string, value: any) => {
    setEditingDocument({
      ...document,
      [field]: value,
    });
    
    // Clear password error when password changes
    if (field === "password") {
      setPasswordError("");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password if it's being changed
    if (document.password) {
      if (document.password.length < 5) {
        setPasswordError("Password must be at least 5 characters");
        toast({
          title: "Validation Error",
          description: "Password must be at least 5 characters",
          variant: "destructive",
        });
        return;
      }
      if (document.password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
    }
    
    onSubmit(e);
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
    { key: "will_attend_ymr_2024", label: "Will Attend YMR - THE NEW ARMY" },
    { key: "is_available_for_training", label: "Available for Training" }
  ];

  const roleOptions = [
    { value: "user", label: "User", description: "Standard user access" },
    { value: "admin", label: "Admin", description: "Administrative privileges" },
    { value: "super_admin", label: "Super Admin", description: "Full system access" }
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
        <form onSubmit={handleFormSubmit} className="space-y-6">
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

          {/* Role Management - Collapsible with Radio Buttons */}
          {isSuperAdmin && (
            <Collapsible open={showRoleSection} onOpenChange={setShowRoleSection}>
              <Card className="border border-blue-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-base text-blue-800">Update Role</CardTitle>
                      </div>
                      {showRoleSection ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription className="text-blue-700">
                      Click to change the user's system role
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="p-4 bg-blue-50/50 rounded-lg">
                      <Label className="text-sm font-medium mb-3 block">System Role</Label>
                      <RadioGroup
                        value={document.role || "user"}
                        onValueChange={(value) => handleChange("role", value)}
                        className="space-y-3"
                      >
                        {roleOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-3 p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
                          >
                            <RadioGroupItem value={option.value} id={`role-${option.value}`} />
                            <div className="flex-1">
                              <Label
                                htmlFor={`role-${option.value}`}
                                className="font-medium cursor-pointer"
                              >
                                {option.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
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
            <CardContent className="space-y-3">
              {toggleFields.map((field) => (
                <div 
                  key={field.key} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200",
                    document[field.key] 
                      ? "bg-primary/10 border-primary/40" 
                      : "bg-muted/30 border-muted-foreground/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      document[field.key] ? "bg-primary" : "bg-muted-foreground/40"
                    )} />
                    <Label 
                      htmlFor={field.key} 
                      className={cn(
                        "cursor-pointer transition-colors",
                        document[field.key] ? "text-foreground font-medium" : "text-muted-foreground"
                      )}
                    >
                      {field.label}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded",
                      document[field.key] 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {document[field.key] ? "ON" : "OFF"}
                    </span>
                    <Switch
                      id={field.key}
                      checked={document[field.key] || false}
                      onCheckedChange={(checked) => handleChange(field.key, checked)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Password Change - Collapsible with Confirm Field */}
          {isSuperAdmin && (
            <Collapsible open={showPasswordSection} onOpenChange={setShowPasswordSection}>
              <Card className="border border-amber-200">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-amber-600" />
                        <CardTitle className="text-base text-amber-800">Reset Password</CardTitle>
                      </div>
                      {showPasswordSection ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription className="text-amber-700">
                      Click to set a new password for this counsellor
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4 p-4 bg-amber-50/50 rounded-lg">
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                          id="confirm_password"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError("");
                          }}
                          placeholder="Confirm new password"
                        />
                      </div>
                      {passwordError && (
                        <p className="text-sm text-destructive">{passwordError}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters
                      </p>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
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
