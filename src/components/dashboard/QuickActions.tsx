import { FileText, Users, UserCheck, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const QuickActions = () => {
  const { userRole } = useAuth();
  
  const isAdminOrSuperAdmin = userRole === "admin" || userRole === "super-admin";

  const actions = [
    {
      title: "New Convert",
      description: "Add convert manually",
      icon: FileText,
      href: "/new-convert-manual",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      showForAll: true,
    },
    {
      title: "Add Counsellor",
      description: "Register new counsellor",
      icon: Users,
      href: "/counselor-registration",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      showForAll: false, // Only for admin/super-admin
    },
    {
      title: "Add Counsellee",
      description: "Register new counsellee",
      icon: UserCheck,
      href: "/add-counsellee",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      showForAll: true,
    },
  ];

  const visibleActions = actions.filter(
    (action) => action.showForAll || isAdminOrSuperAdmin
  );

  return (
    <Card className="bg-card/40 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-army-gold" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${visibleActions.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          {visibleActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-start gap-3 hover:border-army-gold/50 hover:bg-card/50 transition-all group"
              >
                <div className={`${action.bgColor} ${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
