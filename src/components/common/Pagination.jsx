import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

export const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-container" id="pagination-container" data-testid="pagination-container">
      <div className="pagination-info" id="pagination-info" data-testid="pagination-info">
        Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
      </div>
      <div className="pagination-controls" id="pagination-controls" data-testid="pagination-controls">
        <button
          className="page-btn"
          id="pagination-prev"
          data-testid="pagination-prev"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous Page"
        >
          <FaChevronLeft />
        </button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            id={`pagination-page-${page}`}
            data-testid={`pagination-page-${page}`}
            className={`page-num ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}

        <button
          className="page-btn"
          id="pagination-next"
          data-testid="pagination-next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next Page"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};
