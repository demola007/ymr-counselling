import { Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-army-green/30 py-12">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-army-green-dark/10 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Get In <span className="text-army-green-light">Touch</span>
            </h3>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-army-green to-transparent mx-auto rounded-full"></div>
          </div>
          
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="group bg-card/30 backdrop-blur-sm border border-army-green/20 rounded-xl p-6 hover:border-army-green/50 hover:bg-card/40 transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-army-green/10 p-2 rounded-lg group-hover:bg-army-green/20 transition-colors">
                  <Phone className="h-5 w-5 text-army-green" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Counselling HOD</p>
                  <a 
                    href="tel:+2348162495328" 
                    className="text-foreground hover:text-army-green-light transition-colors font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "tel:+2348162495328";
                    }}
                  >
                    +234 816 249 5328
                  </a>
                </div>
              </div>
            </div>
            
            <div className="group bg-card/30 backdrop-blur-sm border border-army-green/20 rounded-xl p-6 hover:border-army-green/50 hover:bg-card/40 transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-army-green/10 p-2 rounded-lg group-hover:bg-army-green/20 transition-colors">
                  <Phone className="h-5 w-5 text-army-green" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Counselling AHOD</p>
                  <a 
                    href="tel:+2348141689142" 
                    className="text-foreground hover:text-army-green-light transition-colors font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "tel:+2348141689142";
                    }}
                  >
                    +234 814 168 9142
                  </a>
                </div>
              </div>
            </div>

            <div className="group bg-card/30 backdrop-blur-sm border border-army-green/20 rounded-xl p-6 hover:border-army-green/50 hover:bg-card/40 transition-all duration-300">
              <div className="flex items-start space-x-3">
                <div className="bg-army-green/10 p-2 rounded-lg group-hover:bg-army-green/20 transition-colors">
                  <Mail className="h-5 w-5 text-army-green flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Email Us</p>
                  <a 
                    href="mailto:ymrcounsellingfollowup@gmail.com" 
                    className="text-foreground hover:text-army-green-light transition-colors text-sm font-medium break-all"
                  >
                    ymrcounsellingfollowup@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div className="pt-8 border-t border-army-green/20 text-center">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} YMR Counselling Unit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};