import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full border border-fg/10 text-fg/75 transition hover:border-brand/50 hover:text-fg", className)}
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
