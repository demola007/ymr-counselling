import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataViewFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  studentFilter: string;
  setStudentFilter: (value: string) => void;
  genderFilter: string;
  setGenderFilter: (value: string) => void;
}

export const DataViewFilters = ({
  searchQuery,
  setSearchQuery,
  studentFilter,
  setStudentFilter,
  genderFilter,
  setGenderFilter,
}: DataViewFiltersProps) => {
  return (
    <div className="glass-panel rounded-lg p-4 md:p-6 mb-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, email or phone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={studentFilter} onValueChange={setStudentFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Student Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="Yes">Students</SelectItem>
            <SelectItem value="No">Non-Students</SelectItem>
          </SelectContent>
        </Select>
        <Select value={genderFilter} onValueChange={setGenderFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};