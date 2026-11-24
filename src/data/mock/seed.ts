/**
 * Deterministic mock data for every edition that has data.
 * Shapes mirror the FastAPI models (converts, counsellee, counsellors,
 * notification_logs) plus the new edition, follow-up and triage fields.
 */
import { createRng, type Rng } from "@/lib/rng";
import { COUNSELLING_TOPICS, DENOMINATIONS, NIGERIAN_STATES } from "@/config/site";
import type {
  ActivityEvent,
  AgeGroup,
  Convert,
  Counsellee,
  CounselleeStatus,
  FollowUpStatus,
  MessageTemplate,
  NotificationBatch,
  StaffMember,
  TimelineEntry,
  Urgency,
} from "@/types";

const FIRST_M = ["Tobi", "Chinedu", "Emeka", "Seun", "Femi", "David", "Samuel", "Ifeanyi", "Tunde", "Kunle", "Daniel", "Joshua", "Victor", "Ayo", "Segun", "Uche", "Obinna", "Gbenga", "Michael", "Peter", "Timothy", "Caleb", "Dare", "Kelechi", "Ibrahim", "Babajide", "Somto", "Toluwani", "Oluwaseun", "John", "Moses", "Nnamdi", "Akin", "Paul", "Stephen"];
const FIRST_F = ["Adaeze", "Funmi", "Chioma", "Tolu", "Blessing", "Grace", "Esther", "Ruth", "Ngozi", "Bisola", "Temi", "Kemi", "Amaka", "Precious", "Deborah", "Favour", "Joy", "Ifeoma", "Mercy", "Yetunde", "Damilola", "Nkechi", "Mary", "Oluchi", "Ireoluwa", "Peace", "Abigail", "Sarah", "Halima", "Bukola", "Ebun", "Zainab", "Ann", "Simi", "Lydia"];
const LAST = ["Adeyemi", "Okafor", "Olawale", "Eze", "Balogun", "Nwosu", "Adebayo", "Ogunleye", "Chukwu", "Afolabi", "Okonkwo", "Bello", "Adewale", "Uzor", "Oyelaran", "Ibe", "Akinola", "Obi", "Fashola", "Okeke", "Ajayi", "Nnadi", "Oyebanji", "Ekwueme", "Aina", "Onyeka", "Salami", "Agbaje", "Ogundipe", "Madu", "Odunsi", "Ilesanmi", "Ugwu", "Akande", "Ezeh", "Olatunji", "Emenike", "Daramola", "Etim", "Bassey"];
const OCCUPATIONS = ["Software developer", "Nurse", "Teacher", "Banker", "Trader", "Civil servant", "Engineer", "Accountant", "Fashion designer", "Pharmacist", "Content creator", "Doctor", "Lawyer", "Entrepreneur", "Sales executive", "Unemployed", "Corps member", "Data analyst"];
const SCHOOLS = ["University of Lagos", "Obafemi Awolowo University", "University of Ibadan", "Covenant University", "Redeemer's University", "Babcock University", "University of Nigeria, Nsukka", "Lagos State University", "Federal University of Technology, Akure", "Yaba College of Technology", "Ahmadu Bello University", "University of Benin"];
const BUS_STOPS = ["Ojota", "Berger", "Ikeja Along", "Oshodi", "Mowe", "Ibafo", "Ogba", "Yaba", "Lekki Phase 1", "Ajah", "Iyana Ipaja", "Ketu", "Magodo", "Gbagada", "Wuse", "Bodija", "Ring Road", "Arepo"];
const STREETS = ["Adeola Odeku St", "Allen Avenue", "Herbert Macaulay Way", "Awolowo Road", "Ikorodu Road", "Bode Thomas St", "Opebi Road", "Ago Palace Way", "Admiralty Way", "Toyin Street", "Obafemi Awolowo Way"];

