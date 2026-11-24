import { useState } from "react";
import { Globe2, GraduationCap, HeartHandshake, Sparkles, Table2, Timer, UsersRound } from "lucide-react";
import { BarList, Columns, Funnel, IntakeTrend, Legend, SERIES, SplitBar } from "@/components/charts/Charts";
import { PageHeader, Panel, StatCard } from "@/components/portal/kit";
import { Skeleton } from "@/components/ui/skeleton";
import { DATA_EDITIONS } from "@/config/editions";
import { useEdition } from "@/context/EditionContext";
import { useCompare, useSummary } from "@/hooks/queries";
import type { EditionSummary } from "@/data/analytics";
import { fmtNum, fmtPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const { year, edition } = useEdition();
  const { data: s } = useSummary();
  const years = [...DATA_EDITIONS].map((e) => e.year).sort();
  const compare = useCompare(years);
  const [tableView, setTableView] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow={`YMR ${year} · ${edition.theme}`}
        title="Analytics"
        description="Who we reached, what they needed, and how well we followed up — and how this year compares with the last."
        actions={
          <button onClick={() => setTableView((t) => !t)} className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold", tableView && "border-ember bg-ember/10")} aria-pressed={tableView}>
            <Table2 className="h-3.5 w-3.5" /> {tableView ? "Chart view" : "Table view"}
          </button>
        }
      />

      {!s ? (
        <div className="grid gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Converts" value={fmtNum(s.converts)} icon={Sparkles} accent hint={`${fmtPct(s.onlineShare)} online`} />
            <StatCard label="Counsellees" value={fmtNum(s.counsellees)} icon={HeartHandshake} hint={`${fmtNum(s.highUrgencyOpen)} high-urgency open`} />
            <StatCard label="Connected to church" value={fmtPct(s.connectedRate)} icon={UsersRound} hint="of converts" />
            <StatCard label="Median first contact" value={s.medianHoursToFirstContact ? `${Math.round(s.medianHoursToFirstContact)}h` : "—"} icon={Timer} hint={`${fmtNum(s.counsellors)} counsellors this edition`} />
          </div>

          {/* Year over year: small multiples, one per measure, editions on the x-axis */}
          <Panel title="Edition over edition" description="Each measure on its own scale. The selected edition is highlighted.">
            {compare.data ? (
              tableView ? (
                <YoyTable rows={compare.data} />
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
                  {(
                    [
                      ["Converts", (x) => x.converts, fmtNum],
                      ["Counsellees", (x) => x.counsellees, fmtNum],
                      ["Followed up", (x) => x.followUpRate, (n: number) => fmtPct(n)],
                      ["Counsellors", (x) => x.counsellors, fmtNum],
                    ] as [string, (x: EditionSummary) => number, (n: number) => string][]
                  ).map(([label, get, f]) => (
                    <div key={label}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                      <Columns data={compare.data.map((x) => ({ label: String(x.edition), value: get(x) }))} highlight={String(year)} format={f} height={150} />
                    </div>
                  ))}
                </div>
              )
            ) : (
              <Skeleton className="h-40" />
            )}
          </Panel>

          <div className="grid gap-6 xl:grid-cols-3">
            <Panel className="xl:col-span-2" title="Daily intake" actions={<Legend items={[{ label: "Converts", color: SERIES.converts }, { label: "Counsellees", color: SERIES.counsellees }]} />}>
              {tableView ? (
                <SimpleTable head={["Date", "Converts", "Counsellees"]} rows={s.daily.map((d) => [d.date, fmtNum(d.converts), fmtNum(d.counsellees)])} />
              ) : (
                <IntakeTrend data={s.daily} height={280} />
              )}
            </Panel>
            <Panel title="Follow-up funnel">
              <Funnel data={s.funnel} />
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <Panel title="What people need" description="Counselling topics, classified by AI">
              {tableView ? <SimpleTable head={["Topic", "Requests"]} rows={s.topics.map((t) => [t.label, fmtNum(t.value)])} /> : <BarList data={s.topics} color={SERIES.counsellees} />}
            </Panel>
            <Panel title="Where they're from" description="Top states, converts and counsellees" actions={<Globe2 className="h-4 w-4 text-muted-foreground" />}>
              {tableView ? <SimpleTable head={["State", "People"]} rows={s.states.map((t) => [t.label, fmtNum(t.value)])} /> : <BarList data={s.states} />}
            </Panel>
            <Panel title="Church background">
              {tableView ? <SimpleTable head={["Denomination", "People"]} rows={s.denominations.map((t) => [t.label, fmtNum(t.value)])} /> : <BarList data={s.denominations} />}
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Age groups">
              <Columns data={s.ageGroups} height={180} />
            </Panel>
            <Panel title="People" description="Converts and counsellees combined">
              <div className="space-y-7">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Gender</p>
                  <SplitBar data={s.gender} colors={["var(--series-5)", "var(--series-1)"]} />
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5" /> Students
                  </p>
                  <SplitBar
                    data={[
                      { label: "Students", value: s.studentShare },
                      { label: "Working / other", value: 1 - s.studentShare },
                    ]}
                    colors={["var(--series-3)", "var(--series-muted)"]}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Converts · where they decided</p>
                  <SplitBar
                    data={[
                      { label: "Onsite", value: 1 - s.onlineShare },
                      { label: "Online", value: s.onlineShare },
                    ]}
                    colors={["var(--series-2)", "var(--series-7)"]}
                  />
                </div>
              </div>
            </Panel>
            <Panel title="Triage & capture">
              <div className="space-y-7">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Urgency (AI)</p>
                  <SplitBar data={s.urgency.map((u) => ({ label: u.label[0]!.toUpperCase() + u.label.slice(1), value: u.value }))} colors={["#d03b3b", "#fab219", "var(--series-muted)"]} />
                </div>
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">How records arrived</p>
                  <BarList data={s.sources} />
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}

function SimpleTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="scrollbar-thin max-h-[320px] overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-card">
          <tr className="border-b text-left text-xs text-muted-foreground">
            {head.map((h, i) => (
              <th key={h} className={cn("py-2 font-semibold", i > 0 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b last:border-0">
              {r.map((c, j) => (
                <td key={j} className={cn("tabular py-2", j > 0 && "text-right")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function YoyTable({ rows }: { rows: { edition: number; converts: number; counsellees: number; followUpRate: number; counsellors: number; connectedRate: number }[] }) {
  return (
    <SimpleTable
      head={["Edition", "Converts", "Counsellees", "Followed up", "Connected", "Counsellors"]}
      rows={rows.map((r) => [r.edition, fmtNum(r.converts), fmtNum(r.counsellees), fmtPct(r.followUpRate), fmtPct(r.connectedRate), fmtNum(r.counsellors)])}
    />
  );
}
