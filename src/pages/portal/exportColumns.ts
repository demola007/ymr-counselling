import type { ExportColumn } from "@/lib/export";
import type { Convert, Counsellee, NotificationBatch, StaffMember } from "@/types";

const person = <T extends Convert | Counsellee>(): ExportColumn<T>[] => [
  { key: "name", label: "Name", value: (r) => r.name },
  { key: "gender", label: "Gender", value: (r) => r.gender },
  { key: "phone_number", label: "Phone", value: (r) => r.phone_number },
  { key: "email", label: "Email", value: (r) => r.email },
  { key: "age_group", label: "Age group", value: (r) => r.age_group },
  { key: "date_of_birth", label: "Date of birth", value: (r) => r.date_of_birth },
  { key: "relationship_status", label: "Relationship status", value: (r) => r.relationship_status },
  { key: "country", label: "Country", value: (r) => r.country },
  { key: "state", label: "State", value: (r) => r.state },
  { key: "address", label: "Address", value: (r) => r.address },
  { key: "nearest_bus_stop", label: "Nearest bus stop", value: (r) => r.nearest_bus_stop },
  { key: "is_student", label: "Student", value: (r) => (r.is_student ? "Yes" : "No") },
  { key: "school", label: "School", value: (r) => r.school },
  { key: "occupation", label: "Occupation", value: (r) => r.occupation },
  { key: "denomination", label: "Denomination", value: (r) => r.denomination },
  { key: "edition", label: "YMR edition", value: (r) => r.edition },
  { key: "source", label: "Source", value: (r) => r.source },
  { key: "created_at", label: "Captured at", value: (r) => r.created_at },
];

export const CONVERT_EXPORT_COLUMNS = (staffName: Map<string, string>): ExportColumn<Convert>[] => [
  ...person<Convert>(),
  { key: "follow_up_status", label: "Follow-up status", value: (r) => r.follow_up_status },
  { key: "assigned_to", label: "Counsellor", value: (r) => (r.assigned_to ? staffName.get(r.assigned_to) ?? r.assigned_to : "") },
  { key: "online", label: "Online convert", value: (r) => (r.online ? "Yes" : "No") },
  { key: "availability_for_follow_up", label: "Open to follow-up", value: (r) => (r.availability_for_follow_up ? "Yes" : "No") },
  { key: "last_contacted_at", label: "Last contacted", value: (r) => r.last_contacted_at },
];

export const COUNSELLEE_EXPORT_COLUMNS = (staffName: Map<string, string>): ExportColumn<Counsellee>[] => [
  { key: "reference", label: "Reference", value: (r) => r.reference },
  ...person<Counsellee>(),
  { key: "status", label: "Status", value: (r) => r.status },
  { key: "urgency", label: "Urgency (AI)", value: (r) => r.urgency },
  { key: "topics", label: "Topics (AI)", value: (r) => r.topics.join("; ") },
  { key: "counselling_reason", label: "Reason", value: (r) => r.counselling_reason },
  { key: "preferred_mode", label: "Preferred mode", value: (r) => r.preferred_mode },
  { key: "assigned_to", label: "Counsellor", value: (r) => (r.assigned_to ? staffName.get(r.assigned_to) ?? r.assigned_to : "") },
  { key: "session_at", label: "Session", value: (r) => r.session_at },
  { key: "counsellor_comments", label: "Counsellor comments", value: (r) => r.counsellor_comments },
];

export const STAFF_EXPORT_COLUMNS: ExportColumn<StaffMember>[] = [
  { key: "name", label: "Name", value: (r) => r.name },
  { key: "email", label: "Email", value: (r) => r.email },
  { key: "phone_number", label: "Phone", value: (r) => r.phone_number },
  { key: "gender", label: "Gender", value: (r) => r.gender },
  { key: "role", label: "Role", value: (r) => r.role },
  { key: "status", label: "Status", value: (r) => r.status },
  { key: "state", label: "State", value: (r) => r.state },
  { key: "denomination", label: "Denomination", value: (r) => r.denomination },
  { key: "years_of_experience", label: "Years of experience", value: (r) => r.years_of_experience },
  { key: "has_certification", label: "Certified", value: (r) => (r.has_certification ? "Yes" : "No") },
  { key: "specialties", label: "Specialties", value: (r) => r.specialties.join("; ") },
  { key: "editions", label: "Editions served", value: (r) => r.editions.join("; ") },
  { key: "will_attend", label: "Attending in person", value: (r) => (r.will_attend ? "Yes" : "No") },
];

export const BATCH_EXPORT_COLUMNS: ExportColumn<NotificationBatch>[] = [
  { key: "id", label: "Batch", value: (r) => r.id },
  { key: "created_at", label: "Created", value: (r) => r.created_at },
  { key: "edition", label: "YMR edition", value: (r) => r.edition },
  { key: "channel", label: "Channel", value: (r) => r.channel },
  { key: "provider", label: "Provider", value: (r) => r.provider },
  { key: "audience_label", label: "Audience", value: (r) => r.audience_label },
  { key: "status", label: "Status", value: (r) => r.status },
  { key: "total", label: "Recipients", value: (r) => r.total },
  { key: "delivered", label: "Delivered", value: (r) => r.delivered },
  { key: "failed", label: "Failed", value: (r) => r.failed },
  { key: "cost_ngn", label: "Cost (NGN)", value: (r) => r.cost_ngn },
  { key: "created_by", label: "Sent by", value: (r) => r.created_by },
];
