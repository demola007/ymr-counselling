import { FileText, Users, UserCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/apiClient";

interface StatsCountsResponse {
  converts: number;
  counsellees: number;
  counsellors: number;
  total: number;
}

export const StatsCards = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin" || userRole === "super-admin";

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats-counts"],
    queryFn: async (): Promise<StatsCountsResponse> => {
      const response = await apiClient.get("stats/counts");
      return response.data;
    },
  });

  const allStats = [
    {
      title: "Total Converts",
      value: isLoading ? "..." : (stats?.converts ?? 0).toLocaleString(),
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      adminOnly: false,
    },
    {
      title: "Counsellors",
      value: isLoading ? "..." : (stats?.counsellors ?? 0).toLocaleString(),
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      adminOnly: true,
    },
    {
      title: "Counsellees",
      value: isLoading ? "..." : (stats?.counsellees ?? 0).toLocaleString(),
      icon: UserCheck,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      adminOnly: false,
    },
  ];

  const displayStats = allStats.filter(stat => !stat.adminOnly || isAdmin);

  return (
    <div className={`grid grid-cols-1 ${displayStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-6`}>
      {displayStats.map((stat, index) => (
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
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <stat.icon className="h-6 w-6" />
                )}
              </div>
            </div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.bgColor} opacity-50`} />
        </Card>
      ))}
    </div>
  );
};
