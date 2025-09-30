import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className={`px-3 py-1 rounded-md border text-sm ${
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
      >
        Previous
      </button>

      {/* Page Info */}
      <span className="text-sm text-gray-600">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </span>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className={`px-3 py-1 rounded-md border text-sm ${
          page === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
