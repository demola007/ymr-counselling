import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainNavigation } from "@/components/MainNavigation";
import { PageHeader } from "@/components/PageHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { DocumentTable } from "@/components/data/DocumentTable";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/utils/apiClient";
import { ClipLoader } from "react-spinners";

const ITEMS_PER_PAGE = 20;

const Counsellee = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();
  const queryClient = useQueryClient();

  const { data: counsellees = [], isLoading } = useQuery({
    queryKey: ['counsellee', searchQuery, currentPage],
    queryFn: async () => {
      const response = await apiClient.get('counsellee', {
        params: {
          searchQuery,
          limit: ITEMS_PER_PAGE,
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
        },
      });
      if (response.data.status === "success") {
        return response.data;
      } else {
        throw new Error('Failed to fetch counsellees');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      setLoading(true);
      await apiClient.delete('counsellee/bulk-delete', {
        data: { ids },
      });
      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counsellee'] });
      toast({
        title: "Success",
        description: "Counsellee(s) deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      setSelectedIds([]);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete counsellee(s)",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleDeleteConfirm = () => {
    const idsToDelete = deletingId ? [deletingId] : selectedIds;
    deleteMutation.mutate(idsToDelete);
  };

  const handleRowClick = (id: number) => {
    navigate(`/counsellee/${id}`);
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

  const paginatedCounsellees = counsellees?.data || [];
  const totalRecords = counsellees?.total || 0;
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {loading && (
        <div className="loader-overlay">
          <ClipLoader color="#3498db" size={50} />
        </div>
      )}
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <MainNavigation />
        <PageHeader 
          title="Counsellee Portal" 
          description="View and manage counsellee information"
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
              documents={paginatedCounsellees}
              selectedIds={selectedIds}
              onSelectRow={handleSelectRow}
              onRowClick={handleRowClick}
              onEditClick={() => {}}
              onDeleteClick={handleDeleteClick}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <DocumentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
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

export default Counsellee;