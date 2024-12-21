import { useState } from "react";
import { CounsellorViewHeader } from "@/components/data/CounsellorViewHeader";
import { DataViewFilters } from "@/components/data/DataViewFilters";
import { DocumentPagination } from "@/components/data/DocumentPagination";
import { CounsellorList } from "@/components/counsellors/CounsellorList";
import { useCounsellors } from "@/hooks/useCounsellors";
import { ClipLoader } from "react-spinners";
import "../contexts/loader.css";

const ITEMS_PER_PAGE = 5;

const Counsellors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    counsellors,
    totalRecords,
    isLoading,
    deleteMutation,
    updateMutation,
  } = useCounsellors(searchQuery, currentPage, ITEMS_PER_PAGE);

  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {loading && (
        <div className="loader-overlay">
          <ClipLoader color="#3498db" size={50} />
        </div>
      )}
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <CounsellorViewHeader />
        
        <DataViewFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <CounsellorList
          counsellors={counsellors}
          isLoading={isLoading}
          onUpdate={updateMutation.mutate}
          onDelete={deleteMutation.mutate}
        />

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
      </div>
    </div>
  );
};

export default Counsellors;