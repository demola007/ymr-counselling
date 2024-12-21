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
    <div className="glass-panel rounded-lg p-4 md:p-6 mb-6">
      <div className="max-w-md w-full mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, email or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};