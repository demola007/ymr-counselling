/**
 * Printable "New Believer" card for altar calls — DL size, 210 × 99 mm,
 * exactly one third of an A4 sheet. Prints three per A4 (cut into strips) or
 * one per page for a print shop.
 *
 * Built for handwriting and for the AI extractor: character boxes for name and
 * phone, tick boxes wherever an answer has fixed options, a card number, and
 * black corner markers so phone photos can be straightened before reading.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import { ArrowLeft, Printer, Scissors } from "lucide-react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

type Layout = "a4-3up" | "single";

const PUBLIC_URL = ((import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) || window.location.origin).replace(/\/$/, "");
const INK = "#1a1410";

/* ---------- print primitives (mm / pt so print is exact) ---------- */

const label = "text-[6.3pt] font-bold uppercase tracking-[0.07em] text-[#1a1410]";

function Comb({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div>
      <p className={cn(label, "mb-[0.6mm] flex items-baseline justify-between")}>
        {title}
        {hint && <span className="text-[5.5pt] font-normal normal-case tracking-normal text-[#7a7169]">{hint}</span>}
      </p>
      <div className="flex">
        {Array.from({ length: n }).map((_, i) => (
          <span key={i} className="h-[6.4mm] flex-1 border-y-[0.25mm] border-l-[0.25mm] border-[#2b241f] last:border-r-[0.25mm]" />
        ))}
      </div>
    </div>
  );
}

function Line({ title, className, hint }: { title: string; className?: string; hint?: string }) {
  return (
    <div className={cn("flex min-w-0 items-end gap-[1.2mm]", className)}>
      <span className={cn(label, "shrink-0 pb-[0.3mm]")}>{title}</span>
      <span className="relative h-[6mm] flex-1 border-b-[0.25mm] border-[#2b241f]">
        {hint && <span className="absolute bottom-[0.4mm] right-0 text-[5pt] text-[#9a9087]">{hint}</span>}
      </span>
    </div>
  );
}

