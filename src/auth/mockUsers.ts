/**
 * Demo accounts for the mock backend only (VITE_API_MODE=mock).
 * They map to seeded staff records in data/mock/seed.ts. Not real credentials.
 */
export const MOCK_PASSWORD = "CityTakers2026!";

export const DEMO_ACCOUNTS = [
  { email: "superadmin@ymr.test", role: "super-admin", label: "Super admin" },
  { email: "admin@ymr.test", role: "admin", label: "Admin" },
  { email: "counsellor@ymr.test", role: "user", label: "Counsellor (user)" },
] as const;
