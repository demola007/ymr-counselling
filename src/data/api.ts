/**
 * The portal's single data boundary. Today every call is served by the in-browser
 * mock (VITE_API_MODE=mock, the default). When the FastAPI rebuild lands, an HTTP
 * implementation of this same object replaces it — pages and hooks don't change.
 */
import { CURRENT_YEAR } from "@/config/editions";
import { defaultProvider, smsPages } from "@/config/providers";
import { COUNSELLING_TOPICS } from "@/config/site";
import { MOCK_PASSWORD } from "@/auth/mockUsers";
import { createRng, uid } from "@/lib/rng";
import type {
  ActivityEvent,
  Audience,
  Channel,
  Convert,
  Counsellee,
  ExportRecord,
  ExtractedForm,
  MessageTemplate,
  NotificationBatch,
  NotificationRecipient,
  Role,
  StaffMember,
  TimelineEntry,
} from "@/types";
import { summarise, summariseNotifications } from "./analytics";
import { db } from "./mock/db";

export const API_MODE = (import.meta.env.VITE_API_MODE as string | undefined) ?? "mock";

const wait = (min = 180, max = 520) => new Promise((r) => setTimeout(r, min + Math.random() * (max - min)));
const clone = <T,>(v: T): T => structuredClone(v);

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export interface Session {
  token: string;
  user: StaffMember;
  expiresAt: number;
}

function audit(actor: string, action: string, target: string, kind: ActivityEvent["kind"], edition = CURRENT_YEAR) {
  const ev: ActivityEvent = { id: uid("act_"), at: new Date().toISOString(), actor, action, target, edition, kind };
  db.log.activity.unshift(ev);
  db.log.activity = db.log.activity.slice(0, 200);
  db.activity.unshift(ev);
  db.persist();
}

function note(by: string, type: TimelineEntry["type"], text: string): TimelineEntry {
  return { id: uid("n_"), at: new Date().toISOString(), by, type, text };
}

export interface SendPayload {
  channel: Channel;
  audience: Audience;
  audienceLabel: string;
  recipients: { id: string; name: string; address: string }[];
  subject: string | null;
  message: string;
  templateId: string | null;
  scheduledFor: string | null;
  edition: number;
  fallbackToSms?: boolean;
}

/* ------------------------------------------------------------------ */

