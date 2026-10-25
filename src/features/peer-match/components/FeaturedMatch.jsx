import React, { useState } from 'react';
import {
  Sparkles,
  UserPlus,
  Check,
  CheckCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  Award,
  ExternalLink,
  BookOpen,
  Target,
} from 'lucide-react';
import MatchExplanation from './MatchExplanation';

/**
 * FeaturedMatch component
 * 
 * Section 2: Featured best match
 * - Makes Ananya Rao the featured profile.
 * - Displays avatar initials, match percentage, key skills, common interests, online status, and short bio.
 * - Actions:
 *   - View Profile
 *   - Connect (state machine: idle -> request-sent -> connected)
 *   - Why this match? (expands MatchExplanation)
 */
export const FeaturedMatch = ({
  peer,
  collaborationStatus = 'idle',
  onConnect,
  onViewProfile,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!peer) return null;

  // Render dynamic connect button text and icon based on status
  const renderConnectButton = () => {
    switch (collaborationStatus) {
      case 'connected':
        return (
          <>
            <CheckCheck size={15} aria-hidden="true" />
            <span>Connected</span>
          </>
        );
      case 'request-sent':
        return (
          <>
            <Check size={15} aria-hidden="true" />
            <span>Request Sent</span>
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <UserPlus size={15} aria-hidden="true" />
            <span>Connect</span>
          </>
        );
    }
  };


  return (
    <section className="featured-match-section" aria-labelledby="featured-match-heading">
      <div className="featured-match-card">
        {/* Top Header Ribbon */}
        <div className="featured-match-header-strip">
          <div className="featured-badge">
            <Award size={14} className="text-marigold" aria-hidden="true" />
            <span>Featured Best Match</span>
          </div>

          <div
            className="featured-score-pill"
            aria-label={`${peer.matchScore}% compatibility score`}
          >
            <Sparkles size={12} className="text-pine" aria-hidden="true" />
            <span>{peer.matchScore}% Match</span>
          </div>
        </div>

        <div className="featured-match-body">
          {/* Avatar with live online/away indicator */}
          <div className="featured-avatar-column">
            <div
              className="featured-avatar"
              role="img"
              aria-label={`${peer.name}'s avatar initials ${peer.initials}`}
            >
              <span>{peer.initials}</span>
              <span
                className={`featured-status-indicator ${
                  peer.isOnline ? 'indicator-online' : 'indicator-away'
                }`}
                title={peer.isOnline ? 'Online now' : 'Currently away'}
                aria-label={peer.isOnline ? 'Online now' : 'Away'}
              />
            </div>
            <span className="featured-status-label">
              {peer.isOnline ? 'Online now' : 'Away'}
            </span>
          </div>

          {/* Peer Details */}
          <div className="featured-info-column">
            <div className="featured-name-row">
              <div>
                <h2 id="featured-match-heading" className="featured-name serif">
                  {peer.name}
                </h2>
                <p className="featured-role">
                  {peer.department} • Semester {peer.semester} (Year {peer.year})
                </p>
              </div>
            </div>

            <p className="featured-bio">{peer.bio}</p>

            {/* Skills */}
            <div className="featured-skills-row">
              <span className="featured-skills-label">Key Skills:</span>
              <div className="featured-skills-list">
                {peer.skills.map((skill) => (
                  <span key={skill} className="featured-skill-pill skill-pill-shared">
                    <Sparkles size={10} className="shared-star" aria-hidden="true" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Common Interests */}
            {peer.interests && peer.interests.length > 0 && (
              <div className="featured-interests-row">
                <span className="featured-skills-label">Common Interests:</span>
                <div className="featured-interests-list">
                  {peer.interests.map((interest) => (
                    <span key={interest} className="featured-interest-pill">
                      <BookOpen size={11} className="mr-1 text-slate" aria-hidden="true" />
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability & Project Goals */}
            <div className="featured-meta-row">
              <div className="featured-meta-item">
                <Calendar size={13} className="text-pine" aria-hidden="true" />
                <span>Available: {peer.availability.join(' & ')}</span>
              </div>
              {peer.projectGoals && (
                <div className="featured-meta-item">
                  <Target size={13} className="text-marigold" aria-hidden="true" />
                  <span className="featured-goals-truncate" title={peer.projectGoals}>
                    Goal: {peer.projectGoals}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Column */}
          <div className="featured-action-column">
            {/* 1. Connect Button */}
            <button
              type="button"
              className={`featured-connect-btn connect-btn-${collaborationStatus}`}
              onClick={() => onConnect(peer.id)}
              aria-label={`Connect with ${peer.name}. Current status: ${collaborationStatus}`}
            >
              {renderConnectButton()}
            </button>

            {/* 2. View Profile Button */}
            <button
              type="button"
              className="featured-view-profile-btn"
              onClick={() => onViewProfile(peer)}
              aria-label={`View full profile of ${peer.name}`}
            >
              <ExternalLink size={13} aria-hidden="true" />
              <span>View Profile</span>
            </button>

            {/* 3. Why this match? Button */}
            <button
              type="button"
              className="featured-explain-btn"
              onClick={() => setShowExplanation(!showExplanation)}
              aria-expanded={showExplanation}
              aria-controls={`explain-${peer.id}`}
            >
              <span>{showExplanation ? 'Hide Breakdown' : 'Why this match?'}</span>
              {showExplanation ? (
                <ChevronUp size={14} aria-hidden="true" />
              ) : (
                <ChevronDown size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Match Explanation */}
        {showExplanation && (
          <div id={`explain-${peer.id}`} className="featured-explanation-wrapper">
            <MatchExplanation peer={peer} />
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMatch;