const REASONS: Record<string, string[]> = {
  "Spiritual growth": ["I want to grow in my walk with God and be consistent in prayer.", "I struggle to study the Bible consistently and want accountability.", "I feel spiritually dry and need help rekindling my fire."],
  "Relationships & marriage": ["I need guidance about a relationship I'm in and whether to proceed to marriage.", "My fiancé and I want premarital counsel.", "I'm finding it hard to trust again after a breakup."],
  "Career & purpose": ["I'm unsure about my career path and want clarity on God's purpose for me.", "I lost my job recently and feel stuck.", "I want guidance on starting a business."],
  "Mental & emotional health": ["I've been battling anxiety and need someone to talk to.", "I often feel lonely and overwhelmed.", "I've been feeling low for months and don't know why."],
  Family: ["There is constant conflict at home with my parents.", "I'm struggling to relate with my siblings since our father passed.", "My parents don't support my faith."],
  Finances: ["I'm in debt and need wisdom on managing money.", "I want to learn to be a faithful steward with my income."],
  Academics: ["I'm struggling with my final year project and feel discouraged.", "I failed some courses and want to bounce back."],
  "Addiction & habits": ["I want freedom from a habit that keeps pulling me back.", "I've been struggling with pornography and want help.", "I want to quit smoking for good."],
  "Ministry & calling": ["I sense a call to ministry and want guidance on next steps.", "I lead a campus fellowship and feel burnt out."],
  "Grief & loss": ["I lost my mother this year and I'm still grieving.", "A close friend died and I can't stop asking why."],
};

const AGE_W: [AgeGroup, number][] = [["Under 18", 6], ["18-24", 38], ["25-30", 30], ["31-35", 13], ["36-45", 9], ["46+", 4]];
const STATE_W: [string, number][] = [["Lagos", 34], ["Ogun", 16], ["Oyo", 9], ["FCT", 7], ["Rivers", 4], ["Osun", 4], ["Ondo", 3], ["Edo", 3], ["Kwara", 3], ["Enugu", 2], ["Ekiti", 2], ["Anambra", 2], ["Delta", 2], ["Kaduna", 2], ["Imo", 1.5], ["Plateau", 1], ...NIGERIAN_STATES.filter((s) => !["Lagos", "Ogun", "Oyo", "FCT", "Rivers", "Osun", "Ondo", "Edo", "Kwara", "Enugu", "Ekiti", "Anambra", "Delta", "Kaduna", "Imo", "Plateau"].includes(s)).map((s) => [s, 0.4] as [string, number])];
const DENOM_W: [string, number][] = [["RCCG", 48], ["Winners (Living Faith)", 7], ["Anglican", 6], ["Catholic", 6], ["Methodist", 4], ["Baptist", 4], ["Deeper Life", 4], ["Christ Embassy", 3], ["Foursquare", 3], ["CAC", 3], ["Daystar", 2], ["Harvesters", 2], ["COZA", 2], ["Other", 4], ["None", 4]];

export const EDITION_SIZES: Record<number, { converts: number; counsellees: number }> = {
  2024: { converts: 612, counsellees: 238 },
  2025: { converts: 1146, counsellees: 431 },
  2026: { converts: 46, counsellees: 118 }, // pre-event: City-to-City outreach + early bookings
};

function phone(r: Rng) {
  return `0${r.pick(["803", "806", "813", "816", "703", "706", "810", "814", "903", "906", "802", "808", "812", "701", "708", "902", "905", "907", "805", "807", "815", "705"])}${String(r.int(1000000, 9999999))}`;
}

