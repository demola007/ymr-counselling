import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, UserCheck, GraduationCap } from "lucide-react";

interface CounselleeStatsProps {
  totalRecords: number;
  currentPageCount: number;
  attendedCount?: number;
  studentCount?: number;
}

export const CounselleeStats = ({
  totalRecords,
  currentPageCount,
  attendedCount = 0,
  studentCount = 0,
}: CounselleeStatsProps) => {
  const stats = [
    {
      label: "Total Counsellees",
      value: totalRecords,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/20",
      textColor: "text-purple-400",
    },
    {
      label: "Current Page",
      value: currentPageCount,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/20",
      textColor: "text-blue-400",
    },
    {
      label: "Attended To",
      value: attendedCount,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500/20",
      textColor: "text-green-400",
    },
    {
      label: "Students",
      value: studentCount,
      icon: GraduationCap,
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/20",
      textColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-gradient-to-br from-[#1A1F2C]/95 to-[#2D1B4E]/95 border border-white/10 backdrop-blur-xl overflow-hidden"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
