import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Edit, 
  Trash2,
  UserCheck,
  Calendar
} from "lucide-react";

interface CounselleeCardProps {
  counsellee: any;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (e: React.MouseEvent, document: any) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
  onClick: (id: number) => void;
}

export const CounselleeCard = ({
  counsellee,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onClick,
}: CounselleeCardProps) => {
  return (
    <Card 
      className="group bg-gradient-to-br from-[#1A1F2C]/95 to-[#2D1B4E]/95 border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer backdrop-blur-xl hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
      onClick={() => onClick(counsellee.id)}
    >
      <CardContent className="p-4">
        {/* Header with checkbox and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(counsellee.id)}
              onClick={(e) => e.stopPropagation()}
              className="border-white/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
              {counsellee.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
              onClick={(e) => onEdit(e, counsellee)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
              onClick={(e) => onDelete(e, counsellee.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Name and badges */}
        <div className="mb-3">
          <h3 className="text-white font-semibold text-base truncate mb-2">
            {counsellee.name || "Unknown"}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {counsellee.gender && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                {counsellee.gender}
              </Badge>
            )}
            {counsellee.age_group && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {counsellee.age_group}
              </Badge>
            )}
            {counsellee.attended_to && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                <UserCheck className="w-3 h-3 mr-1" />
                Attended
              </Badge>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-sm">
          {counsellee.email && (
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
              <span className="truncate">{counsellee.email}</span>
            </div>
          )}
          {counsellee.phone_number && (
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
              <span className="truncate">{counsellee.phone_number}</span>
            </div>
          )}
          {(counsellee.state || counsellee.country) && (
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
              <span className="truncate">
                {[counsellee.state, counsellee.country].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Additional info */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-sm">
          {counsellee.school && (
            <div className="flex items-center gap-2 text-gray-400">
              <GraduationCap className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
              <span className="truncate">{counsellee.school}</span>
            </div>
          )}
          {counsellee.occupation && (
            <div className="flex items-center gap-2 text-gray-400">
              <Briefcase className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              <span className="truncate">{counsellee.occupation}</span>
            </div>
          )}
          {counsellee.counsellor_name && (
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
              <span className="truncate">Counsellor: {counsellee.counsellor_name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
