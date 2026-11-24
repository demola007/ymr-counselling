import { Link } from "react-router-dom";
import { PublicShell } from "@/components/landing/PublicShell";
import { Skyline } from "@/components/brand/Skyline";

export default function NotFound() {
  return (
    <PublicShell>
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <p className="font-display text-[8rem] font-black leading-none text-metal sm:text-[12rem]">404</p>
        <p className="mt-2 font-display text-2xl">This street isn't on our map.</p>
        <Link to="/" className="btn-ember mt-8">
          Back to the city
        </Link>
        <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-60" seed={404} />
      </section>
    </PublicShell>
  );
}
