import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DataViewFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export const DataViewFilters = ({
  searchQuery,
  setSearchQuery,
}: DataViewFiltersProps) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-army-gold/5 via-army-olive/5 to-army-gold/5 rounded-xl" />
      <div className="relative bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl p-6 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-army-gold transition-colors" />
            <Input
              placeholder="Search by name, email, phone, or location..."
              className="pl-12 h-12 bg-background/50 border-border/40 focus:border-army-gold/50 transition-all text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};