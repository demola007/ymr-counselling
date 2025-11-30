import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface DataViewActionsProps {
  selectedIds: number[];
  onDeleteSelected: () => void;
  selectAll: boolean;
  onSelectAll: (checked: boolean) => void;
  userRole: string | null;
}

export const DataViewActions = ({
  selectedIds,
  onDeleteSelected,
  selectAll,
  onSelectAll,
  userRole,
}: DataViewActionsProps) => {
  if (userRole !== "super-admin") {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={selectAll}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
          className="border-2"
        />
        <span className="text-sm font-medium text-foreground">
          {selectedIds.length === 0 ? (
            "Select items"
          ) : (
            <span className="text-army-gold">
              {selectedIds.length} selected
            </span>
          )}
        </span>
      </div>
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete ({selectedIds.length})
        </Button>
      )}
    </div>
  );
};