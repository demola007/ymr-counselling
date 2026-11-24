import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  HandHeart,
  HeartHandshake,
  Lock,
  MapPin,
  MessageCircleHeart,
  Pause,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Reveal } from "@/components/brand/Reveal";
import { Countdown } from "@/components/brand/Countdown";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EDITIONS } from "@/config/editions";
import { MINISTERS, SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/* ---------------- marquee ---------------- */
export function Marquee() {
  const words = ["City Takers", "Ten years of fire", "Dec 26 – 30", "Redemption City", "You are not alone", "Nations, arise"];
  const row = [...words, ...words];
  return (
    <div className="relative overflow-hidden border-y border-fg/5 bg-canvas-2 py-5 mask-fade-x" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...row, ...row].map((w, i) => (
          <span key={i} className={cn("font-display text-3xl font-bold uppercase tracking-wider sm:text-5xl", i % 2 ? "outline-text" : "text-metal")}>
            {w} <span className="mx-6 text-ember-text">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- three doors ---------------- */
const DOORS = [
  {
    to: "/counselling",
    eyebrow: "For anyone",
    title: "Book a counselling session",
    body: "Relationships, purpose, grief, fear, faith — bring it. Meet a counsellor in person at the retreat, on a call, or on WhatsApp.",
    cta: "Book a session",
    icon: HeartHandshake,
    image: "/site/expect-prayer.jpg",
  },
  {
    to: "/new-believer",
    eyebrow: "New believers",
    title: "I gave my life to Jesus",
    body: "Welcome home. Tell us how to reach you and a follow-up counsellor will walk your first steps with you — long after the retreat.",
    cta: "Start my journey",
    icon: Sparkles,
    image: "/site/expect-fire.jpg",
  },
  {
    to: "/join",
    eyebrow: "Serve",
    title: "Join the counselling team",
    body: "Trained, prayerful and patient? Serve on the City Takers counselling & follow-up team this December.",
    cta: "Apply to serve",
    icon: HandHeart,
    image: "/site/expect-worship.jpg",
  },
];

export function Doors() {
  return (
    <section id="doors" className="relative scroll-mt-24 bg-canvas py-24 sm:py-32">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-ember-text">Three doors. One family.</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-fg sm:text-6xl">How can we help you?</h2>
          <p className="mt-5 text-lg text-fg/65">Pick the door that fits. It takes about three minutes, and everything you share stays with the counselling team.</p>
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {DOORS.map((d, i) => (
            <Reveal key={d.to} delay={i * 0.1}>
              <Link
                to={d.to}
                className="dark group relative flex h-[440px] flex-col justify-end overflow-hidden rounded-3xl border border-fg/10 p-7 transition duration-500 hover:-translate-y-1 hover:border-gold/50 sm:h-[500px]"
              >
                <img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas/10" />
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold via-ember to-transparent transition duration-500 group-hover:scale-x-100" />
                <div className="relative">
                  <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-brand backdrop-blur">
                    <d.icon className="h-6 w-6" />
                  </span>
                  <p className="eyebrow text-brand/80">{d.eyebrow}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-fg sm:text-3xl">{d.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-fg/70">{d.body}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                    {d.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- scripture ---------------- */
export function Scripture() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = "Every place that the sole of your foot shall tread upon, that have I given unto you.".split(" ");
  return (
    <section className="relative overflow-hidden bg-canvas-2 py-28 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(246,139,30,.12),transparent_60%)]" />
      <div ref={ref} className="container relative max-w-5xl text-center">
        <p className="eyebrow mb-8 text-ember-text">The mandate · Joshua 1:3</p>
        <p className="font-display text-3xl font-semibold leading-[1.25] sm:text-5xl lg:text-6xl">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={!!reduce}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({ children, progress, range, reduce }: { children: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; range: [number, number]; reduce: boolean }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className="mr-[0.25em] inline-block text-fg">
      {children}
    </motion.span>
  );
}

/* ---------------- how it works as a city route ---------------- */
const STOPS = [
  { title: "Tell us", body: "Fill a short form online, or hand a paper card to any counsellor at the altar.", icon: MessageCircleHeart, time: "3 minutes" },
  { title: "Get matched", body: "We pair you with a trained counsellor who understands what you're facing.", icon: UsersRound, time: "Same day" },
  { title: "Meet & talk", body: "In person at the Counselling Tent, on a call, or on WhatsApp — your choice.", icon: CalendarHeart, time: "During YMR" },
  { title: "Keep walking", body: "We check in after the retreat and connect you to a church family near you.", icon: HandHeart, time: "Weeks after" },
];

export function Route() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  return (
    <section id="route" className="relative scroll-mt-24 overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(#fbaa1a_1px,transparent_1px),linear-gradient(90deg,#fbaa1a_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <Reveal>
            <p className="eyebrow text-ember-text">The route</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">From one conversation to a city taken.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-lg text-fg/65 lg:ml-auto">
              Like a line across the city, every stop is planned. No one who reaches out is left at the station — the follow-up team tracks every journey to the end.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* the line */}
          <svg className="absolute left-0 top-[34px] hidden h-2 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden>
            <line x1="0" y1="1" x2="100" y2="1" stroke="rgba(255,255,255,.08)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="url(#route-g)"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: inView ? 1 : 0 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="route-g" x1="0" x2="1">
                <stop offset="0" stopColor="#fbaa1a" />
                <stop offset="1" stopColor="#e26700" />
              </linearGradient>
            </defs>
          </svg>
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STOPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.45, duration: 0.6 }}
                className="relative flex gap-5 lg:flex-col"
              >
                <span className="relative z-10 flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full border-2 border-gold bg-canvas shadow-[0_0_0_8px_hsl(var(--canvas)),0_0_40px_rgba(246,139,30,.35)]">
                  <s.icon className="h-7 w-7 text-brand" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ember text-[11px] font-bold text-ink">{i + 1}</span>
                </span>
                {i < STOPS.length - 1 && <span className="absolute left-[34px] top-[70px] h-[calc(100%-30px)] w-0.5 bg-gradient-to-b from-gold/60 to-transparent lg:hidden" aria-hidden />}
                <div>
                  <p className="eyebrow text-brand/70">{s.time}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg/65">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <Reveal className="mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Lock, t: "Strictly confidential", d: "Only your counsellor and the team lead see your request." },
            { icon: ShieldCheck, t: "Trained counsellors", d: "Every counsellor is screened and briefed before the retreat." },
            { icon: Phone, t: "Your channel", d: "We reach you how you prefer — WhatsApp, call, SMS or email." },
            { icon: HeartHandshake, t: "No judgement", d: "Whatever it is, you will be heard with love." },
          ].map((p) => (
            <div key={p.t} className="glass rounded-2xl p-5">
              <p.icon className="h-5 w-5 text-brand" />
              <p className="mt-3 font-semibold">{p.t}</p>
              <p className="mt-1 text-sm text-fg/60">{p.d}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- ministers ---------------- */
export function Ministers() {
  const convener = MINISTERS.find((m) => m.role === "Convener")!;
  const rest = MINISTERS.filter((m) => m !== convener);
  return (
    <section id="ministers" className="relative scroll-mt-24 overflow-hidden bg-canvas-2 py-24 sm:py-32">
      <div className="nations-rays pointer-events-none absolute -right-1/3 top-1/2 aspect-square w-[120vmax] -translate-y-1/2 animate-spin-slow opacity-[0.04] blur-sm dark:opacity-[0.07]" />
      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-ember-text">On the altar this December</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">Ministering at City Takers</h2>
            <p className="mt-5 text-fg/65">Twenty voices, one fire. Five days of the Word, prayer and worship at the Old Auditorium.</p>
            <figure className="dark relative mt-8 overflow-hidden rounded-3xl border border-gold/40 text-fg bg-gradient-to-b from-gold/20 to-transparent">
              <img src="/site/pastor-daniel-olawande.jpg" alt={`${convener.title} ${convener.name}`} className="aspect-[4/5] w-full object-cover object-top" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-16">
                <p className="eyebrow text-brand">Convener</p>
                <p className="font-display text-2xl font-bold">
                  {convener.title} {convener.name}
                </p>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 xl:grid-cols-5">
            {rest.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 5) * 0.05}>
                <figure className="dark group relative overflow-hidden rounded-2xl border border-fg/10 bg-gold-pale/90 text-fg">
                  <img
                    src={`/ministers/${m.slug}.jpg`}
                    alt={`${m.title} ${m.name}`}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover object-top transition duration-700 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pb-3 pt-10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">{m.title || " "}</p>
                    <p className="text-[13px] font-semibold leading-tight text-fg">{m.name}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- stats ---------------- */
function CountUp({ to, suffix = "", plain = false }: { to: number; suffix?: string; plain?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(plain ? to : 0);
  useEffect(() => {
    if (!inView || plain) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, plain]);
  return (
    <span ref={ref} className="tabular">
      {v}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="relative bg-canvas py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-fg/10 bg-fg/10 lg:grid-cols-4">
          {SITE.stats.map((s) => (
            <div key={s.label} className="bg-canvas p-8 text-center sm:p-10">
              <p className="font-display text-5xl font-black text-metal sm:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} plain={s.value > 1000} />
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-fg/55">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- a decade ---------------- */
export function Decade() {
  const scroller = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  const list = [...EDITIONS].reverse();
  return (
    <section id="decade" className="relative scroll-mt-24 overflow-hidden bg-canvas-2 py-24 sm:py-32">
      <div className="container flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <p className="eyebrow text-ember-text">2017 → 2026</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">A decade of fire</h2>
          <p className="mt-4 max-w-lg text-fg/65">Ten Decembers, ten themes — and a counselling team that has grown with every one of them.</p>
        </Reveal>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-1)} aria-label="Previous editions" className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/15 hover:border-gold hover:text-brand">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Next editions" className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/15 hover:border-gold hover:text-brand">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div ref={scroller} className="scrollbar-thin mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-[max(1.5rem,calc((100vw-1360px)/2+2rem))]">
        {list.map((e) => {
          const now = e.year === 2026;
          return (
            <article
              key={e.year}
              className={cn(
                "dark group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border text-fg sm:w-[320px]",
                now ? "border-gold shadow-[0_0_60px_-10px_rgba(246,139,30,.6)]" : "border-fg/10",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-fg/5">
                <img src={e.flyer} alt={`YMR ${e.year} — ${e.theme} flyer`} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-fg">
                  Edition {e.number}
                </span>
                {now && <span className="absolute right-4 top-4 rounded-full bg-ember px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-ink">This year</span>}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className={cn("font-display text-6xl font-black leading-none", now ? "text-metal" : "outline-text")}>{e.year}</p>
                <p className="mt-2 font-display text-lg font-semibold">{e.theme}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- watch + gallery ---------------- */
export function Moments() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  const photos = ["/gallery/ymr-moment-06.jpg", "/gallery/ymr-moment-54.jpg", "/gallery/ymr-moment-11.jpg", "/gallery/ymr-moment-66.jpg", "/gallery/ymr-moment-25.jpg"];
  return (
    <section className="bg-canvas py-24 sm:py-32">
      <div className="container">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow text-ember-text">Moments</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">What happens when a generation shows up.</h2>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
          <Reveal className="dark relative overflow-hidden rounded-3xl border border-fg/10 text-fg lg:col-span-7 lg:row-span-2">
            <video
              ref={video}
              src="/videos/ymr-promo-2.mp4"
              poster="/gallery/ymr-moment-01.jpg"
              className="h-full min-h-[320px] w-full object-cover"
              playsInline
              loop
              preload="none"
              onEnded={() => setPlaying(false)}
            />
            <div className={cn("absolute inset-0 bg-gradient-to-t from-black/80 via-transparent transition", playing && "opacity-0")} />
            <button
              onClick={toggle}
              className="group absolute bottom-6 left-6 flex items-center gap-4 text-left"
              aria-label={playing ? "Pause video" : "Play YMR highlights video"}
            >
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-ember text-ink">
                {!playing && <span className="absolute inset-0 rounded-full bg-ember animate-pulse-ring" />}
                {playing ? <Pause className="relative h-6 w-6" /> : <Play className="relative ml-1 h-6 w-6" />}
              </span>
              {!playing && (
                <span>
                  <span className="block font-display text-xl font-bold">Watch the highlights</span>
                  <span className="text-sm text-fg/60">YMR in motion</span>
                </span>
              )}
            </button>
          </Reveal>
          {photos.slice(0, 4).map((p, i) => (
            <Reveal key={p} delay={i * 0.08} className={cn("overflow-hidden rounded-3xl border border-fg/10", i < 2 ? "lg:col-span-5" : "hidden")}>
              <img src={p} alt="Moments from past YMR editions" loading="lazy" className="h-full min-h-[200px] w-full object-cover transition duration-700 hover:scale-105" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  { q: "Is counselling only for people attending YMR in person?", a: "No. You can book a phone or WhatsApp session from anywhere. If you're at Redemption City, you can also walk into the Counselling Tent by the Old Auditorium during the retreat." },
  { q: "Who will see what I write?", a: "Only the counsellor assigned to you and the counselling team lead. We never share your details outside the team, and you can ask us to delete your information at any time." },
  { q: "Who are the counsellors?", a: "Pastors, ministers and trained volunteers from the YMR family who are screened, briefed and prayed over before the retreat. Some are certified professional counsellors." },
  { q: "I gave my life to Christ. What happens next?", a: "Register as a new believer. Within a few days a follow-up counsellor will reach out to pray with you, share a simple first-steps plan and help you find a church family near you." },
  { q: "Is there a cost?", a: "Never. Counselling and follow-up are completely free." },
  { q: "What if I'm in crisis right now?", a: "If you are in immediate danger or thinking of harming yourself, please contact local emergency services or go to the nearest hospital right away. In Nigeria you can call 112. Then reach out to us — we will stand with you." },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-canvas-2 py-24 sm:py-32">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="eyebrow text-ember-text">Questions</p>
          <h2 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Good to know</h2>
          <p className="mt-5 text-fg/65">
            Still unsure? Email <a className="text-brand underline-offset-4 hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="divide-y divide-white/10 border-y border-fg/10">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`} className="border-0">
                <AccordionTrigger className="py-6 text-left text-lg font-semibold hover:text-brand hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-fg/65">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- venue + final CTA ---------------- */
export function Venue() {
  return (
    <section className="relative overflow-hidden bg-canvas py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(246,139,30,.18),transparent_60%)]" />
      <div className="container relative">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-br from-fg/[0.06] to-fg/[0.01] p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-ember-text">See you in the city</p>
            <h2 className="mt-4 font-display text-4xl font-black leading-[0.95] sm:text-6xl">
              Your city.
              <br />
              <span className="text-metal">Your turn.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg text-fg/70">
              {SITE.dates}
              <br />
              {SITE.venue}, {SITE.address}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/counselling" className="btn-ember">
                Book counselling <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={SITE.mapUrl} target="_blank" rel="noreferrer" className="btn-ghost-gold">
                <MapPin className="h-4 w-4" /> Directions <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <Countdown />
            <a href={SITE.registerUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-fg/70 underline-offset-4 hover:text-brand hover:underline">
              Not registered for YMR 2026 yet? Register ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
