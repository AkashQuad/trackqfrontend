import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
  } from "lucide-react";


const Pagination = ({ currentPage, setCurrentPage, totalPages, itemsPerPage, setItemsPerPage, totalItems }) => (
    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`ml-3 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages).keys()].map((page) => {
                const pageNum = page + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 border ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } text-sm font-medium`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === currentPage - 2 && currentPage > 3) ||
                  (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span
                      key={page}
                      className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
</div>
);
export default Pagination;
