import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CounsellorViewHeader } from "@/components/data/CounsellorViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { CounsellorStats } from "@/components/data/CounsellorStats";
import { CounsellorCard } from "@/components/data/CounsellorCard";
import { DataViewActions } from "@/components/data/DataViewActions";
import { EditCounsellorDialog } from "@/components/data/EditCounsellorDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { useCounsellors } from "@/hooks/useCounsellors";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const Counsellors = () => {
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
    counsellors,
    totalRecords,
    isLoading,
    deleteMutation,
    updateMutation,
  } = useCounsellors(searchQuery, currentPage, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  // Calculate stats
  const certifiedCount = counsellors?.filter((c: any) => c.has_certification).length || 0;
  const ymrCount = counsellors?.filter((c: any) => c.will_attend_ymr_2024).length || 0;

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
      setSelectedIds(counsellors?.map((doc: any) => doc.id) || []);
    } else {
      setSelectedIds([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
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

  const handleDeleteConfirm = () => {
    const idsToDelete = deletingId ? [deletingId] : selectedIds;
    deleteMutation.mutate(idsToDelete);
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
    setSelectedIds([]);
    setSelectAll(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-army-black/5 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--army-green)) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container px-4 py-4 md:py-6 mx-auto max-w-7xl relative z-10">
        <CounsellorViewHeader />
        
        <CounsellorStats 
          total={totalRecords}
          currentCount={counsellors?.length || 0}
          certified={certifiedCount}
          availableForYmr={ymrCount}
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

        {/* Counsellor Cards */}
        <div className="space-y-3 md:space-y-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-xl p-4 md:p-5">
                <div className="flex items-start gap-3 md:gap-4">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : counsellors && counsellors.length > 0 ? (
            counsellors.map((counsellor: any) => (
              <CounsellorCard
                key={counsellor.id}
                counsellor={counsellor}
                isSelected={selectedIds.includes(counsellor.id)}
                onSelect={handleSelectRow}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                onClick={handleRowClick}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-card/60 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No counsellors found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "Try adjusting your search terms" : "Add your first counsellor to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <DocumentPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Dialogs */}
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
    </div>
  );
};

export default Counsellors;
