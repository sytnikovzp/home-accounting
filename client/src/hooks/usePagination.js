import { useState } from 'react';

function usePagination(initialPageSize, totalPages = 0) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && (totalPages === 0 || newPage <= totalPages)) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    handlePageChange,
    handleRowsPerPageChange,
  };
}

export default usePagination;
