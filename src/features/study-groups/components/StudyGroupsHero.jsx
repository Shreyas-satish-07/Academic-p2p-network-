import React from 'react';
import { Search, X, Plus, BookOpen, Radio, Users } from 'lucide-react';

/**
 * StudyGroupsHero component
 * 
 * Section 1: Hero section
 * - Heading: "Find your learning circle"
 * - Subtitle: "Join focused study groups, learn consistently, and build with peers."
 * - Three summary badges:
 *   - 8 groups joined
 *   - 3 live sessions today
 *   - 24 active learners online
 * - Primary button: "Create Study Group" (opens CreateGroupModal)
 */
export const StudyGroupsHero = ({
  searchQuery,
  onSearchChange,
  onCreateClick,
}) => {
  return (
    <header className="sg-hero" aria-label="Study Groups Hub Header">
      <div className="sg-hero-accent" aria-hidden="true" />

      <div className="sg-hero-main">
        {/* Title & Primary Create Button */}
        <div className="sg-hero-title-area">
          <div>
            <h1 className="sg-hero-title serif">
              Find your learning circle
            </h1>
            <p className="sg-hero-subtitle">
              Join focused study groups, learn consistently, and build with peers.
            </p>
          </div>

          <button
            type="button"
            className="sg-hero-create-btn"
            onClick={onCreateClick}
            aria-label="Create Study Group"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Create Study Group</span>
          </button>
        </div>

        {/* Three Summary Badges */}
        <div className="sg-hero-badges" aria-label="Study group platform metrics">
          <span className="sg-hero-badge sg-hero-badge-academic">
            <BookOpen size={13} className="text-pine" aria-hidden="true" />
            <span>8 groups joined</span>
          </span>

          <span className="sg-hero-badge sg-hero-badge-live">
            <Radio size={13} className="text-rust" aria-hidden="true" />
            <span>3 live sessions today</span>
          </span>

          <span className="sg-hero-badge sg-hero-badge-online">
            <Users size={13} className="text-slate" aria-hidden="true" />
            <span>24 active learners online</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="sg-hero-search-wrap">
          <Search size={18} className="sg-hero-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="sg-hero-search-input"
            placeholder="Search by group name, subject (e.g. Machine Learning), or tag (e.g. Python, Linux)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search study groups by name, subject, or tag"
          />
          {searchQuery && (
            <button
              type="button"
              className="sg-hero-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search query"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudyGroupsHero;
