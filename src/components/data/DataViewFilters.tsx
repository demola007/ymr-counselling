import { Search, MapPin, Globe, Home, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export interface FilterState {
  searchQuery: string;
  state: string;
  country: string;
  address: string;
}

interface DataViewFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const DataViewFilters = ({
  filters,
  onFiltersChange,
}: DataViewFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = [filters.state, filters.country, filters.address].filter(Boolean).length;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: "",
      state: "",
      country: "",
      address: "",
    });
  };

  const hasAnyFilter = filters.searchQuery || filters.state || filters.country || filters.address;

  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-army-gold/5 via-army-olive/5 to-army-gold/5 rounded-xl" />
      <div className="relative bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl p-6 shadow-lg">
        {/* Main Search */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-army-gold transition-colors" />
            <Input
              placeholder="Search by name, email, or phone..."
              className="pl-12 h-12 bg-background/50 border-border/40 focus:border-army-gold/50 transition-all text-base"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
            />
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-center gap-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                Advanced Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-army-gold/20 text-army-gold text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </CollapsibleTrigger>
            {hasAnyFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Filter */}
              <div className="relative group">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-army-gold transition-colors" />
                <Input
                  placeholder="Filter by country..."
                  className="pl-10 bg-background/50 border-border/40 focus:border-army-gold/50 transition-all"
                  value={filters.country}
                  onChange={(e) => handleFilterChange("country", e.target.value)}
                />
              </div>

              {/* State Filter */}
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-army-gold transition-colors" />
                <Input
                  placeholder="Filter by state..."
                  className="pl-10 bg-background/50 border-border/40 focus:border-army-gold/50 transition-all"
                  value={filters.state}
                  onChange={(e) => handleFilterChange("state", e.target.value)}
                />
              </div>

              {/* Address Filter */}
              <div className="relative group">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-army-gold transition-colors" />
                <Input
                  placeholder="Filter by address..."
                  className="pl-10 bg-background/50 border-border/40 focus:border-army-gold/50 transition-all"
                  value={filters.address}
                  onChange={(e) => handleFilterChange("address", e.target.value)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
