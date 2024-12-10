import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { mockDocuments } from "@/utils/mockData";
import { useToast } from "@/components/ui/use-toast";
import { DataViewHeader } from "@/components/data/DataViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { EditDocumentDialog } from "@/components/data/EditDocumentDialog";
import { DeleteConfirmDialog } from "@/components/data/DeleteConfirmDialog";
import { DataViewActions } from "@/components/data/DataViewActions";

const ITEMS_PER_PAGE = 10;

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem("userRole");

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the document
    toast({
      title: "Document Updated",
      description: "The document has been successfully updated.",
    });
    setIsEditDialogOpen(false);
    setEditingDocument(null);
  };

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudent = studentFilter === "all" || doc.isStudent === studentFilter;
    const matchesGender = genderFilter === "all" || doc.gender === genderFilter;
    return matchesSearch && matchesStudent && matchesGender;
  });

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

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

  const handleDeleteConfirm = () => {
    toast({
      title: "Record Deleted",
      description: "The record has been successfully deleted.",
    });
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
    setSelectedIds([]);
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedDocuments.map(doc => doc.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // ... keep existing code (JSX rendering)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
          selectAll={selectedIds.length === paginatedDocuments.length}
          onSelectAll={handleSelectAll}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {userRole === "super-admin" && <TableHead className="w-[50px]" />}
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Age Group</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Follow Up</TableHead>
                  {userRole === "super-admin" && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((doc) => (
                  <TableRow 
                    key={doc.id} 
                    className="hover:bg-purple-50 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(doc.id)}
                  >
                    {userRole === "super-admin" && (
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(doc.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedIds(prev => [...prev, doc.id]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== doc.id));
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.email}</TableCell>
                    <TableCell>{doc.phone_number}</TableCell>
                    <TableCell>{doc.gender}</TableCell>
                    <TableCell>{doc.isStudent}</TableCell>
                    <TableCell>{doc.school}</TableCell>
                    <TableCell>{doc.age_group}</TableCell>
                    <TableCell>{doc.country}</TableCell>
                    <TableCell>{doc.state}</TableCell>
                    <TableCell>{doc.availability_for_follow_up}</TableCell>
                    {userRole === "super-admin" && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditClick(e, doc)}
                            className="hover:bg-purple-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(e, doc.id)}
                            className="hover:bg-red-100 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1} className="hidden md:block">
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-lg font-semibold text-purple-800">
              Total Records: {filteredDocuments.length}
            </p>
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredDocuments.length)} of {filteredDocuments.length}
            </p>
          </div>
        </div>

        <EditDocumentDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          document={editingDocument}
          onSubmit={handleEditSubmit}
          setEditingDocument={setEditingDocument}
        />

        <DeleteConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          isMultiple={selectedIds.length > 0}
        />
      </div>
    </div>
  );
};

export default DataView;
