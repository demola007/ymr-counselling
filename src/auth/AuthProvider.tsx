import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type Session } from "@/data/api";
import type { StaffMember } from "@/types";
import { can, type Permission } from "./permissions";

const KEY = "ymr-session";

interface AuthValue {
  user: StaffMember | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<StaffMember>;
  logout: () => void;
  can: (p: Permission) => boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    return s.expiresAt > Date.now() ? s : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffMember | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = readSession();
    if (!s) {
      setReady(true);
      return;
    }
    // Re-read the user so role changes made by a super admin apply on reload
    api.auth.me(s.user.id).then((u) => {
      setUser(u && u.status === "active" ? u : null);
      setReady(true);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const s = await api.auth.login(email, password);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* private mode — session lasts for this tab only */
    }
    setUser(s.user);
    return s.user;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!user) return;
    const u = await api.auth.me(user.id);
    if (u) setUser(u);
  }, [user]);

  const value = useMemo<AuthValue>(
    () => ({ user, ready, login, logout, refresh, can: (p) => can(user?.role, p) }),
    [user, ready, login, logout, refresh],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
