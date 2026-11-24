import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Sparkles, UserCheck, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { DataTable, FilterSelect, type Column } from "@/components/portal/DataTable";
import { Avatar, COUNSELLEE_META, PageHeader, StatusPill, UrgencyPill } from "@/components/portal/kit";
import { PersonSheet } from "@/components/portal/PersonSheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { COUNSELLING_TOPICS } from "@/config/site";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useCounsellees, useInvalidate, useStaff } from "@/hooks/queries";
import { exportRows, type ExportFormat } from "@/lib/export";
import { fmtAgo, fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Counsellee, CounselleeStatus, Urgency } from "@/types";
import { COUNSELLEE_EXPORT_COLUMNS } from "./exportColumns";

const STATUSES = Object.keys(COUNSELLEE_META) as CounselleeStatus[];

export default function Counsellees() {
  const { user, can } = useAuth();
  const { year } = useEdition();
  const { data = [], isLoading } = useCounsellees();
  const staff = useStaff();
  const invalidate = useInvalidate();
  const [params, setParams] = useSearchParams();
  const [status, setStatus] = useState<CounselleeStatus | "all">((params.get("status") as CounselleeStatus) ?? "all");
  const [urgency, setUrgency] = useState<Urgency | "all">((params.get("urgency") as Urgency) ?? "all");
  const [topic, setTopic] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [matching, setMatching] = useState(false);

  const staffName = useMemo(() => new Map((staff.data ?? []).map((s) => [s.id, s.name])), [staff.data]);
  const team = (staff.data ?? []).filter((s) => s.status === "active" && s.editions.includes(year));

  const rows = useMemo(
    () => data.filter((c) => (status === "all" || c.status === status) && (urgency === "all" || c.urgency === urgency) && (topic === "all" || c.topics.includes(topic))),
    [data, status, urgency, topic],
  );

  const openId = params.get("open");
  const open = openId ? data.find((c) => c.id === openId) ?? null : null;
  const setOpen = (id: string | null) => {
    const p = new URLSearchParams(params);
    if (id) p.set("open", id);
    else p.delete("open");
    setParams(p, { replace: true });
  };

  const unassigned = data.filter((c) => !c.assigned_to);

  /** Balance unassigned requests across counsellors, preferring a matching specialty and lower caseload. */
  const autoMatch = async () => {
    setMatching(true);
    try {
      const load = new Map(team.map((s) => [s.id, data.filter((c) => c.assigned_to === s.id && c.status !== "resolved").length]));
      const specialtyFor: Record<string, string[]> = {
        "Relationships & marriage": ["Marriage", "Family"],
        "Mental & emotional health": ["Mental wellbeing"],
        "Grief & loss": ["Grief"],
        "Addiction & habits": ["Addiction recovery"],
        "Career & purpose": ["Career"],
        Family: ["Family"],
        Academics: ["Youth & campus"],
      };
      const ordered = [...unassigned].sort((a, b) => ({ high: 0, medium: 1, low: 2 })[a.urgency] - ({ high: 0, medium: 1, low: 2 })[b.urgency]);
      const plan = new Map<string, string[]>();
      for (const c of ordered) {
        const wants = c.topics.flatMap((t) => specialtyFor[t] ?? []);
        const pool = team.filter((s) => s.specialties.some((sp) => wants.includes(sp)));
        const candidates = (pool.length ? pool : team).sort((a, b) => (load.get(a.id) ?? 0) - (load.get(b.id) ?? 0));
        const pick = candidates[0];
        if (!pick) continue;
        load.set(pick.id, (load.get(pick.id) ?? 0) + 1);
        plan.set(pick.id, [...(plan.get(pick.id) ?? []), c.id]);
      }
      for (const [sid, ids] of plan) await api.counsellees.update(ids, { assigned_to: sid, status: "assigned" }, user!.name);
      await invalidate();
      toast.success(`Matched ${fmtNum(ordered.length)} requests to ${fmtNum(plan.size)} counsellors`, { description: "Urgent cases first, by specialty, then lightest caseload." });
    } finally {
      setMatching(false);
    }
  };

  const doExport = async (fmt: ExportFormat) => {
    const name = await exportRows(rows, COUNSELLEE_EXPORT_COLUMNS(staffName), fmt, `ymr-${year}-counsellees`);
    await api.exports.log({ by: user!.name, dataset: "counsellees", editions: [year], format: fmt, rows: rows.length });
    toast.success(`Exported ${fmtNum(rows.length)} rows`, { description: name });
  };

  const columns: Column<Counsellee>[] = [
    {
      key: "name",
      header: "Name",
      sort: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{r.name}</p>
            <p className="font-mono text-[11px] text-muted-foreground">{r.reference}</p>
          </div>
        </div>
      ),
    },
    { key: "urgency", header: "Urgency", sort: (r) => ({ high: 0, medium: 1, low: 2 })[r.urgency], cell: (r) => <UrgencyPill urgency={r.urgency} /> },
    {
      key: "topics",
      header: "Topic",
      hide: "md",
      cell: (r) => (
        <div className="max-w-[240px]">
          <p className="truncate text-[13px]">{r.topics.join(", ")}</p>
          <p className="truncate text-xs text-muted-foreground">{r.counselling_reason}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", sort: (r) => STATUSES.indexOf(r.status), cell: (r) => <StatusPill meta={COUNSELLEE_META[r.status]} /> },
    { key: "assigned", header: "Counsellor", hide: "lg", sort: (r) => staffName.get(r.assigned_to ?? "") ?? "", cell: (r) => (r.assigned_to ? staffName.get(r.assigned_to) : <span className="text-muted-foreground">Unassigned</span>) },
    { key: "mode", header: "Meet by", hide: "xl", cell: (r) => <span className="text-xs text-muted-foreground">{r.preferred_mode}</span> },
    { key: "created", header: "Requested", sort: (r) => r.created_at, hide: "sm", cell: (r) => <span className="whitespace-nowrap text-muted-foreground">{fmtAgo(r.created_at)}</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`YMR ${year}`}
        title="Counsellees"
        description="Counselling requests, triaged by AI for topic and urgency. Assign, schedule and see each one through."
        actions={
          <>
            {can("exports:use") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-1.5 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{fmtNum(rows.length)} filtered rows</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => doExport("xlsx")}>Excel (.xlsx)</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => doExport("csv")}>CSV</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        }
      />

      {can("counsellees:write") && unassigned.length > 0 && (
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-ember/30 bg-gradient-to-r from-ember/10 to-transparent p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/15 text-ember">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">{fmtNum(unassigned.length)} requests waiting for a counsellor</p>
            <p className="text-sm text-muted-foreground">Smart match pairs each one by urgency, the counsellor's specialties and current caseload.</p>
          </div>
          <Button onClick={autoMatch} disabled={matching}>
            <Wand2 className="mr-1.5 h-4 w-4" /> {matching ? "Matching…" : "Smart match"}
          </Button>
        </div>
      )}

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setStatus("all")} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold", status === "all" ? "border-ember bg-ember/10" : "text-muted-foreground")}>
          All <span className="tabular ml-1 opacity-70">{fmtNum(data.length)}</span>
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold", status === s ? "border-ember bg-ember/10" : "text-muted-foreground")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", COUNSELLEE_META[s].dot)} />
            {COUNSELLEE_META[s].label} <span className="tabular opacity-70">{fmtNum(data.filter((c) => c.status === s).length)}</span>
          </button>
        ))}
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        search={(r, q) => r.name.toLowerCase().includes(q) || r.reference.toLowerCase().includes(q) || !!r.phone_number?.includes(q) || r.counselling_reason.toLowerCase().includes(q)}
        searchPlaceholder="Search name, reference, phone or reason"
        onRowClick={(r) => setOpen(r.id)}
        selectable={can("counsellees:write")}
        selected={selected}
        onSelectedChange={setSelected}
        initialSort={{ key: "urgency", dir: "asc" }}
        toolbar={
          <>
            <FilterSelect label="Urgency" value={urgency} onChange={setUrgency} options={[{ value: "high", label: "High" }, { value: "medium", label: "Medium" }, { value: "low", label: "Low" }]} />
            <FilterSelect label="Topic" value={topic} onChange={setTopic} options={COUNSELLING_TOPICS.map((t) => ({ value: t, label: t }))} />
          </>
        }
        bulkBar={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Assign
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-72 overflow-y-auto">
              {team.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onSelect={async () => {
                    await api.counsellees.update([...selected], { assigned_to: s.id, status: "assigned" }, user!.name);
                    await invalidate();
                    toast.success(`Assigned ${fmtNum(selected.size)} to ${s.name}`);
                    setSelected(new Set());
                  }}
                >
                  {s.name} <span className="ml-auto pl-3 text-xs text-muted-foreground">{s.specialties[0]}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <PersonSheet person={open} onClose={() => setOpen(null)} />
    </>
  );
}
