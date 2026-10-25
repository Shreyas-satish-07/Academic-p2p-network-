import React from 'react';
import { Users, RotateCcw, Plus } from 'lucide-react';

/**
 * EmptyGroups component
 * 
 * Section 8: Empty state
 * When filters return zero groups:
 * - Shows EmptyGroups component
 * - Message: "No study groups match your filters."
 * - Button: "Clear Filters"
 * - Secondary button to create a new group
 */
export const EmptyGroups = ({
  onResetFilters,
  onCreateClick,
}) => {
  return (
    <div className="sg-empty-card" role="status" aria-live="polite">
      <div className="sg-empty-icon" aria-hidden="true">
        <Users size={32} />
      </div>

      <h3 className="sg-empty-title serif">
        No study groups match your filters.
      </h3>
      <p className="sg-empty-subtitle">
        We couldn't find any study squads matching your current filter criteria.
        Try clearing your filters or create a new group to study this topic with peers.
      </p>

      <div className="sg-empty-actions">
        <button
          type="button"
          className="sg-modal-cancel-btn flex items-center gap-2"
          onClick={onResetFilters}
          aria-label="Clear all filters"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Clear Filters</span>
        </button>

        <button
          type="button"
          className="sg-modal-submit-btn flex items-center gap-2"
          onClick={onCreateClick}
          aria-label="Create a new study group"
        >
          <Plus size={14} aria-hidden="true" />
          <span>Create New Group</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyGroups;
