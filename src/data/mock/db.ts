/**
 * In-browser mock database. Seed data is generated deterministically; any
 * changes made in the UI (edits, new records, sends) are kept in localStorage
 * as a small change-log so they survive a reload. `resetMockDb()` clears it.
 */
import { DATA_EDITIONS } from "@/config/editions";
import type { ActivityEvent, Convert, Counsellee, ExportRecord, MessageTemplate, NotificationBatch, StaffMember } from "@/types";
import { generateActivity, generateBatches, generateConverts, generateCounsellees, generateStaff, generateTemplates } from "./seed";

const KEY = "ymr-mockdb-v1";

interface ChangeLog {
  patches: Record<string, Record<string, unknown>>;
  created: { converts: Convert[]; counsellees: Counsellee[]; staff: StaffMember[]; batches: NotificationBatch[]; templates: MessageTemplate[] };
  deleted: string[];
  activity: ActivityEvent[];
  exports: ExportRecord[];
  passwords: Record<string, string>;
}

const emptyLog = (): ChangeLog => ({
  patches: {},
  created: { converts: [], counsellees: [], staff: [], batches: [], templates: [] },
  deleted: [],
  activity: [],
  exports: [],
  passwords: {},
});

function readLog(): ChangeLog {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyLog();
    const parsed = JSON.parse(raw) as ChangeLog;
    return { ...emptyLog(), ...parsed, created: { ...emptyLog().created, ...parsed.created } };
  } catch {
    return emptyLog();
  }
}

class MockDb {
  log: ChangeLog = readLog();
  staff: StaffMember[] = [];
  converts: Convert[] = [];
  counsellees: Counsellee[] = [];
  batches: NotificationBatch[] = [];
  templates: MessageTemplate[] = [];
  activity: ActivityEvent[] = [];

  constructor() {
    this.hydrate();
  }

  private apply<T extends { id: string }>(seed: T[], created: T[]): T[] {
    const deleted = new Set(this.log.deleted);
    return [...created, ...seed]
      .filter((x) => !deleted.has(x.id))
      .map((x) => (this.log.patches[x.id] ? ({ ...x, ...this.log.patches[x.id] } as T) : x));
  }

  hydrate() {
    const staff = generateStaff();
    this.staff = this.apply(staff, this.log.created.staff);
    this.converts = this.apply(DATA_EDITIONS.flatMap((e) => generateConverts(e.year, staff)), this.log.created.converts);
    this.counsellees = this.apply(DATA_EDITIONS.flatMap((e) => generateCounsellees(e.year, staff)), this.log.created.counsellees);
    this.batches = this.apply(generateBatches(staff), this.log.created.batches);
    this.templates = this.apply(generateTemplates(), this.log.created.templates);
    this.activity = [...this.log.activity, ...generateActivity(staff)];
  }

  persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.log));
    } catch {
      /* storage full or blocked — changes stay in memory for this session */
    }
  }

  patch(id: string, patch: Record<string, unknown>) {
    this.log.patches[id] = { ...(this.log.patches[id] ?? {}), ...patch };
    this.persist();
  }

  reset() {
    this.log = emptyLog();
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    this.hydrate();
  }
}

export const db = new MockDb();
export const resetMockDb = () => db.reset();
