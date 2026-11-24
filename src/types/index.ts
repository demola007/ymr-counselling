/** Domain types shared by the landing site, the portal and the API layer. */

export type Role = "user" | "admin" | "super-admin";

export type Gender = "Male" | "Female";
export type AgeGroup = "Under 18" | "18-24" | "25-30" | "31-35" | "36-45" | "46+";

/** Fields common to anyone captured on the platform (converts and counsellees). */
export interface PersonBase {
  id: string;
  edition: number; // the YMR year the record belongs to, e.g. 2025
  name: string;
  gender: Gender | null;
  email: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  age_group: AgeGroup | null;
  relationship_status: "Single" | "Married" | "Engaged" | "Widowed" | "Divorced" | null;
  country: string | null;
  state: string | null;
  address: string | null;
  nearest_bus_stop: string | null;
  is_student: boolean;
  school: string | null;
  occupation: string | null;
  denomination: string | null;
  created_at: string; // ISO
  source: "form-upload" | "web-form" | "manual" | "import";
}

export type FollowUpStatus = "new" | "contacted" | "connected" | "discipled" | "unreachable";

export interface Convert extends PersonBase {
  kind: "convert";
  online: boolean;
  availability_for_follow_up: boolean;
  follow_up_status: FollowUpStatus;
  assigned_to: string | null; // staff id
  last_contacted_at: string | null;
  notes: TimelineEntry[];
}

export type CounselleeStatus = "pending" | "assigned" | "in-session" | "follow-up" | "resolved";
export type Urgency = "low" | "medium" | "high";

export interface Counsellee extends PersonBase {
  kind: "counsellee";
  counselling_reason: string;
  topics: string[]; // AI-classified
  urgency: Urgency; // AI triage
  preferred_mode: "In person at YMR" | "Phone call" | "WhatsApp";
  status: CounselleeStatus;
  assigned_to: string | null;
  session_at: string | null;
  counsellor_comments: string | null;
  reference: string;
  notes: TimelineEntry[];
}

export interface TimelineEntry {
  id: string;
  at: string;
  by: string; // staff name
  type: "note" | "call" | "sms" | "email" | "whatsapp" | "status" | "assignment" | "created";
  text: string;
}

export type StaffStatus = "active" | "pending" | "deactivated";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  gender: Gender | null;
  role: Role;
  status: StaffStatus;
  state: string | null;
  country: string | null;
  denomination: string | null;
  years_of_experience: number;
  has_certification: boolean;
  specialties: string[];
  editions: number[]; // the YMR years they served
  will_attend: boolean;
  avatar_url: string | null;
  created_at: string;
  last_active_at: string | null;
}

export type Channel = "email" | "sms" | "whatsapp";
export type BatchStatus = "queued" | "sending" | "sent" | "partial" | "failed" | "scheduled";
export type Audience = "converts" | "counsellees" | "counsellors";

export interface NotificationBatch {
  id: string;
  edition: number;
  channel: Channel;
  provider: string;
  audience: Audience;
  audience_label: string;
  subject: string | null;
  message: string;
  template_id: string | null;
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  opened: number | null; // email/whatsapp read receipts
  cost_ngn: number;
  status: BatchStatus;
  created_by: string;
  created_at: string;
  scheduled_for: string | null;
  completed_at: string | null;
  failure_reasons: Record<string, number>;
}

export interface NotificationRecipient {
  id: string;
  batch_id: string;
  name: string;
  address: string; // email or phone
  status: "delivered" | "failed" | "pending" | "read";
  error: string | null;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  channel: Channel;
  subject: string | null;
  body: string;
  category: "welcome" | "follow-up" | "reminder" | "event" | "devotional";
  updated_at: string;
}

export interface Edition {
  year: number;
  number: number; // 1st, 2nd ... 10th
  theme: string;
  flyer: string;
  start: string; // ISO date
  end: string;
  venue: string;
  hasData: boolean; // whether the portal holds data for this year
  accent?: string;
}

export interface ActivityEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  edition: number;
  kind: "capture" | "edit" | "notify" | "export" | "access" | "create" | "delete";
}

export interface ExportRecord {
  id: string;
  at: string;
  by: string;
  dataset: Audience | "notifications";
  editions: number[];
  format: "csv" | "xlsx" | "json";
  rows: number;
}

/** Any field a convert or counsellee record can hold. */
export type PersonFields = Partial<Omit<Convert, "kind"> & Omit<Counsellee, "kind">>;

/** Result of reading one handwritten form with the AI extractor. */
export interface ExtractedForm {
  id: string;
  fileName: string;
  previewUrl: string;
  kind: "convert" | "counsellee";
  status: "queued" | "reading" | "ready" | "approved" | "rejected" | "error";
  fields: PersonFields;
  confidence: Record<string, number>; // 0..1 per field
  duplicateOf: { id: string; name: string; reason: string } | null;
}
