import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BrandLockup, YmrTenLogo } from "@/components/brand/Logo";
import { useCountdown } from "@/components/brand/Countdown";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/brand/ThemeToggle";

const LINKS = [
  { to: "/#doors", label: "Get help" },
  { to: "/#route", label: "How it works" },
  { to: "/#ministers", label: "Ministers" },
  { to: "/#decade", label: "10 years" },
  { to: "/#faq", label: "FAQ" },
];

function TopStrip() {
  const c = useCountdown();
  return (
    <div className="relative z-50 border-b border-fg/5 bg-canvas-2/80 text-[11px] text-fg/70 backdrop-blur">
      <div className="container flex h-9 items-center justify-between gap-4">
        <p className="truncate">
          <span className="font-semibold text-brand">YMR 2026 · 10th edition</span>
          <span className="mx-2 text-fg/20">/</span>
          {SITE.datesShort} · {SITE.venue}
        </p>
        <p className="hidden shrink-0 items-center gap-3 sm:flex">
          {c.phase === "before" && (
            <span className="tabular">
              <span className="text-fg">{c.days}</span>d <span className="text-fg">{String(c.hours).padStart(2, "0")}</span>h to go
            </span>
          )}
          <a href={SITE.registerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-fg hover:text-brand">
            Register for YMR <ArrowUpRight className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <TopStrip />
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled ? "border-b border-fg/5 bg-canvas/80 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-6 text-fg">
          <Link to="/" className="flex items-center gap-3" aria-label="YMR Counselling home">
            <BrandLockup />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {LINKS.map((l) => (
              <a key={l.to} href={l.to} className="rounded-full px-4 py-2 text-sm text-fg/75 transition hover:bg-fg/5 hover:text-fg">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavLink to="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-fg/80 hover:text-fg sm:block">
              Staff portal
            </NavLink>
            <Link to="/counselling" className="btn-ember hidden !px-5 !py-2.5 sm:inline-flex">
              Book counselling
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-fg/10 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-canvas/95 px-6 pt-32 text-fg backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="border-b border-fg/5 py-4 font-display text-2xl"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Link to="/counselling" onClick={() => setOpen(false)} className="btn-ember">
                  Book counselling
                </Link>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost-gold">
                  Staff portal
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="relative border-t border-fg/5 bg-canvas-2 text-fg/70">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <YmrTenLogo className="w-28" />
          <p className="max-w-xs text-sm leading-relaxed">
            The Counselling & Follow-up team of Young Ministers Retreat. We walk with every new believer and every seeker — at the retreat and long after.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4 text-brand">Get help</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-fg" to="/counselling">Book counselling</Link></li>
            <li><Link className="hover:text-fg" to="/new-believer">I gave my life to Jesus</Link></li>
            <li><Link className="hover:text-fg" to="/join">Serve as a counsellor</Link></li>
            <li><Link className="hover:text-fg" to="/login">Staff portal</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4 text-brand">YMR 2026</p>
          <ul className="space-y-2.5 text-sm">
            <li>{SITE.dates}</li>
            <li>{SITE.venue}</li>
            <li><a className="hover:text-fg" href={SITE.registerUrl} target="_blank" rel="noreferrer">Register ↗</a></li>
            <li><a className="hover:text-fg" href={SITE.mainSite} target="_blank" rel="noreferrer">ymrglobal.org ↗</a></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4 text-brand">Reach us</p>
          <ul className="space-y-2.5 text-sm">
            <li><a className="hover:text-fg" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            {SITE.phones.map((p) => (
              <li key={p}><a className="tabular hover:text-fg" href={`tel:${p.replace(/\s/g, "")}`}>{p}</a></li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {SITE.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-fg/10 px-3 py-1 text-xs hover:border-gold/60 hover:text-fg">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-fg/5">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-fg/40 sm:flex-row">
          <p>© 2026 YMR Counselling & Follow-up · Young Ministers Retreat Global</p>
          <p>Every conversation is confidential.</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-fg">
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
