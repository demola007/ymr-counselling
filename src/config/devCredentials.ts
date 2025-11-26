// ⚠️ DEVELOPMENT ONLY - Remove before production deployment
// Set to false to disable development credentials
export const DEV_MODE = true;

export const DEV_CREDENTIALS = {
  user: {
    email: "user@dev.local",
    password: "user123",
    role: "user",
    token: "dev_token_user_12345"
  },
  admin: {
    email: "admin@dev.local",
    password: "admin123",
    role: "admin",
    token: "dev_token_admin_12345"
  },
  superadmin: {
    email: "superadmin@dev.local",
    password: "superadmin123",
    role: "super-admin",
    token: "dev_token_superadmin_12345"
  }
};

export const checkDevCredentials = (email: string, password: string) => {
  if (!DEV_MODE) return null;
  
  const credentials = Object.values(DEV_CREDENTIALS).find(
    cred => cred.email === email && cred.password === password
  );
  
  return credentials || null;
};
