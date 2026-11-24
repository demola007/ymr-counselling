/**
 * Chart primitives. Colours come from the validated categorical slots in
 * index.css (--series-*), defined separately for light and dark. Identity is
 * never carried by colour alone: every multi-series chart has a legend and
 * values are written in text tokens.
 */
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from "recharts";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { fmtNum, fmtPct } from "@/lib/format";

export const SERIES = {
  converts: "var(--series-2)",
  counsellees: "var(--series-1)",
  brand: "var(--series-brand)",
  muted: "var(--series-muted)",
};

export function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: i.color }} />
          {i.label}
          {i.value && <span className="tabular font-semibold text-foreground">{i.value}</span>}
        </li>
      ))}
    </ul>
  );
}

function TrendTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold">{format(parseISO(String(label)), "EEE d MMM yyyy")}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize text-muted-foreground">{p.dataKey}</span>
          <span className="tabular ml-auto font-semibold">{fmtNum(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}

/** Daily intake, two series on one axis. */
export function IntakeTrend({ data, height = 260, series = ["converts", "counsellees"] }: { data: { date: string; converts: number; counsellees: number }[]; height?: number; series?: ("converts" | "counsellees")[] }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s} id={`g-${s}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={SERIES[s]} stopOpacity={0.35} />
                <stop offset="1" stopColor={SERIES[s]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => format(parseISO(d), "d MMM")}
            tick={{ fontSize: 11, fill: "var(--chart-axis)" }}
            axisLine={{ stroke: "var(--chart-grid)" }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis tick={{ fontSize: 11, fill: "var(--chart-axis)" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<TrendTooltip />} cursor={{ stroke: "var(--chart-axis)", strokeDasharray: "3 3" }} />
          {series.map((s) => (
            <Area
              key={s}
              type="monotone"
              dataKey={s}
              stroke={SERIES[s]}
              strokeWidth={2}
              fill={`url(#g-${s})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--chart-surface)" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Ranked horizontal bars, one hue. Values are always printed. */
export function BarList({ data, color = SERIES.brand, total, max: maxRows = 10, format: f = fmtNum }: { data: { label: string; value: number }[]; color?: string; total?: number; max?: number; format?: (n: number) => string }) {
  const [hover, setHover] = useState<string | null>(null);
  const rows = data.slice(0, maxRows);
  const max = Math.max(1, ...rows.map((r) => r.value));
  const sum = total ?? data.reduce((s, r) => s + r.value, 0);
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="group" onMouseEnter={() => setHover(r.label)} onMouseLeave={() => setHover(null)}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate">{r.label}</span>
            <span className="tabular shrink-0 font-semibold">
              {f(r.value)}
              <span className={cn("ml-1.5 text-xs font-normal text-muted-foreground transition", hover === r.label ? "opacity-100" : "opacity-0 sm:opacity-60")}>{sum ? fmtPct(r.value / sum) : ""}</span>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(r.value / max) * 100}%`, background: color, opacity: hover && hover !== r.label ? 0.45 : 1 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Follow-up funnel: each stage as a share of everyone captured. */
export function Funnel({ data }: { data: { label: string; value: number }[] }) {
  const top = Math.max(1, data[0]?.value ?? 1);
  return (
    <ol className="space-y-3">
      {data.map((d, i) => {
        const pct = d.value / top;
        const prev = i > 0 ? data[i - 1]!.value : null;
        return (
          <li key={d.label}>
            <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
              <span className="font-medium">{d.label}</span>
              <span className="tabular">
                <span className="font-semibold">{fmtNum(d.value)}</span>
                <span className="ml-2 text-xs text-muted-foreground">{fmtPct(pct)}</span>
              </span>
            </div>
            <div className="relative h-9 overflow-hidden rounded-lg bg-muted">
              <div
                className="flex h-full items-center rounded-lg px-3 transition-all duration-700"
                style={{ width: `${Math.max(pct * 100, 2)}%`, background: `color-mix(in oklab, var(--series-brand) ${100 - i * 18}%, var(--chart-surface))` }}
              />
              {prev !== null && prev > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">{fmtPct(d.value / prev)} of previous</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** One stacked bar with 2px gaps, labelled segments. */
export function SplitBar({ data, colors }: { data: { label: string; value: number }[]; colors: string[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div>
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
        {data.map((d, i) => (
          <div key={d.label} style={{ width: `${(d.value / total) * 100}%`, background: colors[i] }} title={`${d.label}: ${fmtNum(d.value)}`} />
        ))}
      </div>
      <div className="mt-3">
        <Legend items={data.map((d, i) => ({ label: d.label, color: colors[i]!, value: fmtPct(d.value / total) }))} />
      </div>
    </div>
  );
}

/** Vertical column chart for ordered categories (age groups, editions). */
export function Columns({ data, highlight, height = 160, format: f = fmtNum }: { data: { label: string; value: number }[]; highlight?: string; height?: number; format?: (n: number) => string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => {
        const on = !highlight || d.label === highlight;
        return (
          <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5" title={`${d.label}: ${f(d.value)}`}>
            <span className={cn("tabular text-[11px] font-semibold", on ? "text-foreground" : "text-muted-foreground")}>{f(d.value)}</span>
            <div
              className="w-full max-w-[44px] rounded-t-md transition-all duration-700 group-hover:opacity-80"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value ? 3 : 0, background: on ? SERIES.brand : SERIES.muted }}
            />
            <span className="text-[11px] text-muted-foreground">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${30 - (v / max) * 28}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={cn("h-8 w-full", className)} aria-hidden>
      <polyline points={pts} fill="none" stroke="var(--series-brand)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