export const api = {
  auth: {
    async login(email: string, password: string): Promise<Session> {
      await wait(400, 800);
      const user = db.staff.find((s) => s.email.toLowerCase() === email.trim().toLowerCase());
      const expected = db.log.passwords[user?.id ?? ""] ?? MOCK_PASSWORD;
      if (!user || password !== expected) throw new ApiError("That email and password don't match our records.", 401);
      if (user.status === "pending") throw new ApiError("Your account is awaiting approval by a super admin.", 403);
      if (user.status === "deactivated") throw new ApiError("This account has been deactivated. Contact the team lead.", 403);
      db.patch(user.id, { last_active_at: new Date().toISOString() });
      return { token: `mock.${btoa(user.id)}.${Date.now()}`, user: clone(user), expiresAt: Date.now() + 12 * 3600_000 };
    },
    async me(userId: string): Promise<StaffMember | null> {
      const u = db.staff.find((s) => s.id === userId);
      return u ? clone(u) : null;
    },
    async signup(input: { name: string; email: string; phone_number: string; password: string; gender: StaffMember["gender"]; state: string | null }) {
      await wait(500, 900);
      if (db.staff.some((s) => s.email.toLowerCase() === input.email.toLowerCase()))
        throw new ApiError("An account with this email already exists.", 409);
      const member: StaffMember = {
        id: uid("stf_"),
        name: input.name,
        email: input.email.toLowerCase(),
        phone_number: input.phone_number,
        gender: input.gender,
        role: "user",
        status: "pending",
        state: input.state,
        country: "Nigeria",
        denomination: null,
        years_of_experience: 0,
        has_certification: false,
        specialties: [],
        editions: [CURRENT_YEAR],
        will_attend: true,
        avatar_url: null,
        created_at: new Date().toISOString(),
        last_active_at: null,
      };
      db.log.created.staff.unshift(member);
      db.log.passwords[member.id] = input.password;
      db.staff.unshift(member);
      db.persist();
      audit(member.name, "requested portal access", member.email, "access");
      return clone(member);
    },
    async changePassword(userId: string, current: string, next: string) {
      await wait();
      const expected = db.log.passwords[userId] ?? MOCK_PASSWORD;
      if (current !== expected) throw new ApiError("Your current password is incorrect.", 400);
      db.log.passwords[userId] = next;
      db.persist();
    },
  },

  converts: {
    async list(edition: number) {
      await wait();
      return clone(db.converts.filter((c) => c.edition === edition));
    },
    async update(ids: string[], patch: Partial<Convert>, actor: string, noteText?: string) {
      await wait();
      for (const id of ids) {
        const c = db.converts.find((x) => x.id === id);
        if (!c) continue;
        const notes = [...c.notes];
        if (patch.follow_up_status && patch.follow_up_status !== c.follow_up_status)
          notes.push(note(actor, "status", `Status changed to ${patch.follow_up_status}`));
        if (patch.assigned_to !== undefined && patch.assigned_to !== c.assigned_to) {
          const who = db.staff.find((s) => s.id === patch.assigned_to)?.name ?? "nobody";
          notes.push(note(actor, "assignment", `Assigned to ${who}`));
        }
        if (noteText) notes.push(note(actor, "note", noteText));
        const full = { ...patch, notes };
        if (patch.follow_up_status && patch.follow_up_status !== "new") (full as Partial<Convert>).last_contacted_at = new Date().toISOString();
        Object.assign(c, full);
        db.patch(id, full);
      }
      audit(actor, "updated", ids.length === 1 ? db.converts.find((c) => c.id === ids[0])?.name ?? "a convert" : `${ids.length} converts`, "edit");
    },
    async addNote(id: string, actor: string, type: TimelineEntry["type"], text: string) {
      await wait(120, 260);
      const c = db.converts.find((x) => x.id === id) ?? db.counsellees.find((x) => x.id === id);
      if (!c) throw new ApiError("Record not found", 404);
      c.notes = [...c.notes, note(actor, type, text)];
      db.patch(id, { notes: c.notes });
    },
    async create(input: Omit<Convert, "id" | "kind" | "notes" | "created_at" | "follow_up_status" | "assigned_to" | "last_contacted_at">, actor: string) {
      await wait();
      const c: Convert = {
        ...input,
        id: uid(`cvt_${input.edition}_`),
        kind: "convert",
        created_at: new Date().toISOString(),
        follow_up_status: "new",
        assigned_to: null,
        last_contacted_at: null,
        notes: [note(actor, "created", input.source === "form-upload" ? "Captured from altar-call form (AI)" : input.source === "web-form" ? "Submitted via the website" : "Added manually")],
      };
      db.converts.unshift(c);
      db.log.created.converts.unshift(c);
      db.persist();
      return clone(c);
    },
    async remove(ids: string[], actor: string) {
      await wait();
      db.converts = db.converts.filter((c) => !ids.includes(c.id));
      db.counsellees = db.counsellees.filter((c) => !ids.includes(c.id));
      db.log.deleted.push(...ids);
      db.persist();
      audit(actor, "deleted", `${ids.length} record${ids.length > 1 ? "s" : ""}`, "delete");
    },
  },

  counsellees: {
    async list(edition: number) {
      await wait();
      return clone(db.counsellees.filter((c) => c.edition === edition));
    },
    async update(ids: string[], patch: Partial<Counsellee>, actor: string) {
      await wait();
      for (const id of ids) {
        const c = db.counsellees.find((x) => x.id === id);
        if (!c) continue;
        const notes = [...c.notes];
        if (patch.status && patch.status !== c.status) notes.push(note(actor, "status", `Status changed to ${patch.status}`));
        if (patch.assigned_to !== undefined && patch.assigned_to !== c.assigned_to) {
          const who = db.staff.find((s) => s.id === patch.assigned_to)?.name ?? "nobody";
          notes.push(note(actor, "assignment", `Assigned to ${who}`));
        }
        const full = { ...patch, notes };
        Object.assign(c, full);
        db.patch(id, full);
      }
      audit(actor, "updated", ids.length === 1 ? db.counsellees.find((c) => c.id === ids[0])?.name ?? "a counsellee" : `${ids.length} counsellees`, "edit");
    },
    async create(input: Omit<Counsellee, "id" | "kind" | "notes" | "created_at" | "status" | "assigned_to" | "session_at" | "counsellor_comments" | "reference" | "topics" | "urgency"> & Partial<Pick<Counsellee, "topics">>, actor: string) {
      await wait(500, 900);
      const { topics, urgency } = triage(input.counselling_reason, input.topics);
      const c: Counsellee = {
        ...input,
        id: uid(`csl_${input.edition}_`),
        kind: "counsellee",
        topics,
        urgency,
        status: "pending",
        assigned_to: null,
        session_at: null,
        counsellor_comments: null,
        reference: `${String(input.edition).slice(2)}CT-${uid().slice(0, 4).toUpperCase()}`,
        created_at: new Date().toISOString(),
        notes: [note(actor, "created", "Counselling request received")],
      };
      db.counsellees.unshift(c);
      db.log.created.counsellees.unshift(c);
      db.persist();
      return clone(c);
    },
  },

  staff: {
    async list() {
      await wait();
      return clone(db.staff);
    },
    async update(id: string, patch: Partial<StaffMember>, actor: string) {
      await wait();
      const s = db.staff.find((x) => x.id === id);
      if (!s) throw new ApiError("Staff member not found", 404);
      Object.assign(s, patch);
      db.patch(id, patch);
      const what = patch.status === "active" && s.status === "active" ? "approved / activated" : patch.role ? `changed role to ${patch.role} for` : "updated";
      audit(actor, what, s.name, "access");
      return clone(s);
    },
    async invite(input: { name: string; email: string; role: Role }, actor: string) {
      await wait();
      const m: StaffMember = {
        id: uid("stf_"),
        name: input.name,
        email: input.email.toLowerCase(),
        phone_number: null,
        gender: null,
        role: input.role,
        status: "active",
        state: null,
        country: "Nigeria",
        denomination: null,
        years_of_experience: 0,
        has_certification: false,
        specialties: [],
        editions: [CURRENT_YEAR],
        will_attend: true,
        avatar_url: null,
        created_at: new Date().toISOString(),
        last_active_at: null,
      };
      db.staff.unshift(m);
      db.log.created.staff.unshift(m);
      db.persist();
      audit(actor, "invited", `${m.name} as ${m.role}`, "access");
      return clone(m);
    },
    /** Public "join the counselling team" application. */
    async apply(input: Partial<StaffMember> & { name: string; email: string }) {
      await wait(500, 900);
      const m: StaffMember = {
        id: uid("stf_"),
        name: input.name,
        email: input.email.toLowerCase(),
        phone_number: input.phone_number ?? null,
        gender: input.gender ?? null,
        role: "user",
        status: "pending",
        state: input.state ?? null,
        country: input.country ?? "Nigeria",
        denomination: input.denomination ?? null,
        years_of_experience: input.years_of_experience ?? 0,
        has_certification: input.has_certification ?? false,
        specialties: input.specialties ?? [],
        editions: [CURRENT_YEAR],
        will_attend: input.will_attend ?? true,
        avatar_url: null,
        created_at: new Date().toISOString(),
        last_active_at: null,
      };
      db.staff.unshift(m);
      db.log.created.staff.unshift(m);
      db.persist();
      audit(m.name, "applied to join", "the counselling team", "access");
      return clone(m);
    },
  },

  analytics: {
    async summary(edition: number) {
      await wait(200, 420);
      return summarise(edition, db.converts, db.counsellees, db.staff);
    },
    async compare(editions: number[]) {
      await wait(200, 420);
      return editions.map((e) => summarise(e, db.converts, db.counsellees, db.staff));
    },
    /** Public, aggregate-only numbers for the landing page. */
    async publicStats() {
      await wait(100, 200);
      return {
        convertsFollowedUp: db.converts.filter((c) => c.follow_up_status !== "new").length,
        counselled: db.counsellees.filter((c) => c.status !== "pending").length,
        counsellors: db.staff.filter((s) => s.status === "active").length,
      };
    },
  },

  notifications: {
    async batches(edition?: number) {
      await wait();
      return clone(edition ? db.batches.filter((b) => b.edition === edition) : db.batches);
    },
    async summary(edition?: number) {
      await wait(150, 300);
      return summariseNotifications(edition ? db.batches.filter((b) => b.edition === edition) : db.batches);
    },
    /** Recipient-level results are generated on demand for seeded batches. */
    async recipients(batch: NotificationBatch): Promise<NotificationRecipient[]> {
      await wait(200, 400);
      const r = createRng(parseInt(batch.id.replace(/\D/g, "").slice(-6) || "1", 10) + batch.total);
      const pool = batch.audience === "counsellors" ? db.staff : batch.audience === "counsellees" ? db.counsellees.filter((c) => c.edition === batch.edition) : db.converts.filter((c) => c.edition === batch.edition);
      const reasons = Object.entries(batch.failure_reasons).flatMap(([k, v]) => Array(v).fill(k) as string[]);
      const out: NotificationRecipient[] = [];
      for (let i = 0; i < Math.min(batch.total, 400); i++) {
        const p = pool[i % Math.max(pool.length, 1)];
        const failed = i < reasons.length;
        out.push({
          id: `${batch.id}_${i}`,
          batch_id: batch.id,
          name: p?.name ?? `Recipient ${i + 1}`,
          address: batch.channel === "email" ? (p?.email ?? "unknown@example.com") : (p?.phone_number ?? "—"),
          status: batch.status === "scheduled" ? "pending" : failed ? "failed" : batch.opened && r.chance(batch.opened / Math.max(batch.delivered, 1)) ? "read" : "delivered",
          error: failed ? reasons[i]! : null,
          updated_at: batch.completed_at ?? batch.created_at,
        });
      }
      return out.sort(() => r.next() - 0.5);
    },
    async send(p: SendPayload, actor: string): Promise<NotificationBatch> {
      await wait(700, 1200);
      const provider = defaultProvider(p.channel);
      const valid = p.recipients.filter((x) => (p.channel === "email" ? /@/.test(x.address) : x.address.replace(/\D/g, "").length >= 10));
      const invalid = p.recipients.length - valid.length;
      const scheduled = !!p.scheduledFor;
      const softFail = scheduled ? 0 : Math.round(valid.length * (p.channel === "email" ? 0.015 : 0.05));
      const reasons: Record<string, number> = {};
      if (invalid) reasons[p.channel === "email" ? "Invalid address" : "Invalid number"] = invalid;
      if (softFail) reasons[p.channel === "sms" ? "DND active on number" : p.channel === "email" ? "Hard bounce" : "Not a WhatsApp number"] = softFail;
      const pages = p.channel === "sms" ? smsPages(p.message).pages : 1;
      const b: NotificationBatch = {
        id: uid("nb_"),
        edition: p.edition,
        channel: p.channel,
        provider: provider.id,
        audience: p.audience,
        audience_label: p.audienceLabel,
        subject: p.subject,
        message: p.message,
        template_id: p.templateId,
        total: p.recipients.length,
        delivered: scheduled ? 0 : valid.length - softFail,
        failed: scheduled ? 0 : invalid + softFail,
        pending: scheduled ? p.recipients.length : 0,
        opened: null,
        cost_ngn: Math.round(valid.length * provider.unitCostNgn * pages),
        status: scheduled ? "scheduled" : invalid + softFail > p.recipients.length * 0.1 ? "partial" : "sent",
        created_by: actor,
        created_at: new Date().toISOString(),
        scheduled_for: p.scheduledFor,
        completed_at: scheduled ? null : new Date().toISOString(),
        failure_reasons: scheduled ? {} : reasons,
      };
      db.batches.unshift(b);
      db.log.created.batches.unshift(b);
      db.persist();
      audit(actor, scheduled ? "scheduled" : "sent", `${p.channel.toUpperCase()} to ${p.recipients.length} ${p.audience}`, "notify", p.edition);
      return clone(b);
    },
    async retryFailed(batchId: string, actor: string) {
      await wait(600, 1000);
      const b = db.batches.find((x) => x.id === batchId);
      if (!b) throw new ApiError("Batch not found", 404);
      const recovered = Math.round(b.failed * 0.55);
      const patch = { delivered: b.delivered + recovered, failed: b.failed - recovered, status: b.failed - recovered > b.total * 0.1 ? "partial" : "sent" } as const;
      Object.assign(b, patch);
      db.patch(b.id, patch);
      audit(actor, "retried failed messages in", `batch ${b.id}`, "notify", b.edition);
      return { recovered };
    },
    async templates() {
      await wait(150, 300);
      return clone(db.templates);
    },
    async saveTemplate(t: MessageTemplate, actor: string) {
      await wait();
      const existing = db.templates.find((x) => x.id === t.id);
      const next = { ...t, updated_at: new Date().toISOString() };
      if (existing) {
        Object.assign(existing, next);
        db.patch(t.id, next);
      } else {
        db.templates.unshift(next);
        db.log.created.templates.unshift(next);
        db.persist();
      }
      audit(actor, existing ? "edited template" : "created template", t.name, "edit");
      return clone(next);
    },
  },

  capture: {
    /** Mock of POST /api/capture/extract — reads one form image and returns fields with confidences. */
    async extract(file: File, kind: "convert" | "counsellee", edition: number): Promise<Omit<ExtractedForm, "id" | "fileName" | "previewUrl" | "status">> {
      await wait(1400, 2600);
      const seed = [...file.name].reduce((s, ch) => s + ch.charCodeAt(0), file.size % 9973);
      const r = createRng(seed);
      const pool = kind === "convert" ? db.converts : db.counsellees;
      const sample = pool[r.int(0, pool.length - 1)]!;
      const isDup = r.chance(0.12);
      const fields: ExtractedForm["fields"] = {
        name: isDup ? sample.name : `${r.pick(["Ope", "Kemi", "Chidi", "Bayo", "Ngozi", "Femi", "Esther"])} ${r.pick(["Adeleke", "Okoro", "Martins", "Ayodele", "Nwankwo"])}`,
        gender: r.pick(["Male", "Female"] as const),
        phone_number: isDup ? sample.phone_number : `080${r.int(10000000, 99999999)}`,
        email: r.chance(0.7) ? `${r.pick(["ope", "kemi", "chidi", "bayo"])}${r.int(10, 99)}@gmail.com` : null,
        age_group: r.pick(["18-24", "25-30", "31-35"] as const),
        state: r.pick(["Lagos", "Ogun", "Oyo", "FCT"]),
        country: "Nigeria",
        address: r.chance(0.6) ? `${r.int(1, 80)} ${r.pick(["Ikorodu Rd", "Allen Ave", "Mowe-Ofada Rd"])}` : null,
        denomination: r.pick(["RCCG", "Anglican", "Catholic", "None"]),
        is_student: r.chance(0.4),
        occupation: r.pick(["Student", "Trader", "Engineer", "Nurse"]),
        relationship_status: "Single",
        nearest_bus_stop: r.chance(0.5) ? r.pick(["Berger", "Ojota", "Mowe"]) : null,
        edition,
        ...(kind === "convert"
          ? { availability_for_follow_up: true, online: false }
          : { counselling_reason: r.pick(["I need help with anxiety and fear about the future.", "Guidance on my relationship.", "I want to grow spiritually."]) }),
      };
      const confidence: Record<string, number> = {};
      for (const k of Object.keys(fields)) confidence[k] = r.chance(0.18) ? 0.45 + r.next() * 0.3 : 0.86 + r.next() * 0.14;
      return {
        kind,
        fields,
        confidence,
        duplicateOf: isDup ? { id: sample.id, name: sample.name, reason: "Same name and phone number" } : null,
      };
    },
  },

  activity: {
    async list(limit = 30) {
      await wait(150, 300);
      return clone(db.activity.slice(0, limit));
    },
  },

  exports: {
    async log(rec: Omit<ExportRecord, "id" | "at">) {
      const full = { ...rec, id: uid("exp_"), at: new Date().toISOString() };
      db.log.exports.unshift(full);
      db.persist();
      audit(rec.by, "exported", `${rec.rows} ${rec.dataset} (${rec.format.toUpperCase()})`, "export");
      return full;
    },
    async list() {
      await wait(100, 200);
      return clone(db.log.exports);
    },
  },
};

