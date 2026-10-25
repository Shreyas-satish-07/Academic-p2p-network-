import React from 'react';
import { Link } from 'react-router-dom';
import { UserX, RotateCcw, SlidersHorizontal, Sparkles } from 'lucide-react';

/**
 * EmptyMatches component
 * 
 * Section 7: Empty state
 * When filters return no results:
 * - Shows an attractive EmptyMatches component
 * - Message: "No exact matches yet"
 * - Suggests clearing filters or adding more skills/interests in Profile
 * - Includes "Update Profile" button linking to /profile
 * - Includes "Clear All Filters" button
 */
export const EmptyMatches = ({ onResetFilters }) => {
  return (
    <div className="empty-matches-card" role="status" aria-live="polite">
      <div className="empty-matches-icon-box" aria-hidden="true">
        <UserX size={36} />
      </div>

      <div className="empty-matches-badge">
        <Sparkles size={12} className="text-marigold" aria-hidden="true" />
        <span>Broaden Your Search</span>
      </div>

      <h3 className="empty-matches-title serif">No exact matches yet</h3>
      <p className="empty-matches-subtitle">
        We couldn't find any students matching your active combination of filters.
        Try clearing your selected skills or department, or add more skills and interests to your Profile to unlock additional peer recommendations.
      </p>

      <div className="empty-matches-actions">
        <button
          type="button"
          className="empty-matches-reset-btn"
          onClick={onResetFilters}
          aria-label="Clear active filters"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Clear All Filters</span>
        </button>

        <Link
          to="/profile"
          className="empty-matches-profile-btn"
          aria-label="Navigate to Profile to update skills and interests"
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          <span>Update Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyMatches;
