import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { Embers } from "@/components/brand/Embers";
import { YmrTenLogo } from "@/components/brand/Logo";
import { NationsBurst } from "@/components/brand/NationsBurst";
import { Skyline } from "@/components/brand/Skyline";
import { SITE } from "@/config/site";

const ease = [0.2, 0.7, 0.2, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const wordY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const skyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="grain relative -mt-[100px] flex min-h-[100svh] flex-col overflow-hidden bg-canvas pt-[100px]">
      {/* video layer, heavily graded so the burst and type stay legible */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-[0.07] mix-blend-luminosity dark:opacity-[0.18]"
        src="/videos/ymr-promo.mp4"
        poster="/gallery/ymr-moment-01.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <NationsBurst />
      <Embers className="absolute inset-0 h-full w-full" />

      <motion.div style={{ y: wordY, opacity: fade }} className="container relative z-10 flex flex-1 flex-col items-center justify-center pb-[190px] pt-6 text-center sm:pb-[250px]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease }}>
          <YmrTenLogo className="mx-auto w-24 dark:drop-shadow-[0_8px_30px_rgba(0,0,0,.6)] sm:w-28" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease }}
          className="eyebrow mt-8 text-brand/80"
        >
          Counselling & Follow-up · {SITE.subtitle}
        </motion.p>

        <h1 className="mt-5 font-display font-black leading-[0.86] tracking-[0.02em]">
          {["CITY", "TAKERS"].map((w, i) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.35 + i * 0.18, duration: 1, ease }}
              className="text-gold-shimmer block text-[clamp(3.6rem,13vw,10rem)] dark:drop-shadow-[0_10px_40px_rgba(246,139,30,.25)]"
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease }}
          className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-fg/80 sm:text-xl"
        >
          Nobody takes a city alone. Whatever you're carrying into YMR this year, a trained counsellor is ready to listen, pray and walk the road with you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease }}
          className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link to="/counselling" className="btn-ember w-full !py-3.5 sm:w-auto">
            <HeartHandshake className="h-4 w-4" /> Talk to a counsellor
          </Link>
          <Link to="/new-believer" className="btn-ghost-gold w-full !py-3.5 sm:w-auto">
            <Sparkles className="h-4 w-4" /> I just gave my life to Jesus
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-8 inline-flex items-center gap-2 text-sm text-fg/60"
        >
          <MapPin className="h-4 w-4 text-brand" /> {SITE.dates} · {SITE.venue}
        </motion.p>
      </motion.div>

      <motion.div style={{ y: skyY }} className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]">
        <Skyline className="h-[200px] sm:h-[280px]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-24 bg-gradient-to-t from-canvas to-transparent" />

      <a
        href="#doors"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-fg/50 hover:text-fg"
        aria-label="Scroll to ways we can help"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