function person(r: Rng, edition: number, created: Date) {
  const gender = r.chance(0.54) ? "Female" : "Male";
  const first = gender === "Female" ? r.pick(FIRST_F) : r.pick(FIRST_M);
  const last = r.pick(LAST);
  const name = `${first} ${last}`;
  const age_group = r.weighted(AGE_W);
  const is_student = age_group === "Under 18" || (age_group === "18-24" && r.chance(0.65)) || (age_group === "25-30" && r.chance(0.12));
  const country = r.weighted([["Nigeria", 92], ["United Kingdom", 2.5], ["Ghana", 1.5], ["United States", 1.5], ["Canada", 1], ["Other", 1.5]] as const);
  const state = country === "Nigeria" ? r.weighted(STATE_W) : null;
  const birthYear = { "Under 18": 2010, "18-24": 2003, "25-30": 1998, "31-35": 1993, "36-45": 1986, "46+": 1975 }[age_group] - r.int(0, 4);
  return {
    id: "",
    edition,
    name,
    gender,
    email: r.chance(0.82) ? `${first}.${last}${r.int(1, 99)}@${r.pick(["gmail.com", "gmail.com", "gmail.com", "yahoo.com", "outlook.com", "icloud.com"])}`.toLowerCase() : null,
    phone_number: r.chance(0.96) ? phone(r) : null,
    date_of_birth: r.chance(0.7) ? `${birthYear}-${String(r.int(1, 12)).padStart(2, "0")}-${String(r.int(1, 28)).padStart(2, "0")}` : null,
    age_group,
    relationship_status: r.weighted([["Single", 72], ["Married", 22], ["Engaged", 5], ["Widowed", 0.5], ["Divorced", 0.5]] as const),
    country,
    state,
    address: r.chance(0.7) ? `${r.int(1, 120)} ${r.pick(STREETS)}` : null,
    nearest_bus_stop: r.chance(0.6) ? r.pick(BUS_STOPS) : null,
    is_student,
    school: is_student ? r.pick(SCHOOLS) : null,
    occupation: is_student ? "Student" : r.pick(OCCUPATIONS),
    denomination: r.weighted(DENOM_W),
    created_at: created.toISOString(),
  } as const;
}

/** Intake timing: weighted toward the five retreat days (altar calls peak on nights 2–4). */
function eventTimestamp(r: Rng, edition: number, kind: "convert" | "counsellee") {
  const dayWeights: [number, number][] =
    kind === "convert"
      ? [[0, 14], [1, 24], [2, 27], [3, 22], [4, 9], [6, 2], [9, 1.2], [14, 0.8]]
      : [[-20, 1], [-12, 2], [-6, 4], [-2, 6], [0, 16], [1, 20], [2, 19], [3, 16], [4, 10], [8, 2]];
  const offset = r.weighted(dayWeights) + (r.chance(0.3) ? r.int(0, 1) : 0);
  const d = new Date(Date.UTC(edition, 11, 26 + offset, r.int(7, 22), r.int(0, 59)));
  return d;
}

function preEventTimestamp(r: Rng) {
  // 2026 has not happened yet (today is late November): spread over Oct 1 – Nov 23
  const start = Date.UTC(2026, 9, 1);
  const end = Date.UTC(2026, 10, 23, 20);
  const t = start + Math.pow(r.next(), 0.6) * (end - start);
  return new Date(t);
}

export function generateStaff(): StaffMember[] {
  const r = createRng(2026_10);
  const fixed: Array<Pick<StaffMember, "name" | "email" | "role" | "gender">> = [
    { name: "Ademola Sobaki", email: "superadmin@ymr.test", role: "super-admin", gender: "Male" },
    { name: "Ireoluwa Daramola", email: "admin@ymr.test", role: "admin", gender: "Female" },
    { name: "Tolu Afolabi", email: "counsellor@ymr.test", role: "user", gender: "Female" },
  ];
  const specialties = ["Youth & campus", "Marriage", "Grief", "Addiction recovery", "Career", "New believers", "Mental wellbeing", "Prayer", "Family"];
  const staff: StaffMember[] = [];
  const total = 64;
  for (let i = 0; i < total; i++) {
    const f = fixed[i];
    const gender = f?.gender ?? (r.chance(0.55) ? "Female" : "Male");
    const first = gender === "Female" ? r.pick(FIRST_F) : r.pick(FIRST_M);
    const last = r.pick(LAST);
    const name = f?.name ?? `${first} ${last}`;
    const status = i < 3 ? "active" : i > total - 7 ? "pending" : r.chance(0.06) ? "deactivated" : "active";
    const role = f?.role ?? (r.chance(0.12) ? "admin" : "user");
    const editions = [2024, 2025, 2026].filter((y) => y === 2026 || r.chance(y === 2025 ? 0.75 : 0.45));
    staff.push({
      id: `stf_${String(i + 1).padStart(3, "0")}`,
      name,
      email: f?.email ?? `${first}.${last}${r.int(1, 9)}@gmail.com`.toLowerCase(),
      phone_number: phone(r),
      gender,
      role,
      status,
      state: r.weighted(STATE_W),
      country: "Nigeria",
      denomination: r.weighted(DENOM_W.filter(([d]) => d !== "None")),
      years_of_experience: r.int(0, 15),
      has_certification: r.chance(0.35),
      specialties: [r.pick(specialties), ...(r.chance(0.6) ? [r.pick(specialties)] : [])].filter((v, idx, a) => a.indexOf(v) === idx),
      editions: status === "pending" ? [2026] : editions,
      will_attend: r.chance(0.85),
      avatar_url: null,
      created_at: new Date(Date.UTC(r.pick([2023, 2024, 2025, 2026]), r.int(0, 11), r.int(1, 28))).toISOString(),
      last_active_at: status === "active" ? new Date(Date.UTC(2026, 10, r.int(1, 24), r.int(6, 22))).toISOString() : null,
    });
  }
  return staff;
}

