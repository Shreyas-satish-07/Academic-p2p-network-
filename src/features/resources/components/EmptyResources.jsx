import React from 'react';
import { FileSearch, RotateCcw, Plus } from 'lucide-react';

/**
 * EmptyResources component
 * 
 * Section 8: Empty state
 * When no resources match search/filters:
 * - Message: "No resources match your search."
 * - Clear Filters button
 * - Upload Resource button
 */
export const EmptyResources = ({
  onResetFilters,
  onUploadClick,
}) => {
  return (
    <div className="res-empty-card" role="status" aria-live="polite">
      <div className="res-empty-icon" aria-hidden="true">
        <FileSearch size={32} />
      </div>

      <h3 className="res-empty-title serif">
        No resources match your search.
      </h3>
      <p className="res-empty-subtitle">
        We couldn't find any documents matching your current filter criteria.
        Try clearing your search terms or be the first to upload study notes for this subject.
      </p>

      <div className="flex items-center gap-2.5 mt-2 flex-wrap justify-center">
        <button
          type="button"
          className="res-secondary-btn"
          onClick={onResetFilters}
          aria-label="Clear active filters"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Clear Filters</span>
        </button>

        <button
          type="button"
          className="res-primary-btn"
          onClick={onUploadClick}
          aria-label="Upload a new resource"
        >
          <Plus size={14} aria-hidden="true" />
          <span>Upload Resource</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyResources;
