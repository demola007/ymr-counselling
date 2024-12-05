import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { mockDocuments } from "@/utils/mockData";

const ITEMS_PER_PAGE = 10;

const DataView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Filter documents based on search query and filters
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStudent = studentFilter === "all" || doc.isStudent === studentFilter;
    const matchesGender = genderFilter === "all" || doc.gender === genderFilter;
    return matchesSearch && matchesStudent && matchesGender;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleRowClick = (id: number) => {
    navigate(`/data/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container px-4 py-4 mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/fea97e0c-ca99-4275-aa6e-653e80cd7ec1.png" 
              alt="YMR Global Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-xl font-bold text-purple-800">Counselling Data</h1>
          </div>
          <Link to="/">
            <Button variant="outline" className="w-full md:w-auto">Back to Upload</Button>
          </Link>
        </div>

        <div className="glass-panel rounded-lg p-4 md:p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Student Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="Yes">Students</SelectItem>
                <SelectItem value="No">Non-Students</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className="hover:bg-purple-50 cursor-pointer"
                  onClick={() => handleRowClick(doc.id)}
                >
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
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

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-lg font-semibold text-purple-800">
              Total Records: {filteredDocuments.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataView;