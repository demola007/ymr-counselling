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
import { Search } from "lucide-react";

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
            />
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Your Documents</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
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