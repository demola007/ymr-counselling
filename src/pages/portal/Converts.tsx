import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download, KanbanSquare, List, Plus, Trash2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { DataTable, FilterSelect, type Column } from "@/components/portal/DataTable";
import { Avatar, FOLLOW_UP_META, PageHeader, StatusPill } from "@/components/portal/kit";
import { PersonSheet } from "@/components/portal/PersonSheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NIGERIAN_STATES } from "@/config/site";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useConverts, useInvalidate, useStaff } from "@/hooks/queries";
import { exportRows, type ExportFormat } from "@/lib/export";
import { fmtAgo, fmtDate, fmtNum, fmtPhone } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Convert, FollowUpStatus } from "@/types";
import { CONVERT_EXPORT_COLUMNS } from "./exportColumns";

const STATUSES = Object.keys(FOLLOW_UP_META) as FollowUpStatus[];

export default function Converts() {
  const { user, can } = useAuth();
  const { year } = useEdition();
  const { data = [], isLoading } = useConverts();
  const staff = useStaff();
  const invalidate = useInvalidate();
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<"table" | "board">("table");
  const [status, setStatus] = useState<FollowUpStatus | "all">((params.get("status") as FollowUpStatus) ?? "all");
  const [state, setState] = useState<string | "all">("all");
  const [owner, setOwner] = useState<"all" | "mine" | "unassigned">("all");
  const [mode, setMode] = useState<"all" | "online" | "onsite">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const staffName = useMemo(() => new Map((staff.data ?? []).map((s) => [s.id, s.name])), [staff.data]);
  const team = (staff.data ?? []).filter((s) => s.status === "active" && s.editions.includes(year));

  const rows = useMemo(
    () =>
      data.filter(
        (c) =>
          (status === "all" || c.follow_up_status === status) &&
          (state === "all" || c.state === state) &&
          (owner === "all" || (owner === "mine" ? c.assigned_to === user?.id : !c.assigned_to)) &&
          (mode === "all" || (mode === "online") === c.online),
      ),
    [data, status, state, owner, mode, user?.id],
  );

  const openId = params.get("open");
  const open = openId ? data.find((c) => c.id === openId) ?? null : null;
  const setOpen = (id: string | null) => {
    const p = new URLSearchParams(params);
    if (id) p.set("open", id);
    else p.delete("open");
    setParams(p, { replace: true });
  };

  const bulk = async (patch: Partial<Convert>, label: string) => {
    await api.converts.update([...selected], patch, user!.name);
    await invalidate();
    toast.success(`${label} · ${fmtNum(selected.size)} converts`);
    setSelected(new Set());
  };

  const doExport = async (fmt: ExportFormat, only?: boolean) => {
    const list = only ? rows.filter((r) => selected.has(r.id)) : rows;
    const name = await exportRows(list, CONVERT_EXPORT_COLUMNS(staffName), fmt, `ymr-${year}-converts`);
    await api.exports.log({ by: user!.name, dataset: "converts", editions: [year], format: fmt, rows: list.length });
    toast.success(`Exported ${fmtNum(list.length)} rows`, { description: name });
  };

  const columns: Column<Convert>[] = [
    {
      key: "name",
      header: "Name",
      sort: (r) => r.name,
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{fmtPhone(r.phone_number)}</p>
          </div>
        </div>
      ),
    },
    { key: "status", header: "Follow-up", sort: (r) => STATUSES.indexOf(r.follow_up_status), cell: (r) => <StatusPill meta={FOLLOW_UP_META[r.follow_up_status]} /> },
    { key: "state", header: "Location", sort: (r) => r.state, hide: "md", cell: (r) => <span className="text-muted-foreground">{[r.state, r.country !== "Nigeria" ? r.country : null].filter(Boolean).join(", ") || "—"}</span> },
    { key: "age", header: "Age", sort: (r) => r.age_group, hide: "lg", cell: (r) => <span className="text-muted-foreground">{r.age_group ?? "—"}</span> },
    { key: "assigned", header: "Counsellor", sort: (r) => staffName.get(r.assigned_to ?? "") ?? "", hide: "lg", cell: (r) => (r.assigned_to ? staffName.get(r.assigned_to) : <span className="text-muted-foreground">Unassigned</span>) },
    { key: "mode", header: "Where", hide: "xl", cell: (r) => <span className="text-xs text-muted-foreground">{r.online ? "Online" : "Onsite"}</span> },
    { key: "created", header: "Captured", sort: (r) => r.created_at, hide: "sm", cell: (r) => <span className="whitespace-nowrap text-muted-foreground" title={fmtDate(r.created_at)}>{fmtAgo(r.created_at)}</span> },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`YMR ${year}`}
        title="Converts"
        description="Everyone who gave their life to Christ — track each one from altar call to church family."
        actions={
          <>
            <div className="flex rounded-lg border p-0.5">
              {(
                [
                  ["table", List, "Table"],
                  ["board", KanbanSquare, "Pipeline"],
                ] as const
              ).map(([v, Icon, label]) => (
                <button key={v} onClick={() => setView(v)} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold", view === v ? "bg-accent text-foreground" : "text-muted-foreground")} aria-pressed={view === v}>
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
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
                  <DropdownMenuItem onSelect={() => doExport("json")}>JSON</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {can("capture:use") && (
              <Button size="sm" asChild>
                <Link to="/portal/capture">
                  <Plus className="mr-1.5 h-4 w-4" /> Add converts
                </Link>
              </Button>
            )}
          </>
        }
      />

      {/* status summary chips */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setStatus("all")} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold", status === "all" ? "border-ember bg-ember/10" : "text-muted-foreground")}>
          All <span className="tabular ml-1 opacity-70">{fmtNum(data.length)}</span>
        </button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={cn("flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold", status === s ? "border-ember bg-ember/10" : "text-muted-foreground")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", FOLLOW_UP_META[s].dot)} />
            {FOLLOW_UP_META[s].label} <span className="tabular opacity-70">{fmtNum(data.filter((c) => c.follow_up_status === s).length)}</span>
          </button>
        ))}
      </div>

      {view === "table" ? (
        <DataTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          search={(r, q) => r.name.toLowerCase().includes(q) || !!r.phone_number?.includes(q) || !!r.email?.includes(q)}
          searchPlaceholder="Search name, phone or email"
          onRowClick={(r) => setOpen(r.id)}
          selectable={can("converts:write") || can("exports:use")}
          selected={selected}
          onSelectedChange={setSelected}
          initialSort={{ key: "created", dir: "desc" }}
          toolbar={
            <>
              <FilterSelect label="State" value={state} onChange={setState} options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))} />
              <FilterSelect label="Owner" value={owner} onChange={setOwner} options={[{ value: "mine", label: "Assigned to me" }, { value: "unassigned", label: "Unassigned" }]} />
              <FilterSelect label="Where" value={mode} onChange={setMode} options={[{ value: "onsite", label: "Onsite" }, { value: "online", label: "Online" }]} />
            </>
          }
          bulkBar={
            <>
              {can("converts:write") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Assign
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="max-h-72 overflow-y-auto">
                    {team.map((s) => (
                      <DropdownMenuItem key={s.id} onSelect={() => bulk({ assigned_to: s.id }, `Assigned to ${s.name}`)}>
                        {s.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {can("converts:write") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      Set status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {STATUSES.map((s) => (
                      <DropdownMenuItem key={s} onSelect={() => bulk({ follow_up_status: s }, `Marked ${FOLLOW_UP_META[s].label}`)}>
                        {FOLLOW_UP_META[s].label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {can("exports:use") && (
                <Button size="sm" variant="outline" onClick={() => doExport("xlsx", true)}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Export
                </Button>
              )}
              {can("records:delete") && (
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => setConfirmDelete(true)}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              )}
            </>
          }
        />
      ) : (
        <Board rows={rows} staffName={staffName} onOpen={setOpen} canWrite={can("converts:write")} onMove={async (id, s) => {
          await api.converts.update([id], { follow_up_status: s }, user!.name);
          await invalidate();
        }} />
      )}

      <PersonSheet person={open} onClose={() => setOpen(null)} />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {fmtNum(selected.size)} converts?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes their records and follow-up history. This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                await api.converts.remove([...selected], user!.name);
                await invalidate();
                toast.success(`Deleted ${fmtNum(selected.size)} records`);
                setSelected(new Set());
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Board({ rows, staffName, onOpen, onMove, canWrite }: { rows: Convert[]; staffName: Map<string, string>; onOpen: (id: string) => void; onMove: (id: string, s: FollowUpStatus) => Promise<void>; canWrite: boolean }) {
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<FollowUpStatus | null>(null);
  return (
    <div className="scrollbar-thin -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
      {STATUSES.map((s) => {
        const list = rows.filter((r) => r.follow_up_status === s);
        return (
          <section
            key={s}
            onDragOver={(e) => {
              if (!canWrite) return;
              e.preventDefault();
              setOver(s);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={async () => {
              setOver(null);
              if (drag) await onMove(drag, s);
              setDrag(null);
            }}
            className={cn("panel flex w-[290px] shrink-0 flex-col transition", over === s && "border-ember ring-2 ring-ember/20")}
            aria-label={FOLLOW_UP_META[s].label}
          >
            <header className="flex items-center justify-between border-b px-4 py-3">
              <StatusPill meta={FOLLOW_UP_META[s]} />
              <span className="tabular text-xs font-semibold text-muted-foreground">{fmtNum(list.length)}</span>
            </header>
            <ul className="scrollbar-thin max-h-[62vh] space-y-2 overflow-y-auto p-3">
              {list.slice(0, 60).map((c) => (
                <li
                  key={c.id}
                  draggable={canWrite}
                  onDragStart={() => setDrag(c.id)}
                  onClick={() => onOpen(c.id)}
                  className={cn("cursor-pointer rounded-xl border bg-background p-3 transition hover:border-ember/40", drag === c.id && "opacity-50")}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} className="h-7 w-7 text-[10px]" />
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {[c.state, c.age_group].filter(Boolean).join(" · ")}
                    {c.assigned_to && <span className="block truncate">→ {staffName.get(c.assigned_to)}</span>}
                  </p>
                </li>
              ))}
              {list.length > 60 && <li className="py-2 text-center text-xs text-muted-foreground">+{fmtNum(list.length - 60)} more — use filters to narrow</li>}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

