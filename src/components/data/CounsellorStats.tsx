import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Calendar, GraduationCap } from "lucide-react";

interface CounsellorStatsProps {
  total: number;
  currentCount: number;
  certified?: number;
  availableForYmr?: number;
}

export const CounsellorStats = ({ 
  total, 
  currentCount,
  certified = 0,
  availableForYmr = 0
}: CounsellorStatsProps) => {
  const stats = [
    {
      label: "Total Counsellors",
      value: total,
      icon: Users,
      color: "army-green",
      bgColor: "bg-army-green/10",
      textColor: "text-army-green",
      borderColor: "border-army-green/30"
    },
    {
      label: "Current Page",
      value: currentCount,
      icon: GraduationCap,
      color: "army-gold",
      bgColor: "bg-army-gold/10",
      textColor: "text-army-gold",
      borderColor: "border-army-gold/30"
    },
    {
      label: "Certified",
      value: certified,
      icon: Award,
      color: "purple",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/30"
    },
    {
      label: "Available @ YMR",
      value: availableForYmr,
      icon: Calendar,
      color: "cyan",
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-400",
      borderColor: "border-cyan-500/30"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className={`relative overflow-hidden bg-card/60 backdrop-blur-xl border ${stat.borderColor} hover:shadow-lg transition-all duration-300`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 ${stat.textColor}`} />
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className={`p-2 md:p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.textColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
