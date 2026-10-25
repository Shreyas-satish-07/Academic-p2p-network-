import React from 'react';
import { Search, X, Plus, FileText, Download, BookOpen } from 'lucide-react';

/**
 * ResourcesHero component
 * 
 * Section 1: Hero section
 * - Heading: "Learn better, together"
 * - Subtitle: "Discover notes, guides, presentations, and resources shared by your cohort."
 * - Three summary badges:
 *   - 14 resources shared
 *   - 128 total downloads
 *   - 6 subjects covered
 * - Primary button: "Upload Resource" (opens UploadResourceModal)
 * - Search bar with instant real-time filtering
 */
export const ResourcesHero = ({
  searchQuery,
  onSearchChange,
  onUploadClick,
}) => {
  return (
    <header className="res-hero" aria-label="Academic Resource Hub Header">
      <div className="res-hero-accent" aria-hidden="true" />

      <div className="res-hero-main">
        {/* Title & Primary Upload Button */}
        <div className="res-hero-title-area">
          <div>
            <h1 className="res-hero-title serif">
              Learn better, together
            </h1>
            <p className="res-hero-subtitle">
              Discover notes, guides, presentations, and resources shared by your cohort.
            </p>
          </div>

          <button
            type="button"
            className="res-hero-upload-btn"
            onClick={onUploadClick}
            aria-label="Upload an academic resource"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Upload Resource</span>
          </button>
        </div>

        {/* Three Summary Badges */}
        <div className="res-hero-badges" aria-label="Resource platform statistics">
          <span className="res-hero-badge res-hero-badge-shared">
            <FileText size={13} className="text-pine" aria-hidden="true" />
            <span>14 resources shared</span>
          </span>

          <span className="res-hero-badge res-hero-badge-downloads">
            <Download size={13} className="text-marigold" aria-hidden="true" />
            <span>128 total downloads</span>
          </span>

          <span className="res-hero-badge res-hero-badge-subjects">
            <BookOpen size={13} className="text-slate" aria-hidden="true" />
            <span>6 subjects covered</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="res-hero-search-wrap">
          <Search size={18} className="res-hero-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="res-hero-search-input"
            placeholder="Search by title, description, subject, or tag (e.g. Normalization, LeetCode, TCP)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search resources by title, subject, or tag"
          />
          {searchQuery && (
            <button
              type="button"
              className="res-hero-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search input"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ResourcesHero;
