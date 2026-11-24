/** Client-side export to CSV, Excel and JSON. */
export type ExportFormat = "csv" | "xlsx" | "json";

export interface ExportColumn<T> {
  key: string;
  label: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

const csvCell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const download = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export async function exportRows<T>(rows: T[], columns: ExportColumn<T>[], format: ExportFormat, baseName: string) {
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `${baseName}-${stamp}.${format}`;
  const records = rows.map((r) => Object.fromEntries(columns.map((c) => [c.label, c.value(r) ?? ""])));

  if (format === "json") {
    download(new Blob([JSON.stringify(records, null, 2)], { type: "application/json" }), filename);
  } else if (format === "csv") {
    const head = columns.map((c) => csvCell(c.label)).join(",");
    const body = rows.map((r) => columns.map((c) => csvCell(c.value(r))).join(",")).join("\n");
    // BOM so Excel opens UTF-8 names correctly
    download(new Blob(["﻿" + head + "\n" + body], { type: "text/csv;charset=utf-8" }), filename);
  } else {
    const XLSX = await import("xlsx");
    const ws = XLSX.utils.json_to_sheet(records);
    ws["!cols"] = columns.map((c) => ({ wch: Math.min(40, Math.max(10, c.label.length + 2)) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, baseName.slice(0, 31));
    XLSX.writeFile(wb, filename);
  }
  return filename;
}
