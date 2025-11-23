import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, UserPlus } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export const ActionButtons = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Clean, Elegant Action Cards */}
      <div className="grid gap-4 md:gap-5">
        {/* New Converts - Primary Action */}
        <Link to="/new-convert" className="group">
          <div className="relative bg-card/50 backdrop-blur-sm border border-army-green/40 rounded-xl p-6 md:p-8 hover:border-army-green hover:bg-card/70 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(34,255,34,0.15)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-army-green/15 p-3.5 rounded-lg group-hover:bg-army-green/25 transition-colors">
                  <UserPlus className="h-6 w-6 text-army-green-light" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">New Converts</h3>
                  <p className="text-sm text-muted-foreground">Register and join The New Army</p>
                </div>
              </div>
              <div className="hidden sm:block text-army-green/60 group-hover:text-army-green group-hover:translate-x-1 transition-all">
                →
              </div>
            </div>
          </div>
        </Link>

        {/* Secondary Actions Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Join Our Team */}
          <Link to="/counselor-registration" className="group">
            <div className="bg-card/50 backdrop-blur-sm border border-army-gold/30 rounded-xl p-6 hover:border-army-gold hover:bg-card/70 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,215,0,0.1)] h-full">
              <div className="flex flex-col gap-3">
                <div className="bg-army-gold/10 p-3 rounded-lg w-fit group-hover:bg-army-gold/20 transition-colors">
                  <UserPlus className="h-5 w-5 text-army-gold" />
                </div>
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">Join Our Team</h3>
                  <p className="text-sm text-muted-foreground">Become a counsellor</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Book a Session */}
          <div className="w-full">
            <BookingDialog />
          </div>
        </div>
      </div>
    </div>
  );
};