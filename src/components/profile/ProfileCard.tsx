import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Shield,
  CheckCircle2
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
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="bg-card border-border overflow-hidden">
        <div className="relative">
          {/* Subtle gradient header */}
          <div className="h-32 bg-gradient-to-r from-secondary via-primary/20 to-secondary relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
          </div>
          
          {/* Profile info */}
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
              {/* Avatar */}
              <Avatar className="h-28 w-28 border-4 border-card shadow-lg ring-2 ring-primary/30">
                <AvatarImage src={profile.picture_url} alt={profile.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-army-green-dark text-primary-foreground text-2xl font-bold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              
              {/* Name and badges */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.email}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {profile.role && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 gap-1">
                      <Shield className="w-3 h-3" />
                      {profile.role}
                    </Badge>
                  )}
                  {profile.has_certification && (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30 gap-1">
                      <Award className="w-3 h-3" />
                      Certified
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Edit button */}
              <Button
                onClick={onEdit}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              Contact Information
            </h3>
            <div className="space-y-4">
              <ProfileField icon={Mail} label="Email" value={profile.email} />
              <Separator className="bg-border/50" />
              <ProfileField icon={Phone} label="Phone" value={profile.phone_number} />
            </div>
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              Personal Details
            </h3>
            <div className="space-y-4">
              <ProfileField icon={User} label="Gender" value={profile.gender} />
              <Separator className="bg-border/50" />
              <ProfileField icon={Calendar} label="Date of Birth" value={profile.date_of_birth} />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              Location
            </h3>
            <div className="space-y-4">
              <ProfileField icon={MapPin} label="Country" value={profile.country} />
              <Separator className="bg-border/50" />
              <ProfileField icon={MapPin} label="State" value={profile.state} />
              <Separator className="bg-border/50" />
              <ProfileField icon={MapPin} label="Address" value={profile.address} />
            </div>
          </CardContent>
        </Card>

        {/* Ministry Details */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Church className="h-4 w-4 text-primary" />
              </div>
              Ministry Details
            </h3>
            <div className="space-y-4">
              <ProfileField icon={Briefcase} label="Experience" value={`${profile.years_of_experience || 0} years`} />
              <Separator className="bg-border/50" />
              <ProfileField icon={Church} label="Denomination" value={profile.denomination} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Badges */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Status & Availability</h3>
          <div className="flex flex-wrap gap-3">
            <StatusBadge 
              active={profile.will_attend_ymr} 
              label="Attending YMR" 
            />
            <StatusBadge 
              active={profile.is_available_for_training} 
              label="Available for Training" 
            />
            <StatusBadge 
              active={profile.has_certification} 
              label="Certified Counsellor" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ProfileFieldProps {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
}

const ProfileField = ({ icon: Icon, label, value }: ProfileFieldProps) => (
  <div className="flex items-center gap-3">
    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground font-medium truncate">{value || "Not specified"}</p>
    </div>
  </div>
);

interface StatusBadgeProps {
  active: boolean;
  label: string;
}

const StatusBadge = ({ active, label }: StatusBadgeProps) => (
  <div className={`
    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
    ${active 
      ? "bg-primary/10 text-primary border border-primary/30" 
      : "bg-muted text-muted-foreground border border-border"
    }
  `}>
    <CheckCircle2 className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
    {label}
  </div>
);
