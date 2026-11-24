import { useMemo, useState } from "react";
import { CalendarClock, Check, Send, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { COUNSELLEE_META, FOLLOW_UP_META, Panel } from "@/components/portal/kit";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { defaultProvider, smsPages } from "@/config/providers";
import { NIGERIAN_STATES } from "@/config/site";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useConverts, useCounsellees, useInvalidate, useStaff, useTemplates } from "@/hooks/queries";
import { firstName, fmtNaira, fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Audience, Channel, CounselleeStatus, FollowUpStatus } from "@/types";
import { CHANNEL_META } from "./channelMeta";

const VARS = ["first_name", "edition_year", "edition_theme", "reference", "session_time"] as const;

export function Composer({ onSent }: { onSent: () => void }) {
  const { user } = useAuth();
  const { year, edition } = useEdition();
  const converts = useConverts();
  const counsellees = useCounsellees();
  const staff = useStaff();
  const templates = useTemplates();
  const invalidate = useInvalidate();

  const [audience, setAudience] = useState<Audience>("converts");
  const [fuStatus, setFuStatus] = useState<FollowUpStatus[]>([]);
  const [csStatus, setCsStatus] = useState<CounselleeStatus[]>([]);
  const [state, setState] = useState("all");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [when, setWhen] = useState<"now" | "later">("now");
  const [at, setAt] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const people = useMemo(() => {
    if (audience === "converts")
      return (converts.data ?? []).filter((c) => (fuStatus.length === 0 || fuStatus.includes(c.follow_up_status)) && (state === "all" || c.state === state) && c.availability_for_follow_up);
    if (audience === "counsellees") return (counsellees.data ?? []).filter((c) => (csStatus.length === 0 || csStatus.includes(c.status)) && (state === "all" || c.state === state));
    return (staff.data ?? []).filter((s) => s.status === "active" && s.editions.includes(year));
  }, [audience, converts.data, counsellees.data, staff.data, fuStatus, csStatus, state, year]);

  const reachable = (ch: Channel) => people.filter((p) => (ch === "email" ? !!p.email : !!p.phone_number)).length;
  const recipients = people
    .filter((p) => (channel === "email" ? !!p.email : !!p.phone_number))
    .map((p) => ({ id: p.id, name: p.name, address: (channel === "email" ? p.email : p.phone_number) ?? "" }));

  const provider = defaultProvider(channel);
  const pages = channel === "sms" ? smsPages(message) : null;
  const cost = recipients.length * provider.unitCostNgn * (pages?.pages || 1);

  const sample = people[0];
  const render = (text: string) =>
    text
      .replace(/{{\s*first_name\s*}}/g, sample ? firstName(sample.name) : "Adaeze")
      .replace(/{{\s*edition_year\s*}}/g, String(year))
      .replace(/{{\s*edition_theme\s*}}/g, edition.theme)
      .replace(/{{\s*reference\s*}}/g, sample && "reference" in sample ? sample.reference : "26CT-7K2P")
      .replace(/{{\s*session_time\s*}}/g, "Sat 27 Dec, 2:00pm");

  const pickTemplate = (id: string) => {
    const t = templates.data?.find((x) => x.id === id);
    if (!t) return;
    setTemplateId(id);
    setChannel(t.channel);
    setMessage(t.body);
    setSubject(t.subject ?? "");
  };

  const audienceLabel =
    audience === "converts"
      ? `Converts${fuStatus.length ? ` · ${fuStatus.map((s) => FOLLOW_UP_META[s].label).join(", ")}` : ""}${state !== "all" ? ` · ${state}` : ""}`
      : audience === "counsellees"
        ? `Counsellees${csStatus.length ? ` · ${csStatus.map((s) => COUNSELLEE_META[s].label).join(", ")}` : ""}${state !== "all" ? ` · ${state}` : ""}`
        : "Counselling team";

  const canSend = recipients.length > 0 && message.trim().length > 0 && (channel !== "email" || subject.trim()) && (when === "now" || at);

  const send = async () => {
    setBusy(true);
    try {
      const b = await api.notifications.send(
        { channel, audience, audienceLabel, recipients, subject: channel === "email" ? subject : null, message, templateId, scheduledFor: when === "later" ? new Date(at).toISOString() : null, edition: year },
        user!.name,
      );
      await invalidate();
      toast.success(b.status === "scheduled" ? `Scheduled for ${fmtNum(b.total)} people` : `Sent to ${fmtNum(b.delivered)} of ${fmtNum(b.total)}`, {
        description: b.failed ? `${fmtNum(b.failed)} failed — see History for reasons` : undefined,
      });
      onSent();
    } finally {
      setBusy(false);
    }
  };

  const Toggle = <T extends string>({ value, list, set, meta }: { value: T; list: T[]; set: (v: T[]) => void; meta: { label: string; dot: string } }) => {
    const on = list.includes(value);
    return (
      <button
        type="button"
        onClick={() => set(on ? list.filter((x) => x !== value) : [...list, value])}
        className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold", on ? "border-ember bg-ember/10" : "text-muted-foreground")}
        aria-pressed={on}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} /> {meta.label}
      </button>
    );
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        <Panel title="1 · Who should get it?" description={`From YMR ${year} · ${edition.theme}`}>
          <div className="grid gap-2 sm:grid-cols-3">
            {(
              [
                ["converts", "Converts", converts.data?.length],
                ["counsellees", "Counsellees", counsellees.data?.length],
                ["counsellors", "Counselling team", (staff.data ?? []).filter((s) => s.status === "active" && s.editions.includes(year)).length],
              ] as const
            ).map(([k, l, n]) => (
              <button key={k} onClick={() => setAudience(k)} className={cn("rounded-xl border p-3 text-left transition", audience === k ? "border-ember bg-ember/10 ring-1 ring-ember/30" : "hover:border-ember/40")}>
                <p className="text-sm font-semibold">{l}</p>
                <p className="tabular text-xs text-muted-foreground">{fmtNum(n ?? 0)} people</p>
              </button>
            ))}
          </div>
          {audience !== "counsellors" && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {audience === "converts"
                  ? (Object.keys(FOLLOW_UP_META) as FollowUpStatus[]).filter((s) => s !== "unreachable").map((s) => <Toggle key={s} value={s} list={fuStatus} set={setFuStatus} meta={FOLLOW_UP_META[s]} />)
                  : (Object.keys(COUNSELLEE_META) as CounselleeStatus[]).map((s) => <Toggle key={s} value={s} list={csStatus} set={setCsStatus} meta={COUNSELLEE_META[s]} />)}
              </div>
              <select value={state} onChange={(e) => setState(e.target.value)} className="h-9 rounded-lg border bg-background px-2.5 text-sm" aria-label="State">
                <option value="all">All states</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {audience === "converts" && <p className="text-xs text-muted-foreground">Converts who opted out of follow-up are always excluded.</p>}
            </div>
          )}
        </Panel>

        <Panel title="2 · Channel">
          <div className="grid gap-2 sm:grid-cols-3">
            {(["whatsapp", "sms", "email"] as Channel[]).map((ch) => {
              const M = CHANNEL_META[ch];
              const p = defaultProvider(ch);
              return (
                <button key={ch} onClick={() => setChannel(ch)} className={cn("rounded-xl border p-3 text-left transition", channel === ch ? "border-ember bg-ember/10 ring-1 ring-ember/30" : "hover:border-ember/40")}>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <M.icon className="h-4 w-4" style={{ color: M.color }} /> {M.label}
                  </p>
                  <p className="tabular mt-1 text-xs text-muted-foreground">
                    {fmtNum(reachable(ch))} reachable · {fmtNaira(p.unitCostNgn)}/msg
                  </p>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="3 · Message">
          <div className="space-y-3">
            <select value={templateId ?? ""} onChange={(e) => pickTemplate(e.target.value)} className="h-10 w-full rounded-lg border bg-background px-3 text-sm" aria-label="Start from a template">
              <option value="">Start from a template…</option>
              {(templates.data ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {CHANNEL_META[t.channel].label} · {t.name}
                </option>
              ))}
            </select>
            {channel === "email" && <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="h-10 w-full rounded-lg border bg-background px-3 text-sm" />}
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message…" className="h-44 w-full rounded-lg border bg-background p-3 text-sm leading-relaxed outline-none focus:border-ember/60" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Insert:</span>
              {VARS.map((v) => (
                <button key={v} type="button" onClick={() => setMessage((m) => `${m}{{${v}}}`)} className="rounded-md border bg-muted px-2 py-0.5 font-mono text-[11px] hover:border-ember/50">
                  {`{{${v}}}`}
                </button>
              ))}
              {pages && (
                <span className={cn("tabular ml-auto text-xs", pages.pages > 2 ? "text-amber-600 dark:text-status-warning" : "text-muted-foreground")}>
                  {message.length} chars · {pages.pages} SMS page{pages.pages === 1 ? "" : "s"}
                  {pages.unicode && " · emoji/Unicode shortens pages"}
                </span>
              )}
            </div>
            {channel === "whatsapp" && (
              <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ember" />
                Outside a 24-hour reply window, WhatsApp only delivers Meta-approved templates. Utility templates (check-ins, reminders) cost far less than marketing ones.
              </p>
            )}
          </div>
        </Panel>

        <Panel title="4 · When">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ["now", "Send now"],
                ["later", "Schedule"],
              ] as const
            ).map(([k, l]) => (
              <button key={k} onClick={() => setWhen(k)} className={cn("rounded-full border px-4 py-2 text-sm font-semibold", when === k ? "border-ember bg-ember/10" : "text-muted-foreground")}>
                {l}
              </button>
            ))}
            {when === "later" && <input type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm" aria-label="Send at" />}
          </div>
        </Panel>
      </div>

      {/* Preview + summary */}
      <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <Panel title="Preview" description={sample ? `As ${sample.name} will see it` : undefined}>
          {channel === "email" ? (
            <div className="overflow-hidden rounded-xl border bg-white text-[#211d1a]">
              <div className="bg-[#0e0b09] px-4 py-5 text-center">
                <p className="font-display text-lg font-bold tracking-widest text-[#fbaa1a]">CITY TAKERS</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#f6efe6]/60">YMR Counselling</p>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold">{render(subject) || "Subject"}</p>
                <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed">{render(message) || "Your message…"}</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border-[6px] border-zinc-800 bg-zinc-900 p-3 shadow-xl">
              <div className={cn("min-h-[260px] rounded-[1.4rem] p-3", channel === "whatsapp" ? "bg-[#0b141a]" : "bg-zinc-950")}>
                <p className="mb-3 text-center text-[10px] text-zinc-400">{channel === "whatsapp" ? "YMR Counselling ✓" : "YMR-CT"}</p>
                <div className={cn("ml-auto max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-tr-sm px-3 py-2 text-[12.5px] leading-snug", channel === "whatsapp" ? "bg-[#005c4b] text-white" : "bg-zinc-800 text-zinc-100")}>
                  {render(message) || "Your message…"}
                </div>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Summary">
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> Recipients
              </dt>
              <dd className="tabular text-right font-semibold">{fmtNum(recipients.length)}</dd>
            </div>
            {people.length > recipients.length && (
              <p className="text-xs text-amber-600 dark:text-status-warning">
                {fmtNum(people.length - recipients.length)} in this audience have no {channel === "email" ? "email" : "phone number"} and will be skipped.
              </p>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Provider</dt>
              <dd className="text-right">{provider.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Estimated cost</dt>
              <dd className="tabular text-right font-semibold">{fmtNaira(cost)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5" /> When
              </dt>
              <dd className="text-right">{when === "now" ? "Immediately" : at ? new Date(at).toLocaleString() : "Pick a time"}</dd>
            </div>
          </dl>
          <Button className="mt-5 w-full" disabled={!canSend || busy} onClick={() => setConfirm(true)}>
            <Send className="mr-1.5 h-4 w-4" /> {when === "now" ? "Review & send" : "Review & schedule"}
          </Button>
        </Panel>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {when === "now" ? "Send" : "Schedule"} {CHANNEL_META[channel].label} to {fmtNum(recipients.length)} people?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {audienceLabel} · estimated {fmtNaira(cost)} via {provider.name}. Messages can't be recalled once sent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={send}>
              <Check className="mr-1.5 h-4 w-4" /> Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
