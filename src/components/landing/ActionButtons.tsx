import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, UserPlus } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export const ActionButtons = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Primary CTA Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-army-green-dark via-army-green to-army-green-dark blur-xl opacity-20"></div>
        <div className="relative bg-card/40 backdrop-blur-xl border border-army-green/30 rounded-2xl p-8 md:p-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Join <span className="text-army-green-light">The Movement</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take your first step into divine purpose. Access our portal or register as a new convert.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-army-green text-black hover:bg-army-green-light font-semibold shadow-[0_0_20px_rgba(34,255,34,0.3)] hover:shadow-[0_0_30px_rgba(34,255,34,0.5)] transition-all duration-300 group"
              >
                <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Access Portal
              </Button>
            </Link>
            <Link to="/new-convert" className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-army-green/50 text-army-green hover:bg-army-green/10 hover:border-army-green font-semibold backdrop-blur-sm group"
              >
                <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                New Converts
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/counselor-registration" className="w-full">
          <div className="group bg-card/30 backdrop-blur-sm border border-army-gold/30 rounded-xl p-6 hover:border-army-gold hover:bg-card/50 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="bg-army-gold/10 p-3 rounded-lg group-hover:bg-army-gold/20 transition-colors">
                <UserPlus className="h-6 w-6 text-army-gold" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-foreground mb-1">Join Our Team</h3>
                <p className="text-sm text-muted-foreground">Become a counsellor and serve</p>
              </div>
            </div>
          </div>
        </Link>
        
        <div className="w-full">
          <BookingDialog />
        </div>
      </div>
    </div>
  );
};