import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Download, Lock, Pencil, Plus, RotateCcw, Send, Wallet, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { BarList } from "@/components/charts/Charts";
import { DataTable, FilterSelect, type Column } from "@/components/portal/DataTable";
import { Meter, PageHeader, Panel, StatCard } from "@/components/portal/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROVIDERS } from "@/config/providers";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useBatches, useInvalidate, useNotifSummary, useTemplates } from "@/hooks/queries";
import { exportRows } from "@/lib/export";
import { fmtDateTime, fmtNaira, fmtNum, fmtPct } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BatchStatus, Channel, MessageTemplate, NotificationBatch } from "@/types";
import { Composer } from "./notifications/Composer";
import { BATCH_EXPORT_COLUMNS } from "./exportColumns";
import { CHANNEL_META } from "./notifications/channelMeta";


const STATUS_META: Record<BatchStatus, { label: string; cls: string; icon: typeof Clock }> = {
  sent: { label: "Delivered", cls: "text-[#006300] dark:text-status-good bg-status-good/10 border-status-good/30", icon: CheckCircle2 },
  partial: { label: "Partial", cls: "text-amber-700 dark:text-status-warning bg-status-warning/10 border-status-warning/40", icon: XCircle },
  failed: { label: "Failed", cls: "text-status-critical bg-status-critical/10 border-status-critical/40", icon: XCircle },
  scheduled: { label: "Scheduled", cls: "text-sky-700 dark:text-sky-300 bg-sky-500/10 border-sky-500/30", icon: Clock },
  queued: { label: "Queued", cls: "text-muted-foreground bg-muted border-border", icon: Clock },
  sending: { label: "Sending", cls: "text-muted-foreground bg-muted border-border", icon: Clock },
};

export function BatchStatusPill({ status }: { status: BatchStatus }) {
  const m = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", m.cls)}>
      <m.icon className="h-3 w-3" /> {m.label}
    </span>
  );
}

export default function Notifications() {
  const { can } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "history";
  const setTab = (t: string) => setParams({ tab: t }, { replace: true });

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Reach converts, counsellees and the team by WhatsApp, SMS and email — and see exactly what landed."
        actions={
          can("notifications:send") ? (
            <Button size="sm" onClick={() => setTab("compose")}>
              <Send className="mr-1.5 h-4 w-4" /> New message
            </Button>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Sending is limited to super admins
            </span>
          )
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="history">History</TabsTrigger>
          {can("notifications:send") && <TabsTrigger value="compose">Compose</TabsTrigger>}
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <History />
        </TabsContent>
        {can("notifications:send") && (
          <TabsContent value="compose">
            <Composer onSent={() => setTab("history")} />
          </TabsContent>
        )}
        <TabsContent value="templates">
          <Templates />
        </TabsContent>
        <TabsContent value="providers">
          <Providers />
        </TabsContent>
      </Tabs>
    </>
  );
}

