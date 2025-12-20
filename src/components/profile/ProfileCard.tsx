import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Award, 
  Church,
  Edit,
  Shield
} from "lucide-react";
import { CounsellorProfile } from "@/hooks/useProfile";

interface ProfileCardProps {
  profile: CounsellorProfile;
  onEdit: () => void;
}

export const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  return (
    <Card className="bg-gradient-to-br from-[#1A1F2C]/95 to-[#2D1B4E]/95 border border-white/10 backdrop-blur-xl overflow-hidden">
      {/* Header Background */}
      <div className="h-24 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6TTIwIDIwaDIwdjIwSDIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      </div>

      <CardContent className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 mb-6">
          <Avatar className="h-24 w-24 border-4 border-[#1A1F2C] shadow-xl">
            <AvatarImage src={profile.picture_url} alt={profile.name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              {profile.role && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.role}
                </Badge>
              )}
              {profile.has_certification && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Award className="w-3 h-3 mr-1" />
                  Certified
                </Badge>
              )}
              {profile.will_attend_ymr && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Attending YMR
                </Badge>
              )}
              {profile.is_available_for_training && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  Available for Training
                </Badge>
              )}
            </div>
          </div>
          <Button
            onClick={onEdit}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField icon={Mail} label="Email" value={profile.email} />
          <ProfileField icon={Phone} label="Phone" value={profile.phone_number} />
          <ProfileField icon={User} label="Gender" value={profile.gender} />
          <ProfileField icon={Calendar} label="Date of Birth" value={profile.date_of_birth} />
          <ProfileField icon={MapPin} label="Country" value={profile.country} />
          <ProfileField icon={MapPin} label="State" value={profile.state} />
          <ProfileField icon={MapPin} label="Address" value={profile.address} className="md:col-span-2" />
          <ProfileField icon={Briefcase} label="Years of Experience" value={`${profile.years_of_experience || 0} years`} />
          <ProfileField icon={Church} label="Denomination" value={profile.denomination} />
        </div>
      </CardContent>
    </Card>
  );
};

interface ProfileFieldProps {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
  className?: string;
}

const ProfileField = ({ icon: Icon, label, value, className = "" }: ProfileFieldProps) => (
  <div className={`flex items-start gap-3 p-3 bg-white/5 rounded-lg ${className}`}>
    <div className="p-2 rounded-lg bg-purple-500/20">
      <Icon className="h-4 w-4 text-purple-400" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-white font-medium">{value || "Not specified"}</p>
    </div>
  </div>
);
