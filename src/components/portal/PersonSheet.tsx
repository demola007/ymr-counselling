import { useState } from "react";
import { CalendarClock, Mail, MapPin, MessageCircle, MessageSquareText, Phone, Send, StickyNote, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { api } from "@/data/api";
import { useInvalidate, useStaff } from "@/hooks/queries";
import { fmtDate, fmtDateTime, fmtPhone, whatsappLink } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Convert, Counsellee, CounselleeStatus, FollowUpStatus, PersonFields, TimelineEntry } from "@/types";
import { Avatar, COUNSELLEE_META, FOLLOW_UP_META, StatusPill, UrgencyPill } from "./kit";

const TL_ICON: Record<TimelineEntry["type"], typeof Phone> = {
  note: StickyNote,
  call: Phone,
  sms: MessageSquareText,
  email: Mail,
  whatsapp: MessageCircle,
  status: UserCheck,
  assignment: UserCheck,
  created: CalendarClock,
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value || "—"}</dd>
    </div>
  );
}

export function PersonSheet({ person, onClose }: { person: Convert | Counsellee | null; onClose: () => void }) {
  const { user, can } = useAuth();
  const staff = useStaff();
  const invalidate = useInvalidate();
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState<TimelineEntry["type"]>("call");
  const [busy, setBusy] = useState(false);
  const p = person;
  const writable = p?.kind === "convert" ? can("converts:write") : can("counsellees:write");
  const team = (staff.data ?? []).filter((s) => s.status === "active" && (p ? s.editions.includes(p.edition) : true));

  const update = async (patch: PersonFields) => {
    if (!p) return;
    setBusy(true);
    try {
      if (p.kind === "convert") await api.converts.update([p.id], patch as Partial<Convert>, user!.name);
      else await api.counsellees.update([p.id], patch as Partial<Counsellee>, user!.name);
      await invalidate();
      toast.success("Saved");
    } finally {
      setBusy(false);
    }
  };

  const addNote = async () => {
    if (!p || !noteText.trim()) return;
    setBusy(true);
    try {
      await api.converts.addNote(p.id, user!.name, noteType, noteText.trim());
      setNoteText("");
      await invalidate();
      toast.success("Logged on timeline");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={!!p} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        {p && (
          <>
            <SheetHeader className="space-y-0 border-b bg-gradient-to-br from-ember/10 to-transparent p-6 text-left">
              <div className="flex items-start gap-4">
                <Avatar name={p.name} className="h-14 w-14 text-base" />
                <div className="min-w-0">
                  <SheetTitle className="font-display text-xl">{p.name}</SheetTitle>
                  <SheetDescription className="mt-1 flex flex-wrap items-center gap-2">
                    {p.kind === "convert" ? <StatusPill meta={FOLLOW_UP_META[p.follow_up_status]} /> : <StatusPill meta={COUNSELLEE_META[p.status]} />}
                    {p.kind === "counsellee" && <UrgencyPill urgency={p.urgency} />}
                    <span className="text-xs">
                      {p.kind === "convert" ? "Convert" : `Counsellee · ${p.reference}`} · YMR {p.edition}
                    </span>
                  </SheetDescription>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.phone_number && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`tel:${p.phone_number}`}>
                      <Phone className="mr-1.5 h-3.5 w-3.5" /> Call
                    </a>
                  </Button>
                )}
                {p.phone_number && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={whatsappLink(p.phone_number)} target="_blank" rel="noreferrer">
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </Button>
                )}
                {p.email && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${p.email}`}>
                      <Mail className="mr-1.5 h-3.5 w-3.5" /> Email
                    </a>
                  </Button>
                )}
              </div>
            </SheetHeader>

            <div className="space-y-6 p-6">
              {p.kind === "counsellee" && (
                <section className="rounded-2xl border bg-muted/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Request</p>
                  <p className="mt-2 text-sm leading-relaxed">{p.counselling_reason}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.topics.map((t) => (
                      <span key={t} className="rounded-full bg-background px-2.5 py-0.5 text-xs">
                        {t}
                      </span>
                    ))}
                    <span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted-foreground">Prefers: {p.preferred_mode}</span>
                  </div>
                </section>
              )}

              {writable && (
                <section className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
                    Status
                    {p.kind === "convert" ? (
                      <select disabled={busy} className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground" value={p.follow_up_status} onChange={(e) => update({ follow_up_status: e.target.value as FollowUpStatus })}>
                        {Object.entries(FOLLOW_UP_META).map(([k, m]) => (
                          <option key={k} value={k}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select disabled={busy} className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground" value={p.status} onChange={(e) => update({ status: e.target.value as CounselleeStatus })}>
                        {Object.entries(COUNSELLEE_META).map(([k, m]) => (
                          <option key={k} value={k}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </label>
                  <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
                    Assigned counsellor
                    <select
                      disabled={busy}
                      className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground"
                      value={p.assigned_to ?? ""}
                      onChange={(e) => update({ assigned_to: e.target.value || null, ...(p.kind === "counsellee" && p.status === "pending" && e.target.value ? { status: "assigned" as const } : {}) })}
                    >
                      <option value="">Unassigned</option>
                      {team.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </section>
              )}

              <section>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Details</p>
                <dl className="divide-y">
                  <Row label="Phone" value={fmtPhone(p.phone_number)} />
                  <Row label="Email" value={p.email} />
                  <Row label="Gender" value={p.gender} />
                  <Row label="Age group" value={p.age_group} />
                  <Row label="Relationship" value={p.relationship_status} />
                  <Row
                    label="Location"
                    value={
                      (p.state || p.country) && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {[p.address, p.state, p.country].filter(Boolean).join(", ")}
                        </span>
                      )
                    }
                  />
                  <Row label="Nearest bus stop" value={p.nearest_bus_stop} />
                  <Row label={p.is_student ? "School" : "Occupation"} value={p.is_student ? p.school : p.occupation} />
                  <Row label="Church" value={p.denomination} />
                  {p.kind === "convert" && <Row label="Decision made" value={p.online ? "Online" : "At Redemption City"} />}
                  {p.kind === "convert" && <Row label="Open to follow-up" value={p.availability_for_follow_up ? "Yes" : "No"} />}
                  {p.kind === "counsellee" && <Row label="Session" value={fmtDateTime(p.session_at)} />}
                  <Row label="Captured" value={`${fmtDate(p.created_at)} · ${p.source.replace("-", " ")}`} />
                </dl>
              </section>

              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Journey</p>
                <ol className="relative space-y-4 border-l pl-6">
                  {[...p.notes].reverse().map((n) => {
                    const Icon = TL_ICON[n.type];
                    return (
                      <li key={n.id} className="relative">
                        <span className="absolute -left-[35px] flex h-6 w-6 items-center justify-center rounded-full border bg-card">
                          <Icon className="h-3 w-3 text-ember" />
                        </span>
                        <p className="text-sm">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {n.by} · {fmtDateTime(n.at)}
                        </p>
                      </li>
                    );
                  })}
                </ol>
                {writable && (
                  <div className="mt-5 rounded-xl border p-3">
                    <div className="mb-2 flex flex-wrap gap-1">
                      {(["call", "whatsapp", "sms", "note"] as const).map((t) => (
                        <button key={t} onClick={() => setNoteType(t)} className={cn("rounded-full px-2.5 py-1 text-xs capitalize", noteType === t ? "bg-ember/15 font-semibold text-ember-text" : "text-muted-foreground hover:bg-accent")}>
                          {t === "sms" ? "SMS" : t === "whatsapp" ? "WhatsApp" : t}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addNote()}
                        placeholder="Log what happened…"
                        className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm outline-none focus:border-ember/60"
                      />
                      <Button size="sm" onClick={addNote} disabled={busy || !noteText.trim()} aria-label="Add to timeline">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
