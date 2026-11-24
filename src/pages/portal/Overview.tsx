import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, HeartHandshake, Megaphone, ScanLine, Sparkles, Timer, UserPlus, UsersRound } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { Countdown, useCountdown } from "@/components/brand/Countdown";
import { NationsBurst } from "@/components/brand/NationsBurst";
import { Funnel, IntakeTrend, Legend, SERIES } from "@/components/charts/Charts";
import { Avatar, FOLLOW_UP_META, Panel, StatCard, StatusPill, UrgencyPill } from "@/components/portal/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { ordinal } from "@/config/editions";
import { useEdition } from "@/context/EditionContext";
import { useActivity, useConverts, useCounsellees, useSummary } from "@/hooks/queries";
import { firstName, fmtAgo, fmtNum, fmtPct } from "@/lib/format";
import { cn } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

const delta = (a?: number, b?: number) => (a !== undefined && b ? (a - b) / b : null);

export default function Overview() {
  const { user, can } = useAuth();
  const { year, edition, isCurrent } = useEdition();
  const c = useCountdown();
  const summary = useSummary();
  const prev = useSummary(year - 1);
  const converts = useConverts();
  const counsellees = useCounsellees();
  const activity = useActivity();
  const s = summary.data;
  // A pre-event year compared with a finished one would read as a collapse, so hide deltas until the retreat starts
  const comparable = !(isCurrent && c.phase === "before");
  const p = year > 2024 && comparable ? prev.data : undefined;

  const urgent = (counsellees.data ?? []).filter((x) => x.urgency === "high" && x.status !== "resolved").slice(0, 5);
  const newest = (converts.data ?? []).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <section className="dark relative overflow-hidden rounded-3xl border bg-ink p-6 text-cream sm:p-8">
        <NationsBurst intensity={0.55} className="opacity-80" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-gold/90">
              YMR {year} · {ordinal(edition.number)} edition · {edition.theme}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              {greeting()}, {firstName(user!.name)}.
            </h1>
            <p className="mt-2 max-w-xl text-cream/70">
              {isCurrent && c.phase === "before"
                ? `City Takers starts in ${c.days} days. ${s ? `${fmtNum(s.unassignedCounsellees)} counselling requests are waiting for a counsellor.` : ""}`
                : isCurrent && c.phase === "live"
                  ? `We're live — Day ${c.dayOfEvent}. Every form captured today is a life to follow up.`
                  : `Looking back at ${edition.theme}: ${s ? `${fmtNum(s.converts)} converts and ${fmtNum(s.counsellees)} counsellees.` : ""}`}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {can("capture:use") && (
                <Link to="/portal/capture" className="btn-ember !py-2.5">
                  <ScanLine className="h-4 w-4" /> Capture forms
                </Link>
              )}
              {can("counsellees:read") && (
                <Link to="/portal/counsellees?status=pending" className="btn-ghost-gold !py-2.5">
                  <HeartHandshake className="h-4 w-4" /> Assign requests
                </Link>
              )}
              {can("notifications:send") && (
                <Link to="/portal/notifications?tab=compose" className="btn-ghost-gold !py-2.5">
                  <Megaphone className="h-4 w-4" /> Send a message
                </Link>
              )}
            </div>
          </div>
          {isCurrent && c.phase === "before" && <Countdown size="sm" className="self-start lg:self-end" />}
        </div>
      </section>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {!s ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Converts" value={fmtNum(s.converts)} icon={Sparkles} accent delta={delta(s.converts, p?.converts)} deltaLabel={p ? `vs ${year - 1}` : comparable ? "captured this edition" : "pre-event outreach so far"} />
            <StatCard label="Followed up" value={fmtPct(s.followUpRate)} icon={UserPlus} delta={p ? s.followUpRate - p.followUpRate : null} deltaLabel={p ? `pts vs ${year - 1}` : `${fmtNum(s.converts - s.funnel[1]!.value)} not yet reached`} />
            {can("counsellees:read") ? (
              <StatCard label="Counsellees" value={fmtNum(s.counsellees)} icon={HeartHandshake} delta={delta(s.counsellees, p?.counsellees)} deltaLabel={p ? `vs ${year - 1}` : `${fmtNum(s.counselleesResolved)} resolved`} />
            ) : (
              <StatCard label="Connected to church" value={fmtPct(s.connectedRate)} icon={HeartHandshake} hint="of converts" />
            )}
            <StatCard
              label="First contact"
              value={s.medianHoursToFirstContact ? `${Math.round(s.medianHoursToFirstContact)}h` : "—"}
              icon={Timer}
              hint="median time to reach a convert"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Intake by day"
          description={isCurrent ? "Pre-event registrations and outreach so far" : "Forms captured across the retreat and the weeks after"}
          actions={
            <Legend
              items={[
                { label: "Converts", color: SERIES.converts },
                ...(can("counsellees:read") ? [{ label: "Counsellees", color: SERIES.counsellees }] : []),
              ]}
            />
          }
        >
          {s ? <IntakeTrend data={s.daily} series={can("counsellees:read") ? ["converts", "counsellees"] : ["converts"]} /> : <Skeleton className="h-[260px]" />}
        </Panel>
        <Panel title="Follow-up journey" description="Converts reaching each stage">
          {s ? <Funnel data={s.funnel} /> : <Skeleton className="h-[220px]" />}
          {s && s.unreachable > 0 && <p className="mt-4 text-xs text-muted-foreground">{fmtNum(s.unreachable)} marked unreachable after three attempts.</p>}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {can("counsellees:read") && (
          <Panel
            title={
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-status-critical" /> Needs attention
              </span>
            }
            description="High-urgency requests flagged by AI triage"
            actions={
              <Link to="/portal/counsellees?urgency=high" className="text-xs font-semibold text-ember-text hover:underline">
                View all
              </Link>
            }
            bodyClassName="p-0"
          >
            {urgent.length ? (
              <ul className="divide-y">
                {urgent.map((x) => (
                  <li key={x.id}>
                    <Link to={`/portal/counsellees?open=${x.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-accent/60">
                      <Avatar name={x.name} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold">
                          <span className="truncate">{x.name}</span> <UrgencyPill urgency={x.urgency} />
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{x.counselling_reason}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">Nothing urgent. 🙌🏾</p>
            )}
          </Panel>
        )}

        <Panel
          className={cn(!can("counsellees:read") && "xl:col-span-2")}
          title="Latest converts"
          actions={
            <Link to="/portal/converts" className="text-xs font-semibold text-ember-text hover:underline">
              Open list
            </Link>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y">
            {converts.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="px-5 py-3.5">
                    <Skeleton className="h-8" />
                  </li>
                ))
              : newest.map((x) => (
                  <li key={x.id}>
                    <Link to={`/portal/converts?open=${x.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-accent/60">
                      <Avatar name={x.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{x.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[x.state, x.age_group].filter(Boolean).join(" · ")} · {fmtAgo(x.created_at)}
                        </p>
                      </div>
                      <StatusPill meta={FOLLOW_UP_META[x.follow_up_status]} />
                    </Link>
                  </li>
                ))}
          </ul>
        </Panel>

        <Panel title="Team activity" description="What the team has been doing" bodyClassName="p-0">
          <ul className="scrollbar-thin max-h-[360px] divide-y overflow-y-auto">
            {(activity.data ?? []).slice(0, 12).map((a, i) => (
              <motion.li key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="flex gap-3 px-5 py-3">
                <Avatar name={a.actor} className="h-7 w-7 text-[10px]" />
                <p className="text-[13px] leading-snug">
                  <span className="font-semibold">{a.actor}</span> <span className="text-muted-foreground">{a.action}</span> {a.target}
                  <span className="block text-[11px] text-muted-foreground">{fmtAgo(a.at)}</span>
                </p>
              </motion.li>
            ))}
          </ul>
        </Panel>
      </div>

      {can("team:read") && s && (
        <Panel title="Counsellor caseload" description="Open cases per counsellor — balance assignments before the retreat" actions={<UsersRound className="h-4 w-4 text-muted-foreground" />}>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.counsellorLoad.slice(0, 9).map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <Avatar name={l.name} className="h-7 w-7 text-[10px]" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between text-[13px]">
                    <span className="truncate">{l.name}</span>
                    <span className="tabular font-semibold">
                      {l.open}
                      <span className="font-normal text-muted-foreground"> / {l.total}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${(l.open / Math.max(1, s.counsellorLoad[0]!.total)) * 100}%`, background: SERIES.brand }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
