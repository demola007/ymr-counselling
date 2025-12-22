import { Home, Upload, Users, UserCheck, FileText, Bell, Activity, Settings, LogOut, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DEV_MODE } from "@/config/devCredentials";

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { userRole, logout } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isAdmin = userRole === "admin" || userRole === "super-admin";
  const isSuperAdmin = userRole === "super-admin";

  const mainItems = [
    { title: "Dashboard", url: "/upload", icon: Home },
    { title: "My Profile", url: "/profile", icon: UserCircle },
  ];

  const portalItems = isAdmin ? [
    { title: "Converts Portal", url: "/data", icon: FileText },
    { title: "Counsellors Portal", url: "/counsellors", icon: Users },
    { title: "Counsellee Portal", url: "/counsellee", icon: UserCheck },
  ] : [];

  // System items - Notifications is enabled for super-admins only
  const systemItems = [
    { title: "Activity Logs", url: "/logs", icon: Activity, enabled: false },
    { title: "Notifications", url: "/notifications", icon: Bell, enabled: isSuperAdmin },
    { title: "Settings", url: "/settings", icon: Settings, enabled: false },
  ];

  return (
    <Sidebar
      className={`border-r border-border/40 bg-card backdrop-blur-xl ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <SidebarContent>
        {/* Logo Section */}
        <div className={`flex items-center gap-3 p-6 border-b border-border/40 ${isCollapsed ? "justify-center" : ""}`}>
          <img 
            src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
            alt="YMR Logo" 
            className="h-10 w-10 object-contain"
          />
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-army-gold">THE NEW ARMY</h1>
              <p className="text-xs text-muted-foreground">YMR Global</p>
            </div>
          )}
        </div>

        {DEV_MODE && !isCollapsed && (
          <div className="mx-4 mt-4 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-600 font-semibold">🔧 Dev Mode</p>
            <p className="text-xs text-yellow-700">Role: {userRole}</p>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="group">
                      <item.icon className={`h-5 w-5 transition-colors ${isActive(item.url) ? "text-army-gold" : "text-muted-foreground group-hover:text-foreground"}`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Portals - Only for Admins */}
        {isAdmin && portalItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>Portals</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {portalItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url} className="group">
                        <item.icon className={`h-5 w-5 transition-colors ${isActive(item.url) ? "text-army-gold" : "text-muted-foreground group-hover:text-foreground"}`} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.enabled ? (
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link to={item.url} className="group">
                        <item.icon className={`h-5 w-5 transition-colors ${isActive(item.url) ? "text-army-gold" : "text-muted-foreground group-hover:text-foreground"}`} />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton disabled className="opacity-50 cursor-not-allowed">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      {!isCollapsed && (
                        <span className="flex items-center justify-between w-full">
                          {item.title}
                          <span className="text-xs text-muted-foreground">Soon</span>
                        </span>
                      )}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={logout}
              className={`w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 ${isCollapsed ? "px-2" : ""}`}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
