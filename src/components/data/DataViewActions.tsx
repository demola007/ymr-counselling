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
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectAll}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
        />
        <span className="text-sm text-gray-600">
          {selectedIds.length} selected
        </span>
      </div>
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteSelected}
          className="ml-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected
        </Button>
      )}
    </div>
  );
};