function timeline(r: Rng, created: Date, by: string, kind: "convert" | "counsellee", status: string, staffName: string | null): TimelineEntry[] {
  const out: TimelineEntry[] = [
    { id: r.id(), at: created.toISOString(), by, type: "created", text: kind === "convert" ? "Captured from altar-call form" : "Counselling request received" },
  ];
  let t = created.getTime();
  const step = (hours: number) => (t += hours * 3600_000 * (0.5 + r.next()));
  if (staffName && status !== "new" && status !== "pending") {
    step(6);
    out.push({ id: r.id(), at: new Date(t).toISOString(), by, type: "assignment", text: `Assigned to ${staffName}` });
  }
  if (["contacted", "connected", "discipled", "in-session", "follow-up", "resolved"].includes(status)) {
    step(30);
    out.push({ id: r.id(), at: new Date(t).toISOString(), by: staffName ?? by, type: r.pick(["call", "whatsapp", "sms"] as const), text: r.pick(["Spoke for 15 minutes, prayed together.", "Sent welcome message and first-steps guide.", "Called — very receptive, asked about a church close to home.", "Shared Bible reading plan."]) });
  }
  if (["connected", "discipled", "resolved"].includes(status)) {
    step(96);
    out.push({ id: r.id(), at: new Date(t).toISOString(), by: staffName ?? by, type: "note", text: r.pick(["Now attending a parish near home.", "Joined a cell fellowship.", "Follow-up session held; doing much better."]) });
  }
  if (status === "unreachable") {
    step(48);
    out.push({ id: r.id(), at: new Date(t).toISOString(), by: staffName ?? by, type: "call", text: "Three call attempts, no answer. Number may be wrong." });
  }
  return out;
}

