import { cn } from "@/lib/utils";
import { FlameMark } from "./Logo";

export function FlameLoader({ fullscreen, label = "Loading", className }: { fullscreen?: boolean; label?: string; className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-4", fullscreen && "fixed inset-0 z-50 bg-background", className)}
    >
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-ember/30 animate-pulse-ring" />
        <FlameMark className="relative h-10 w-10 animate-float" />
      </span>
      <span className="eyebrow text-muted-foreground">{label}</span>
    </div>
  );
}