function History() {
  const { year } = useEdition();
  const { user, can } = useAuth();
  const [scope, setScope] = useState<"edition" | "all">("edition");
  const target = scope === "edition" ? year : undefined;
  const batches = useBatches(target);
  const summary = useNotifSummary(target);
  const [channel, setChannel] = useState<Channel | "all">("all");
  const [status, setStatus] = useState<BatchStatus | "all">("all");
  const [open, setOpen] = useState<NotificationBatch | null>(null);
  const s = summary.data;

  const rows = useMemo(() => (batches.data ?? []).filter((b) => (channel === "all" || b.channel === channel) && (status === "all" || b.status === status)), [batches.data, channel, status]);

  const columns: Column<NotificationBatch>[] = [
    {
      key: "message",
      header: "Message",
      cell: (b) => {
        const M = CHANNEL_META[b.channel];
        return (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `color-mix(in oklab, ${M.color} 16%, transparent)`, color: M.color }}>
              <M.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 max-w-[320px]">
              <p className="truncate font-semibold">{b.subject ?? b.message.split("\n")[0]}</p>
              <p className="truncate text-xs text-muted-foreground">
                {b.audience_label} · {b.provider}
              </p>
            </div>
          </div>
        );
      },
    },
    { key: "status", header: "Status", sort: (b) => b.status, cell: (b) => <BatchStatusPill status={b.status} /> },
    {
      key: "delivery",
      header: "Delivered",
      sort: (b) => (b.total ? b.delivered / b.total : 0),
      cell: (b) =>
        b.status === "scheduled" ? (
          <span className="text-xs text-muted-foreground">{fmtDateTime(b.scheduled_for)}</span>
        ) : (
          <div className="w-32">
            <div className="tabular mb-1 flex justify-between text-xs">
              <span className="font-semibold">{fmtPct(b.total ? b.delivered / b.total : 0)}</span>
              <span className="text-muted-foreground">
                {fmtNum(b.delivered)}/{fmtNum(b.total)}
              </span>
            </div>
            <Meter value={b.delivered} max={b.total} tone={b.delivered / Math.max(1, b.total) < 0.9 ? "bad" : "good"} />
          </div>
        ),
    },
    { key: "cost", header: "Cost", hide: "lg", sort: (b) => b.cost_ngn, cell: (b) => <span className="tabular">{fmtNaira(b.cost_ngn)}</span> },
    { key: "by", header: "Sent by", hide: "xl", cell: (b) => <span className="text-muted-foreground">{b.created_by}</span> },
    { key: "at", header: "Date", sort: (b) => b.created_at, hide: "md", cell: (b) => <span className="whitespace-nowrap text-muted-foreground">{fmtDateTime(b.created_at)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex rounded-lg border p-0.5 text-xs font-semibold sm:w-fit">
        {(
          [
            ["edition", `YMR ${year}`],
            ["all", "All editions"],
          ] as const
        ).map(([v, l]) => (
          <button key={v} onClick={() => setScope(v)} className={cn("flex-1 whitespace-nowrap rounded-md px-3 py-1.5", scope === v ? "bg-accent" : "text-muted-foreground")}>
            {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {!s ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-2xl" />)
        ) : (
          <>
            <StatCard label="Messages sent" value={fmtNum(s.messages)} icon={Send} accent hint={`${fmtNum(s.batches)} campaigns`} />
            <StatCard label="Delivery rate" value={fmtPct(s.deliveryRate, 1)} icon={CheckCircle2} hint={`${fmtNum(s.delivered)} delivered`} />
            <StatCard label="Failed" value={fmtNum(s.failed)} icon={XCircle} hint={s.reasons[0] ? `Top reason: ${s.reasons[0].label}` : "None"} />
            <StatCard label="Spend" value={fmtNaira(s.cost)} icon={Wallet} hint="estimated provider cost" />
          </>
        )}
      </div>

      {s && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Panel title="By channel" description="Delivery success per channel">
            <div className="grid gap-4 sm:grid-cols-3">
              {s.byChannel.map((c) => {
                const M = CHANNEL_META[c.channel as Channel];
                return (
                  <div key={c.channel} className="rounded-xl border p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <M.icon className="h-4 w-4" style={{ color: M.color }} /> {M.label}
                    </div>
                    <p className="tabular mt-3 text-2xl font-bold">{c.total ? fmtPct(c.rate, 1) : "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {fmtNum(c.delivered)} of {fmtNum(c.total)} delivered
                    </p>
                    <Meter value={c.delivered} max={c.total || 1} className="mt-3" tone={c.rate < 0.9 ? "bad" : "good"} />
                    <p className="tabular mt-3 text-xs text-muted-foreground">{fmtNaira(c.cost)} spent</p>
                  </div>
                );
              })}
            </div>
          </Panel>
          <Panel title="Why messages failed">{s.reasons.length ? <BarList data={s.reasons} color="var(--series-8)" max={6} /> : <p className="text-sm text-muted-foreground">No failures. 🎉</p>}</Panel>
        </div>
      )}

      <DataTable
        rows={rows}
        columns={columns}
        loading={batches.isLoading}
        onRowClick={setOpen}
        search={(b, q) => b.message.toLowerCase().includes(q) || b.audience_label.toLowerCase().includes(q) || (b.subject ?? "").toLowerCase().includes(q)}
        searchPlaceholder="Search messages"
        initialSort={{ key: "at", dir: "desc" }}
        toolbar={
          <>
            <FilterSelect label="Channel" value={channel} onChange={setChannel} options={(Object.keys(CHANNEL_META) as Channel[]).map((c) => ({ value: c, label: CHANNEL_META[c].label }))} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={(["sent", "partial", "failed", "scheduled"] as BatchStatus[]).map((x) => ({ value: x, label: STATUS_META[x].label }))} />
            {can("exports:use") && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await exportRows(rows, BATCH_EXPORT_COLUMNS, "csv", "ymr-notification-history");
                  await api.exports.log({ by: user!.name, dataset: "notifications", editions: target ? [target] : [], format: "csv", rows: rows.length });
                }}
              >
                <Download className="mr-1.5 h-4 w-4" /> CSV
              </Button>
            )}
          </>
        }
      />
      <BatchSheet batch={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function BatchSheet({ batch, onClose }: { batch: NotificationBatch | null; onClose: () => void }) {
  const { user, can } = useAuth();
  const invalidate = useInvalidate();
  const [filter, setFilter] = useState<"all" | "failed">("all");
  const [retrying, setRetrying] = useState(false);
  const recipients = useQuery({ queryKey: ["recipients", batch?.id, batch?.failed], queryFn: () => api.notifications.recipients(batch!), enabled: !!batch });
  const list = (recipients.data ?? []).filter((r) => filter === "all" || r.status === "failed");
  const M = batch ? CHANNEL_META[batch.channel] : null;

  return (
    <Sheet open={!!batch} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        {batch && M && (
          <div className="space-y-6">
            <SheetHeader className="text-left">
              <SheetDescription className="flex items-center gap-2">
                <M.icon className="h-4 w-4" style={{ color: M.color }} /> {M.label} via {batch.provider} · {fmtDateTime(batch.created_at)}
              </SheetDescription>
              <SheetTitle className="font-display text-xl">{batch.subject ?? batch.audience_label}</SheetTitle>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <BatchStatusPill status={batch.status} />
                <span className="text-xs text-muted-foreground">
                  {batch.audience_label} · by {batch.created_by}
                </span>
              </div>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Delivered", batch.delivered, "text-[#006300] dark:text-status-good"],
                ["Failed", batch.failed, "text-status-critical"],
                [batch.opened !== null ? "Opened / read" : "Pending", batch.opened ?? batch.pending, ""],
              ].map(([l, v, c]) => (
                <div key={String(l)} className="rounded-xl border p-3">
                  <p className={cn("tabular text-xl font-bold", String(c))}>{fmtNum(Number(v))}</p>
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
            <div className="whitespace-pre-wrap rounded-xl border bg-muted/40 p-4 text-sm">{batch.message}</div>
            {Object.keys(batch.failure_reasons).length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Failure reasons</p>
                  {can("notifications:send") && batch.failed > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={retrying}
                      onClick={async () => {
                        setRetrying(true);
                        try {
                          const r = await api.notifications.retryFailed(batch.id, user!.name);
                          await invalidate();
                          toast.success(`Retried — ${fmtNum(r.recovered)} recovered`);
                          onClose();
                        } finally {
                          setRetrying(false);
                        }
                      }}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retry failed
                    </Button>
                  )}
                </div>
                <BarList data={Object.entries(batch.failure_reasons).map(([label, value]) => ({ label, value }))} color="var(--series-8)" />
              </div>
            )}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recipients</p>
                <div className="flex rounded-lg border p-0.5 text-xs">
                  {(["all", "failed"] as const).map((f) => (
                    <button key={f} onClick={() => setFilter(f)} className={cn("rounded-md px-2.5 py-1 capitalize", filter === f ? "bg-accent font-semibold" : "text-muted-foreground")}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <ul className="divide-y rounded-xl border">
                {recipients.isLoading ? (
                  <li className="p-4">
                    <Skeleton className="h-6" />
                  </li>
                ) : (
                  list.slice(0, 80).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{r.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">{r.error ?? r.address}</span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                          r.status === "failed" ? "bg-status-critical/10 text-status-critical" : r.status === "pending" ? "bg-muted text-muted-foreground" : "bg-status-good/10 text-[#006300] dark:text-status-good",
                        )}
                      >
                        {r.status}
                      </span>
                    </li>
                  ))
                )}
              </ul>
              {list.length > 80 && <p className="mt-2 text-center text-xs text-muted-foreground">Showing 80 of {fmtNum(list.length)}</p>}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Templates() {
  const { can, user } = useAuth();
  const { data = [], isLoading } = useTemplates();
  const invalidate = useInvalidate();
  const [edit, setEdit] = useState<MessageTemplate | null>(null);
  const editable = can("templates:write");

  return (
    <>
      <div className="mb-4 flex justify-end">
        {editable && (
          <Button size="sm" onClick={() => setEdit({ id: `tpl_${Date.now()}`, name: "", channel: "sms", subject: null, body: "", category: "follow-up", updated_at: "" })}>
            <Plus className="mr-1.5 h-4 w-4" /> New template
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)
          : data.map((t) => {
              const M = CHANNEL_META[t.channel];
              return (
                <article key={t.id} className="panel flex flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: M.color }}>
                      <M.icon className="h-3.5 w-3.5" /> {M.label}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize text-muted-foreground">{t.category}</span>
                  </div>
                  <h3 className="mt-3 font-semibold">{t.name}</h3>
                  {t.subject && <p className="mt-1 text-xs text-muted-foreground">Subject: {t.subject}</p>}
                  <p className="mt-2 line-clamp-4 flex-1 whitespace-pre-wrap text-sm text-muted-foreground">{t.body}</p>
                  {editable && (
                    <Button size="sm" variant="ghost" className="mt-3 self-start" onClick={() => setEdit(t)}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
                  )}
                </article>
              );
            })}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{edit?.updated_at ? "Edit template" : "New template"}</DialogTitle>
          </DialogHeader>
          {edit && (
            <div className="space-y-3">
              <input className="h-10 w-full rounded-lg border bg-background px-3 text-sm" placeholder="Template name" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <select className="h-10 rounded-lg border bg-background px-3 text-sm" value={edit.channel} onChange={(e) => setEdit({ ...edit, channel: e.target.value as Channel, subject: e.target.value === "email" ? edit.subject ?? "" : null })}>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
                <select className="h-10 rounded-lg border bg-background px-3 text-sm" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as MessageTemplate["category"] })}>
                  {["welcome", "follow-up", "reminder", "event", "devotional"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              {edit.channel === "email" && <input className="h-10 w-full rounded-lg border bg-background px-3 text-sm" placeholder="Subject" value={edit.subject ?? ""} onChange={(e) => setEdit({ ...edit, subject: e.target.value })} />}
              <textarea className="h-40 w-full rounded-lg border bg-background p-3 text-sm" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} placeholder="Use {{first_name}}, {{edition_year}}, {{edition_theme}}, {{reference}}" />
            </div>
          )}
          <DialogFooter>
            <Button
              disabled={!edit?.name || !edit.body}
              onClick={async () => {
                await api.notifications.saveTemplate(edit!, user!.name);
                await invalidate();
                toast.success("Template saved");
                setEdit(null);
              }}
            >
              Save template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Providers() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        {(["whatsapp", "sms", "email"] as Channel[]).map((ch) => {
          const M = CHANNEL_META[ch];
          const p = PROVIDERS.find((x) => x.channel === ch && x.recommended)!;
          return (
            <Panel key={ch} title={<span className="flex items-center gap-2"><M.icon className="h-4 w-4" style={{ color: M.color }} /> {M.label}</span>} actions={<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006300] dark:text-status-good"><span className="h-2 w-2 rounded-full bg-status-good" /> Active</span>}>
              <p className="font-semibold">{p.name}</p>
              <p className="tabular mt-1 text-2xl font-bold">
                {fmtNaira(p.unitCostNgn)}
                <span className="text-sm font-normal text-muted-foreground"> / message</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{p.note}</p>
            </Panel>
          );
        })}
      </div>
      <Panel title="Cost to reach 1,000 people" description="Indicative rates, November 2026 — confirm with each provider before budgeting">
        <div className="scrollbar-thin overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2">Provider</th>
                <th className="py-2">Channel</th>
                <th className="py-2 text-right">Per message</th>
                <th className="py-2 text-right">Per 1,000</th>
                <th className="hidden py-2 pl-6 md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {PROVIDERS.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">
                    {p.name}
                    {p.recommended && <span className="ml-2 rounded bg-ember/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ember-text">Recommended</span>}
                  </td>
                  <td className="py-3">{CHANNEL_META[p.channel].label}</td>
                  <td className="tabular py-3 text-right">{fmtNaira(p.unitCostNgn)}</td>
                  <td className="tabular py-3 text-right font-semibold">{fmtNaira(p.unitCostNgn * 1000)}</td>
                  <td className="hidden max-w-md py-3 pl-6 text-xs text-muted-foreground md:table-cell">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
