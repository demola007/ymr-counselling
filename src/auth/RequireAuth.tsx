import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import type { Permission } from "./permissions";
import { FlameLoader } from "@/components/brand/FlameLoader";
import { Forbidden } from "@/components/portal/Forbidden";

export function RequireAuth({ children, permission }: { children: ReactNode; permission?: Permission }) {
  const { user, ready, can } = useAuth();
  const loc = useLocation();
  if (!ready) return <FlameLoader fullscreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search }} />;
  if (permission && !can(permission)) return <Forbidden />;
  return <>{children}</>;
}