export function generateConverts(edition: number, staff: StaffMember[]): Convert[] {
  const r = createRng(edition * 7 + 1);
  const n = EDITION_SIZES[edition]?.converts ?? 0;
  const team = staff.filter((s) => s.status === "active" && s.editions.includes(edition));
  const out: Convert[] = [];
  for (let i = 0; i < n; i++) {
    const created = edition === 2026 ? preEventTimestamp(r) : eventTimestamp(r, edition, "convert");
    const base = person(r, edition, created);
    const ageing = edition === 2026 ? 0.35 : edition === 2025 ? 1 : 1.2;
    const status: FollowUpStatus = r.weighted([
      ["new", edition === 2026 ? 50 : 10],
      ["contacted", 30 * ageing],
      ["connected", 26 * ageing],
      ["discipled", 18 * ageing],
      ["unreachable", 9],
    ] as const);
    const assignee = status === "new" && r.chance(0.7) ? null : r.pick(team);
    out.push({
      ...base,
      id: `cvt_${edition}_${String(i + 1).padStart(4, "0")}`,
      kind: "convert",
      online: r.chance(0.17),
      availability_for_follow_up: r.chance(0.93),
      follow_up_status: status,
      assigned_to: assignee?.id ?? null,
      last_contacted_at: status === "new" ? null : new Date(created.getTime() + (2 + Math.pow(r.next(), 2) * 160) * 3600_000).toISOString(),
      source: r.weighted([["form-upload", 78], ["web-form", 14], ["manual", 8]] as const),
      notes: timeline(r, created, "Capture desk", "convert", status, assignee?.name ?? null),
    });
  }
  return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

const URGENT_TOPICS = new Set(["Mental & emotional health", "Addiction & habits", "Grief & loss"]);

export function generateCounsellees(edition: number, staff: StaffMember[]): Counsellee[] {
  const r = createRng(edition * 13 + 5);
  const n = EDITION_SIZES[edition]?.counsellees ?? 0;
  const team = staff.filter((s) => s.status === "active" && s.editions.includes(edition));
  const out: Counsellee[] = [];
  const topicW: [string, number][] = [["Spiritual growth", 22], ["Relationships & marriage", 20], ["Career & purpose", 16], ["Mental & emotional health", 11], ["Family", 9], ["Finances", 6], ["Academics", 5], ["Addiction & habits", 5], ["Ministry & calling", 4], ["Grief & loss", 3]];
  for (let i = 0; i < n; i++) {
    const created = edition === 2026 ? preEventTimestamp(r) : eventTimestamp(r, edition, "counsellee");
    const base = person(r, edition, created);
    const primary = r.weighted(topicW);
    const topics = [primary, ...(r.chance(0.3) ? [r.weighted(topicW)] : [])].filter((v, idx, a) => a.indexOf(v) === idx);
    const urgency: Urgency = URGENT_TOPICS.has(primary) ? r.weighted([["high", 45], ["medium", 45], ["low", 10]] as const) : r.weighted([["high", 6], ["medium", 34], ["low", 60]] as const);
    const status: CounselleeStatus =
      edition === 2026
        ? r.weighted([["pending", 52], ["assigned", 34], ["in-session", 4], ["follow-up", 6], ["resolved", 4]] as const)
        : r.weighted([["pending", 3], ["assigned", 6], ["in-session", 2], ["follow-up", 22], ["resolved", 67]] as const);
    const assignee = status === "pending" ? null : r.pick(team);
    out.push({
      ...base,
      id: `csl_${edition}_${String(i + 1).padStart(4, "0")}`,
      kind: "counsellee",
      counselling_reason: r.pick(REASONS[primary] ?? REASONS["Spiritual growth"]!),
      topics,
      urgency,
      preferred_mode: r.weighted([["In person at YMR", 58], ["Phone call", 22], ["WhatsApp", 20]] as const),
      status,
      assigned_to: assignee?.id ?? null,
      session_at: status === "pending" ? null : new Date(Date.UTC(edition, 11, 26 + r.int(0, 4), r.int(9, 18))).toISOString(),
      counsellor_comments: status === "resolved" ? r.pick(["Prayed together; recommended a reading plan. Follow-up done.", "Referred to a professional counsellor for ongoing support.", "Very hopeful outcome. Connected to a mentor."]) : null,
      reference: `${String(edition).slice(2)}${["FG", "NA", "CT"][edition - 2024] ?? "YM"}-${r.id(4).toUpperCase()}`,
      source: r.weighted([["web-form", 64], ["form-upload", 30], ["manual", 6]] as const),
      notes: timeline(r, created, "Web form", "counsellee", status, assignee?.name ?? null),
    });
  }
  return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function generateTemplates(): MessageTemplate[] {
  const t = "2026-11-02T10:00:00.000Z";
  return [
    { id: "tpl_welcome_sms", name: "Welcome to the family", channel: "sms", subject: null, category: "welcome", updated_at: t, body: "Hi {{first_name}}, welcome to God's family! We're so glad you gave your life to Jesus at YMR {{edition_year}}. A counsellor will reach out to you soon. — YMR Counselling" },
    { id: "tpl_welcome_email", name: "Welcome — first steps", channel: "email", subject: "Welcome to the family, {{first_name}} 🔥", category: "welcome", updated_at: t, body: "Dear {{first_name}},\n\nHeaven is rejoicing over you! Your decision at YMR {{edition_year}} — {{edition_theme}} is the beginning of a beautiful journey.\n\nHere are three first steps:\n1. Read the Gospel of John, one chapter a day.\n2. Talk to God every day — just as you'd talk to a friend.\n3. Find a Bible-believing church near you. Reply to this email and we'll help.\n\n\"Therefore if any man be in Christ, he is a new creature.\" — 2 Corinthians 5:17\n\nWith love,\nYMR Counselling & Follow-up" },
    { id: "tpl_followup_wa", name: "Week-one check-in", channel: "whatsapp", subject: null, category: "follow-up", updated_at: t, body: "Hello {{first_name}} 👋🏾 It's the YMR follow-up team. How has your first week been? Is there anything we can pray with you about? Reply here anytime." },
    { id: "tpl_session_sms", name: "Session reminder", channel: "sms", subject: null, category: "reminder", updated_at: t, body: "Hi {{first_name}}, your counselling session at YMR is on {{session_time}} at the Counselling Tent, Old Auditorium. Ref: {{reference}}." },
    { id: "tpl_counsellor_brief", name: "Counsellor briefing", channel: "email", subject: "City Takers — counsellor briefing & rota", category: "event", updated_at: t, body: "Dear {{first_name}},\n\nThank you for serving at YMR {{edition_year}}. The counsellors' briefing holds on Dec 25 at 4pm in the Counselling Tent. Please come with your Bible, notepad and a charged phone.\n\nGod bless you,\nCounselling Team Lead" },
    { id: "tpl_devotional_wa", name: "Daily word", channel: "whatsapp", subject: null, category: "devotional", updated_at: t, body: "Good morning {{first_name}} ☀️ Today's word: \"Every place that the sole of your foot shall tread upon, that have I given unto you.\" — Joshua 1:3. Go take your city! 🔥" },
  ];
}

const FAILURE_REASONS: Record<string, string[]> = {
  sms: ["DND active on number", "Invalid number", "Network timeout", "Insufficient units"],
  email: ["Hard bounce", "Mailbox full", "Invalid address", "Marked as spam"],
  whatsapp: ["Not a WhatsApp number", "Template not approved", "Rate limited", "User blocked business"],
};

export function generateBatches(staff: StaffMember[]): NotificationBatch[] {
  const r = createRng(424242);
  const senders = staff.filter((s) => s.role === "super-admin" || (s.role === "admin" && r.chance(0.4)));
  const plan: Array<[number, number]> = [[2024, 9], [2025, 18], [2026, 7]];
  const out: NotificationBatch[] = [];
  const templates = generateTemplates();
  let n = 0;
  for (const [edition, count] of plan) {
    for (let i = 0; i < count; i++) {
      const channel = edition === 2024 ? r.weighted([["sms", 6], ["email", 4]] as const) : r.weighted([["sms", 4], ["email", 4], ["whatsapp", edition === 2026 ? 4 : 2]] as const);
      const audience = r.weighted([["converts", 6], ["counsellees", 3], ["counsellors", 2]] as const);
      const tpl = r.pick(templates.filter((t) => t.channel === channel)) ?? templates[0]!;
      const total = audience === "counsellors" ? r.int(30, 60) : edition === 2026 ? r.int(40, 120) : r.int(120, edition === 2025 ? 1100 : 600);
      const failRate = channel === "sms" ? 0.04 + r.next() * 0.1 : channel === "email" ? 0.01 + r.next() * 0.05 : 0.03 + r.next() * 0.12;
      const hardFail = r.chance(0.05);
      const failed = hardFail ? total : Math.round(total * failRate);
      const scheduled = edition === 2026 && i === count - 1;
      const delivered = scheduled ? 0 : total - failed;
      const created =
        edition === 2026
          ? new Date(Date.UTC(2026, 9 + Math.floor(i / 4), 3 + i * 3, r.int(8, 18)))
          : new Date(Date.UTC(edition, 11, 26 + Math.floor((i / count) * 25), r.int(7, 21), r.int(0, 59)));
      const reasons: Record<string, number> = {};
      if (!scheduled) {
        let left = failed;
        for (const reason of FAILURE_REASONS[channel]!) {
          const take = reason === FAILURE_REASONS[channel]![FAILURE_REASONS[channel]!.length - 1] ? left : Math.round(left * (0.3 + r.next() * 0.4));
          if (take > 0) reasons[reason] = take;
          left -= take;
          if (left <= 0) break;
        }
      }
      const provider = channel === "sms" ? "termii" : channel === "email" ? (edition === 2024 ? "termii" : "aws_ses") : edition === 2026 ? "kapso" : "twilio";
      const unit = channel === "sms" ? 6.5 : channel === "email" ? 0.16 : 10.5;
      out.push({
        id: `nb_${String(++n).padStart(4, "0")}`,
        edition,
        channel,
        provider,
        audience,
        audience_label: audience === "converts" ? (r.chance(0.5) ? "All converts" : "Converts · not yet contacted") : audience === "counsellees" ? "Counsellees · upcoming sessions" : "Counselling team",
        subject: channel === "email" ? tpl.subject?.replace("{{first_name}}", "friend") ?? null : null,
        message: tpl.body,
        template_id: tpl.id,
        total,
        delivered,
        failed: scheduled ? 0 : failed,
        pending: scheduled ? total : 0,
        opened: channel === "sms" || scheduled ? null : Math.round(delivered * (channel === "email" ? 0.38 + r.next() * 0.2 : 0.7 + r.next() * 0.2)),
        cost_ngn: Math.round(total * unit * (channel === "sms" ? Math.ceil(tpl.body.length / 160) : 1)),
        status: scheduled ? "scheduled" : hardFail ? "failed" : failed / total > 0.1 ? "partial" : "sent",
        created_by: r.pick(senders)?.name ?? "Ademola Sobaki",
        created_at: created.toISOString(),
        scheduled_for: scheduled ? "2026-12-26T06:30:00.000Z" : null,
        completed_at: scheduled ? null : new Date(created.getTime() + r.int(2, 30) * 60_000).toISOString(),
        failure_reasons: hardFail ? { [channel === "whatsapp" ? "Template not approved" : "Provider authentication failed"]: total } : reasons,
      });
    }
  }
  return out.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function generateActivity(staff: StaffMember[]): ActivityEvent[] {
  const r = createRng(99);
  const actors = staff.filter((s) => s.status === "active").slice(0, 14);
  const templates: Array<[ActivityEvent["kind"], string, () => string]> = [
    ["capture", "uploaded and extracted", () => `${r.int(4, 28)} convert forms`],
    ["edit", "updated follow-up status for", () => `${r.pick(FIRST_F)} ${r.pick(LAST)}`],
    ["create", "registered counsellee", () => `${r.pick(FIRST_M)} ${r.pick(LAST)}`],
    ["notify", "sent a WhatsApp check-in to", () => `${r.int(20, 90)} converts`],
    ["export", "exported", () => `converts (${r.pick(["CSV", "Excel"])})`],
    ["access", "approved staff account for", () => `${r.pick(FIRST_F)} ${r.pick(LAST)}`],
  ];
  const out: ActivityEvent[] = [];
  for (let i = 0; i < 40; i++) {
    const [kind, action, target] = r.pick(templates);
    out.push({
      id: `act_${i}`,
      at: new Date(Date.UTC(2026, 10, 24) - i * r.int(30, 200) * 60_000).toISOString(),
      actor: r.pick(actors).name,
      action,
      target: target(),
      edition: 2026,
      kind,
    });
  }
  return out;
}

export { COUNSELLING_TOPICS, DENOMINATIONS };
