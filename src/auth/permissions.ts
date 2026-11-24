import type { Role } from "@/types";

/**
 * What each role may do. The portal hides what a role can't use and the API
 * must enforce the same matrix server-side.
 *
 *  user        — read converts, capture/upload convert forms
 *  admin       — read & write all records, analytics, notification history, exports
 *  super-admin — everything, including sending notifications and managing access
 */
export type Permission =
  | "converts:read"
  | "converts:write"
  | "capture:use"
  | "counsellees:read"
  | "counsellees:write"
  | "team:read"
  | "team:write"
  | "analytics:read"
  | "notifications:history"
  | "notifications:send"
  | "templates:write"
  | "exports:use"
  | "access:manage"
  | "editions:manage"
  | "records:delete";

const USER: Permission[] = ["converts:read", "capture:use"];
const ADMIN: Permission[] = [
  ...USER,
  "converts:write",
  "counsellees:read",
  "counsellees:write",
  "team:read",
  "team:write",
  "analytics:read",
  "notifications:history",
  "exports:use",
  "records:delete",
];
const SUPER: Permission[] = [...ADMIN, "notifications:send", "templates:write", "access:manage", "editions:manage"];

export const ROLE_PERMISSIONS: Record<Role, Set<Permission>> = {
  user: new Set(USER),
  admin: new Set(ADMIN),
  "super-admin": new Set(SUPER),
};

export const can = (role: Role | null | undefined, p: Permission) => !!role && ROLE_PERMISSIONS[role].has(p);

export const ROLE_LABEL: Record<Role, string> = { user: "Counsellor", admin: "Admin", "super-admin": "Super admin" };

export const PERMISSION_MATRIX: { label: string; perm: Permission }[] = [
  { label: "View converts", perm: "converts:read" },
  { label: "Capture forms with AI", perm: "capture:use" },
  { label: "Edit converts & counsellees", perm: "converts:write" },
  { label: "View counsellees", perm: "counsellees:read" },
  { label: "Manage counselling team", perm: "team:write" },
  { label: "Analytics", perm: "analytics:read" },
  { label: "Notification history", perm: "notifications:history" },
  { label: "Export data", perm: "exports:use" },
  { label: "Delete records", perm: "records:delete" },
  { label: "Send notifications", perm: "notifications:send" },
  { label: "Edit message templates", perm: "templates:write" },
  { label: "Manage staff access & roles", perm: "access:manage" },
  { label: "Manage editions", perm: "editions:manage" },
];
