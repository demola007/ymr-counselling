/** Pure aggregations over records. The mock API runs them in the browser; the FastAPI version will run the same queries in SQL. */
import type { Convert, Counsellee, FollowUpStatus, NotificationBatch, StaffMember } from "@/types";

export interface Count {
  label: string;
  value: number;
}

const tally = <T,>(rows: T[], key: (r: T) => string | null | undefined, top?: number): Count[] => {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  const out = [...m.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  if (!top || out.length <= top) return out;
  // Fold the tail — and any literal "Other" answers — into a single "Other" bucket, kept last
  const head = out.filter((c) => c.label !== "Other").slice(0, top);
  const rest = out.filter((c) => !head.includes(c)).reduce((s, c) => s + c.value, 0);
  return rest ? [...head, { label: "Other", value: rest }] : head;
};

export const FOLLOW_UP_ORDER: FollowUpStatus[] = ["new", "contacted", "connected", "discipled"];

export interface EditionSummary {
  edition: number;
  converts: number;
  counsellees: number;
  counsellors: number;
  followUpRate: number; // converts contacted or further / converts
  connectedRate: number; // connected + discipled
  unreachable: number;
  counselleesResolved: number;
  highUrgencyOpen: number;
  unassignedCounsellees: number;
  medianHoursToFirstContact: number | null;
  daily: { date: string; converts: number; counsellees: number }[];
  funnel: Count[];
  topics: Count[];
  urgency: Count[];
  gender: Count[];
  ageGroups: Count[];
  states: Count[];
  denominations: Count[];
  onlineShare: number;
  studentShare: number;
  sources: Count[];
  counsellorLoad: { id: string; name: string; open: number; total: number }[];
}

export function summarise(edition: number, converts: Convert[], counsellees: Counsellee[], staff: StaffMember[]): EditionSummary {
  const cv = converts.filter((c) => c.edition === edition);
  const cs = counsellees.filter((c) => c.edition === edition);
  const team = staff.filter((s) => s.editions.includes(edition) && s.status !== "pending");
  const reached = cv.filter((c) => c.follow_up_status !== "new");

  const days = new Map<string, { converts: number; counsellees: number }>();
  const bump = (iso: string, k: "converts" | "counsellees") => {
    const d = iso.slice(0, 10);
    const cur = days.get(d) ?? { converts: 0, counsellees: 0 };
    cur[k]++;
    days.set(d, cur);
  };
  cv.forEach((c) => bump(c.created_at, "converts"));
  cs.forEach((c) => bump(c.created_at, "counsellees"));
  const daily = [...days.entries()].map(([date, v]) => ({ date, ...v })).sort((a, b) => a.date.localeCompare(b.date));

  const hours = cv
    .filter((c) => c.last_contacted_at)
    .map((c) => (new Date(c.last_contacted_at!).getTime() - new Date(c.created_at).getTime()) / 3600_000)
    .sort((a, b) => a - b);

  // Funnel is cumulative: everyone who reached a stage or beyond
  const rank = (s: FollowUpStatus) => (s === "unreachable" ? 1 : FOLLOW_UP_ORDER.indexOf(s));
  const funnel = FOLLOW_UP_ORDER.map((s, i) => ({
    label: ({ new: "Captured", contacted: "Contacted", connected: "Connected to church", discipled: "Discipled", unreachable: "Unreachable" } as Record<FollowUpStatus, string>)[s],
    value: cv.filter((c) => rank(c.follow_up_status) >= i && !(c.follow_up_status === "unreachable" && i > 0)).length,
  }));

  const load = new Map<string, { open: number; total: number }>();
  for (const c of cs) {
    if (!c.assigned_to) continue;
    const cur = load.get(c.assigned_to) ?? { open: 0, total: 0 };
    cur.total++;
    if (c.status !== "resolved") cur.open++;
    load.set(c.assigned_to, cur);
  }
  for (const c of cv) {
    if (!c.assigned_to) continue;
    const cur = load.get(c.assigned_to) ?? { open: 0, total: 0 };
    cur.total++;
    if (c.follow_up_status === "new" || c.follow_up_status === "contacted") cur.open++;
    load.set(c.assigned_to, cur);
  }

  return {
    edition,
    converts: cv.length,
    counsellees: cs.length,
    counsellors: team.length,
    followUpRate: cv.length ? reached.length / cv.length : 0,
    connectedRate: cv.length ? cv.filter((c) => c.follow_up_status === "connected" || c.follow_up_status === "discipled").length / cv.length : 0,
    unreachable: cv.filter((c) => c.follow_up_status === "unreachable").length,
    counselleesResolved: cs.filter((c) => c.status === "resolved").length,
    highUrgencyOpen: cs.filter((c) => c.urgency === "high" && c.status !== "resolved").length,
    unassignedCounsellees: cs.filter((c) => !c.assigned_to).length,
    medianHoursToFirstContact: hours.length ? hours[Math.floor(hours.length / 2)]! : null,
    daily,
    funnel,
    topics: tally(cs.flatMap((c) => c.topics.map((t) => ({ t }))), (x) => x.t),
    urgency: (["high", "medium", "low"] as const).map((u) => ({ label: u, value: cs.filter((c) => c.urgency === u).length })),
    gender: tally([...cv, ...cs], (p) => p.gender),
    ageGroups: ["Under 18", "18-24", "25-30", "31-35", "36-45", "46+"].map((a) => ({ label: a, value: [...cv, ...cs].filter((p) => p.age_group === a).length })),
    states: tally([...cv, ...cs], (p) => p.state, 10),
    denominations: tally([...cv, ...cs], (p) => p.denomination, 8),
    onlineShare: cv.length ? cv.filter((c) => c.online).length / cv.length : 0,
    studentShare: cv.length + cs.length ? [...cv, ...cs].filter((p) => p.is_student).length / (cv.length + cs.length) : 0,
    sources: tally([...cv, ...cs], (p) => ({ "form-upload": "AI form capture", "web-form": "Web form", manual: "Manual entry", import: "Import" })[p.source]),
    counsellorLoad: [...load.entries()]
      .map(([id, v]) => ({ id, name: staff.find((s) => s.id === id)?.name ?? id, ...v }))
      .sort((a, b) => b.total - a.total),
  };
}

export interface NotificationSummary {
  batches: number;
  messages: number;
  delivered: number;
  failed: number;
  deliveryRate: number;
  cost: number;
  byChannel: { channel: string; total: number; delivered: number; failed: number; rate: number; cost: number }[];
  reasons: Count[];
}

export function summariseNotifications(batches: NotificationBatch[]): NotificationSummary {
  const done = batches.filter((b) => b.status !== "scheduled" && b.status !== "queued");
  const messages = done.reduce((s, b) => s + b.total, 0);
  const delivered = done.reduce((s, b) => s + b.delivered, 0);
  const failed = done.reduce((s, b) => s + b.failed, 0);
  const reasons = new Map<string, number>();
  done.forEach((b) => Object.entries(b.failure_reasons).forEach(([k, v]) => reasons.set(k, (reasons.get(k) ?? 0) + v)));
  return {
    batches: batches.length,
    messages,
    delivered,
    failed,
    deliveryRate: messages ? delivered / messages : 0,
    cost: done.reduce((s, b) => s + b.cost_ngn, 0),
    byChannel: (["whatsapp", "sms", "email"] as const).map((ch) => {
      const bs = done.filter((b) => b.channel === ch);
      const total = bs.reduce((s, b) => s + b.total, 0);
      const d = bs.reduce((s, b) => s + b.delivered, 0);
      return { channel: ch, total, delivered: d, failed: bs.reduce((s, b) => s + b.failed, 0), rate: total ? d / total : 0, cost: bs.reduce((s, b) => s + b.cost_ngn, 0) };
    }),
    reasons: [...reasons.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
  };
}
