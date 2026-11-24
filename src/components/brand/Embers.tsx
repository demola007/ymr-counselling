import { useEffect, useRef } from "react";

/** Rising ember particles on a canvas. Pauses off-screen and respects reduced motion. */
export function Embers({ density = 70, className }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; vy: number; vx: number; life: number; max: number; hue: number };
    const ps: P[] = [];
    const spawn = (initial = false): P => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.6 + 0.25),
      vx: (Math.random() - 0.5) * 0.25,
      life: 0,
      max: Math.random() * 500 + 300,
      hue: 25 + Math.random() * 20,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const count = Math.round((density * Math.min(w, 1400)) / 1400);
    for (let i = 0; i < count; i++) ps.push(spawn(true));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const dark = canvas.closest(".dark") !== null || document.documentElement.classList.contains("dark");
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      for (const p of ps) {
        p.life++;
        p.x += p.vx + Math.sin((p.life + p.max) / 40) * 0.15;
        p.y += p.vy;
        const t = p.life / p.max;
        const alpha = Math.sin(Math.PI * Math.min(t, 1)) * (dark ? 0.9 : 0.35);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, `hsla(${p.hue}, 100%, ${dark ? 65 : 45}%, ${alpha})`);
        g.addColorStop(1, `hsla(${p.hue}, 100%, ${dark ? 50 : 45}%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
        if (p.life > p.max || p.y < -20) Object.assign(p, spawn());
      }
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
