import React from 'react';
import { Search, RotateCcw, Filter, User } from 'lucide-react';
import { SUBJECT_OPTIONS, STATUS_OPTIONS, SORT_OPTIONS } from '../discussionsData';

/**
 * DiscussionFilters component
 * Full functional filters: keyword search, subject, solved status, sorting, and "My Discussions" toggle.
 */
export const DiscussionFilters = ({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  myDiscussionsOnly,
  onToggleMyDiscussions,
  onClearFilters,
  activeFilterCount,
}) => {
  return (
    <section className="disc-filters-card" aria-label="Discussion search and filter controls">
      {/* Search Bar Row */}
      <div className="disc-search-row">
        <div className="disc-search-wrap">
          <Search size={18} className="disc-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="disc-search-input"
            placeholder="Search discussions by question, keywords, tag, or author..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search discussions"
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="disc-filter-controls-row">
        <div className="disc-selects-group">
          {/* Subject Filter */}
          <select
            className="disc-select-field"
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            aria-label="Filter by subject"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Solved Status Filter */}
          <select
            className="disc-select-field"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by solved status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* My Discussions Toggle */}
          <button
            type="button"
            className={`disc-toggle-btn ${myDiscussionsOnly ? 'active' : ''}`}
            onClick={onToggleMyDiscussions}
            aria-pressed={myDiscussionsOnly}
            aria-label="Toggle showing only my discussions"
          >
            <User size={13} aria-hidden="true" />
            <span>My Questions</span>
          </button>
        </div>

        <div className="disc-filter-meta-right">
          {/* Sort Order Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 600 }}>Sort:</span>
            <select
              className="disc-select-field"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort discussions by"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="disc-clear-filters-btn"
              onClick={onClearFilters}
              aria-label="Clear all applied filters"
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}

          {activeFilterCount === 0 && (
            <span style={{ fontSize: '12px', color: 'var(--ink-faint)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} aria-hidden="true" />
              Default view
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscussionFilters;
