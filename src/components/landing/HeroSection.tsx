import { Badge } from "@/components/ui/badge";
export const HeroSection = () => {
  return <div className="space-y-6 animate-slide-in-left">
      <Badge variant="outline" className="border-army-green/50 text-army-green bg-army-green/10 px-4 py-1">
        YMR 2025
      </Badge>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
        <span className="text-foreground">Welcome to</span>
        <br />
        <span className="text-army-green-light text-5xl md:text-6xl lg:text-7xl tracking-tight">
          THE NEW ARMY
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
        Join us for an extraordinary spiritual experience as we raise up 
        <span className="text-army-green font-semibold"> warriors </span>
        equipped for kingdom advancement and divine purpose.
      </p>
      
      <div className="pt-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-12 bg-gradient-to-b from-army-green-light to-army-green-dark rounded-full"></div>
          <div>
            <p className="text-sm text-muted-foreground">
          </p>
            <p className="text-lg font-semibold text-foreground">Transform Your Life Through Divine Counsel</p>
          </div>
        </div>
      </div>
    </div>;
};