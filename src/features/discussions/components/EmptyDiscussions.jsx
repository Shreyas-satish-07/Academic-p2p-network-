import React from 'react';
import { HelpCircle, RotateCcw, Plus } from 'lucide-react';

/**
 * EmptyDiscussions component
 * Clean fallback state shown when queries or filter selections yield zero matching questions.
 */
export const EmptyDiscussions = ({ onResetFilters, onAskQuestionClick }) => {
  return (
    <div className="disc-empty-container" role="status" aria-label="No discussions found">
      <div className="disc-empty-icon-wrap" aria-hidden="true">
        <HelpCircle size={28} />
      </div>

      <h3 className="disc-empty-title">No discussions match your filters</h3>

      <p className="disc-empty-desc">
        Try adjusting your search terms, selecting a broader subject category, or be the first to ask
        a new question about this academic topic.
      </p>

      <div className="disc-empty-actions">
        <button
          type="button"
          className="disc-btn disc-btn-outline"
          onClick={onResetFilters}
          aria-label="Reset all discussion filters"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Clear Filters</span>
        </button>

        <button
          type="button"
          className="disc-btn disc-btn-primary"
          onClick={onAskQuestionClick}
          aria-label="Ask a new question"
        >
          <Plus size={13} aria-hidden="true" />
          <span>Ask a Question</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyDiscussions;
