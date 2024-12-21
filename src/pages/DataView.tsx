import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataViewHeader } from "@/components/data/DataViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { EditConvertDialog } from "@/components/data/EditConvertDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";
import { DocumentTable } from "@/components/data/DocumentTable";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { useAuth } from "@/hooks/useAuth";
import { ClipLoader } from "react-spinners";
import apiClient from "@/utils/apiClient";
import "../contexts/loader.css";

const ITEMS_PER_PAGE = 20;

const DataView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const queryClient = useQueryClient();

  const { data: filteredDocuments = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['converts', searchQuery, studentFilter, genderFilter, currentPage],
    queryFn: async () => {
      const response = await apiClient.get('converts', {
        params: {
          searchQuery,
          limit: ITEMS_PER_PAGE,
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
        },
      });
      if (response.data.status === "success") {
        return response.data;
      }
      throw new Error('Failed to fetch documents');
    },
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments?.data || [];
  const totalRecords = filteredDocuments?.total || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
  
  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      setLoading(true);
      await apiClient.delete('converts/bulk-delete', {
        data: { ids },
      });
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converts'] });
      toast({
        title: "Success",
        description: "Convert data deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      setSelectedIds([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.detail || "Failed to delete convert data",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (document: any) => {
      const response = await apiClient.put(`converts/${document.id}`, document);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['converts'] });
      toast({
        title: "Success",
        description: "Convert data updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingDocument(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update convert data",
        variant: "destructive",
      });
    },
  });

  const handleEditSubmit = async (data: any) => {
    if (editingDocument) {
      updateMutation.mutate({ ...data, id: editingDocument.id });
    }
  };

  const handleDeleteConfirm = () => {
    const idsToDelete = deletingId ? [deletingId] : selectedIds;
    deleteMutation.mutate(idsToDelete);
  };

  const handleRowClick = (id: number) => {
    navigate(`/data/${id}`);
  };

  const handleEditClick = (e: React.MouseEvent, document: any) => {
    e.stopPropagation();
    setEditingDocument(document);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSelected = () => {
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
    if (checked) {
      setSelectedIds(paginatedDocuments.map(doc => doc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "gender", label: "Gender" },
    { key: "email", label: "Email" },
    { key: "phone_number", label: "Phone" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "country", label: "Country" },
    { key: "state", label: "State" },
    { key: "address", label: "Address" },
    { key: "is_student", label: "Student" },
    { key: "age_group", label: "Age Group" },
    { key: "denomination", label: "Denomination" },
    { key: "availability_for_follow_up", label: "Available for Follow-up" },
    { key: "online", label: "Online" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {loading && (
        <div className="loader-overlay">
          <ClipLoader color="#3498db" size={50} />
        </div>
      )}
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <DataViewHeader />
        
        <DataViewFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <DataViewActions
          selectedIds={selectedIds}
          onDeleteSelected={handleDeleteSelected}
          selectAll={selectedIds?.length === paginatedDocuments?.length}
          onSelectAll={handleSelectAll}
          userRole={userRole}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <DocumentTable
              documents={paginatedDocuments}
              selectedIds={selectedIds}
              onSelectRow={handleSelectRow}
              onRowClick={handleRowClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              isLoading={isLoadingDocuments}
              columns={columns}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <DocumentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoadingDocuments}
          />

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-lg font-semibold text-purple-800">
              Total Records: {totalRecords}
            </p>
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} - {Math.min(endIndex, totalRecords)} of {totalRecords}
            </p>
          </div>
        </div>

        <EditConvertDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          document={editingDocument}
          onSubmit={handleEditSubmit}
          setEditingDocument={setEditingDocument}
          isLoading={updateMutation.isPending}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          isMultiple={selectedIds.length > 0}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default DataView;
