import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CounsellorProfile } from "@/hooks/useProfile";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: CounsellorProfile | null;
  onSubmit: (profile: Partial<CounsellorProfile>) => void;
  isLoading: boolean;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  onSubmit,
  isLoading,
}: EditProfileDialogProps) => {
  const [formData, setFormData] = useState<Partial<CounsellorProfile>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (field: keyof CounsellorProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Email - Read only */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                value={formData.email || ""}
                disabled
                className="bg-white/5 border-white/10 text-gray-400"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number || ""}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-300">Gender</Label>
              <Select
                value={formData.gender || ""}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-white/10">
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-300">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-gray-300">Country</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => handleChange("country", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-300">State</Label>
              <Input
                id="state"
                value={formData.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-gray-300">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-300">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={formData.years_of_experience || 0}
                onChange={(e) => handleChange("years_of_experience", parseInt(e.target.value))}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            {/* Denomination */}
            <div className="space-y-2">
              <Label htmlFor="denomination" className="text-gray-300">Denomination</Label>
              <Input
                id="denomination"
                value={formData.denomination || ""}
                onChange={(e) => handleChange("denomination", e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          {/* Toggle Fields */}
          <div className="space-y-4 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Has Certification</Label>
                <p className="text-xs text-gray-400">You have counselling certification</p>
              </div>
              <Switch
                checked={formData.has_certification || false}
                onCheckedChange={(checked) => handleChange("has_certification", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Will Attend YMR</Label>
                <p className="text-xs text-gray-400">You will be attending YMR</p>
              </div>
              <Switch
                checked={formData.will_attend_ymr || false}
                onCheckedChange={(checked) => handleChange("will_attend_ymr", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Available for Training</Label>
                <p className="text-xs text-gray-400">You are available for counsellor training</p>
              </div>
              <Switch
                checked={formData.is_available_for_training || false}
                onCheckedChange={(checked) => handleChange("is_available_for_training", checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
