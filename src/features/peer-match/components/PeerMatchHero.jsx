import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, X, GraduationCap, Users, SlidersHorizontal, Info } from 'lucide-react';

/**
 * PeerMatchHero component
 * 
 * Section 1: Hero section
 * - Heading: "Find your next great collaborator"
 * - Subtitle explaining skill- and interest-based matching.
 * - Dynamic summary: "We found {count} students who may be a strong fit for your profile."
 * - Primary "Update Matching Preferences" button linking to /profile.
 * - Small explanation that matches are based on profile data.
 */
export const PeerMatchHero = ({
  searchQuery,
  onSearchChange,
  matchCount,
  currentUser,
}) => {
  return (
    <header className="peer-match-hero" aria-label="Peer Matchmaking Overview">
      <div className="peer-match-hero-accent" aria-hidden="true" />

      <div className="peer-match-hero-main">
        {/* Top badges */}
        <div className="hero-meta-badges">
          <span className="hero-badge hero-badge-academic">
            <GraduationCap size={13} aria-hidden="true" />
            <span>
              {currentUser.department} • Semester {currentUser.semester} (Year {currentUser.year})
            </span>
          </span>
          <span className="hero-badge hero-badge-status">
            <Sparkles size={12} className="text-marigold" aria-hidden="true" />
            <span>Smart Compatibility Engine Active</span>
          </span>
        </div>

        {/* Heading & Subtitle */}
        <div className="hero-title-area">
          <h1 className="peer-match-hero-title serif">
            Find your next great collaborator
          </h1>
          <p className="peer-match-hero-subtitle">
            Connect with peer students algorithmically matched on shared technical skills, coursework interests, schedule availability, and project aspirations.
          </p>
        </div>

        {/* Profile summary & Update Preferences Action */}
        <div className="hero-summary-action-banner">
          <div className="hero-summary-info">
            <div className="hero-summary-icon">
              <Users size={16} aria-hidden="true" />
            </div>
            <div>
              <p className="hero-summary-headline">
                We found <strong>{matchCount} students</strong> who may be a strong fit for your profile.
              </p>
              <div className="hero-explanation-subtext">
                <Info size={12} aria-hidden="true" />
                <span>
                  Matches are dynamically calculated from your registered skills ({currentUser.skills?.slice(0, 3).join(', ')}...), academic term, and active collaboration hours.
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="hero-update-prefs-btn"
            aria-label="Update Matching Preferences in Profile"
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            <span>Update Matching Preferences</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="peer-search-container">
          <div className="peer-search-input-wrap">
            <Search size={18} className="peer-search-icon" aria-hidden="true" />
            <input
              id="pm-search-in"
              type="text"
              className="peer-search-input"
              placeholder="Search by student name, skill (e.g. React, Python), or interest..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search peers by name, skill, or interest"
            />
            {searchQuery && (
              <button
                type="button"
                className="peer-search-clear-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search input"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="peer-count-badge" aria-live="polite">
            <Users size={14} className="text-pine" aria-hidden="true" />
            <span>
              <strong>{matchCount}</strong> {matchCount === 1 ? 'Peer' : 'Peers'} displayed
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PeerMatchHero;