/** Keyword triage that stands in for the AI classifier in mock mode. */
export function triage(text: string, chosen?: string[]) {
  const t = text.toLowerCase();
  const rules: [string, RegExp][] = [
    ["Mental & emotional health", /anxi|depress|lonely|suicid|overwhelm|panic|fear|low/],
    ["Relationships & marriage", /relationship|marri|fianc|boyfriend|girlfriend|wife|husband|breakup/],
    ["Career & purpose", /career|job|purpose|business|work/],
    ["Addiction & habits", /addict|porn|smok|drink|habit|gambl/],
    ["Grief & loss", /died|death|grief|griev|lost my|passed/],
    ["Family", /parent|father|mother|sibling|family|home/],
    ["Finances", /debt|money|financ|loan/],
    ["Academics", /school|exam|project|course|universit/],
    ["Ministry & calling", /ministry|calling|call to|pastor|fellowship/],
  ];
  const found = rules.filter(([, re]) => re.test(t)).map(([k]) => k);
  const topics = [...new Set([...(chosen ?? []), ...found])].filter((x) => (COUNSELLING_TOPICS as readonly string[]).includes(x));
  if (!topics.length) topics.push("Spiritual growth");
  const urgency = /suicid|kill myself|end it|harm|abuse|danger/.test(t)
    ? "high"
    : topics.some((x) => ["Mental & emotional health", "Addiction & habits", "Grief & loss"].includes(x))
      ? "medium"
      : "low";
  return { topics, urgency } as { topics: string[]; urgency: Counsellee["urgency"] };
}
