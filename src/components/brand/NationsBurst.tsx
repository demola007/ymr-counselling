import { cn } from "@/lib/utils";

/**
 * The flyer's radiating flags of the nations, abstracted into slowly turning
 * conic rays with a molten gold core. Purely decorative.
 */
export function NationsBurst({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="nations-rays absolute left-1/2 top-1/2 aspect-square w-[220vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow blur-[2px]"
        style={{ opacity: `calc(var(--rays-opacity) * ${intensity})`, maskImage: "radial-gradient(closest-side, transparent 8%, #000 24%, rgba(0,0,0,.55) 55%, transparent 78%)" }}
      />
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[90vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(255,214,120,.55), rgba(246,139,30,.28) 35%, rgba(226,103,0,.08) 60%, transparent 75%)", opacity: intensity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,hsl(var(--canvas))_80%)]" />
    </div>
  );
}
