import { useEffect, useState } from "react";
import { EVENT_END, EVENT_START } from "@/config/editions";
import { cn } from "@/lib/utils";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

export function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const phase = now < EVENT_START.getTime() ? "before" : now <= EVENT_END.getTime() ? "live" : "after";
  return { phase, ...parts(EVENT_START.getTime() - now), dayOfEvent: Math.floor((now - EVENT_START.getTime()) / 86400_000) + 1 } as const;
}

export function Countdown({ className, size = "lg" }: { className?: string; size?: "sm" | "lg" }) {
  const c = useCountdown();
  if (c.phase === "live")
    return (
      <div className={cn("inline-flex items-center gap-3 rounded-full border border-ember/40 bg-ember/10 px-5 py-2.5", className)}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
        </span>
        <span className="font-semibold">Live now — Day {c.dayOfEvent} of 5</span>
      </div>
    );
  if (c.phase === "after") return null;
  const units = [
    ["Days", c.days],
    ["Hours", c.hours],
    ["Minutes", c.minutes],
    ["Seconds", c.seconds],
  ] as const;
  return (
    <div className={cn("flex items-stretch gap-2 sm:gap-3", className)} role="timer" aria-label={`${c.days} days ${c.hours} hours until YMR 2026`}>
      {units.map(([label, v], i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "glass flex flex-col items-center rounded-2xl",
              size === "lg" ? "min-w-[64px] px-3 py-3 sm:min-w-[88px] sm:px-4 sm:py-4" : "min-w-[52px] px-2 py-2",
            )}
          >
            <span className={cn("tabular font-display font-bold leading-none text-metal", size === "lg" ? "text-3xl sm:text-5xl" : "text-xl")}>
              {String(v).padStart(2, "0")}
            </span>
            <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-fg/60 sm:text-[10px]">{label}</span>
          </div>
          {i < units.length - 1 && <span className="hidden font-display text-2xl text-brand/50 sm:block">:</span>}
        </div>
      ))}
    </div>
  );
}
