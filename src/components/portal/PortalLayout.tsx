import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronsUpDown, History, LogOut, Menu, Moon, Search, Sun, UserRound, X } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { ROLE_LABEL } from "@/auth/permissions";
import { BrandLockup } from "@/components/brand/Logo";
import { FlameLoader } from "@/components/brand/FlameLoader";
import { useCountdown } from "@/components/brand/Countdown";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CURRENT_YEAR, ordinal } from "@/config/editions";
import { useEdition } from "@/context/EditionContext";
import { useTheme } from "@/context/ThemeContext";
import { useConverts, useCounsellees } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import { Avatar, Kbd } from "./kit";
import { NAV } from "./nav";

function EditionSwitcher({ compact }: { compact?: boolean }) {
  const { year, setYear, editions, edition } = useEdition();
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-3 rounded-xl border bg-card text-left transition hover:border-ember/50",
            compact ? "px-2.5 py-1.5" : "w-full px-3 py-2.5",
          )}
          aria-label={`Viewing YMR ${year}. Change edition`}
        >
          <img src={edition.flyer} alt="" className={cn("rounded-md object-cover", compact ? "h-7 w-7" : "h-9 w-9")} />
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{compact ? "Edition" : `${ordinal(edition.number)} edition`}</span>
            <span className="block truncate text-sm font-semibold">
              {year} · {edition.theme}
            </span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-1.5">
        <p className="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">View data for</p>
        {editions.map((e) => (
          <button
            key={e.year}
            onClick={() => {
              setYear(e.year);
              setOpen(false);
            }}
            className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-accent", e.year === year && "bg-accent")}
          >
            <img src={e.flyer} alt="" className="h-10 w-10 rounded-md object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">
                YMR {e.year}
                {e.year === CURRENT_YEAR && <span className="ml-2 rounded bg-ember/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ember">Current</span>}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {ordinal(e.number)} · {e.theme}
              </span>
            </span>
            {e.year === year && <Check className="h-4 w-4 text-ember" />}
          </button>
        ))}
        <p className="border-t px-2.5 pb-1 pt-2 text-[11px] text-muted-foreground">Each December adds a new edition automatically.</p>
      </PopoverContent>
    </Popover>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { can } = useAuth();
  const items = NAV.filter((n) => !n.perm || can(n.perm));
  const groups = (["Work", "Insight", "Admin"] as const).map((g) => ({ g, items: items.filter((i) => i.group === g) })).filter((x) => x.items.length);
  return (
    <nav className="space-y-6" aria-label="Portal">
      {groups.map(({ g, items }) => (
        <div key={g}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">{g}</p>
          <ul className="space-y-0.5">
            {items.map((i) => (
              <li key={i.to}>
                <NavLink
                  to={i.to}
                  end={i.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                      isActive ? "bg-ember/10 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <motion.span layoutId="nav-active" className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-ember" />}
                      <i.icon className={cn("h-[18px] w-[18px]", isActive ? "text-ember" : "")} />
                      {i.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function EventChip() {
  const c = useCountdown();
  const { isCurrent } = useEdition();
  if (!isCurrent) return null;
  return (
    <div className="hidden items-center gap-2 rounded-full border border-ember/30 bg-ember/10 px-3 py-1 text-xs font-semibold text-ember-text md:flex">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
      </span>
      {c.phase === "before" ? `${c.days} days to City Takers` : c.phase === "live" ? `Live · Day ${c.dayOfEvent}` : "YMR 2026 complete"}
    </div>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const nav = useNavigate();
  const { can } = useAuth();
  const { year } = useEdition();
  const converts = useConverts();
  const counsellees = useCounsellees();
  const [q, setQ] = useState("");
  const people = useMemo(() => {
    if (q.trim().length < 2) return [];
    const needle = q.toLowerCase();
    const all = [...(converts.data ?? []), ...(can("counsellees:read") ? counsellees.data ?? [] : [])];
    return all.filter((p) => p.name.toLowerCase().includes(needle) || p.phone_number?.includes(needle) || p.email?.includes(needle)).slice(0, 8);
  }, [q, converts.data, counsellees.data, can]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={`Search people in YMR ${year}, or jump to a page…`} value={q} onValueChange={setQ} />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        {people.length > 0 && (
          <CommandGroup heading="People">
            {people.map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.name} ${p.phone_number ?? ""} ${p.id}`}
                onSelect={() => {
                  nav(`/portal/${p.kind === "convert" ? "converts" : "counsellees"}?open=${p.id}`);
                  setOpen(false);
                }}
              >
                <Avatar name={p.name} className="mr-2 h-6 w-6 text-[9px]" />
                <span className="flex-1">{p.name}</span>
                <span className="text-xs capitalize text-muted-foreground">{p.kind}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="Go to">
          {NAV.filter((n) => !n.perm || can(n.perm)).map((n) => (
            <CommandItem
              key={n.to}
              onSelect={() => {
                nav(n.to);
                setOpen(false);
              }}
            >
              <n.icon className="mr-2 h-4 w-4" /> {n.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function PortalLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { isCurrent, year } = useEdition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => setMobileOpen(false), [loc.pathname]);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  if (!user) return null;

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/portal" className="px-2 pt-1">
        <BrandLockup />
      </Link>
      <EditionSwitcher />
      <div className="scrollbar-thin -mx-1 flex-1 overflow-y-auto px-1">
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </div>
      <div className="rounded-2xl border bg-gradient-to-br from-ember/10 to-transparent p-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} className="h-9 w-9" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r bg-sidebar lg:block">{sidebar}</aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r bg-sidebar lg:hidden"
            >
              <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <EditionSwitcher compact />
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden h-10 max-w-sm flex-1 items-center gap-2 rounded-xl border bg-card px-3 text-sm text-muted-foreground transition hover:border-ember/40 md:flex"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search people, pages…</span>
              <Kbd>⌘K</Kbd>
            </button>
            <div className="ml-auto flex items-center gap-1.5">
              <EventChip />
              <button onClick={() => setSearchOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent md:hidden" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <button onClick={toggle} className="rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full p-0.5 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                  <Avatar name={user.name} className="h-9 w-9" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="truncate">{user.name}</p>
                    <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => nav("/portal/profile")}>
                    <UserRound className="mr-2 h-4 w-4" /> Profile & password
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => nav("/")}>
                    <History className="mr-2 h-4 w-4" /> Public site
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      logout();
                      nav("/login");
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {!isCurrent && (
            <div className="border-t border-ember/20 bg-ember/10 px-4 py-1.5 text-center text-xs font-medium text-ember-text sm:px-6">
              You're viewing archived data from YMR {year}. Switch to {CURRENT_YEAR} in the edition menu to see this year.
            </div>
          )}
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Suspense fallback={<FlameLoader className="min-h-[50vh]" />}>
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Outlet />
            </motion.div>
          </Suspense>
        </main>
      </div>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
