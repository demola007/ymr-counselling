/** Small building blocks shared by every portal page. */
import type { ComponentType, ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtNum, initials } from "@/lib/format";
import type { CounselleeStatus, FollowUpStatus, Urgency } from "@/types";

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2 text-ember">{eyebrow}</div>}
        <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, description, actions, children, className, bodyClassName }: { title?: ReactNode; description?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <section className={cn("panel", className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  hint,
  accent,
  invertDelta,
}: {
  label: string;
  value: ReactNode;
  delta?: number | null; // fraction, e.g. 0.12 = +12%
  deltaLabel?: string;
  icon?: ComponentType<{ className?: string }>;
  hint?: ReactNode;
  accent?: boolean;
  invertDelta?: boolean;
}) {
  const up = (delta ?? 0) > 0.005;
  const down = (delta ?? 0) < -0.005;
  const good = invertDelta ? down : up;
  const bad = invertDelta ? up : down;
  return (
    <div className={cn("panel relative overflow-hidden p-5", accent && "border-ember/40")}>
      {accent && <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-ember/20 blur-2xl" />}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", accent ? "bg-ember/15 text-ember" : "bg-muted text-muted-foreground")}>
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="tabular mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <div className="mt-2 flex min-h-[20px] items-center gap-2 text-xs">
        {delta !== undefined && delta !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
              good && "bg-status-good/10 text-[#006300] dark:text-[#0ca30c]",
              bad && "bg-status-critical/10 text-status-critical",
              !good && !bad && "bg-muted text-muted-foreground",
            )}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : down ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {Math.abs(delta * 100).toFixed(0)}%
          </span>
        )}
        {(deltaLabel || hint) && <span className="truncate text-muted-foreground">{deltaLabel ?? hint}</span>}
      </div>
    </div>
  );
}

export function Avatar({ name, className, src }: { name: string; className?: string; src?: string | null }) {
  // A stable warm hue per person
  const hue = [...name].reduce((s, c) => s + c.charCodeAt(0), 0) % 50;
  return src ? (
    <img src={src} alt="" className={cn("h-8 w-8 shrink-0 rounded-full object-cover", className)} />
  ) : (
    <span
      className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-ink", className)}
      style={{ background: `linear-gradient(135deg, hsl(${hue + 20} 95% 70%), hsl(${hue + 5} 90% 55%))` }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

const pill = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize";

export const FOLLOW_UP_META: Record<FollowUpStatus, { label: string; cls: string; dot: string }> = {
  new: { label: "New", cls: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300", dot: "bg-sky-500" },
  contacted: { label: "Contacted", cls: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  connected: { label: "Connected", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  discipled: { label: "Discipled", cls: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  unreachable: { label: "Unreachable", cls: "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400", dot: "bg-zinc-500" },
};

export const COUNSELLEE_META: Record<CounselleeStatus, { label: string; cls: string; dot: string }> = {
  pending: { label: "Pending", cls: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300", dot: "bg-sky-500" },
  assigned: { label: "Assigned", cls: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  "in-session": { label: "In session", cls: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
  "follow-up": { label: "Follow-up", cls: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  resolved: { label: "Resolved", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
};

export function StatusPill({ meta }: { meta: { label: string; cls: string; dot: string } }) {
  return (
    <span className={cn(pill, meta.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function UrgencyPill({ urgency }: { urgency: Urgency }) {
  const m = {
    high: { cls: "border-status-critical/40 bg-status-critical/10 text-status-critical", label: "High" },
    medium: { cls: "border-status-warning/40 bg-status-warning/10 text-amber-700 dark:text-status-warning", label: "Medium" },
    low: { cls: "border-border bg-muted text-muted-foreground", label: "Low" },
  }[urgency];
  return (
    <span className={cn(pill, m.cls)} title={`AI triage: ${m.label} urgency`}>
      <span aria-hidden>{urgency === "high" ? "▲" : urgency === "medium" ? "◆" : "▽"}</span>
      {m.label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, body, action }: { icon: ComponentType<{ className?: string }>; title: string; body?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Meter({ value, max, className, tone = "brand" }: { value: number; max: number; className?: string; tone?: "brand" | "good" | "bad" }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-muted", className)} role="meter" aria-valuenow={value} aria-valuemax={max} aria-valuemin={0}>
      <div
        className={cn("h-full rounded-full", tone === "brand" && "bg-gradient-to-r from-gold to-ember", tone === "good" && "bg-status-good", tone === "bad" && "bg-status-critical")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-semibold text-muted-foreground">{children}</kbd>;
}

export const n = fmtNum;
