import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { fmtNum } from "@/lib/format";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  sort?: (row: T) => string | number | null;
  className?: string;
  /** hide below this breakpoint */
  hide?: "sm" | "md" | "lg" | "xl";
}

const hideCls = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell", xl: "hidden xl:table-cell" };

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  loading,
  search,
  searchPlaceholder = "Search…",
  toolbar,
  selectable,
  selected,
  onSelectedChange,
  onRowClick,
  pageSize = 25,
  empty,
  initialSort,
  bulkBar,
}: {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  search?: (row: T, q: string) => boolean;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  selectable?: boolean;
  selected?: Set<string>;
  onSelectedChange?: (s: Set<string>) => void;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  empty?: ReactNode;
  initialSort?: { key: string; dir: "asc" | "desc" };
  bulkBar?: ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = needle && search ? rows.filter((r) => search(r, needle)) : rows;
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sort) {
        const s = col.sort;
        out = [...out].sort((a, b) => {
          const av = s(a);
          const bv = s(b);
          if (av === bv) return 0;
          if (av === null) return 1;
          if (bv === null) return -1;
          return (av < bv ? -1 : 1) * (sort.dir === "asc" ? 1 : -1);
        });
      }
    }
    return out;
  }, [rows, q, sort, columns, search]);

  useEffect(() => setPage(0), [q, rows.length]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const view = filtered.slice(page * pageSize, page * pageSize + pageSize);
  const sel = selected ?? new Set<string>();
  const allOnPage = view.length > 0 && view.every((r) => sel.has(r.id));

  const toggleAll = () => {
    const next = new Set(sel);
    if (allOnPage) view.forEach((r) => next.delete(r.id));
    else view.forEach((r) => next.add(r.id));
    onSelectedChange?.(next);
  };
  const toggle = (id: string) => {
    const next = new Set(sel);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onSelectedChange?.(next);
  };

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center">
        {search && (
          <label className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-ember/60 focus:ring-2 focus:ring-ember/15"
              aria-label="Search table"
            />
          </label>
        )}
        <div className="flex flex-1 flex-wrap items-center gap-2 sm:justify-end">{toolbar}</div>
      </div>

      {selectable && sel.size > 0 && bulkBar && (
        <div className="flex flex-wrap items-center gap-2 border-b bg-ember/5 px-3 py-2 text-sm">
          <span className="font-semibold">{fmtNum(sel.size)} selected</span>
          <button className="text-xs text-muted-foreground underline-offset-2 hover:underline" onClick={() => onSelectedChange?.(new Set())}>
            Clear
          </button>
          <div className="ml-auto flex flex-wrap gap-2">{bulkBar}</div>
        </div>
      )}

      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <Checkbox checked={allOnPage} onCheckedChange={toggleAll} aria-label="Select all on this page" />
                </th>
              )}
              {columns.map((c) => (
                <th key={c.key} className={cn("whitespace-nowrap px-3 py-3 font-semibold", c.hide && hideCls[c.hide], c.className)}>
                  {c.sort ? (
                    <button
                      className="inline-flex items-center gap-1 hover:text-foreground"
                      onClick={() => setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "desc" }))}
                    >
                      {c.header}
                      {sort?.key === c.key ? sort.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" /> : <ChevronsUpDown className="h-3 w-3 opacity-40" />}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    {selectable && <td className="px-3 py-3.5" />}
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-3 py-3.5", c.hide && hideCls[c.hide])}>
                        <Skeleton className="h-4 w-full max-w-[140px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : view.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => onRowClick?.(r)}
                    className={cn("border-b transition last:border-0", onRowClick && "cursor-pointer hover:bg-accent/60", sel.has(r.id) && "bg-ember/5")}
                  >
                    {selectable && (
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={sel.has(r.id)} onCheckedChange={() => toggle(r.id)} aria-label="Select row" />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-3 py-3 align-middle", c.hide && hideCls[c.hide], c.className)}>
                        {c.cell(r)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
        {!loading && view.length === 0 && (empty ?? <p className="py-16 text-center text-sm text-muted-foreground">Nothing matches your filters.</p>)}
      </div>

      <div className="flex items-center justify-between gap-3 border-t px-3 py-2.5 text-xs text-muted-foreground">
        <span className="tabular">
          {filtered.length ? `${fmtNum(page * pageSize + 1)}–${fmtNum(Math.min(filtered.length, (page + 1) * pageSize))} of ${fmtNum(filtered.length)}` : "0 results"}
        </span>
        <div className="flex items-center gap-1">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40" aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="tabular px-2">
            {page + 1} / {pages}
          </span>
          <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-md p-1.5 hover:bg-accent disabled:opacity-40" aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Compact select used in table toolbars. */
export function FilterSelect<T extends string>({ value, onChange, options, label }: { value: T | "all"; onChange: (v: T | "all") => void; options: { value: T; label: string }[]; label: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T | "all")}
      aria-label={label}
      className="h-9 rounded-lg border bg-background px-2.5 text-sm outline-none focus:border-ember/60"
    >
      <option value="all">{label}: all</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
