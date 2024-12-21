import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentTable } from "@/components/data/DocumentTable";
import { EditDocumentDialog } from "@/components/data/EditDocumentDialog";
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
      counsellor_name: document.counsellor_name || "N/A",
      counselling_reason: document.counselling_reason || "N/A",
      date_of_birth: document.date_of_birth || "N/A",
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
              { key: "counsellor_name", label: "Counsellor" },
              { key: "counselling_reason", label: "Reason" },
              { key: "date_of_birth", label: "Date of Birth" },
            ]}
          />
        </div>
      </div>

      <EditDocumentDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        document={editingDocument}
        onSubmit={handleEditSubmit}
        setEditingDocument={setEditingDocument}
        isLoading={false}
        fields={[
          { key: "name", label: "Name", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ]},
          { key: "email", label: "Email", type: "email" },
          { key: "phone_number", label: "Phone Number", type: "text" },
          { key: "date_of_birth", label: "Date of Birth", type: "date" },
          { key: "relationship_status", label: "Relationship Status", type: "select", options: [
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
            { value: "other", label: "Other" }
          ]},
          { key: "country", label: "Country", type: "text" },
          { key: "state", label: "State", type: "text" },
          { key: "address", label: "Address", type: "text" },
          { key: "nearest_bus_stop", label: "Nearest Bus Stop", type: "text" },
          { key: "is_student", label: "Is Student", type: "select", options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" }
          ]},
          { key: "age_group", label: "Age Group", type: "select", options: [
            { value: "18-24", label: "18-24" },
            { value: "25-34", label: "25-34" },
            { value: "35-44", label: "35-44" },
            { value: "45+", label: "45+" }
          ]},
          { key: "school", label: "School", type: "text" },
          { key: "occupation", label: "Occupation", type: "text" },
          { key: "denomination", label: "Denomination", type: "text" },
          { key: "counselling_reason", label: "Counselling Reason", type: "textarea" },
          { key: "counsellor_name", label: "Counsellor Name", type: "text" },
          { key: "counsellor_comments", label: "Counsellor Comments", type: "textarea" }
        ]}
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
