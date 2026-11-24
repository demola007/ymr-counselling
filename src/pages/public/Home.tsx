import { Hero } from "@/components/landing/Hero";
import { PublicShell } from "@/components/landing/PublicShell";
import { Decade, Doors, Faq, Marquee, Ministers, Moments, Route, Scripture, Stats, Venue } from "@/components/landing/Sections";

export default function Home() {
  return (
    <PublicShell>
      <Hero />
      <Marquee />
      <Doors />
      <Scripture />
      <Route />
      <Ministers />
      <Stats />
      <Decade />
      <Moments />
      <Faq />
      <Venue />
    </PublicShell>
  );
}
