import {
  Activity,
  BarChart3,
  CalendarRange,
  Download,
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { Permission } from "@/auth/permissions";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Activity;
  perm?: Permission;
  group: "Work" | "Insight" | "Admin";
  end?: boolean;
}

export const NAV: NavItem[] = [
  { to: "/portal", label: "Overview", icon: LayoutDashboard, group: "Work", end: true },
  { to: "/portal/capture", label: "AI Capture", icon: ScanLine, perm: "capture:use", group: "Work" },
  { to: "/portal/converts", label: "Converts", icon: Sparkles, perm: "converts:read", group: "Work" },
  { to: "/portal/counsellees", label: "Counsellees", icon: HeartHandshake, perm: "counsellees:read", group: "Work" },
  { to: "/portal/team", label: "Counselling team", icon: UsersRound, perm: "team:read", group: "Work" },
  { to: "/portal/analytics", label: "Analytics", icon: BarChart3, perm: "analytics:read", group: "Insight" },
  { to: "/portal/notifications", label: "Notifications", icon: Megaphone, perm: "notifications:history", group: "Insight" },
  { to: "/portal/exports", label: "Exports", icon: Download, perm: "exports:use", group: "Insight" },
  { to: "/portal/activity", label: "Activity log", icon: Activity, perm: "analytics:read", group: "Insight" },
  { to: "/portal/access", label: "Access & roles", icon: ShieldCheck, perm: "access:manage", group: "Admin" },
  { to: "/portal/editions", label: "Editions", icon: CalendarRange, perm: "editions:manage", group: "Admin" },
];
