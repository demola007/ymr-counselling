import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { Embers } from "@/components/brand/Embers";
import { BrandLockup } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/brand/ThemeToggle";

/** Two-panel layout for the public forms: a visual story on the left, the wizard on the right. */
export function FormShell({
  image,
  eyebrow,
  title,
  verse,
  verseRef,
  children,
}: {
  image: string;
  eyebrow: string;
  title: ReactNode;
  verse: string;
  verseRef: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-fg lg:grid lg:grid-cols-[minmax(380px,0.9fr)_1.1fr]">
      <aside className="grain relative overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/80 to-canvas lg:bg-gradient-to-r lg:from-canvas/40 lg:via-canvas/70 lg:to-canvas" />
        <Embers density={36} className="absolute inset-0 h-full w-full" />
        <div className="relative flex h-full flex-col justify-between gap-10 p-6 sm:p-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-sm text-fg/70 hover:text-fg">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <span className="flex items-center gap-2">
              <ThemeToggle />
              <BrandLockup />
            </span>
          </div>
          <div className="max-w-md pb-2 lg:pb-10">
            <p className="eyebrow text-ember-text">{eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">{title}</h1>
            <blockquote className="mt-8 hidden border-l-2 border-gold/60 pl-5 lg:block">
              <p className="font-display text-xl leading-snug text-fg/85">“{verse}”</p>
              <footer className="mt-2 text-sm text-brand">{verseRef}</footer>
            </blockquote>
          </div>
        </div>
      </aside>
      <main className="relative px-5 py-10 sm:px-10 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-xl">{children}</div>
      </main>
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col gap-2">
            <div className="h-1 overflow-hidden rounded-full bg-fg/10">
              <motion.div
                className="h-full bg-gradient-to-r from-gold to-ember"
                initial={false}
                animate={{ width: i < current ? "100%" : i === current ? "50%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className={cn("hidden text-[11px] font-semibold uppercase tracking-[0.16em] sm:block", i <= current ? "text-brand" : "text-fg/35")}>{s}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-fg/50 sm:hidden">
        Step {current + 1} of {steps.length} · {steps[current]}
      </p>
    </div>
  );
}

export function StepPanel({ stepKey, children }: { stepKey: string | number; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className="space-y-6"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function Field({ label, hint, error, children, optional, className }: { label: string; hint?: string; error?: string; children: ReactNode; optional?: boolean; className?: string }) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="flex items-baseline justify-between gap-2 text-sm font-medium text-fg/90">
        {label}
        {optional && <span className="text-xs font-normal text-fg/40">Optional</span>}
      </span>
      {children}
      {error ? <span className="block text-xs text-red-600 dark:text-red-400">{error}</span> : hint ? <span className="block text-xs text-fg/45">{hint}</span> : null}
    </label>
  );
}

export const inputCls =
  "h-12 w-full rounded-xl border border-fg/10 bg-fg/[0.04] px-4 text-[15px] text-fg placeholder:text-fg/30 outline-none transition focus:border-gold/70 focus:bg-fg/[0.06] focus:ring-4 focus:ring-gold/10";

export function Chips<T extends string>({
  options,
  value,
  onChange,
  multiple,
}: {
  options: readonly T[];
  value: T[] | T | null;
  onChange: (v: T[] | T) => void;
  multiple?: boolean;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <div className="flex flex-wrap gap-2" role={multiple ? "group" : "radiogroup"}>
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            type="button"
            key={o}
            role={multiple ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => {
              if (multiple) onChange((on ? selected.filter((x) => x !== o) : [...selected, o]) as T[]);
              else onChange(o);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition",
              on ? "border-gold bg-gold/15 text-brand" : "border-fg/10 bg-fg/[0.03] text-fg/75 hover:border-fg/25",
            )}
          >
            {on && <Check className="h-3.5 w-3.5" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function NavButtons({ step, last, onBack, busy, nextLabel = "Continue", submitLabel = "Submit" }: { step: number; last: boolean; onBack: () => void; busy?: boolean; nextLabel?: string; submitLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      {step > 0 ? (
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm text-fg/70 hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      ) : (
        <span />
      )}
      <button type="submit" disabled={busy} className="btn-ember min-w-[150px] disabled:opacity-60">
        {busy ? "Sending…" : last ? submitLabel : nextLabel}
      </button>
    </div>
  );
}

export function SuccessCard({ title, children, reference }: { title: string; children: ReactNode; reference?: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-ember/30 animate-pulse-ring" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-ember text-ink">
          <Check className="h-10 w-10" strokeWidth={3} />
        </span>
      </div>
      <h2 className="mt-8 font-display text-4xl font-bold">{title}</h2>
      {reference && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm">
          Your reference <span className="font-mono font-bold text-brand">{reference}</span>
        </p>
      )}
      <div className="mx-auto mt-6 max-w-md space-y-4 text-fg/70">{children}</div>
      <Link to="/" className="btn-ghost-gold mt-10">
        Back to home
      </Link>
    </motion.div>
  );
}
