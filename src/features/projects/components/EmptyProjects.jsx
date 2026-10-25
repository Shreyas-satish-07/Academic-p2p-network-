import React from 'react';
import { FolderGit2, RotateCcw, Plus } from 'lucide-react';

/**
 * EmptyProjects component
 * Clean academic empty state displayed when search queries or filters return no matching projects.
 */
export const EmptyProjects = ({ onResetFilters, onCreateProjectClick }) => {
  return (
    <div className="proj-empty-container" role="status" aria-label="No projects found">
      <div className="proj-empty-icon-wrap" aria-hidden="true">
        <FolderGit2 size={28} />
      </div>

      <h3 className="proj-empty-title">No projects match your current filters</h3>

      <p className="proj-empty-desc">
        Try adjusting your keywords, broadening category filters, or be the pioneer to start a new
        academic collaboration initiative.
      </p>

      <div className="proj-empty-actions">
        <button
          type="button"
          className="proj-btn proj-btn-outline"
          onClick={onResetFilters}
          aria-label="Reset all search filters"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Clear Filters</span>
        </button>

        <button
          type="button"
          className="proj-btn proj-btn-primary"
          onClick={onCreateProjectClick}
          aria-label="Create a new project"
        >
          <Plus size={13} aria-hidden="true" />
          <span>Create Project</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyProjects;
