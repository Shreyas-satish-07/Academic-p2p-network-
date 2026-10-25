import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, BookOpen, Clock, Building, Calendar } from 'lucide-react';
import {
  FILTER_DEPARTMENTS,
  FILTER_SEMESTERS,
  FILTER_SKILLS,
  FILTER_INTERESTS,
  FILTER_AVAILABILITY,
} from '../peerMatchData';

/**
 * MatchFilters component
 * 
 * Section 3: Filter panel
 * - Search by name or skill
 * - Department
 * - Semester
 * - Skill
 * - Interest
 * - Availability
 * - Minimum match score
 * - Clear all filters button
 */
export const MatchFilters = ({
  _searchQuery,
  _onSearchChange,
  selectedDept,
  onDeptChange,
  selectedSemester,
  onSemesterChange,
  selectedSkills,
  onSkillToggle,
  selectedInterest,
  onInterestChange,
  selectedAvailability,
  onAvailabilityChange,
  minScore,
  onMinScoreChange,
  onResetFilters,
  activeFilterCount,
}) => {
  const scorePresets = [
    { label: 'All', value: 0 },
    { label: '70%+', value: 70 },
    { label: '80%+', value: 80 },
    { label: '90%+', value: 90 },
  ];

  return (
    <aside className="peer-filters-card" aria-label="Peer Match Filters">
      <div className="filters-header">
        <div className="filters-title-wrap">
          <Filter size={16} className="text-pine" aria-hidden="true" />
          <h2 className="filters-title">Filter Collaborators</h2>
          {activeFilterCount > 0 && (
            <span className="filters-count-badge" aria-label={`${activeFilterCount} active filters`}>
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            className="filters-reset-btn"
            onClick={onResetFilters}
            aria-label="Clear all active filters"
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      <div className="filters-content">
        {/* 1. Minimum Match Score */}
        <div className="filter-group">
          <label className="filter-label">
            <Sparkles size={12} className="text-marigold" aria-hidden="true" />
            <span>Minimum Match Score</span>
          </label>
          <div className="score-presets-row" role="radiogroup" aria-label="Minimum match score">
            {scorePresets.map((preset) => {
              const isSelected = minScore === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  className={`score-preset-btn ${isSelected ? 'preset-active' : ''}`}
                  onClick={() => onMinScoreChange(preset.value)}
                  role="radio"
                  aria-checked={isSelected}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Department Filter */}
        <div className="filter-group">
          <label htmlFor="dept-select" className="filter-label">
            <Building size={12} className="text-slate" aria-hidden="true" />
            <span>Department</span>
          </label>
          <select
            id="dept-select"
            className="filter-select"
            value={selectedDept}
            onChange={(e) => onDeptChange(e.target.value)}
          >
            {FILTER_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Semester Filter */}
        <div className="filter-group">
          <label htmlFor="semester-select" className="filter-label">
            <Calendar size={12} className="text-slate" aria-hidden="true" />
            <span>Semester</span>
          </label>
          <select
            id="semester-select"
            className="filter-select"
            value={selectedSemester}
            onChange={(e) => onSemesterChange(e.target.value)}
          >
            {FILTER_SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Interest Filter */}
        <div className="filter-group">
          <label htmlFor="interest-select" className="filter-label">
            <BookOpen size={12} className="text-slate" aria-hidden="true" />
            <span>Interest Area</span>
          </label>
          <select
            id="interest-select"
            className="filter-select"
            value={selectedInterest}
            onChange={(e) => onInterestChange(e.target.value)}
          >
            {FILTER_INTERESTS.map((interest) => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Availability Schedule */}
        <div className="filter-group">
          <label htmlFor="avail-select" className="filter-label">
            <Clock size={12} className="text-slate" aria-hidden="true" />
            <span>Availability Schedule</span>
          </label>
          <select
            id="avail-select"
            className="filter-select"
            value={selectedAvailability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
          >
            {FILTER_AVAILABILITY.map((avail) => (
              <option key={avail} value={avail}>
                {avail}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Technical Skills Filter Chips */}
        <div className="filter-group">
          <div className="filter-label-row">
            <span className="filter-label">Technical Skills</span>
            {selectedSkills.length > 0 && (
              <span className="filter-subcount">{selectedSkills.length} selected</span>
            )}
          </div>
          <div className="skill-filter-pills" role="group" aria-label="Filter by skills">
            {FILTER_SKILLS.map((skill) => {
              const isChecked = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  className={`skill-filter-pill ${isChecked ? 'pill-selected' : ''}`}
                  onClick={() => onSkillToggle(skill)}
                  aria-pressed={isChecked}
                >
                  {isChecked && <Check size={11} className="mr-1" aria-hidden="true" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MatchFilters;
