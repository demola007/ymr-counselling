import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileJson, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { PageHeader, Panel } from "@/components/portal/kit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DATA_EDITIONS } from "@/config/editions";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useStaff } from "@/hooks/queries";
import { exportRows, type ExportColumn, type ExportFormat } from "@/lib/export";
import { fmtDateTime, fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Convert, Counsellee, NotificationBatch, StaffMember } from "@/types";
import { BATCH_EXPORT_COLUMNS, CONVERT_EXPORT_COLUMNS, COUNSELLEE_EXPORT_COLUMNS, STAFF_EXPORT_COLUMNS } from "./exportColumns";

type Dataset = "converts" | "counsellees" | "counsellors" | "notifications";

const DATASETS: { id: Dataset; label: string; body: string }[] = [
  { id: "converts", label: "Converts", body: "Contact details, follow-up status, counsellor" },
  { id: "counsellees", label: "Counsellees", body: "Requests, AI topics & urgency, sessions" },
  { id: "counsellors", label: "Counselling team", body: "Team members, roles and specialties" },
  { id: "notifications", label: "Notification history", body: "Every campaign with delivery results and cost" },
];

export default function Exports() {
  const { user } = useAuth();
  const { year } = useEdition();
  const staff = useStaff();
  const history = useQuery({ queryKey: ["exports"], queryFn: () => api.exports.list() });
  const [dataset, setDataset] = useState<Dataset>("converts");
  const [years, setYears] = useState<number[]>([year]);
  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const [busy, setBusy] = useState(false);

  const staffName = new Map((staff.data ?? []).map((s) => [s.id, s.name]));
  const columnsFor = (d: Dataset) =>
    (d === "converts" ? CONVERT_EXPORT_COLUMNS(staffName) : d === "counsellees" ? COUNSELLEE_EXPORT_COLUMNS(staffName) : d === "counsellors" ? STAFF_EXPORT_COLUMNS : BATCH_EXPORT_COLUMNS) as ExportColumn<unknown>[];
  const [cols, setCols] = useState<Record<Dataset, Set<string>>>(() => ({
    converts: new Set(CONVERT_EXPORT_COLUMNS(new Map()).map((c) => c.key)),
    counsellees: new Set(COUNSELLEE_EXPORT_COLUMNS(new Map()).map((c) => c.key)),
    counsellors: new Set(STAFF_EXPORT_COLUMNS.map((c) => c.key)),
    notifications: new Set(BATCH_EXPORT_COLUMNS.map((c) => c.key)),
  }));
  const all = columnsFor(dataset);
  const chosen = cols[dataset];

  const run = async () => {
    setBusy(true);
    try {
      let rows: unknown[] = [];
      if (dataset === "converts") rows = (await Promise.all(years.map((y) => api.converts.list(y)))).flat() as Convert[];
      else if (dataset === "counsellees") rows = (await Promise.all(years.map((y) => api.counsellees.list(y)))).flat() as Counsellee[];
      else if (dataset === "counsellors") rows = ((await api.staff.list()) as StaffMember[]).filter((s) => s.editions.some((e) => years.includes(e)));
      else rows = ((await api.notifications.batches()) as NotificationBatch[]).filter((b) => years.includes(b.edition));
      const name = await exportRows(rows, all.filter((c) => chosen.has(c.key)), format, `ymr-${dataset}-${years.sort().join("-")}`);
      await api.exports.log({ by: user!.name, dataset: dataset, editions: years, format, rows: rows.length });
      await history.refetch();
      toast.success(`Exported ${fmtNum(rows.length)} rows`, { description: name });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Exports" description="Download any dataset, for one edition or several, in the format you need. Every export is logged." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Panel title="Dataset">
            <div className="grid gap-2 sm:grid-cols-2">
              {DATASETS.map((d) => (
                <button key={d.id} onClick={() => setDataset(d.id)} className={cn("rounded-xl border p-4 text-left transition", dataset === d.id ? "border-ember bg-ember/10 ring-1 ring-ember/30" : "hover:border-ember/40")}>
                  <p className="font-semibold">{d.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{d.body}</p>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Editions" description="Combine years for longitudinal analysis">
            <div className="flex flex-wrap gap-2">
              {DATA_EDITIONS.map((e) => {
                const on = years.includes(e.year);
                return (
                  <button
                    key={e.year}
                    onClick={() => setYears((ys) => (on ? (ys.length > 1 ? ys.filter((y) => y !== e.year) : ys) : [...ys, e.year]))}
                    className={cn("flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-semibold", on ? "border-ember bg-ember/10" : "text-muted-foreground")}
                    aria-pressed={on}
                  >
                    <img src={e.flyer} alt="" className="h-7 w-7 rounded-full object-cover" />
                    {e.year} · {e.theme}
                  </button>
                );
              })}
            </div>
          </Panel>
          <Panel
            title="Columns"
            description={`${chosen.size} of ${all.length} selected`}
            actions={
              <div className="flex gap-2 text-xs">
                <button className="font-semibold text-ember-text hover:underline" onClick={() => setCols((c) => ({ ...c, [dataset]: new Set(all.map((x) => x.key)) }))}>
                  All
                </button>
                <button className="text-muted-foreground hover:underline" onClick={() => setCols((c) => ({ ...c, [dataset]: new Set(["name"]) }))}>
                  None
                </button>
              </div>
            }
          >
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {all.map((c) => (
                <label key={c.key} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent">
                  <Checkbox
                    checked={chosen.has(c.key)}
                    onCheckedChange={(v) =>
                      setCols((prev) => {
                        const next = new Set(prev[dataset]);
                        if (v) next.add(c.key);
                        else next.delete(c.key);
                        return { ...prev, [dataset]: next };
                      })
                    }
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </Panel>
        </div>
        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Panel title="Format">
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ["xlsx", "Excel", FileSpreadsheet],
                  ["csv", "CSV", FileText],
                  ["json", "JSON", FileJson],
                ] as const
              ).map(([f, l, Icon]) => (
                <button key={f} onClick={() => setFormat(f)} className={cn("flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold", format === f ? "border-ember bg-ember/10" : "text-muted-foreground")}>
                  <Icon className="h-5 w-5" /> {l}
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full" onClick={run} disabled={busy || chosen.size === 0}>
              {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Download className="mr-1.5 h-4 w-4" />} Download
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">Exports contain personal data. Store them securely and delete them when you're done.</p>
          </Panel>
          <Panel title="Recent exports" bodyClassName="p-0">
            <ul className="divide-y">
              {(history.data ?? []).slice(0, 8).map((e) => (
                <li key={e.id} className="px-5 py-3 text-sm">
                  <p className="font-medium capitalize">
                    {e.dataset} · {e.editions.join(", ") || "all"} · {e.format.toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fmtNum(e.rows)} rows · {e.by} · {fmtDateTime(e.at)}
                  </p>
                </li>
              ))}
              {!history.data?.length && <li className="px-5 py-6 text-center text-sm text-muted-foreground">No exports yet</li>}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
