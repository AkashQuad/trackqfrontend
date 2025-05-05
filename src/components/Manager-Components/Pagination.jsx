import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange,
  indexOfFirstEmployee,
  indexOfLastEmployee,
  filteredEmployeeTasks,
}) => {
  const baseStyles = `
    p-5 rounded-lg bg-white border border-gray-100
    shadow-sm transition-all duration-200 ease-in-out
  `;
  const maxPagesToShow = 5;
  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={`${baseStyles} mt-8`}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstEmployee + 1} to{" "}
          {Math.min(indexOfLastEmployee, filteredEmployeeTasks.length)} of{" "}
          {filteredEmployeeTasks.length} employees
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                aria-label="Page 1"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-4 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                currentPage === number
                  ? "bg-muted-blue text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Page ${number}`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-4 py-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium"
                aria-label={`Page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;