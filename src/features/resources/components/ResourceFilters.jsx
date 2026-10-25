import React from 'react';
import { Filter, RotateCcw, BookOpen, Layers, ArrowUpDown, Bookmark } from 'lucide-react';
import {
  SUBJECT_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
  SORT_OPTIONS,
} from '../resourcesData';

/**
 * ResourceFilters component
 * 
 * Section 3: Search and filters panel
 * - Subject filter
 * - Resource type filter
 * - Sort selector (Most Recent, Most Downloaded, Most Viewed, A-Z)
 * - Saved resources only toggle
 * - Clear filters button
 */
export const ResourceFilters = ({
  selectedSubject,
  onSubjectChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  savedOnly,
  onSavedOnlyToggle,
  onResetFilters,
  activeFilterCount,
}) => {
  return (
    <aside className="res-filters-card" aria-label="Resource Library Filters">
      {/* Header */}
      <div className="res-filters-header">
        <div className="res-filters-title-wrap">
          <Filter size={16} className="text-pine" aria-hidden="true" />
          <h2 className="res-filters-title">Filter Resources</h2>
          {activeFilterCount > 0 && (
            <span className="res-filters-count" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            className="res-filters-reset-btn"
            onClick={onResetFilters}
            aria-label="Clear all resource filters"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* 1. Subject Filter */}
      <div className="res-filter-group">
        <label htmlFor="filter-subject" className="res-filter-label">
          <BookOpen size={12} className="text-slate" aria-hidden="true" />
          <span>Subject</span>
        </label>
        <select
          id="filter-subject"
          className="res-filter-select"
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
        >
          {SUBJECT_FILTER_OPTIONS.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Resource Type Filter */}
      <div className="res-filter-group">
        <label htmlFor="filter-type" className="res-filter-label">
          <Layers size={12} className="text-slate" aria-hidden="true" />
          <span>Resource Type</span>
        </label>
        <select
          id="filter-type"
          className="res-filter-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          {TYPE_FILTER_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Sort By Filter */}
      <div className="res-filter-group">
        <label htmlFor="filter-sort" className="res-filter-label">
          <ArrowUpDown size={12} className="text-slate" aria-hidden="true" />
          <span>Sort By</span>
        </label>
        <select
          id="filter-sort"
          className="res-filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Saved Resources Only Toggle */}
      <div className="res-filter-group pt-1">
        <label className="res-toggle-label">
          <div className="res-filter-label">
            <Bookmark size={12} className="text-marigold" aria-hidden="true" />
            <span>Saved resources only</span>
          </div>
          <input
            type="checkbox"
            className="res-toggle-checkbox"
            checked={savedOnly}
            onChange={(e) => onSavedOnlyToggle(e.target.checked)}
            aria-label="Filter only saved and bookmarked resources"
          />
          <span className="res-toggle-switch" aria-hidden="true" />
        </label>
      </div>
    </aside>
  );
};

export default ResourceFilters;
