import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Calendar,
  GraduationCap,
  Edit2, 
  Trash2,
  ChevronRight
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CounsellorCardProps {
  counsellor: any;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (e: React.MouseEvent, document: any) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
  onClick: (id: number) => void;
}

export const CounsellorCard = ({
  counsellor,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onClick,
}: CounsellorCardProps) => {
  return (
    <Card 
      className={`group relative bg-card/60 backdrop-blur-xl border transition-all duration-300 hover:shadow-[0_8px_30px_hsl(var(--army-green)/0.15)] cursor-pointer overflow-hidden ${
        isSelected 
          ? 'border-army-green shadow-[0_0_20px_hsl(var(--army-green)/0.2)]' 
          : 'border-border/40 hover:border-army-green/50'
      }`}
      onClick={() => onClick(counsellor.id)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-army-green via-army-gold to-army-green opacity-60" />
      
      <CardContent className="p-4 md:p-5">
        <div className="flex items-start gap-3 md:gap-4">
          {/* Checkbox */}
          <div 
            className="pt-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(counsellor.id);
            }}
          >
            <Checkbox 
              checked={isSelected}
              className="border-army-green/50 data-[state=checked]:bg-army-green data-[state=checked]:border-army-green"
            />
          </div>

          {/* Avatar/Picture */}
          <div className="relative flex-shrink-0">
            {counsellor.picture_url ? (
              <img 
                src={counsellor.picture_url} 
                alt={counsellor.name}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-army-green/30"
              />
            ) : (
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-army-green/20 to-army-gold/20 flex items-center justify-center border-2 border-army-green/30">
                <User className="w-6 h-6 md:w-8 md:h-8 text-army-green" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-base md:text-lg truncate group-hover:text-army-green transition-colors">
                  {counsellor.name || "Unknown"}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground text-xs md:text-sm mt-0.5">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{counsellor.email || "No email"}</span>
                </div>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {counsellor.has_certification && (
                  <Badge className="bg-army-gold/20 text-army-gold border-army-gold/30 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Certified
                  </Badge>
                )}
                {counsellor.will_attend_ymr_2024 && (
                  <Badge className="bg-army-green/20 text-army-green border-army-green/30 text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    YMR 2024
                  </Badge>
                )}
                {counsellor.is_available_for_training && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Training
                  </Badge>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2 text-xs md:text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="w-3 h-3 flex-shrink-0 text-army-green/70" />
                <span className="truncate">{counsellor.phone_number || "No phone"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-3 h-3 flex-shrink-0 text-army-green/70" />
                <span className="truncate">{counsellor.state || counsellor.country || "No location"}</span>
              </div>
            </div>

            {/* Experience & Denomination */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {counsellor.years_of_experience && (
                <span className="px-2 py-0.5 bg-background/50 rounded-full">
                  {counsellor.years_of_experience} years exp.
                </span>
              )}
              {counsellor.denomination && (
                <span className="px-2 py-0.5 bg-background/50 rounded-full truncate max-w-[150px]">
                  {counsellor.denomination}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-army-green hover:bg-army-green/10"
              onClick={(e) => onEdit(e, counsellor)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => onDelete(e, counsellor.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Arrow indicator */}
          <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-army-green group-hover:translate-x-1 transition-all hidden md:block" />
        </div>
      </CardContent>
    </Card>
  );
};
