import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Convert } from "@/types/convert";

interface Column {
  key: string;
  label: string;
}

interface DocumentTableProps {
  documents: any[];
  selectedIds: number[];
  onSelectRow: (id: number) => void;
  onRowClick: (id: number) => void;
  onEditClick: (e: React.MouseEvent, document: any) => void;
  onDeleteClick: (e: React.MouseEvent, id: number) => void;
  isLoading: boolean;
  columns: Column[];
}

export const DocumentTable = ({
  documents,
  selectedIds,
  onSelectRow,
  onRowClick,
  onEditClick,
  onDeleteClick,
  isLoading,
  columns
}: DocumentTableProps) => {
  const { userRole } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const formatValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {userRole === "super-admin" && <TableHead className="w-[50px]" />}
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          {userRole === "super-admin" && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow
            key={doc.id}
            className="hover:bg-purple-50 cursor-pointer transition-colors"
            onClick={() => onRowClick(doc.id)}
          >
            {userRole === "super-admin" && (
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(doc.id)}
                  onCheckedChange={() => onSelectRow(doc.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key}>
                {formatValue(doc[column.key])}
              </TableCell>
            ))}
            {userRole === "super-admin" && (
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onEditClick(e, doc)}
                    className="hover:bg-purple-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onDeleteClick(e, doc.id)}
                    className="hover:bg-red-100 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};