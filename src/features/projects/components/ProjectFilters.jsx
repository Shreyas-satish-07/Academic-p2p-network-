import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  RECRUITMENT_OPTIONS,
  SKILL_OPTIONS,
  SORT_OPTIONS,
} from '../projectsData';

/**
 * ProjectFilters component
 * Comprehensive filter controls: search, category, status, recruitment, skill, sorting, and reset.
 */
export const ProjectFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  selectedRecruitment,
  onRecruitmentChange,
  selectedSkill,
  onSkillChange,
  sortBy,
  onSortChange,
  onClearFilters,
  activeFilterCount,
}) => {
  return (
    <section className="proj-filters-card" aria-label="Project search and filter controls">
      {/* Search Input Row */}
      <div className="proj-search-row">
        <div className="proj-search-wrap">
          <Search size={18} className="proj-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="proj-search-input"
            placeholder="Search projects by title, technology, required skill, or tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search projects"
          />
        </div>
      </div>

      {/* Dropdown Filters Row */}
      <div className="proj-filter-controls-row">
        <div className="proj-selects-group">
          {/* Category Filter */}
          <div className="proj-select-label-wrap">
            <select
              className="proj-select-field"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Filter by project category"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="proj-select-label-wrap">
            <select
              className="proj-select-field"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by project lifecycle status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Recruitment Status Filter */}
          <div className="proj-select-label-wrap">
            <select
              className="proj-select-field"
              value={selectedRecruitment}
              onChange={(e) => onRecruitmentChange(e.target.value)}
              aria-label="Filter by recruitment status"
            >
              {RECRUITMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div className="proj-select-label-wrap">
            <select
              className="proj-select-field"
              value={selectedSkill}
              onChange={(e) => onSkillChange(e.target.value)}
              aria-label="Filter by required technical skill"
            >
              {SKILL_OPTIONS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="proj-filter-meta-right">
          {/* Sort By Filter */}
          <div className="proj-select-label-wrap">
            <span style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: 600 }}>Sort:</span>
            <select
              className="proj-select-field"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort projects by criteria"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              className="proj-clear-filters-btn"
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
              All filters default
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectFilters;
