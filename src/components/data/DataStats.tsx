import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Globe, GraduationCap } from "lucide-react";

interface DataStatsProps {
  totalRecords: number;
  currentPageCount: number;
  onlineCount?: number;
  studentCount?: number;
}

export const DataStats = ({ 
  totalRecords, 
  currentPageCount,
  onlineCount = 0,
  studentCount = 0
}: DataStatsProps) => {
  const stats = [
    {
      label: "Total Converts",
      value: totalRecords,
      icon: Users,
      color: "text-army-gold",
      bgColor: "bg-army-gold/10",
    },
    {
      label: "Current Page",
      value: currentPageCount,
      icon: UserCheck,
      color: "text-army-olive",
      bgColor: "bg-army-olive/10",
    },
    {
      label: "Online Converts",
      value: onlineCount,
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Students",
      value: studentCount,
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden bg-card/60 backdrop-blur-xl border-border/40 hover:border-army-gold/30 transition-all duration-300 hover:shadow-lg group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-army-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
