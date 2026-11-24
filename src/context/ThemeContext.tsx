import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
const Ctx = createContext<{ theme: Theme; toggle: () => void; setTheme: (t: Theme) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("ymr-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 450);
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);
  return <Ctx.Provider value={{ theme, toggle, setTheme }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
