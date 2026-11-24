import { useMemo } from "react";
import { createRng } from "@/lib/rng";
import { cn } from "@/lib/utils";

/**
 * A procedurally drawn night-city skyline with lit windows — the "city" in
 * City Takers. Deterministic, so it renders the same every time.
 */
export function Skyline({ className, seed = 26 }: { className?: string; seed?: number }) {
  const { buildings, windows } = useMemo(() => {
    const r = createRng(seed);
    const W = 1600;
    const buildings: { x: number; w: number; h: number; spire: boolean }[] = [];
    let x = -20;
    while (x < W) {
      const w = r.int(38, 110);
      const tall = r.chance(0.18);
      const h = tall ? r.int(220, 330) : r.int(70, 200);
      buildings.push({ x, w, h, spire: tall && r.chance(0.6) });
      x += w + r.int(-6, 4);
    }
    const windows: { x: number; y: number; d: number; warm: boolean }[] = [];
    for (const b of buildings) {
      for (let wy = 400 - b.h + 14; wy < 392; wy += 14) {
        for (let wx = b.x + 8; wx < b.x + b.w - 8; wx += 11) {
          if (r.chance(0.16)) windows.push({ x: wx, y: wy, d: r.next() * 6, warm: r.chance(0.8) });
        }
      }
    }
    return { buildings, windows };
  }, [seed]);

  return (
    <svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice" className={cn("w-full", className)} aria-hidden>
      <defs>
        <linearGradient id="sky-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--sky-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--sky-bottom)" }} />
        </linearGradient>
        <linearGradient id="sky-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbaa1a" stopOpacity=".55" />
          <stop offset=".08" stopColor="#fbaa1a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={400 - b.h} width={b.w} height={b.h} fill="url(#sky-b)" />
          <rect x={b.x} y={400 - b.h} width={b.w} height={b.h} fill="url(#sky-edge)" />
          {b.spire && <rect x={b.x + b.w / 2 - 1.5} y={400 - b.h - 40} width={3} height={40} style={{ fill: "var(--sky-top)" }} />}
          {b.spire && <circle cx={b.x + b.w / 2} cy={400 - b.h - 42} r={2.5} fill="#ff5a3c" className="animate-pulse" />}
        </g>
      ))}
      {windows.map((w, i) => (
        <rect
          key={i}
          x={w.x}
          y={w.y}
          width={4}
          height={6}
          rx={0.8}
          style={{ fill: w.warm ? "var(--sky-window)" : "var(--sky-window-cool)", animation: `pulse ${5 + w.d}s ease-in-out ${w.d}s infinite` }}
          opacity={0.75}
        />
      ))}
    </svg>
  );
}
