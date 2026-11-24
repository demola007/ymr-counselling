import { useState } from "react";

/** Minimal multi-step form state with per-step validation. */
export function useStepForm<T extends Record<string, unknown>>(initial: T, validators: ((v: T) => Partial<Record<keyof T, string>>)[]) {
  const [values, setValues] = useState<T>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const set = <K extends keyof T>(k: K, v: T[K]) => {
    setValues((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const next = () => {
    const errs = validators[step]?.(values) ?? {};
    const clean = Object.fromEntries(Object.entries(errs).filter(([, v]) => v)) as Partial<Record<keyof T, string>>;
    setErrors(clean);
    if (Object.keys(clean).length) return false;
    setStep((s) => Math.min(s + 1, validators.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  };
  const validateCurrent = () => {
    const errs = validators[step]?.(values) ?? {};
    const clean = Object.fromEntries(Object.entries(errs).filter(([, v]) => v)) as Partial<Record<keyof T, string>>;
    setErrors(clean);
    return Object.keys(clean).length === 0;
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  return { values, set, step, setStep, next, back, errors, validateCurrent, last: step === validators.length - 1 };
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const isPhone = (s: string) => s.replace(/\D/g, "").length >= 10;
