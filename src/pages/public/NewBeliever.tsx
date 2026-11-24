import { useState } from "react";
import { BookOpen, Church, MessageCircle } from "lucide-react";
import { Chips, Field, FormShell, NavButtons, StepPanel, Stepper, SuccessCard, inputCls } from "@/components/forms/FormKit";
import { CURRENT_YEAR } from "@/config/editions";
import { AGE_GROUPS, COUNTRIES, DENOMINATIONS, NIGERIAN_STATES } from "@/config/site";
import { api } from "@/data/api";
import type { AgeGroup, Gender } from "@/types";
import { isEmail, isPhone, useStepForm } from "./useStepForm";

const STEPS = ["Welcome", "Stay in touch", "Your journey"];

type V = {
  name: string;
  gender: Gender | "";
  age_group: AgeGroup | "";
  phone_number: string;
  email: string;
  country: string;
  state: string;
  address: string;
  nearest_bus_stop: string;
  denomination: string;
  is_student: boolean;
  school: string;
  occupation: string;
  online: boolean;
  availability_for_follow_up: boolean;
};

export default function NewBeliever() {
  const f = useStepForm<V>(
    { name: "", gender: "", age_group: "", phone_number: "", email: "", country: "Nigeria", state: "", address: "", nearest_bus_stop: "", denomination: "", is_student: false, school: "", occupation: "", online: false, availability_for_follow_up: true },
    [
      (v) => ({
        name: v.name.trim().split(/\s+/).length < 2 ? "Please enter your first and last name" : undefined,
        gender: !v.gender ? "Please choose one" : undefined,
      }),
      (v) => ({
        phone_number: !isPhone(v.phone_number) ? "We need a phone number to follow up with you" : undefined,
        email: v.email && !isEmail(v.email) ? "That email doesn't look right" : undefined,
        state: v.country === "Nigeria" && !v.state ? "Choose your state" : undefined,
      }),
      () => ({}),
    ],
  );
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const v = f.values;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.last) return void f.next();
    setBusy(true);
    try {
      const rec = await api.converts.create(
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
          nearest_bus_stop: v.nearest_bus_stop || null,
          is_student: v.is_student,
          school: v.is_student ? v.school || null : null,
          occupation: v.is_student ? "Student" : v.occupation || null,
          denomination: v.denomination || null,
          online: v.online,
          availability_for_follow_up: v.availability_for_follow_up,
          source: "web-form",
        },
        "Web form",
      );
      setDone(rec.name.split(" ")[0] ?? "friend");
    } finally {
      setBusy(false);
    }
  };

  return (
    <FormShell
      image="/site/expect-fire.jpg"
      eyebrow="New believers · Welcome home"
      title={
        <>
          Heaven is <span className="text-metal">celebrating you.</span>
        </>
      }
      verse="Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new."
      verseRef="2 Corinthians 5:17"
    >
      {done ? (
        <SuccessCard title={`Welcome to the family, ${done}!`}>
          <p>This is the best decision you will ever make. A follow-up counsellor will reach out within a few days. Until then, here are three first steps:</p>
          <ul className="grid gap-3 pt-2 text-left">
            {[
              { icon: BookOpen, t: "Read the Gospel of John", d: "One chapter a day. Start tonight." },
              { icon: MessageCircle, t: "Talk to God daily", d: "Prayer is simply talking with your Father." },
              { icon: Church, t: "Find a church family", d: "We'll help you find one close to home." },
            ].map((s) => (
              <li key={s.t} className="flex gap-3 rounded-2xl border border-fg/10 bg-fg/[0.03] p-4">
                <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>
                  <span className="block font-semibold text-fg">{s.t}</span>
                  <span className="text-sm">{s.d}</span>
                </span>
              </li>
            ))}
          </ul>
        </SuccessCard>
      ) : (
        <form onSubmit={submit} noValidate>
          <Stepper steps={STEPS} current={f.step} />
          <StepPanel stepKey={f.step}>
            {f.step === 0 && (
              <>
                <h2 className="font-display text-3xl font-bold">We're so glad you're here.</h2>
                <p className="text-fg/65">Tell us a little about yourself so we can walk with you.</p>
                <Field label="Full name" error={f.errors.name}>
                  <input className={inputCls} autoComplete="name" value={v.name} onChange={(e) => f.set("name", e.target.value)} placeholder="First and last name" />
                </Field>
                <Field label="Gender" error={f.errors.gender}>
                  <Chips options={["Female", "Male"] as const} value={v.gender || null} onChange={(x) => f.set("gender", x as Gender)} />
                </Field>
                <Field label="Age group" optional>
                  <Chips options={AGE_GROUPS} value={v.age_group || null} onChange={(x) => f.set("age_group", x as AgeGroup)} />
                </Field>
                <Field label="Where did you make your decision?">
                  <Chips options={["At Redemption City", "Watching online"] as const} value={v.online ? "Watching online" : "At Redemption City"} onChange={(x) => f.set("online", x === "Watching online")} />
                </Field>
              </>
            )}
            {f.step === 1 && (
              <>
                <h2 className="font-display text-3xl font-bold">How can we reach you?</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (WhatsApp preferred)" error={f.errors.phone_number}>
                    <input className={inputCls} type="tel" inputMode="tel" autoComplete="tel" value={v.phone_number} onChange={(e) => f.set("phone_number", e.target.value)} placeholder="0803 123 4567" />
                  </Field>
                  <Field label="Email" optional error={f.errors.email}>
                    <input className={inputCls} type="email" autoComplete="email" value={v.email} onChange={(e) => f.set("email", e.target.value)} />
                  </Field>
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
                  <Field label="Area / address" optional>
                    <input className={inputCls} value={v.address} onChange={(e) => f.set("address", e.target.value)} />
                  </Field>
                  <Field label="Nearest bus stop" optional>
                    <input className={inputCls} value={v.nearest_bus_stop} onChange={(e) => f.set("nearest_bus_stop", e.target.value)} />
                  </Field>
                </div>
              </>
            )}
            {f.step === 2 && (
              <>
                <h2 className="font-display text-3xl font-bold">A little more</h2>
                <Field label="Do you attend a church?" optional>
                  <select className={inputCls} value={v.denomination} onChange={(e) => f.set("denomination", e.target.value)}>
                    <option value="">Select</option>
                    {DENOMINATIONS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Are you a student?">
                  <Chips options={["Yes", "No"] as const} value={v.is_student ? "Yes" : "No"} onChange={(x) => f.set("is_student", x === "Yes")} />
                </Field>
                {v.is_student ? (
                  <Field label="School" optional>
                    <input className={inputCls} value={v.school} onChange={(e) => f.set("school", e.target.value)} />
                  </Field>
                ) : (
                  <Field label="Occupation" optional>
                    <input className={inputCls} value={v.occupation} onChange={(e) => f.set("occupation", e.target.value)} />
                  </Field>
                )}
                <label className="flex cursor-pointer gap-3 rounded-2xl border border-gold/25 bg-gold/5 p-4 text-sm text-fg/80">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#f68b1e]"
                    checked={v.availability_for_follow_up}
                    onChange={(e) => f.set("availability_for_follow_up", e.target.checked)}
                  />
                  Yes, I'd like a counsellor to follow up with me after YMR.
                </label>
              </>
            )}
          </StepPanel>
          <NavButtons step={f.step} last={f.last} onBack={f.back} busy={busy} submitLabel="Count me in" />
        </form>
      )}
    </FormShell>
  );
}
