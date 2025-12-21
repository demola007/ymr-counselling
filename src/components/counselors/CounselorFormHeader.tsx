import { Shield } from "lucide-react";
export const CounselorFormHeader = () => {
  return <div className="text-center max-w-2xl mx-auto mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-army-gold/20 mb-4">
        <Shield className="w-8 h-8 text-army-gold" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Join Our Counselling Team</h1>
      <p className="text-muted-foreground text-lg">
        Apply to become part of our team of professionals and matured counselors
      </p>
    </div>;
};