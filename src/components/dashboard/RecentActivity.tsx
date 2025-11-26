import { Activity, Upload, UserPlus, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const RecentActivity = () => {
  // Placeholder data - will be replaced with real data later
  const activities = [
    {
      id: 1,
      type: "upload",
      message: "No recent activity",
      timestamp: "Just now",
      icon: Activity,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "upload":
        return Upload;
      case "user":
        return UserPlus;
      case "convert":
        return FileCheck;
      default:
        return Activity;
    }
  };

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-army-gold" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0 last:pb-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`${activity.bgColor} ${activity.color} p-2 rounded-lg mt-1`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
