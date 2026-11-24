import { cn } from "@/lib/utils";

/**
 * YMR @ 10 anniversary mark. `tone="light"` is the white version for dark
 * backgrounds, `"dark"` the black one; `"auto"` (default) follows the theme.
 */
export function YmrTenLogo({ className, tone = "auto" }: { className?: string; tone?: "light" | "dark" | "auto" }) {
  if (tone === "auto")
    return (
      <>
        <YmrTenLogo tone="dark" className={cn("dark:hidden", className)} />
        <YmrTenLogo tone="light" className={cn("hidden dark:block", className)} />
      </>
    );
  return (
    <img
      src={tone === "light" ? "/brand/ymr-at-10-logo.webp" : "/brand/ymr-at-10-logo-light.webp"}
      alt="Young Ministers Retreat — 10 years anniversary"
      className={cn("h-auto select-none", className)}
      draggable={false}
    />
  );
}

/** The flame + "YMR Counselling" lockup used in navigation. */
export function BrandLockup({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <FlameMark className="h-8 w-8 shrink-0" />
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-bold tracking-[0.12em]">YMR</span>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">Counselling</span>
        </span>
      )}
    </span>
  );
}

/** Stylised flame drawn from the YMR mark — pure SVG so it scales and themes. */
export function FlameMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="fm-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd27a" />
          <stop offset="0.45" stopColor="#fbaa1a" />
          <stop offset="1" stopColor="#e26700" />
        </linearGradient>
      </defs>
      <path
        fill="url(#fm-g)"
        d="M17.5 3c.4 3.6 2.6 5.4 5 6.6 2.3 1.2 3.4 3.4 2.7 5.6-1.2-1.9-3-2.8-5.2-3.2-5-.9-8.6-3.7-9.6-8-2.4 4.4-3 9.6-.6 14.4 2 4 5.3 6.8 7.2 10.3 1 1.9 1.2 4 .6 6.3 4.3-.9 7.3-4.7 7-9.6-.1-1.7-.6-3.2-1.2-4.4 2-1.9 4.5-2.4 6.6-.8.9-1.9 1.2-4.2.3-6.4-1.3-3.2-4.7-5-8.2-5.3-2.2-.2-3.9-1.8-4.6-5.5Z"
      />
      <path fill="url(#fm-g)" opacity=".85" d="M12.4 25.8c-2.4 1.6-2.6 4.3-.8 6.3 1.4 1.5 2 3.3 1.6 5.3 2.2-1.9 3-4.4 2.4-6.9-.5-2-1.6-3.7-3.2-4.7Z" />
    </svg>
  );
}
