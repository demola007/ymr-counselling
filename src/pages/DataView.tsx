import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataViewHeader } from "@/components/data/DataViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { EditDocumentDialog } from "@/components/data/EditDocumentDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";
import { DocumentTable } from "@/components/data/DocumentTable";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import apiClient from "@/utils/apiClient";
import { ClipLoader } from "react-spinners";
import "../contexts/loader.css"

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
  const isMobile = useIsMobile();

  // Fetch documents with filters and pagination
  const { data: filteredDocuments = [], isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['converts', searchQuery, studentFilter, genderFilter, currentPage],
    queryFn: async () => {
      const response = await apiClient.get('converts', {
        params: {
          searchQuery,
          limit: ITEMS_PER_PAGE,
          skip: (currentPage - 1) * ITEMS_PER_PAGE, // Calculate offset
        },
      });
      if (response.data.status === "success") {
        return response.data;
      } else {
        throw new Error('Failed to fetch documents');
      }
    },
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments?.data || [];
  const totalRecords = filteredDocuments?.total || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
  
  // Delete mutation
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
      // Handle errors here
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete convert data",
        variant: "destructive",
      });
      console.error("Delete Error:", error);
    },
    onSettled: () => {
      // Cleanup logic after success or error
      setLoading(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (document: any) => {
      await apiClient.put(`converts/${document.id}`, document);
      return document;
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
      // Handle errors here
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update convert data",
        variant: "destructive",
      });
      console.error("Update Error:", error);
    },
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDocument) {
      updateMutation.mutate(editingDocument);
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
    if (userRole !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "Only super-admin users can edit documents.",
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
        description: "Only super-admin users can delete documents.",
        variant: "destructive",
      });
      return;
    }
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    if (userRole !== "super-admin") {
      toast({
        title: "Access Denied",
        description: "Only super-admin users can delete documents.",
        variant: "destructive",
      });
      return;
    }
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
          studentFilter={studentFilter}
          setStudentFilter={setStudentFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
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
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)} of {totalRecords}
            </p>
          </div>
        </div>

        <EditDocumentDialog
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
