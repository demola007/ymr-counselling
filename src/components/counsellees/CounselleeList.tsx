import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentTable } from "@/components/data/DocumentTable";
import { EditCounselleeDialog } from "@/components/data/EditCounselleeDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface CounselleeListProps {
  counsellees: any[];
  isLoading: boolean;
  onUpdate: (document: any) => void;
  onDelete: (ids: number[]) => void;
}

export const CounselleeList = ({
  counsellees,
  isLoading,
  onUpdate,
  onDelete,
}: CounselleeListProps) => {
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
    navigate(`/counsellee/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, document: any) => {
    e.stopPropagation();
    if (userRole !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "Only super-admin users can edit counsellees.",
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
        description: "Only super-admin users can delete counsellees.",
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
      setSelectedIds(counsellees?.map(doc => doc.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const getDisplayFields = (document: any) => {
    return {
      name: document.name || "N/A",
      email: document.email || "N/A",
      phone_number: document.phone_number || "N/A",
      gender: document.gender || "N/A",
      country: document.country || "N/A",
      state: document.state || "N/A",
      address: document.address || "N/A",
      age_group: document.age_group || "N/A",
      school: document.school || "N/A",
      occupation: document.occupation || "N/A",
      counsellor_name: document.counsellor_name || "N/A",
      attended_to: document.attended_to || "N/A",
    };
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
            documents={counsellees.map(doc => ({
              ...doc,
              displayFields: getDisplayFields(doc)
            }))}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onRowClick={handleRowClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            isLoading={isLoading}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "phone_number", label: "Phone Number" },
              { key: "gender", label: "Gender" },
              { key: "country", label: "Country" },
              { key: "state", label: "State" },
              { key: "address", label: "Address" },
              { key: "age_group", label: "Age Group" },
              { key: "school", label: "School" },
              { key: "occupation", label: "Occupation" },
              { key: "counsellor_name", label: "Counsellor" },
              { key: "attended_to", label: "Attended To" },
            ]}
          />
        </div>
      </div>

      <EditCounselleeDialog
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
