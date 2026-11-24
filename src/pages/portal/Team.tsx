import { useMemo, useState } from "react";
import { Award, Download, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { ROLE_LABEL } from "@/auth/permissions";
import { Avatar, PageHeader } from "@/components/portal/kit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useConverts, useCounsellees, useStaff } from "@/hooks/queries";
import { exportRows } from "@/lib/export";
import { fmtAgo, fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import { STAFF_EXPORT_COLUMNS } from "./exportColumns";

export default function Team() {
  const { year } = useEdition();
  const { user, can } = useAuth();
  const staff = useStaff();
  const converts = useConverts();
  const counsellees = useCounsellees();
  const [q, setQ] = useState("");
  const [onlyThisYear, setOnlyThisYear] = useState(true);

  const load = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of converts.data ?? []) if (c.assigned_to && (c.follow_up_status === "new" || c.follow_up_status === "contacted")) m.set(c.assigned_to, (m.get(c.assigned_to) ?? 0) + 1);
    for (const c of counsellees.data ?? []) if (c.assigned_to && c.status !== "resolved") m.set(c.assigned_to, (m.get(c.assigned_to) ?? 0) + 1);
    return m;
  }, [converts.data, counsellees.data]);

  const list = (staff.data ?? [])
    .filter((s) => s.status === "active" && (!onlyThisYear || s.editions.includes(year)))
    .filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.specialties.join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader
        eyebrow={`YMR ${year}`}
        title="Counselling team"
        description="Who's serving, what they're good at, and how full their hands are."
        actions={
          can("exports:use") && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await exportRows(list, STAFF_EXPORT_COLUMNS, "xlsx", `ymr-${year}-counselling-team`);
                await api.exports.log({ by: user!.name, dataset: "counsellors", editions: [year], format: "xlsx", rows: list.length });
                toast.success(`Exported ${fmtNum(list.length)} team members`);
              }}
            >
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
          )
        }
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or specialty" className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:border-ember/60" />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="h-4 w-4 accent-[#f68b1e]" checked={onlyThisYear} onChange={(e) => setOnlyThisYear(e.target.checked)} />
          Only serving in {year}
        </label>
        <p className="tabular text-sm text-muted-foreground sm:ml-auto">{fmtNum(list.length)} counsellors</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {staff.isLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
          : list.map((s) => {
              const open = load.get(s.id) ?? 0;
              return (
                <article key={s.id} className="panel group p-5 transition hover:border-ember/40">
                  <div className="flex items-start gap-3">
                    <Avatar name={s.name} className="h-12 w-12 text-sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {ROLE_LABEL[s.role]} · {s.years_of_experience}y experience
                      </p>
                    </div>
                    {s.has_certification && (
                      <span title="Certified counsellor" className="rounded-full bg-gold/15 p-1.5 text-ember-text">
                        <Award className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.specialties.map((sp) => (
                      <span key={sp} className="rounded-full bg-muted px-2.5 py-0.5 text-[11px]">
                        {sp}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {s.state ?? "—"}
                    </span>
                    <span className={cn("tabular font-semibold", open > 25 ? "text-status-critical" : "text-foreground")}>{open} open cases</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Served: {s.editions.join(", ")}</span>
                    <span>{s.last_active_at ? `Active ${fmtAgo(s.last_active_at)}` : "Never signed in"}</span>
                  </div>
                </article>
              );
            })}
      </div>
    </>
  );
}
