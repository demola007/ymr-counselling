import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { DEMO_ACCOUNTS, MOCK_PASSWORD } from "@/auth/mockUsers";
import { Embers } from "@/components/brand/Embers";
import { BrandLockup, YmrTenLogo } from "@/components/brand/Logo";
import { NationsBurst } from "@/components/brand/NationsBurst";
import { Skyline } from "@/components/brand/Skyline";
import { Field, inputCls } from "@/components/forms/FormKit";
import { API_MODE, ApiError, api } from "@/data/api";
import { NIGERIAN_STATES } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/brand/ThemeToggle";
import type { Gender } from "@/types";
import { isEmail, isPhone } from "./useStepForm";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-fg lg:grid lg:grid-cols-2">
      <aside className="grain relative hidden overflow-hidden lg:block">
        <NationsBurst intensity={0.7} />
        <Embers density={40} className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <BrandLockup />
          <div>
            <YmrTenLogo className="w-28" />
            <h1 className="mt-8 font-display text-6xl font-black leading-[0.9] text-metal">
              Staff
              <br />
              Portal
            </h1>
            <p className="mt-6 max-w-sm text-fg/70">Capture forms with AI, follow up every soul, and see the whole picture — across every edition of YMR.</p>
          </div>
          <p className="text-xs text-fg/40">Restricted to the YMR Counselling & Follow-up team.</p>
        </div>
        <Skyline className="absolute inset-x-0 bottom-0 h-56" seed={10} />
      </aside>
      <main className="flex min-h-screen flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-fg/60 hover:text-fg">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span className="flex items-center gap-2">
            <ThemeToggle />
            <span className="lg:hidden">
              <BrandLockup />
            </span>
          </span>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={loc.state?.from ?? "/portal"} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      nav(loc.state?.from ?? "/portal", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-brand">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <h2 className="mt-6 font-display text-4xl font-bold">Welcome back</h2>
        <p className="mt-2 text-fg/60">Sign in with your team account.</p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Email">
            <input className={inputCls} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Password">
            <div className="relative">
              <input className={cn(inputCls, "pr-12")} type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-fg/50 hover:text-fg" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          {error && (
            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="btn-ember w-full !py-3.5 disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-fg/60">
          New to the team?{" "}
          <Link to="/signup" className="font-semibold text-brand hover:underline">
            Request access
          </Link>
        </p>

        {API_MODE === "mock" && (
          <div className="mt-10 rounded-2xl border border-dashed border-fg/15 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-fg/50">
              <KeyRound className="h-3.5 w-3.5" /> Demo accounts (mock mode)
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(MOCK_PASSWORD);
                  }}
                  className="rounded-full border border-fg/10 bg-fg/[0.04] px-3 py-1.5 text-xs hover:border-gold/60 hover:text-brand"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}

export function Signup() {
  const [v, setV] = useState({ name: "", email: "", phone_number: "", gender: "" as Gender | "", state: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (v.name.trim().split(/\s+/).length < 2) errs.name = "Enter your full name";
    if (!isEmail(v.email)) errs.email = "Enter a valid email";
    if (!isPhone(v.phone_number)) errs.phone_number = "Enter a valid phone number";
    if (v.password.length < 8) errs.password = "Use at least 8 characters";
    if (v.password !== v.confirm) errs.confirm = "Passwords don't match";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    try {
      await api.auth.signup({ name: v.name.trim(), email: v.email.trim(), phone_number: v.phone_number, password: v.password, gender: (v.gender || null) as Gender | null, state: v.state || null });
      setDone(true);
    } catch (err) {
      setErrors({ email: err instanceof ApiError ? err.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      {done ? (
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold">Request sent</h2>
          <p className="mt-4 text-fg/65">A super admin will review and approve your account. You'll be able to sign in once it's approved.</p>
          <Link to="/login" className="btn-ghost-gold mt-8">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <h2 className="font-display text-4xl font-bold">Request access</h2>
          <p className="mt-2 text-fg/60">For members of the YMR counselling team. New accounts start as counsellors and are approved by a super admin.</p>
          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <Field label="Full name" error={errors.name}>
              <input className={inputCls} autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" error={errors.email}>
                <input className={inputCls} type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Phone" error={errors.phone_number}>
                <input className={inputCls} type="tel" autoComplete="tel" value={v.phone_number} onChange={(e) => set("phone_number", e.target.value)} />
              </Field>
              <Field label="Gender" optional>
                <select className={inputCls} value={v.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Select</option>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </Field>
              <Field label="State" optional>
                <select className={inputCls} value={v.state} onChange={(e) => set("state", e.target.value)}>
                  <option value="">Select</option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Password" error={errors.password}>
                <input className={inputCls} type="password" autoComplete="new-password" value={v.password} onChange={(e) => set("password", e.target.value)} />
              </Field>
              <Field label="Confirm password" error={errors.confirm}>
                <input className={inputCls} type="password" autoComplete="new-password" value={v.confirm} onChange={(e) => set("confirm", e.target.value)} />
              </Field>
            </div>
            <button type="submit" disabled={busy} className="btn-ember w-full !py-3.5 disabled:opacity-60">
              {busy ? "Sending…" : "Request access"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-fg/60">
            Already approved?{" "}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
