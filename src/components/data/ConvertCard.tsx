import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2, Mail, Phone, MapPin, User, Calendar, Building } from "lucide-react";
import { Convert } from "@/types/convert";

interface ConvertCardProps {
  convert: Convert;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  showActions: boolean;
}

export const ConvertCard = ({
  convert,
  isSelected,
  onSelect,
  onClick,
  onEdit,
  onDelete,
  showActions,
}: ConvertCardProps) => {
  return (
    <Card 
      className="group relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/40 hover:border-army-gold/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-army-gold/5 via-transparent to-army-olive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative p-6 space-y-4">
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {showActions && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground truncate flex items-center gap-2">
                <User className="h-4 w-4 text-army-gold flex-shrink-0" />
                {convert.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {convert.gender}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {convert.age_group}
                </Badge>
                {convert.is_student && (
                  <Badge className="text-xs bg-army-olive/20 text-army-olive border-army-olive/30">
                    Student
                  </Badge>
                )}
                {convert.online && (
                  <Badge className="text-xs bg-blue-500/20 text-blue-700 border-blue-500/30">
                    Online
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0 hover:bg-army-gold/20 hover:text-army-gold"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-army-gold flex-shrink-0" />
            <span className="truncate">{convert.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-army-gold flex-shrink-0" />
            <span>{convert.phone_number}</span>
          </div>
        </div>

        {/* Location & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-army-olive flex-shrink-0" />
            <span className="truncate">{convert.state}, {convert.country}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4 text-army-olive flex-shrink-0" />
            <span className="truncate">{convert.denomination}</span>
          </div>
        </div>

        {/* Additional Info */}
        {(convert.occupation || convert.school) && (
          <div className="text-sm text-muted-foreground pt-2 border-t border-border/40">
            <span className="font-medium">Occupation:</span>{" "}
            {convert.occupation || convert.school || "N/A"}
          </div>
        )}

        {/* Follow-up indicator */}
        {convert.availability_for_follow_up && (
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full w-fit">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Available for follow-up
          </div>
        )}
      </CardContent>
    </Card>
  );
};
