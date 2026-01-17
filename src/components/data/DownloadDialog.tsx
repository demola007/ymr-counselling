import { useState } from "react";
import { Download, FileSpreadsheet, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import apiClient from "@/utils/apiClient";
import type { FilterState } from "./DataViewFilters";

const AVAILABLE_COLUMNS = [
  { key: "name", label: "Name", category: "Basic" },
  { key: "gender", label: "Gender", category: "Basic" },
  { key: "email", label: "Email", category: "Contact" },
  { key: "phone_number", label: "Phone Number", category: "Contact" },
  { key: "date_of_birth", label: "Date of Birth", category: "Basic" },
  { key: "relationship_status", label: "Relationship Status", category: "Basic" },
  { key: "country", label: "Country", category: "Location" },
  { key: "state", label: "State", category: "Location" },
  { key: "address", label: "Address", category: "Location" },
  { key: "nearest_bus_stop", label: "Nearest Bus Stop", category: "Location" },
  { key: "is_student", label: "Is Student", category: "Education/Work" },
  { key: "age_group", label: "Age Group", category: "Basic" },
  { key: "school", label: "School", category: "Education/Work" },
  { key: "occupation", label: "Occupation", category: "Education/Work" },
  { key: "denomination", label: "Denomination", category: "Church" },
  { key: "availability_for_follow_up", label: "Available for Follow-up", category: "Church" },
  { key: "online", label: "Online Convert", category: "Church" },
  { key: "created_at", label: "Created At", category: "System" },
];

const CATEGORIES = ["Basic", "Contact", "Location", "Education/Work", "Church", "System"];

interface DownloadDialogProps {
  filters: FilterState;
  totalRecords: number;
}

export const DownloadDialog = ({ filters, totalRecords }: DownloadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    AVAILABLE_COLUMNS.map((col) => col.key)
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleColumnToggle = (key: string) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectCategory = (category: string, selected: boolean) => {
    const categoryColumns = AVAILABLE_COLUMNS.filter((col) => col.category === category).map(
      (col) => col.key
    );
    if (selected) {
      setSelectedColumns((prev) => [...new Set([...prev, ...categoryColumns])]);
    } else {
      setSelectedColumns((prev) => prev.filter((key) => !categoryColumns.includes(key)));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedColumns(AVAILABLE_COLUMNS.map((col) => col.key));
    } else {
      setSelectedColumns([]);
    }
  };

  const isCategorySelected = (category: string) => {
    const categoryColumns = AVAILABLE_COLUMNS.filter((col) => col.category === category);
    return categoryColumns.every((col) => selectedColumns.includes(col.key));
  };

  const isCategoryPartiallySelected = (category: string) => {
    const categoryColumns = AVAILABLE_COLUMNS.filter((col) => col.category === category);
    const selectedCount = categoryColumns.filter((col) => selectedColumns.includes(col.key)).length;
    return selectedCount > 0 && selectedCount < categoryColumns.length;
  };

  const handleDownload = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "No columns selected",
        description: "Please select at least one column to download.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    try {
      const params: Record<string, string> = {};
      
      if (filters.searchQuery) params.searchQuery = filters.searchQuery;
      if (filters.state) params.state = filters.state;
      if (filters.country) params.country = filters.country;
      if (filters.address) params.address = filters.address;
      
      // Only send columns param if not all columns are selected
      if (selectedColumns.length < AVAILABLE_COLUMNS.length) {
        params.columns = selectedColumns.join(",");
      }

      const response = await apiClient.get("converts/download", {
        params,
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename based on filters
      let filename = "converts";
      if (filters.state) filename += `_state_${filters.state}`;
      if (filters.country) filename += `_country_${filters.country}`;
      filename += ".csv";
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: "Your CSV file is being downloaded.",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Download failed",
        description: error?.response?.data?.detail || "Failed to download CSV file.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-army-gold/10 border-army-gold/30 hover:bg-army-gold/20 text-army-gold"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-army-gold" />
            Download Converts Data
          </DialogTitle>
          <DialogDescription>
            Select which columns to include in the CSV export.
            {totalRecords > 0 && (
              <span className="block mt-1 text-army-gold font-medium">
                {totalRecords} records will be exported based on current filters.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Select All */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedColumns.length === AVAILABLE_COLUMNS.length}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
              />
              <Label htmlFor="select-all" className="font-medium">
                Select All Columns
              </Label>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedColumns.length} of {AVAILABLE_COLUMNS.length} selected
            </span>
          </div>

          {/* Columns by Category */}
          {CATEGORIES.map((category) => {
            const categoryColumns = AVAILABLE_COLUMNS.filter((col) => col.category === category);
            const isSelected = isCategorySelected(category);
            const isPartial = isCategoryPartiallySelected(category);

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={isSelected}
                    ref={(el) => {
                      if (el) {
                        (el as HTMLButtonElement & { indeterminate?: boolean }).indeterminate = isPartial;
                      }
                    }}
                    onCheckedChange={(checked) => handleSelectCategory(category, !!checked)}
                  />
                  <Label htmlFor={`category-${category}`} className="font-semibold text-sm text-army-gold">
                    {category}
                  </Label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                  {categoryColumns.map((col) => (
                    <div key={col.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={col.key}
                        checked={selectedColumns.includes(col.key)}
                        onCheckedChange={() => handleColumnToggle(col.key)}
                      />
                      <Label htmlFor={col.key} className="text-sm font-normal cursor-pointer">
                        {col.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading || selectedColumns.length === 0}
            className="bg-army-gold hover:bg-army-gold/90 text-white"
          >
            {isDownloading ? (
              <>Downloading...</>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Download ({selectedColumns.length} columns)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
