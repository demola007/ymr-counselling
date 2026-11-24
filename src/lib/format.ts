import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

export const nf = new Intl.NumberFormat("en-NG");
export const fmtNum = (n: number) => nf.format(Math.round(n));
export const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const fmtPct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;
export const fmtNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: n < 100 ? 2 : 0 }).format(n);

const toDate = (d: string | Date) => (typeof d === "string" ? parseISO(d) : d);
export const fmtDate = (d: string | Date | null | undefined, pattern = "d MMM yyyy") => (d ? format(toDate(d), pattern) : "—");
export const fmtDateTime = (d: string | Date | null | undefined) => (d ? format(toDate(d), "d MMM yyyy, h:mm a") : "—");
export const fmtAgo = (d: string | Date | null | undefined) =>
  d ? `${formatDistanceToNowStrict(toDate(d))} ago` : "never";

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export const firstName = (name: string) => name.split(/\s+/)[0] ?? name;

/** Display a Nigerian number as +234 803 123 4567. */
export const fmtPhone = (p: string | null) => {
  if (!p) return "—";
  const d = p.replace(/\D/g, "");
  if (d.startsWith("234") && d.length === 13) return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
  if (d.startsWith("0") && d.length === 11) return `+234 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  return p;
};

export const whatsappLink = (p: string | null) => {
  if (!p) return undefined;
  let d = p.replace(/\D/g, "");
  if (d.startsWith("0")) d = `234${d.slice(1)}`;
  return `https://wa.me/${d}`;
};

export const pluralize = (n: number, one: string, many = `${one}s`) => `${fmtNum(n)} ${n === 1 ? one : many}`;
