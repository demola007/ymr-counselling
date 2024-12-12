import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const DocumentPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: DocumentPaginationProps) => {
  if (isLoading) {
    return <Skeleton className="h-10 w-[300px] mx-auto" />;
  }

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible page numbers
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        end = 4;
      }
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <button 
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            disabled={currentPage === 1}
          >
            <PaginationPrevious
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </button>
        </PaginationItem>

        {getPageNumbers().map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === '...' ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNum as number);
                }}
              >
                <PaginationLink
                  isActive={currentPage === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </button>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
          >
            <PaginationNext
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};