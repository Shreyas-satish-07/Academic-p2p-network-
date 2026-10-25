import React from 'react';
import { Filter, RotateCcw, BookOpen, Layers, Users, Activity, Check } from 'lucide-react';
import {
  SUBJECT_FILTER_OPTIONS,
  DIFFICULTY_FILTER_OPTIONS,
  GROUP_SIZE_OPTIONS,
  ACTIVITY_FILTER_OPTIONS,
} from '../studyGroupsData';

/**
 * GroupFilters component
 * 
 * Section 3: Group filters
 * Functional local filters:
 * - Search by group name, subject, or tag (handled in hero or synchronized here)
 * - Subject
 * - Difficulty
 * - Group size (All Sizes, Small, Medium, Large)
 * - Activity: All, Active Today, Live Now
 * - Joined groups only toggle
 * - Clear filters button
 */
export const GroupFilters = ({
  selectedSubject,
  onSubjectChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedGroupSize,
  onGroupSizeChange,
  selectedActivity,
  onActivityChange,
  joinedOnly,
  onJoinedOnlyToggle,
  onResetFilters,
  activeFilterCount,
}) => {
  return (
    <aside className="sg-filters-card" aria-label="Study Groups Filters">
      {/* Header */}
      <div className="sg-filters-header">
        <div className="sg-filters-title-wrap">
          <Filter size={16} className="text-pine" aria-hidden="true" />
          <h2 className="sg-filters-title">Filter Groups</h2>
          {activeFilterCount > 0 && (
            <span className="sg-filters-count" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            className="sg-filters-reset-btn"
            onClick={onResetFilters}
            aria-label="Clear all filters"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* 1. Subject Filter */}
      <div className="sg-filter-group">
        <label htmlFor="filter-subject-select" className="sg-filter-label">
          <BookOpen size={12} className="text-slate" aria-hidden="true" />
          <span>Subject</span>
        </label>
        <select
          id="filter-subject-select"
          className="sg-filter-select"
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

      {/* 2. Difficulty Filter */}
      <div className="sg-filter-group">
        <span className="sg-filter-label">
          <Layers size={12} className="text-slate" aria-hidden="true" />
          <span>Difficulty</span>
        </span>
        <div className="sg-difficulty-buttons" role="radiogroup" aria-label="Filter by difficulty">
          {DIFFICULTY_FILTER_OPTIONS.map((diff) => {
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                className={`sg-diff-btn ${isSelected ? 'diff-active' : ''}`}
                onClick={() => onDifficultyChange(diff)}
                role="radio"
                aria-checked={isSelected}
              >
                {diff === 'All Difficulties' ? 'All' : diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Group Size Filter */}
      <div className="sg-filter-group">
        <label htmlFor="filter-size-select" className="sg-filter-label">
          <Users size={12} className="text-slate" aria-hidden="true" />
          <span>Group Size</span>
        </label>
        <select
          id="filter-size-select"
          className="sg-filter-select"
          value={selectedGroupSize}
          onChange={(e) => onGroupSizeChange(e.target.value)}
        >
          {GROUP_SIZE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Activity: All, Active Today, Live Now */}
      <div className="sg-filter-group">
        <span className="sg-filter-label">
          <Activity size={12} className="text-slate" aria-hidden="true" />
          <span>Activity</span>
        </span>
        <div className="sg-activity-radio-row" role="radiogroup" aria-label="Filter by activity status">
          {ACTIVITY_FILTER_OPTIONS.map((opt) => {
            const isSelected = selectedActivity === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                className={`sg-activity-pill-btn ${isSelected ? 'pill-active' : ''}`}
                onClick={() => onActivityChange(opt.value)}
                role="radio"
                aria-checked={isSelected}
              >
                {isSelected && <Check size={11} className="mr-1 inline-block" aria-hidden="true" />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Joined Groups Only Toggle */}
      <div className="sg-filter-group pt-1">
        <label className="sg-toggle-label">
          <div className="sg-filter-label">
            <Users size={12} className="text-pine" aria-hidden="true" />
            <span>Joined groups only</span>
          </div>
          <input
            type="checkbox"
            className="sg-toggle-checkbox"
            checked={joinedOnly}
            onChange={(e) => onJoinedOnlyToggle(e.target.checked)}
            aria-label="Filter to show joined groups only"
          />
          <span className="sg-toggle-switch" aria-hidden="true" />
        </label>
      </div>
    </aside>
  );
};

export default GroupFilters;
