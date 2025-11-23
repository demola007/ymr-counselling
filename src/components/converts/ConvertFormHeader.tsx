import React from "react";
import { Shield } from "lucide-react";

export const ConvertFormHeader = () => {
  return (
    <div className="space-y-6 text-center max-w-3xl mx-auto mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-army-green/10 border border-army-green/20 mb-2">
        <Shield className="w-8 h-8 text-army-green" />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Join the Lord's Army
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Did you answer the call of salvation during YMR 2024 - FLOODGATES? 
          We'd love to keep in touch with you.
        </p>
      </div>

      <div className="pt-4 border-t border-border/40">
        <p className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
          In line with the relevant Data Protection Laws in Nigeria, by completing this form you consent to the collection 
          and processing of your personal data for YMR Counselling and Follow-up activities, as well as for communication 
          purposes such as receiving information by mail, telephone, email, or other electronic means about our activities.
        </p>
      </div>
    </div>
  );
};