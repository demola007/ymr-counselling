import { useState } from "react";
import { Lock } from "lucide-react";
import { Chips, Field, FormShell, NavButtons, StepPanel, Stepper, SuccessCard, inputCls } from "@/components/forms/FormKit";
import { CURRENT_YEAR } from "@/config/editions";
import { AGE_GROUPS, COUNSELLING_TOPICS, COUNTRIES, DENOMINATIONS, NIGERIAN_STATES } from "@/config/site";
import { api } from "@/data/api";
import type { AgeGroup, Counsellee, Gender } from "@/types";
import { isEmail, isPhone, useStepForm } from "./useStepForm";

const STEPS = ["About you", "Where you're from", "How we can help", "Review"];
const MODES = ["In person at YMR", "Phone call", "WhatsApp"] as const;

type V = {
  name: string;
  gender: Gender | "";
  age_group: AgeGroup | "";
  phone_number: string;
  email: string;
  country: string;
  state: string;
  address: string;
  denomination: string;
  occupation: string;
  is_student: boolean;
  topics: string[];
  counselling_reason: string;
  preferred_mode: (typeof MODES)[number];
  consent: boolean;
};

export default function Counselling() {
  const f = useStepForm<V>(
    { name: "", gender: "", age_group: "", phone_number: "", email: "", country: "Nigeria", state: "", address: "", denomination: "", occupation: "", is_student: false, topics: [], counselling_reason: "", preferred_mode: "In person at YMR", consent: false },
    [
      (v) => ({
        name: v.name.trim().split(/\s+/).length < 2 ? "Please enter your first and last name" : undefined,
        gender: !v.gender ? "Please choose one" : undefined,
        phone_number: !isPhone(v.phone_number) ? "Enter a valid phone number so we can reach you" : undefined,
        email: v.email && !isEmail(v.email) ? "That email doesn't look right" : undefined,
      }),
      (v) => ({ state: v.country === "Nigeria" && !v.state ? "Choose your state" : undefined }),
      (v) => ({
        topics: v.topics.length === 0 ? "Choose at least one area" : undefined,
        counselling_reason: v.counselling_reason.trim().length < 10 ? "Tell us a little more (a sentence is fine)" : undefined,
      }),
      (v) => ({ consent: !v.consent ? "Please confirm to continue" : undefined }),
    ],
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Counsellee | null>(null);
  const v = f.values;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.last) return void f.next();
    if (!f.validateCurrent()) return;
    setBusy(true);
    try {
      const rec = await api.counsellees.create(
        {
          edition: CURRENT_YEAR,
          name: v.name.trim(),
          gender: (v.gender || null) as Gender | null,
          email: v.email.trim() || null,
          phone_number: v.phone_number.trim(),
          date_of_birth: null,
          age_group: (v.age_group || null) as AgeGroup | null,
          relationship_status: null,
          country: v.country,
          state: v.state || null,
          address: v.address || null,
          nearest_bus_stop: null,
          is_student: v.is_student,
          school: null,
          occupation: v.occupation || null,
          denomination: v.denomination || null,
          source: "web-form",
          counselling_reason: v.counselling_reason.trim(),
          topics: v.topics,
          preferred_mode: v.preferred_mode,
        },
        "Web form",
      );
      setDone(rec);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormShell
      image="/site/expect-prayer.jpg"
      eyebrow="Counselling · City Takers 2026"
      title={
        <>
          You don't have to <span className="text-metal">carry it alone.</span>
        </>
      }
      verse="Come unto me, all ye that labour and are heavy laden, and I will give you rest."
      verseRef="Matthew 11:28"
    >
      {done ? (
        <SuccessCard title="We've got you." reference={done.reference}>
          <p>
            Thank you, {done.name.split(" ")[0]}. A counsellor will reach out on <strong className="text-fg">{done.phone_number}</strong> within 48 hours
            {done.preferred_mode === "In person at YMR" ? " to set a time at the Counselling Tent, Old Auditorium." : "."}
          </p>
          <p className="text-sm">Keep your reference — quote it if you call or walk in during the retreat.</p>
        </SuccessCard>
      ) : (
        <form onSubmit={submit} noValidate>
          <Stepper steps={STEPS} current={f.step} />
          <StepPanel stepKey={f.step}>
            {f.step === 0 && (
              <>
                <h2 className="font-display text-3xl font-bold">Let's start with you</h2>
                <Field label="Full name" error={f.errors.name}>
                  <input className={inputCls} autoComplete="name" value={v.name} onChange={(e) => f.set("name", e.target.value)} placeholder="e.g. Adaeze Okafor" />
                </Field>
                <Field label="Gender" error={f.errors.gender}>
                  <Chips options={["Female", "Male"] as const} value={v.gender || null} onChange={(x) => f.set("gender", x as Gender)} />
                </Field>
                <Field label="Age group" optional>
                  <Chips options={AGE_GROUPS} value={v.age_group || null} onChange={(x) => f.set("age_group", x as AgeGroup)} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (WhatsApp preferred)" error={f.errors.phone_number}>
                    <input className={inputCls} type="tel" autoComplete="tel" inputMode="tel" value={v.phone_number} onChange={(e) => f.set("phone_number", e.target.value)} placeholder="0803 123 4567" />
                  </Field>
                  <Field label="Email" optional error={f.errors.email}>
                    <input className={inputCls} type="email" autoComplete="email" value={v.email} onChange={(e) => f.set("email", e.target.value)} placeholder="you@example.com" />
                  </Field>
                </div>
              </>
            )}
            {f.step === 1 && (
              <>
                <h2 className="font-display text-3xl font-bold">Where are you joining from?</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Country">
                    <select className={inputCls} value={v.country} onChange={(e) => f.set("country", e.target.value)}>
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  {v.country === "Nigeria" ? (
                    <Field label="State" error={f.errors.state}>
                      <select className={inputCls} value={v.state} onChange={(e) => f.set("state", e.target.value)}>
                        <option value="">Select state</option>
                        {NIGERIAN_STATES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  ) : (
                    <Field label="City / region" optional>
                      <input className={inputCls} value={v.state} onChange={(e) => f.set("state", e.target.value)} />
                    </Field>
                  )}
                </div>
                <Field label="Address or area" optional hint="Helps us connect you with a church nearby.">
                  <input className={inputCls} value={v.address} onChange={(e) => f.set("address", e.target.value)} placeholder="e.g. Ikeja, Lagos" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Church / denomination" optional>
                    <select className={inputCls} value={v.denomination} onChange={(e) => f.set("denomination", e.target.value)}>
                      <option value="">Select</option>
                      {DENOMINATIONS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Occupation" optional>
                    <input className={inputCls} value={v.occupation} onChange={(e) => f.set("occupation", e.target.value)} placeholder="e.g. Nurse" />
                  </Field>
                </div>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-fg/80">
                  <input type="checkbox" className="h-4 w-4 accent-[#f68b1e]" checked={v.is_student} onChange={(e) => f.set("is_student", e.target.checked)} />
                  I'm currently a student
                </label>
              </>
            )}
            {f.step === 2 && (
              <>
                <h2 className="font-display text-3xl font-bold">What would you like to talk about?</h2>
                <Field label="Choose all that apply" error={f.errors.topics}>
                  <Chips multiple options={COUNSELLING_TOPICS} value={v.topics} onChange={(x) => f.set("topics", x as string[])} />
                </Field>
                <Field label="In your own words" error={f.errors.counselling_reason} hint="Share as much or as little as you like. Only your counsellor will read this.">
                  <textarea
                    className={`${inputCls} h-36 resize-none py-3`}
                    value={v.counselling_reason}
                    onChange={(e) => f.set("counselling_reason", e.target.value)}
                    placeholder="What's on your heart?"
                    maxLength={1500}
                  />
                </Field>
                <Field label="How would you like to meet?">
                  <Chips options={MODES} value={v.preferred_mode} onChange={(x) => f.set("preferred_mode", x as V["preferred_mode"])} />
                </Field>
              </>
            )}
            {f.step === 3 && (
              <>
                <h2 className="font-display text-3xl font-bold">One last look</h2>
                <dl className="divide-y divide-white/10 rounded-2xl border border-fg/10 bg-fg/[0.03]">
                  {[
                    ["Name", v.name],
                    ["Phone", v.phone_number],
                    ["Email", v.email || "—"],
                    ["From", [v.state, v.country].filter(Boolean).join(", ")],
                    ["Topics", v.topics.join(", ")],
                    ["Meet by", v.preferred_mode],
                  ].map(([k, val]) => (
                    <div key={k} className="flex justify-between gap-6 px-5 py-3.5 text-sm">
                      <dt className="text-fg/50">{k}</dt>
                      <dd className="text-right font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
                <label className="flex cursor-pointer gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-4 text-sm text-fg/80">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#f68b1e]" checked={v.consent} onChange={(e) => f.set("consent", e.target.checked)} />
                  <span>
                    <span className="flex items-center gap-1.5 font-semibold text-fg">
                      <Lock className="h-3.5 w-3.5 text-brand" /> Confidential
                    </span>
                    I agree that the YMR counselling team may contact me about this request. My details are only shared with my counsellor and the team lead.
                  </span>
                </label>
                {f.errors.consent && <p className="text-xs text-red-600 dark:text-red-400">{f.errors.consent}</p>}
              </>
            )}
          </StepPanel>
          <NavButtons step={f.step} last={f.last} onBack={f.back} busy={busy} submitLabel="Book my session" />
        </form>
      )}
    </FormShell>
  );
}