function Box({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[0.9mm] whitespace-nowrap text-[6.5pt] text-[#1a1410]">
      <span className="inline-block h-[3mm] w-[3mm] shrink-0 rounded-[0.4mm] border-[0.28mm] border-[#2b241f]" />
      {children}
    </span>
  );
}

function Choice({ title, options, className }: { title: string; options: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-[2.4mm] gap-y-[0.8mm]", className)}>
      <span className={label}>{title}</span>
      {options.map((o) => (
        <Box key={o}>{o}</Box>
      ))}
    </div>
  );
}

const Marker = ({ className }: { className: string }) => <span className={cn("absolute h-[3mm] w-[3mm] bg-black", className)} aria-hidden />;

function Markers() {
  return (
    <>
      <Marker className="left-[2.5mm] top-[2.5mm]" />
      <Marker className="right-[2.5mm] top-[2.5mm]" />
      <Marker className="bottom-[2.5mm] left-[2.5mm]" />
      <Marker className="bottom-[2.5mm] right-[2.5mm]" />
    </>
  );
}

/* ---------- the card: front ---------- */

function CardFront({ qr }: { qr: string }) {
  return (
    <article className="card relative flex h-[99mm] w-[210mm] flex-col overflow-hidden bg-white px-[8mm] pb-[5mm] pt-[5mm] font-sans [&>*]:shrink-0" style={{ color: INK }}>
      <Markers />

      {/* header */}
      <header className="flex items-center gap-[3mm]">
        <img src="/brand/ymr-at-10-logo-light.webp" alt="YMR 10 years" className="h-[10.5mm] w-auto" />
        <div className="min-w-0 flex-1">
          <p className="text-[5.8pt] font-bold uppercase tracking-[0.24em] text-[#b65a00]">YMR 2026 · City Takers · Counselling & Follow-up</p>
          <h1 className="font-display text-[14pt] font-black leading-none tracking-[0.02em]">New Believer Card</h1>
          <p className="mt-[0.6mm] text-[6.3pt] text-[#4a423b]">Welcome to God's family! Please write clearly in CAPITAL LETTERS — one letter per box.</p>
        </div>
        <div className="flex items-center gap-[1.4mm] rounded-[0.8mm] border-[0.3mm] border-[#2b241f] px-[1.4mm] py-[0.6mm]">
          <span className="text-[6pt] font-bold uppercase tracking-[0.12em]">No.</span>
          <span className="h-[4mm] w-[14mm] border-b-[0.25mm] border-dotted border-[#2b241f]" />
        </div>
        {qr && (
          <div className="flex items-center gap-[1.2mm]">
            <span className="w-[13mm] text-right text-[5pt] leading-tight text-[#6b625a]">Rather use your phone? Scan</span>
            <img src={qr} alt="QR code to the online new believer form" className="h-[11mm] w-[11mm]" />
          </div>
        )}
      </header>
      <div className="mt-[1.6mm] h-[0.7mm] w-full bg-gradient-to-r from-[#fbaa1a] via-[#f68b1e] to-[#e26700]" />

      {/* body: two columns */}
      <div className="mt-[2.2mm] grid flex-1 grid-cols-[1fr_1fr] gap-x-[6mm]">
        <div className="flex flex-col justify-between gap-[1.7mm]">
          <Comb n={15} title="First name" />
          <Comb n={15} title="Surname" />
          <Comb n={11} title="Phone number" hint="0803 123 4567" />
          <div className="flex flex-wrap gap-x-[2.6mm] gap-y-[0.8mm]">
            <Box>On WhatsApp</Box>
            <Choice title="Gender" options={["Male", "Female"]} />
          </div>
          <Choice title="Status" options={["Single", "Engaged", "Married"]} />
        </div>

        <div className="flex flex-col justify-between gap-[1.7mm]">
          <Choice title="Age" options={["Under 18", "18–24", "25–30", "31–35", "36–45", "46+"]} />
          <Line title="Email" />
          <div className="grid grid-cols-[1fr_1fr] gap-x-[3mm]">
            <Line title="State" />
            <Line title="Country" hint="if not Nigeria" />
          </div>
          <Line title="Area / nearest bus stop" />
          <div className="flex items-end gap-[2mm]">
            <Line title="Church" className="flex-1" />
            <Box>None yet</Box>
          </div>
          <div className="flex items-end gap-[2mm]">
            <Box>Student</Box>
            <Box>Working</Box>
            <Line title="School / job" className="flex-1" />
          </div>
          <div className="flex flex-wrap gap-x-[4mm] gap-y-[0.8mm]">
            <Choice title="I decided" options={["Here", "Online"]} />
            <Choice title="Follow me up" options={["Yes", "Not now"]} />
          </div>
        </div>
      </div>

      {/* counsellor strip */}
      <footer className="mt-[2mm] flex items-center gap-[3mm] rounded-[1mm] bg-[#f3ece1] px-[2.4mm] py-[1.2mm]">
        <span className="text-[5.6pt] font-bold uppercase tracking-[0.18em] text-[#8a5a24]">Counsellor</span>
        <span className="h-[4mm] flex-1 border-b-[0.25mm] border-[#2b241f]" />
        <div className="flex items-center gap-[1.8mm]">
          {["Sat 26", "Sun 27", "Mon 28", "Tue 29", "Wed 30"].map((d) => (
            <Box key={d}>{d}</Box>
          ))}
        </div>
        <span className="max-w-[46mm] text-[4.8pt] leading-tight text-[#7a7169]">Confidential. Used only by the YMR counselling team to follow you up.</span>
      </footer>
    </article>
  );
}

/* ---------- the card: back (keep this side) ---------- */

function CardBack() {
  return (
    <article className="card relative flex h-[99mm] w-[210mm] overflow-hidden bg-white" style={{ color: INK }}>
      <div className="flex w-[78mm] flex-col justify-between bg-[#1a1410] px-[8mm] py-[7mm] text-white">
        <div>
          <p className="text-[5.8pt] font-bold uppercase tracking-[0.24em] text-[#fbaa1a]">Keep this side</p>
          <h2 className="mt-[2mm] font-display text-[17pt] font-black leading-[1.02]">Heaven is celebrating you.</h2>
        </div>
        <blockquote className="border-l-[0.6mm] border-[#f68b1e] pl-[3mm]">
          <p className="font-display text-[8.5pt] leading-snug">“If any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.”</p>
          <footer className="mt-[1mm] text-[6.5pt] font-semibold text-[#fbaa1a]">2 Corinthians 5:17</footer>
        </blockquote>
      </div>
      <div className="flex flex-1 flex-col px-[8mm] py-[7mm]">
        <p className="text-[8pt] leading-relaxed text-[#4a423b]">
          Today you made the most important decision of your life. A counsellor from the YMR follow-up team will reach out within a few days to pray with you and help you take your next steps.
        </p>
        <ol className="mt-[3.5mm] grid grid-cols-2 gap-x-[5mm] gap-y-[2.6mm]">
          {[
            ["Read", "The Gospel of John, one chapter a day."],
            ["Pray", "Talk to God daily, as to a loving Father."],
            ["Belong", "Find a Bible-believing church near you."],
            ["Share", "Tell one person what God has done."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-[2mm]">
              <span className="flex h-[5mm] w-[5mm] shrink-0 items-center justify-center rounded-full bg-[#f68b1e] text-[7pt] font-bold text-white">{i + 1}</span>
              <span className="text-[7.5pt] leading-snug">
                <strong>{t}.</strong> {d}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-auto flex items-end justify-between gap-[4mm] border-t-[0.25mm] border-[#d9cfc3] pt-[2.5mm]">
          <div className="text-[6.5pt] leading-relaxed text-[#4a423b]">
            <p className="font-semibold text-[#1a1410]">Need to talk? Counselling Tent, Old Auditorium.</p>
            <p>
              {SITE.email} · {SITE.phones[0]}
            </p>
          </div>
          <div className="flex items-center gap-[1.2mm] rounded-[0.8mm] border-[0.3mm] border-[#2b241f] px-[1.4mm] py-[0.6mm]">
            <span className="text-[6pt] font-bold uppercase tracking-[0.12em]">Card No.</span>
            <span className="h-[4mm] w-[14mm] border-b-[0.25mm] border-dotted border-[#2b241f]" />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- page ---------- */

function A4Sheet({ children }: { children: ReactNode }) {
  // Three 99 mm strips = 297 mm. Dashed lines mark where to cut.
  return (
    <div className="sheet flex h-[297mm] w-[210mm] flex-col bg-white">
      {[0, 1, 2].map((i) => (
        <div key={i} className={cn("relative", i > 0 && "cut-line")}>
          {children}
        </div>
      ))}
    </div>
  );
}

export default function PrintConvertCard() {
  // ?layout=single&back=1 preselects options (handy for print-shop links and PDF export)
  const [params] = useSearchParams();
  const [layout, setLayout] = useState<Layout>(params.get("layout") === "single" ? "single" : "a4-3up");
  const [withBack, setWithBack] = useState(params.get("back") === "1");
  const [qr, setQr] = useState("");
  const target = `${PUBLIC_URL}/new-believer`;

  useEffect(() => {
    QRCode.toDataURL(target, { margin: 0, width: 220, errorCorrectionLevel: "M", color: { dark: INK, light: "#ffffff" } })
      .then(setQr)
      .catch(() => setQr(""));
  }, [target]);

  // @page must be a real stylesheet rule, so inject one for the chosen layout
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `@page { size: ${layout === "single" ? "210mm 99mm" : "A4 portrait"}; margin: 0; }`;
    document.head.appendChild(el);
    const prevTitle = document.title;
    document.title = "YMR 2026 — New Believer Card";
    return () => {
      el.remove();
      document.title = prevTitle;
    };
  }, [layout]);

  const pages = useMemo(() => {
    const front = <CardFront qr={qr} />;
    const back = <CardBack />;
    if (layout === "single") return withBack ? [front, back] : [front];
    return withBack ? [<A4Sheet key="f">{front}</A4Sheet>, <A4Sheet key="b">{back}</A4Sheet>] : [<A4Sheet key="f">{front}</A4Sheet>];
  }, [layout, withBack, qr]);

  return (
    <div className="print-root min-h-screen bg-[#e9e4dc] text-[#1a1410]">
      <style>{`
        .cut-line::before { content: ""; position: absolute; left: 0; right: 0; top: 0; border-top: 0.2mm dashed #b9ada0; z-index: 1; }
        @media print {
          html, body { background: #fff !important; height: auto !important; min-height: 0 !important; margin: 0 !important; }
          .print-root { background: #fff !important; min-height: 0 !important; }
          .no-print, [data-sonner-toaster] { display: none !important; }
          .print-stage { display: block !important; padding: 0 !important; }
          .print-page { box-shadow: none !important; transform: none !important; margin: 0 !important; overflow: hidden; break-after: page; break-inside: avoid; }
          .print-page:last-child { break-after: auto; }
          /* a hair under the page height so rounding never spills onto a blank page */
          .print-page .sheet { height: 296.5mm !important; overflow: hidden; }
          .print-page > .card { height: 98.6mm !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="no-print sticky top-0 z-10 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-[#6b625a] hover:text-[#1a1410]">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <p className="mr-auto font-display text-lg font-bold">
            New Believer Card <span className="font-sans text-xs font-medium text-[#6b625a]">210 × 99 mm · ⅓ A4</span>
          </p>
          <div className="flex rounded-lg border border-black/10 p-0.5 text-xs font-semibold" role="radiogroup" aria-label="Paper layout">
            {(
              [
                ["a4-3up", "3 per A4"],
                ["single", "One card per page"],
              ] as const
            ).map(([v, l]) => (
              <button key={v} role="radio" aria-checked={layout === v} onClick={() => setLayout(v)} className={cn("rounded-md px-3 py-1.5", layout === v ? "bg-[#1a1410] text-white" : "text-[#6b625a]")}>
                {l}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-[#4a423b]">
            <input type="checkbox" checked={withBack} onChange={(e) => setWithBack(e.target.checked)} className="h-4 w-4 accent-[#f68b1e]" />
            Welcome note on the back
          </label>
          <button onClick={() => window.print()} className="btn-ember !py-2">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
        <p className="mx-auto flex max-w-5xl items-center gap-1.5 px-4 pb-3 text-xs text-[#6b625a]">
          <Scissors className="h-3.5 w-3.5" />
          Print at <strong>100% / Actual size</strong> with headers and footers off, then cut along the dashed lines. For the back, print double-sided and flip on the long edge.
        </p>
      </div>

      <div className="print-stage flex flex-col items-center gap-8 overflow-x-auto px-4 py-10">
        {pages.map((p, i) => (
          <div key={i} className="print-page origin-top bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,.35)] max-md:scale-[0.5]">
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
