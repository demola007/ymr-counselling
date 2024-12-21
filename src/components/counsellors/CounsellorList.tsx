import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentTable } from "@/components/data/DocumentTable";
import { EditCounsellorDialog } from "@/components/data/EditCounsellorDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface CounsellorListProps {
  counsellors: any[];
  isLoading: boolean;
  onUpdate: (document: any) => void;
  onDelete: (ids: number[]) => void;
}

export const CounsellorList = ({
  counsellors,
  isLoading,
  onUpdate,
  onDelete,
}: CounsellorListProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDocument) {
      onUpdate(editingDocument);
      setIsEditDialogOpen(false);
      setEditingDocument(null);
    }
  };

  const handleDeleteConfirm = () => {
    const idsToDelete = deletingId ? [deletingId] : selectedIds;
    onDelete(idsToDelete);
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
    setSelectedIds([]);
    setSelectAll(false);
  };

  const handleRowClick = (id: number) => {
    navigate(`/counsellors/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, document: any) => {
    e.stopPropagation();
    if (userRole !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "Only super-admin users can edit counsellors.",
        variant: "destructive",
      });
      return;
    }
    setEditingDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (userRole !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "Only super-admin users can delete counsellors.",
        variant: "destructive",
      });
      return;
    }
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(counsellors?.map(doc => doc.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <DataViewActions
        selectedIds={selectedIds}
        onDeleteSelected={handleDeleteSelected}
        selectAll={selectAll}
        onSelectAll={handleSelectAll}
        userRole={userRole}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <DocumentTable
            documents={counsellors}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onRowClick={handleRowClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            isLoading={isLoading}
          />
        </div>
      </div>

      <EditCounsellorDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        document={editingDocument}
        onSubmit={handleEditSubmit}
        setEditingDocument={setEditingDocument}
        isLoading={false}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isMultiple={selectedIds.length > 0}
        isLoading={false}
      />
    </>
  );
};