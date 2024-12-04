import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Search, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data
const documents = [
  {
    id: 1,
    name: "Project Proposal.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "2024-02-20",
    status: "Active",
  },
  {
    id: 2,
    name: "Financial Report Q4.xlsx",
    type: "Excel",
    size: "1.8 MB",
    uploadedAt: "2024-02-19",
    status: "Active",
  },
  {
    id: 3,
    name: "Meeting Minutes.docx",
    type: "Word",
    size: "542 KB",
    uploadedAt: "2024-02-18",
    status: "Archived",
  },
  {
    id: 4,
    name: "Product Roadmap.pptx",
    type: "PowerPoint",
    size: "3.1 MB",
    uploadedAt: "2024-02-17",
    status: "Active",
  },
  {
    id: 5,
    name: "User Research.pdf",
    type: "PDF",
    size: "4.2 MB",
    uploadedAt: "2024-02-16",
    status: "Active",
  },
];

const DataView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "uploadedAt", direction: "desc" });

  // Filter documents based on search query and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort documents based on current sort configuration
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/">
            <Button variant="outline">Back to Upload</Button>
          </Link>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Documents</h1>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="Word">Word</SelectItem>
                  <SelectItem value="PowerPoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("name")} className="cursor-pointer hover:bg-muted">
                  Name <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("type")} className="cursor-pointer hover:bg-muted">
                  Type <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("size")} className="cursor-pointer hover:bg-muted">
                  Size <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("uploadedAt")} className="cursor-pointer hover:bg-muted">
                  Upload Date <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort("status")} className="cursor-pointer hover:bg-muted">
                  Status <ArrowUpDown className="inline ml-2 h-4 w-4" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.uploadedAt}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        doc.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DataView;