import { FileText, Users, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const StatsCards = () => {
  const stats = [
    {
      title: "Total Converts",
      value: "0",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Counsellors",
      value: "0",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Counsellees",
      value: "0",
      icon: UserCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden bg-card/40 backdrop-blur-sm border-border/40 hover:border-border/60 transition-all duration-300 hover:shadow-lg group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.bgColor} opacity-50`} />
        </Card>
      ))}
    </div>
  );
};
