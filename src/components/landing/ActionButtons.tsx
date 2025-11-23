import { Link } from "react-router-dom";
import { UserPlus, CalendarClock, ShieldCheck } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export const ActionButtons = () => {
  return (
    <section aria-label="Key actions" className="max-w-4xl mx-auto px-4">
      <div className="space-y-4">
        {/* Primary action: New Converts */}
        <Link to="/new-convert" className="group block">
          <article className="relative overflow-hidden rounded-2xl border border-army-green/60 bg-card/80 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 hover:border-army-green hover:shadow-[var(--shadow-army)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-army-green/20 p-3.5 text-army-green-light transition-colors group-hover:bg-army-green/30">
                  <UserPlus className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="mb-1 text-lg md:text-xl font-semibold text-foreground">New Converts</h3>
                  <p className="text-sm text-muted-foreground">Join the Lord&apos;s Army</p>
                </div>
              </div>
              <div className="hidden h-9 items-center justify-center rounded-full border border-army-green/60 px-3 text-xs font-medium text-army-green-light transition-all group-hover:bg-army-green/15 sm:flex">
                <span className="mr-1">Begin journey</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </div>
          </article>
        </Link>

        {/* Secondary actions */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Join Our Team */}
          <Link to="/counselor-registration" className="group block">
            <article className="flex h-full flex-col justify-between rounded-xl border border-army-gold/40 bg-card/70 p-4 md:p-5 transition-all duration-300 hover:border-army-gold hover:shadow-[var(--shadow-gold)]">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-army-gold/15 p-2.5 text-army-gold">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground md:text-base">Join Our Team</h3>
                  <p className="text-xs text-muted-foreground md:text-sm">Serve as a counsellor</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Staff & volunteers</span>
                <span className="text-army-gold transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </article>
          </Link>

          {/* Book a Session */}
          <article className="flex h-full flex-col justify-between rounded-xl border border-army-green/40 bg-card/70 p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-army-green/15 p-2.5 text-army-green-light">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-foreground md:text-base">Book a Session</h3>
                <p className="text-xs text-muted-foreground md:text-sm">Connect with a counsellor</p>
              </div>
            </div>
            <div className="mt-4">
              <BookingDialog />
            </div>
          </article>

          {/* Access Portal - staff only */}
          <Link to="/login" className="group block">
            <article className="flex h-full flex-col justify-between rounded-xl border border-army-green/30 bg-card/70 p-4 md:p-5 transition-all duration-300 hover:border-army-green hover:shadow-[var(--shadow-army)]">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-army-green/15 p-2.5 text-army-green-light">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-foreground md:text-base">Access Portal</h3>
                  <p className="text-xs text-muted-foreground md:text-sm">Login for staff & counsellors</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-full border border-army-green/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">Staff only</span>
                <span className="text-army-green-light transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </section>
  );
};