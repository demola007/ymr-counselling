import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CounselleeViewHeader } from "@/components/data/CounselleeViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { CounselleeCard } from "@/components/data/CounselleeCard";
import { CounselleeStats } from "@/components/data/CounselleeStats";
import { EditCounselleeDialog } from "@/components/data/EditCounselleeDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";
import { useCounsellees } from "@/hooks/useCounsellees";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const Counsellee = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useAuth();

  const {
    counsellees,
    totalRecords,
    isLoading,
    deleteMutation,
    updateMutation,
  } = useCounsellees(searchQuery, currentPage, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  const handleSelectRow = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedIds(checked ? counsellees?.map((doc: any) => doc.id) || [] : []);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const idsToDelete = deletingId ? [deletingId] : selectedIds;
    deleteMutation.mutate(idsToDelete);
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
    setSelectedIds([]);
    setSelectAll(false);
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

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDocument) {
      updateMutation.mutate(editingDocument);
      setIsEditDialogOpen(false);
      setEditingDocument(null);
    }
  };

  const handleRowClick = (id: number) => {
    navigate(`/counsellee/${id}`);
  };

  // Calculate stats
  const attendedCount = counsellees?.filter((c: any) => c.attended_to)?.length || 0;
  const studentCount = counsellees?.filter((c: any) => c.is_student === "Yes" || c.school)?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0A1F] via-[#1A1F2C] to-[#0F0A1F]">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 py-6 mx-auto max-w-7xl relative z-10">
        <CounselleeViewHeader />
        
        <CounselleeStats
          totalRecords={totalRecords}
          currentPageCount={counsellees?.length || 0}
          attendedCount={attendedCount}
          studentCount={studentCount}
        />

        <DataViewFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <DataViewActions
          selectedIds={selectedIds}
          onDeleteSelected={handleDeleteSelected}
          selectAll={selectAll}
          onSelectAll={handleSelectAll}
          userRole={userRole}
        />

        {/* Counsellee Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : counsellees && counsellees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {counsellees.map((counsellee: any) => (
              <CounselleeCard
                key={counsellee.id}
                counsellee={counsellee}
                isSelected={selectedIds.includes(counsellee.id)}
                onSelect={handleSelectRow}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onClick={handleRowClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Counsellees Found</h3>
            <p className="text-gray-400 max-w-md">
              {searchQuery 
                ? "No counsellees match your search criteria. Try adjusting your search."
                : "Start by adding your first counsellee record."}
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6">
          <DocumentPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </div>

        {/* Dialogs */}
        <EditCounselleeDialog
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
          isMultiple={selectedIds.length > 0 && !deletingId}
          isLoading={deleteMutation.isPending}
        />
      </div>
    </div>
  );
};

export default Counsellee;
