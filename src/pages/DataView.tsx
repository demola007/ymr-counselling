import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataViewHeader } from "@/components/data/DataViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { DataStats } from "@/components/data/DataStats";
import { ConvertCard } from "@/components/data/ConvertCard";
import { EditConvertDialog } from "@/components/data/EditConvertDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { useAuth } from "@/hooks/useAuth";
import { ClipLoader } from "react-spinners";
import { Skeleton } from "@/components/ui/skeleton";
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
      const response = await apiClient.get('converts/', {
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

  // Calculate stats
  const onlineCount = useMemo(() => 
    paginatedDocuments.filter(doc => doc.online).length, 
    [paginatedDocuments]
  );
  
  const studentCount = useMemo(() => 
    paginatedDocuments.filter(doc => doc.is_student).length, 
    [paginatedDocuments]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-army-gold/5 to-army-olive/5">
      {loading && (
        <div className="loader-overlay">
          <ClipLoader color="#B8860B" size={50} />
        </div>
      )}
      
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <DataViewHeader />
        
        <DataStats 
          totalRecords={totalRecords}
          currentPageCount={paginatedDocuments.length}
          onlineCount={onlineCount}
          studentCount={studentCount}
        />
        
        <DataViewFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {userRole === "super-admin" && (
          <DataViewActions
            selectedIds={selectedIds}
            onDeleteSelected={handleDeleteSelected}
            selectAll={selectedIds?.length === paginatedDocuments?.length && paginatedDocuments?.length > 0}
            onSelectAll={handleSelectAll}
            userRole={userRole}
          />
        )}

        {/* Cards Grid */}
        <div className="space-y-4 mb-6">
          {isLoadingDocuments ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))
          ) : paginatedDocuments.length === 0 ? (
            // Empty state
            <div className="text-center py-16 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl">
              <p className="text-lg font-medium text-muted-foreground">No converts found</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search query</p>
            </div>
          ) : (
            // Convert cards
            paginatedDocuments.map((doc) => (
              <ConvertCard
                key={doc.id}
                convert={doc}
                isSelected={selectedIds.includes(doc.id)}
                onSelect={() => handleSelectRow(doc.id)}
                onClick={() => handleRowClick(doc.id)}
                onEdit={(e) => handleEditClick(e, doc)}
                onDelete={(e) => handleDeleteClick(e, doc.id)}
                showActions={userRole === "super-admin"}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="space-y-4">
          <DocumentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoadingDocuments}
          />

          <div className="text-center p-4 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> - <span className="font-semibold text-foreground">{Math.min(endIndex, totalRecords)}</span> of <span className="font-semibold text-foreground">{totalRecords}</span> records
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
