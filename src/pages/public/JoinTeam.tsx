import { useState } from "react";
import { Chips, Field, FormShell, NavButtons, StepPanel, Stepper, SuccessCard, inputCls } from "@/components/forms/FormKit";
import { DENOMINATIONS, NIGERIAN_STATES } from "@/config/site";
import { api } from "@/data/api";
import type { Gender } from "@/types";
import { isEmail, isPhone, useStepForm } from "./useStepForm";

const STEPS = ["About you", "Experience", "Availability"];
const SPECIALTIES = ["Youth & campus", "New believers", "Marriage", "Family", "Career", "Grief", "Addiction recovery", "Mental wellbeing", "Prayer"] as const;

type V = {
  name: string;
  email: string;
  phone_number: string;
  gender: Gender | "";
  state: string;
  denomination: string;
  years_of_experience: string;
  has_certification: boolean;
  specialties: string[];
  will_attend: boolean;
  training: boolean;
};

export default function JoinTeam() {
  const f = useStepForm<V>(
    { name: "", email: "", phone_number: "", gender: "", state: "", denomination: "", years_of_experience: "", has_certification: false, specialties: [], will_attend: true, training: true },
    [
      (v) => ({
        name: v.name.trim().split(/\s+/).length < 2 ? "Please enter your full name" : undefined,
        email: !isEmail(v.email) ? "We need a valid email to create your portal access" : undefined,
        phone_number: !isPhone(v.phone_number) ? "Enter a valid phone number" : undefined,
        gender: !v.gender ? "Please choose one" : undefined,
      }),
      (v) => ({ specialties: v.specialties.length === 0 ? "Pick at least one area" : undefined }),
      () => ({}),
    ],
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const v = f.values;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.last) return void f.next();
    setBusy(true);
    try {
      await api.staff.apply({
        name: v.name.trim(),
        email: v.email.trim(),
        phone_number: v.phone_number,
        gender: (v.gender || null) as Gender | null,
        state: v.state || null,
        denomination: v.denomination || null,
        years_of_experience: Number(v.years_of_experience) || 0,
        has_certification: v.has_certification,
        specialties: v.specialties,
        will_attend: v.will_attend,
      });
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormShell
      image="/site/expect-worship.jpg"
      eyebrow="Serve · Counselling & Follow-up team"
      title={
        <>
          Help a generation <span className="text-metal">take their city.</span>
        </>
      }
      verse="Bear ye one another's burdens, and so fulfil the law of Christ."
      verseRef="Galatians 6:2"
    >
      {done ? (
        <SuccessCard title="Application received">
          <p>Thank you for offering to serve. The counselling team lead will review your application and you'll get an email once your portal access is approved.</p>
          <p className="text-sm">Counsellors' briefing: December 25, 4pm, Counselling Tent.</p>
        </SuccessCard>
      ) : (
        <form onSubmit={submit} noValidate>
          <Stepper steps={STEPS} current={f.step} />
          <StepPanel stepKey={f.step}>
            {f.step === 0 && (
              <>
                <h2 className="font-display text-3xl font-bold">Tell us about you</h2>
                <Field label="Full name" error={f.errors.name}>
                  <input className={inputCls} autoComplete="name" value={v.name} onChange={(e) => f.set("name", e.target.value)} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email" error={f.errors.email}>
                    <input className={inputCls} type="email" autoComplete="email" value={v.email} onChange={(e) => f.set("email", e.target.value)} />
                  </Field>
                  <Field label="Phone" error={f.errors.phone_number}>
                    <input className={inputCls} type="tel" autoComplete="tel" value={v.phone_number} onChange={(e) => f.set("phone_number", e.target.value)} />
                  </Field>
                </div>
                <Field label="Gender" error={f.errors.gender}>
                  <Chips options={["Female", "Male"] as const} value={v.gender || null} onChange={(x) => f.set("gender", x as Gender)} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="State" optional>
                    <select className={inputCls} value={v.state} onChange={(e) => f.set("state", e.target.value)}>
                      <option value="">Select</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Church / denomination" optional>
                    <select className={inputCls} value={v.denomination} onChange={(e) => f.set("denomination", e.target.value)}>
                      <option value="">Select</option>
                      {DENOMINATIONS.filter((d) => d !== "None").map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </>
            )}
            {f.step === 1 && (
              <>
                <h2 className="font-display text-3xl font-bold">Your experience</h2>
                <Field label="Years of counselling or ministry experience" optional>
                  <input className={inputCls} type="number" min={0} max={60} value={v.years_of_experience} onChange={(e) => f.set("years_of_experience", e.target.value)} />
                </Field>
                <Field label="Do you hold a professional counselling certification?">
                  <Chips options={["Yes", "No"] as const} value={v.has_certification ? "Yes" : "No"} onChange={(x) => f.set("has_certification", x === "Yes")} />
                </Field>
                <Field label="Areas you're comfortable counselling in" error={f.errors.specialties}>
                  <Chips multiple options={SPECIALTIES} value={v.specialties} onChange={(x) => f.set("specialties", x as string[])} />
                </Field>
              </>
            )}
            {f.step === 2 && (
              <>
                <h2 className="font-display text-3xl font-bold">Availability</h2>
                <Field label="Will you be at YMR 2026 in person (Dec 26 – 30)?">
                  <Chips options={["Yes", "No — I can serve remotely"] as const} value={v.will_attend ? "Yes" : "No — I can serve remotely"} onChange={(x) => f.set("will_attend", x === "Yes")} />
                </Field>
                <Field label="Can you attend the counsellors' briefing on Dec 25?">
                  <Chips options={["Yes", "No"] as const} value={v.training ? "Yes" : "No"} onChange={(x) => f.set("training", x === "Yes")} />
                </Field>
              </>
            )}
          </StepPanel>
          <NavButtons step={f.step} last={f.last} onBack={f.back} busy={busy} submitLabel="Submit application" />
        </form>
      )}
    </FormShell>
  );
}
