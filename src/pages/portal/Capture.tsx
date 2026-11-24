import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, CheckCheck, FileImage, Keyboard, Loader2, Printer, RotateCcw, ScanLine, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { PageHeader, Panel } from "@/components/portal/kit";
import { Button } from "@/components/ui/button";
import { AGE_GROUPS, NIGERIAN_STATES } from "@/config/site";
import { useEdition } from "@/context/EditionContext";
import { api } from "@/data/api";
import { useInvalidate } from "@/hooks/queries";
import { fmtNum } from "@/lib/format";
import { uid } from "@/lib/rng";
import { cn } from "@/lib/utils";
import type { AgeGroup, ExtractedForm, Gender } from "@/types";

const FIELDS: { key: string; label: string; type?: "select" | "bool"; options?: readonly string[]; wide?: boolean; only?: "convert" | "counsellee" }[] = [
  { key: "name", label: "Full name", wide: true },
  { key: "phone_number", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
  { key: "age_group", label: "Age group", type: "select", options: AGE_GROUPS },
  { key: "state", label: "State", type: "select", options: NIGERIAN_STATES },
  { key: "address", label: "Address" },
  { key: "nearest_bus_stop", label: "Bus stop" },
  { key: "denomination", label: "Church" },
  { key: "occupation", label: "Occupation" },
  { key: "is_student", label: "Student", type: "bool" },
  { key: "online", label: "Online convert", type: "bool", only: "convert" },
  { key: "counselling_reason", label: "Reason for counselling", wide: true, only: "counsellee" },
];

export default function Capture() {
  const { user } = useAuth();
  const { year, isCurrent } = useEdition();
  const invalidate = useInvalidate();
  const [kind, setKind] = useState<"convert" | "counsellee">("convert");
  const [items, setItems] = useState<ExtractedForm[]>([]);
  const [drag, setDrag] = useState(false);
  const [saving, setSaving] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const update = (id: string, patch: Partial<ExtractedForm>) => setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = [...files].filter((f) => f.type.startsWith("image/") || f.type === "application/pdf").slice(0, 40);
      if (!list.length) return toast.error("Drop photos (JPG, PNG, HEIC) or PDFs of the forms.");
      const fresh: ExtractedForm[] = list.map((f) => ({
        id: uid("cap_"),
        fileName: f.name,
        previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
        kind,
        status: "queued",
        fields: {},
        confidence: {},
        duplicateOf: null,
      }));
      setItems((xs) => [...fresh, ...xs]);
      // Read three at a time, like the API's worker pool
      const queue = list.map((f, i) => ({ f, id: fresh[i]!.id }));
      const worker = async () => {
        for (let job = queue.shift(); job; job = queue.shift()) {
          update(job.id, { status: "reading" });
          try {
            const r = await api.capture.extract(job.f, kind, year);
            update(job.id, { ...r, status: "ready" });
          } catch {
            update(job.id, { status: "error" });
          }
        }
      };
      await Promise.all([worker(), worker(), worker()]);
    },
    [kind, year],
  );

  const manual = () =>
    setItems((xs) => [
      { id: uid("cap_"), fileName: "Typed in", previewUrl: "", kind, status: "ready", fields: { edition: year, country: "Nigeria" }, confidence: {}, duplicateOf: null },
      ...xs,
    ]);

  const approved = items.filter((x) => x.status === "approved");
  const ready = items.filter((x) => x.status === "ready");

  const save = async () => {
    setSaving(true);
    try {
      for (const it of approved) {
        const f = it.fields;
        const base = {
          edition: year,
          name: String(f.name ?? "").trim() || "Unnamed",
          gender: (f.gender ?? null) as Gender | null,
          email: f.email ?? null,
          phone_number: f.phone_number ?? null,
          date_of_birth: null,
          age_group: (f.age_group ?? null) as AgeGroup | null,
          relationship_status: f.relationship_status ?? null,
          country: f.country ?? "Nigeria",
          state: f.state ?? null,
          address: f.address ?? null,
          nearest_bus_stop: f.nearest_bus_stop ?? null,
          is_student: !!f.is_student,
          school: f.school ?? null,
          occupation: f.occupation ?? null,
          denomination: f.denomination ?? null,
          source: it.previewUrl ? ("form-upload" as const) : ("manual" as const),
        };
        if (it.kind === "convert") await api.converts.create({ ...base, online: !!f.online, availability_for_follow_up: f.availability_for_follow_up ?? true }, user!.name);
        else await api.counsellees.create({ ...base, counselling_reason: f.counselling_reason ?? "", preferred_mode: "In person at YMR" }, user!.name);
      }
      await invalidate();
      toast.success(`Saved ${fmtNum(approved.length)} ${kind === "convert" ? "converts" : "counsellees"} to YMR ${year}`);
      approved.forEach((a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl));
      setItems((xs) => xs.filter((x) => x.status !== "approved"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={`Saving into YMR ${year}`}
        title="AI Capture"
        description="Snap or scan the paper cards from the altar and counselling tent. AI reads the handwriting; you check and approve."
        actions={
          <>
          <Button variant="outline" size="sm" asChild>
            <Link to="/forms/convert" target="_blank">
              <Printer className="mr-1.5 h-4 w-4" /> Print blank cards
            </Link>
          </Button>
          <div className="flex rounded-lg border p-0.5" role="radiogroup" aria-label="Form type">
            {(["convert", "counsellee"] as const).map((k) => (
              <button key={k} role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={cn("rounded-md px-3 py-1.5 text-xs font-semibold capitalize", kind === k ? "bg-ember text-ink" : "text-muted-foreground")}>
                {k} forms
              </button>
            ))}
          </div>
          </>
        }
      />

      {!isCurrent && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-status-warning/40 bg-status-warning/10 px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-status-warning" />
          You're capturing into the archived YMR {year} edition. Switch editions if that's not intended.
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition sm:p-12",
          drag ? "border-ember bg-ember/10" : "border-border bg-card hover:border-ember/50",
        )}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#f68b1e_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative mx-auto flex max-w-md flex-col items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-ember text-ink shadow-lg shadow-ember/30">
            <UploadCloud className="h-8 w-8" />
          </span>
          <p className="mt-5 text-lg font-semibold">Drop form photos here</p>
          <p className="mt-1 text-sm text-muted-foreground">Up to 40 at a time · JPG, PNG, HEIC or PDF · works with your phone camera</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={() => input.current?.click()}>
              <ScanLine className="mr-1.5 h-4 w-4" /> Choose photos
            </Button>
            <Button variant="outline" onClick={manual}>
              <Keyboard className="mr-1.5 h-4 w-4" /> Type one in
            </Button>
          </div>
          <input ref={input} type="file" accept="image/*,application/pdf" capture="environment" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
        </div>
      </div>

      {items.length > 0 && (
        <div className="sticky top-16 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-y bg-background/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
          <p className="text-sm">
            <span className="font-semibold">{fmtNum(items.length)}</span> forms ·{" "}
            <span className="text-muted-foreground">
              {fmtNum(items.filter((x) => x.status === "reading" || x.status === "queued").length)} reading · {fmtNum(ready.length)} to review · {fmtNum(approved.length)} approved
            </span>
          </p>
          <div className="ml-auto flex gap-2">
            {ready.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setItems((xs) => xs.map((x) => (x.status === "ready" && !x.duplicateOf ? { ...x, status: "approved" } : x)))}>
                <CheckCheck className="mr-1.5 h-4 w-4" /> Approve all clean
              </Button>
            )}
            <Button size="sm" disabled={!approved.length || saving} onClick={save}>
              {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Check className="mr-1.5 h-4 w-4" />}
              Save {approved.length ? fmtNum(approved.length) : ""} to database
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-5 2xl:grid-cols-2">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.div key={it.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
              <ReviewCard item={it} onChange={(p) => update(it.id, p)} onRemove={() => setItems((xs) => xs.filter((x) => x.id !== it.id))} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <Panel className="mt-6" title="How AI Capture works">
          <ol className="grid gap-4 text-sm sm:grid-cols-3">
            {[
              ["Upload", "Photograph a stack of cards on a table — one card per photo works best."],
              ["Review", "Fields the AI is unsure about are highlighted. Possible duplicates are flagged."],
              ["Save", "Approved forms go straight into the follow-up pipeline for this edition."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember/15 text-xs font-bold text-ember">{i + 1}</span>
                <span>
                  <span className="font-semibold">{t}</span>
                  <span className="block text-muted-foreground">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </>
  );
}

function ReviewCard({ item, onChange, onRemove }: { item: ExtractedForm; onChange: (p: Partial<ExtractedForm>) => void; onRemove: () => void }) {
  const reading = item.status === "reading" || item.status === "queued";
  const low = Object.entries(item.confidence).filter(([, c]) => c < 0.8).length;
  const set = (k: string, v: unknown) => onChange({ fields: { ...item.fields, [k]: v }, confidence: { ...item.confidence, [k]: 1 } });

  return (
    <article className={cn("panel overflow-hidden", item.status === "approved" && "border-status-good/60 ring-1 ring-status-good/30")}>
      <div className="grid sm:grid-cols-[200px_1fr]">
        <div className="relative min-h-[180px] bg-muted sm:min-h-full">
          {item.previewUrl ? (
            <img src={item.previewUrl} alt={item.fileName} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              {item.fileName === "Typed in" ? <Keyboard className="h-8 w-8" /> : <FileImage className="h-8 w-8" />}
              <span className="text-xs">{item.fileName}</span>
            </div>
          )}
          {reading && (
            <div className="absolute inset-0 overflow-hidden bg-black/50">
              <div className="absolute inset-x-0 h-12 animate-scan bg-gradient-to-b from-transparent via-ember/60 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-cream">{item.status === "queued" ? "Queued" : "Reading handwriting…"}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.fileName}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {item.kind} form
                {!reading && low > 0 && <span className="ml-2 text-amber-600 dark:text-status-warning">· {low} field{low > 1 ? "s" : ""} to check</span>}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              {item.status === "approved" ? (
                <Button size="sm" variant="ghost" onClick={() => onChange({ status: "ready" })}>
                  <RotateCcw className="mr-1 h-3.5 w-3.5" /> Undo
                </Button>
              ) : (
                <Button size="sm" disabled={reading} onClick={() => onChange({ status: "approved" })}>
                  <Check className="mr-1 h-3.5 w-3.5" /> Approve
                </Button>
              )}
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onRemove} aria-label="Discard">
                {item.status === "approved" ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {item.duplicateOf && (
            <div className="mb-3 flex items-start gap-2 rounded-lg border border-status-warning/40 bg-status-warning/10 px-3 py-2 text-xs">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-status-warning" />
              <span>
                Possible duplicate of <strong>{item.duplicateOf.name}</strong> — {item.duplicateOf.reason.toLowerCase()}.
              </span>
            </div>
          )}

          {reading ? (
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {FIELDS.filter((f) => !f.only || f.only === item.kind).map((f) => {
                const v = (item.fields as Record<string, unknown>)[f.key];
                const c = item.confidence[f.key];
                const unsure = c !== undefined && c < 0.8;
                const cls = cn(
                  "h-9 w-full rounded-lg border bg-background px-2.5 text-[13px] outline-none focus:border-ember/60",
                  unsure && "border-status-warning/70 bg-status-warning/5",
                );
                return (
                  <label key={f.key} className={cn("space-y-1", f.wide && "col-span-2")}>
                    <span className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                      {f.label}
                      {unsure && <span className="text-amber-600 dark:text-status-warning">{Math.round(c! * 100)}% sure</span>}
                    </span>
                    {f.type === "select" ? (
                      <select className={cls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value || null)} disabled={item.status === "approved"}>
                        <option value="">—</option>
                        {f.options!.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === "bool" ? (
                      <select className={cls} value={v ? "yes" : "no"} onChange={(e) => set(f.key, e.target.value === "yes")} disabled={item.status === "approved"}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    ) : (
                      <input className={cls} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} disabled={item.status === "approved"} />
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
