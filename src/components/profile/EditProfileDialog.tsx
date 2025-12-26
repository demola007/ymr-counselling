import { useState, useEffect, useRef } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, X } from "lucide-react";
import { CounsellorProfile } from "@/hooks/useProfile";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: CounsellorProfile | null;
  onSubmit: (profile: Partial<CounsellorProfile> | FormData) => void;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && open) {
      setFormData(profile);
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [profile, open]);

  const handleChange = (field: keyof CounsellorProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build FormData for the update
    const submitData = new FormData();
    
    // Add all changed fields
    const fieldsToSubmit: (keyof CounsellorProfile)[] = [
      'name', 'phone_number', 'gender', 'date_of_birth', 'country', 
      'state', 'address', 'years_of_experience', 'denomination',
      'has_certification', 'will_attend_ymr', 'is_available_for_training'
    ];
    
    fieldsToSubmit.forEach(field => {
      const value = formData[field];
      if (value !== undefined && value !== null) {
        submitData.append(field, String(value));
      }
    });
    
    // Add profile image if selected
    if (selectedImage) {
      submitData.append('profile_image', selectedImage);
    }
    
    onSubmit(submitData);
  };

  const getInitials = (name?: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const currentImage = imagePreview || formData.profile_image || formData.profile_image_url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2C] border border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-white/20">
                <AvatarImage
                  src={currentImage}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-xl">
                  {getInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              
              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
              
              {/* Remove image button */}
              {(selectedImage || currentImage) && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Camera className="h-4 w-4 mr-2" />
              {currentImage ? "Change Photo" : "Upload Photo"}
            </Button>
          </div>

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