interface LoginResult {
  success: boolean;
  role: string;
}

export const login = (email: string, password: string): LoginResult => {
  if (email === "superadmin@example.com" && password === "superadmin") {
    return { success: true, role: "super-admin" };
  } else if (email === "admin@example.com" && password === "admin") {
    return { success: true, role: "admin" };
  } else if (email === "user@example.com" && password === "user") {
    return { success: true, role: "user" };
  }
  return { success: false, role: "" };
};

export const logout = () => {
  // Add any additional logout logic here if needed
};