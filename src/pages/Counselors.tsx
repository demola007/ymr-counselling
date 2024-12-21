import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { DocumentTable } from "@/components/data/DocumentTable";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { EditCounsellorDialog } from "@/components/data/EditCounsellorDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { useAuth } from "@/hooks/useAuth";

const ITEMS_PER_PAGE = 10;

const Counselors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const queryClient = useQueryClient();

  // Fetch counselors with search and pagination
  const { data: counselors = [], isLoading } = useQuery({
    queryKey: ['counselors', searchQuery],
    queryFn: async () => {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [];
    },
  });

  // Calculate pagination
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCounselors = counselors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(counselors.length / ITEMS_PER_PAGE);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // TODO: Implement delete API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselors'] });
      toast({
        title: "Success",
        description: "Counselor deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (document: any) => {
      // TODO: Implement update API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselors'] });
      toast({
        title: "Success",
        description: "Counselor updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingDocument(null);
    },
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDocument) {
      updateMutation.mutate(editingDocument);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <PageHeader 
          title="Counselors" 
          description="View and manage counselor applications"
        />
        
        <DataViewFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          studentFilter="all"
          setStudentFilter={() => {}}
          genderFilter="all"
          setGenderFilter={() => {}}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <DocumentTable
              documents={paginatedCounselors}
              selectedIds={[]}
              onSelectRow={() => {}}
              onRowClick={() => {}}
              onEditClick={(e, doc) => {
                e.stopPropagation();
                if (userRole !== "super-admin") {
                  toast({
                    title: "Access Denied",
                    description: "Only super-admin users can edit counselors.",
                    variant: "destructive",
                  });
                  return;
                }
                setEditingDocument(doc);
                setIsEditDialogOpen(true);
              }}
              onDeleteClick={(e, id) => {
                e.stopPropagation();
                if (userRole !== "super-admin") {
                  toast({
                    title: "Access Denied",
                    description: "Only super-admin users can delete counselors.",
                    variant: "destructive",
                  });
                  return;
                }
                setDeletingId(id);
                setIsDeleteDialogOpen(true);
              }}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mt-6">
          <DocumentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </div>

        <EditCounsellorDialog
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
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default Counselors;
