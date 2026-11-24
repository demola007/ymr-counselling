/** Super-admin pages: access & roles, editions; plus the activity log and profile. */
import { useMemo, useState } from "react";
import { Check, CheckCircle2, Clock, KeyRound, MinusCircle, Plus, ShieldCheck, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { PERMISSION_MATRIX, ROLE_LABEL, ROLE_PERMISSIONS } from "@/auth/permissions";
import { DataTable, FilterSelect, type Column } from "@/components/portal/DataTable";
import { Avatar, PageHeader, Panel } from "@/components/portal/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CURRENT_YEAR, EDITIONS, ordinal } from "@/config/editions";
import { EDITION_SIZES } from "@/data/mock/seed";
import { api, ApiError } from "@/data/api";
import { resetMockDb } from "@/data/mock/db";
import { useActivity, useInvalidate, useStaff } from "@/hooks/queries";
import { fmtAgo, fmtDate, fmtDateTime, fmtNum } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Role, StaffMember } from "@/types";

/* ---------------- Access & roles ---------------- */
export function Access() {
  const { user } = useAuth();
  const staff = useStaff();
  const invalidate = useInvalidate();
  const [role, setRole] = useState<Role | "all">("all");
  const [invite, setInvite] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "user" as Role });

  const pending = (staff.data ?? []).filter((s) => s.status === "pending");
  const rows = (staff.data ?? []).filter((s) => s.status !== "pending" && (role === "all" || s.role === role));

  const patch = async (s: StaffMember, p: Partial<StaffMember>, msg: string) => {
    await api.staff.update(s.id, p, user!.name);
    await invalidate();
    toast.success(msg);
  };

  const columns: Column<StaffMember>[] = [
    {
      key: "name",
      header: "Member",
      sort: (s) => s.name,
      cell: (s) => (
        <div className="flex items-center gap-3">
          <Avatar name={s.name} />
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {s.name} {s.id === user?.id && <span className="text-xs font-normal text-muted-foreground">(you)</span>}
            </p>
            <p className="truncate text-xs text-muted-foreground">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sort: (s) => s.role,
      cell: (s) => (
        <select
          value={s.role}
          disabled={s.id === user?.id}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => patch(s, { role: e.target.value as Role }, `${s.name} is now ${ROLE_LABEL[e.target.value as Role]}`)}
          className="h-8 rounded-lg border bg-background px-2 text-xs font-semibold disabled:opacity-60"
          aria-label={`Role for ${s.name}`}
        >
          {(["user", "admin", "super-admin"] as Role[]).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "status",
      header: "Status",
      sort: (s) => s.status,
      cell: (s) => (
        <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", s.status === "active" ? "text-[#006300] dark:text-status-good" : "text-muted-foreground")}>
          {s.status === "active" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <MinusCircle className="h-3.5 w-3.5" />} {s.status}
        </span>
      ),
    },
    { key: "last", header: "Last active", hide: "md", sort: (s) => s.last_active_at, cell: (s) => <span className="text-muted-foreground">{fmtAgo(s.last_active_at)}</span> },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (s) =>
        s.id !== user?.id && (
          <Button size="sm" variant="ghost" onClick={() => patch(s, { status: s.status === "active" ? "deactivated" : "active" }, s.status === "active" ? `Deactivated ${s.name}` : `Reactivated ${s.name}`)}>
            {s.status === "active" ? "Deactivate" : "Reactivate"}
          </Button>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Access & roles"
        description="Approve new team members and decide what each person can see and do."
        actions={
          <Button size="sm" onClick={() => setInvite(true)}>
            <UserPlus className="mr-1.5 h-4 w-4" /> Invite member
          </Button>
        }
      />

      {pending.length > 0 && (
        <Panel className="mb-6 border-ember/40" title={<span className="flex items-center gap-2"><Clock className="h-4 w-4 text-ember" /> {pending.length} waiting for approval</span>} bodyClassName="p-0">
          <ul className="divide-y">
            {pending.map((s) => (
              <li key={s.id} className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <Avatar name={s.name} />
                  <div className="min-w-0">
                    <p className="font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {s.email} · {s.specialties.join(", ") || "No specialties listed"} · applied {fmtAgo(s.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => patch(s, { status: "deactivated" }, `Declined ${s.name}`)}>
                    <X className="mr-1 h-3.5 w-3.5" /> Decline
                  </Button>
                  <Button size="sm" onClick={() => patch(s, { status: "active" }, `Approved ${s.name} as Counsellor`)}>
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="grid gap-6 2xl:grid-cols-[1fr_420px]">
        <DataTable
          rows={rows}
          columns={columns}
          loading={staff.isLoading}
          search={(s, q) => s.name.toLowerCase().includes(q) || s.email.includes(q)}
          searchPlaceholder="Search team"
          initialSort={{ key: "role", dir: "asc" }}
          toolbar={<FilterSelect label="Role" value={role} onChange={setRole} options={(["user", "admin", "super-admin"] as Role[]).map((r) => ({ value: r, label: ROLE_LABEL[r] }))} />}
        />
        <Panel title="What each role can do" actions={<ShieldCheck className="h-4 w-4 text-muted-foreground" />} bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-2.5 text-left font-semibold">Permission</th>
                {(["user", "admin", "super-admin"] as Role[]).map((r) => (
                  <th key={r} className="px-2 py-2.5 text-center font-semibold">
                    {ROLE_LABEL[r].replace("Super admin", "Super")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_MATRIX.map((p) => (
                <tr key={p.perm} className="border-b last:border-0">
                  <td className="px-4 py-2">{p.label}</td>
                  {(["user", "admin", "super-admin"] as Role[]).map((r) => (
                    <td key={r} className="px-2 py-2 text-center">
                      {ROLE_PERMISSIONS[r].has(p.perm) ? <Check className="mx-auto h-4 w-4 text-[#006300] dark:text-status-good" aria-label="Allowed" /> : <span className="text-muted-foreground/40" aria-label="Not allowed">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Dialog open={invite} onOpenChange={setInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input className="h-10 w-full rounded-lg border bg-background px-3 text-sm" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="h-10 w-full rounded-lg border bg-background px-3 text-sm" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className="h-10 w-full rounded-lg border bg-background px-3 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
              {(["user", "admin", "super-admin"] as Role[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">They'll get an email to set a password. (In mock mode, the demo password works.)</p>
          </div>
          <DialogFooter>
            <Button
              disabled={!form.name || !/@/.test(form.email)}
              onClick={async () => {
                await api.staff.invite(form, user!.name);
                await invalidate();
                toast.success(`Invited ${form.name}`);
                setInvite(false);
                setForm({ name: "", email: "", role: "user" });
              }}
            >
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------- Editions ---------------- */
export function Editions() {
  const [open, setOpen] = useState(false);
  const next = CURRENT_YEAR + 1;
  return (
    <>
      <PageHeader
        title="Editions"
        description="Every YMR is its own edition. Records are stored per edition, so year-on-year comparisons just work."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Prepare YMR {next}
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[...EDITIONS].reverse().map((e) => (
          <article key={e.year} className={cn("panel overflow-hidden", e.year === CURRENT_YEAR && "border-ember/50")}>
            <div className="flex gap-4 p-4">
              <img src={e.flyer} alt="" className="h-24 w-20 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{ordinal(e.number)} edition</p>
                <p className="font-display text-xl font-bold">{e.year}</p>
                <p className="truncate font-semibold">{e.theme}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {fmtDate(e.start, "d MMM")} – {fmtDate(e.end, "d MMM")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t px-4 py-2.5 text-xs">
              {e.hasData ? (
                <span className="tabular text-muted-foreground">
                  {fmtNum(EDITION_SIZES[e.year]?.converts ?? 0)} converts · {fmtNum(EDITION_SIZES[e.year]?.counsellees ?? 0)} counsellees (seed)
                </span>
              ) : (
                <span className="text-muted-foreground">No portal data — before the platform</span>
              )}
              {e.year === CURRENT_YEAR && <span className="rounded bg-ember/15 px-1.5 py-0.5 font-bold uppercase text-ember-text">Current</span>}
            </div>
          </article>
        ))}
      </div>
      <Panel className="mt-6" title="Mock data" description="Clear everything you've changed in this browser and reload the seed data.">
        <Button
          variant="outline"
          onClick={() => {
            resetMockDb();
            window.location.reload();
          }}
        >
          Reset mock database
        </Button>
      </Panel>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prepare YMR {next}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <input className="h-10 w-full rounded-lg border bg-background px-3" placeholder="Theme, e.g. announced in the new year" />
            <div className="grid grid-cols-2 gap-2">
              <input className="h-10 rounded-lg border bg-background px-3" type="date" defaultValue={`${next}-12-26`} aria-label="Start date" />
              <input className="h-10 rounded-lg border bg-background px-3" type="date" defaultValue={`${next}-12-30`} aria-label="End date" />
            </div>
            <p className="text-xs text-muted-foreground">Creating an edition is saved by the API (POST /api/editions). In mock mode this is a preview of the flow.</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                toast.info("Editions are created through the API once the backend is connected.");
                setOpen(false);
              }}
            >
              Create edition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------------- Activity ---------------- */
export function ActivityLog() {
  const { data = [], isLoading } = useActivity();
  const [kind, setKind] = useState<string | "all">("all");
  const rows = useMemo(() => data.filter((a) => kind === "all" || a.kind === kind), [data, kind]);
  return (
    <>
      <PageHeader title="Activity log" description="An audit trail of captures, edits, sends, exports and access changes." />
      <DataTable
        rows={rows}
        loading={isLoading}
        search={(a, q) => `${a.actor} ${a.action} ${a.target}`.toLowerCase().includes(q)}
        toolbar={<FilterSelect label="Type" value={kind} onChange={setKind} options={["capture", "edit", "create", "notify", "export", "access", "delete"].map((k) => ({ value: k, label: k }))} />}
        columns={[
          { key: "who", header: "Who", cell: (a) => <span className="flex items-center gap-2"><Avatar name={a.actor} className="h-7 w-7 text-[10px]" /> <span className="font-medium">{a.actor}</span></span> },
          { key: "what", header: "What", cell: (a) => <span><span className="text-muted-foreground">{a.action}</span> {a.target}</span> },
          { key: "kind", header: "Type", hide: "md", cell: (a) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] capitalize">{a.kind}</span> },
          { key: "at", header: "When", sort: (a) => a.at, cell: (a) => <span className="whitespace-nowrap text-muted-foreground" title={fmtDateTime(a.at)}>{fmtAgo(a.at)}</span> },
        ]}
        initialSort={{ key: "at", dir: "desc" }}
      />
    </>
  );
}

/* ---------------- Profile ---------------- */
export function Profile() {
  const { user } = useAuth();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [err, setErr] = useState<string | null>(null);
  if (!user) return null;
  return (
    <>
      <PageHeader title="Your profile" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Details">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} className="h-16 w-16 text-lg" />
            <div>
              <p className="font-display text-xl font-bold">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.email} · {ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
          <dl className="mt-6 divide-y text-sm">
            {[
              ["Phone", user.phone_number ?? "—"],
              ["State", user.state ?? "—"],
              ["Editions served", user.editions.join(", ")],
              ["Specialties", user.specialties.join(", ") || "—"],
              ["Member since", fmtDate(user.created_at)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel title={<span className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Change password</span>}>
          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr(null);
              if (pw.next.length < 8) return setErr("Use at least 8 characters.");
              if (pw.next !== pw.confirm) return setErr("New passwords don't match.");
              try {
                await api.auth.changePassword(user.id, pw.current, pw.next);
                toast.success("Password updated");
                setPw({ current: "", next: "", confirm: "" });
              } catch (e2) {
                setErr(e2 instanceof ApiError ? e2.message : "Couldn't update password");
              }
            }}
          >
            {(
              [
                ["current", "Current password", "current-password"],
                ["next", "New password", "new-password"],
                ["confirm", "Confirm new password", "new-password"],
              ] as const
            ).map(([k, l, ac]) => (
              <label key={k} className="block space-y-1.5 text-sm">
                <span className="text-muted-foreground">{l}</span>
                <input type="password" autoComplete={ac} value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} className="h-10 w-full rounded-lg border bg-background px-3" />
              </label>
            ))}
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit">Update password</Button>
          </form>
        </Panel>
      </div>
    </>
  );
}
