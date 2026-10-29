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
 * Displays:
 * - Avatar (image or initials)
 * - Match percentage
 * - Key skills and common interests
 * - Online status
 * - Short bio
 * - Connect CTA
 * - Why this match? accordion
 */
export const FeaturedMatch = ({
  peer,
  collaborationStatus = 'idle',
  onConnect,
  onViewProfile,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!peer) return null;

  const peerId = peer._id || peer.id;
  const matchScore = peer.compatibilityScore ?? peer.matchScore ?? 0;
  const isOnline = peer.isOnline !== undefined ? peer.isOnline : true;

  const formatAvailability = (avail) => {
    if (!avail) return 'Flexible schedule';
    if (Array.isArray(avail)) return avail.join(' & ');
    if (typeof avail === 'object') {
      const parts = [avail.weekdays, avail.weekends].filter(Boolean);
      if (parts.length > 0) return parts.join(' • ');
      if (Array.isArray(avail.openTo) && avail.openTo.length > 0) {
        return avail.openTo.join(', ');
      }
    }
    return String(avail);
  };

  const displayAvailability = formatAvailability(peer.availability);
  const skillsList = Array.isArray(peer.skills) ? peer.skills : [];
  const interestsList = Array.isArray(peer.interests) ? peer.interests : [];

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
            aria-label={`${matchScore}% compatibility score`}
          >
            <Sparkles size={12} className="text-pine" aria-hidden="true" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        <div className="featured-match-body">
          {/* Avatar with live online/away indicator */}
          <div className="featured-avatar-column">
            <div
              className="featured-avatar"
              role="img"
              aria-label={`${peer.name}'s avatar`}
            >
              {peer.avatar?.url ? (
                <img
                  src={peer.avatar.url}
                  alt={peer.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <span>{peer.initials || 'ST'}</span>
              )}
              <span
                className={`featured-status-indicator ${
                  isOnline ? 'indicator-online' : 'indicator-away'
                }`}
                title={isOnline ? 'Online now' : 'Currently away'}
                aria-label={isOnline ? 'Online now' : 'Away'}
              />
            </div>
            <span className="featured-status-label">
              {isOnline ? 'Online now' : 'Away'}
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
                  {peer.department} • Semester {peer.semester}
                </p>
              </div>
            </div>

            <p className="featured-bio">{peer.bio || 'Eager to collaborate on student projects.'}</p>

            {/* Skills */}
            {skillsList.length > 0 && (
              <div className="featured-skills-row">
                <span className="featured-skills-label">Key Skills:</span>
                <div className="featured-skills-list">
                  {skillsList.map((skill) => (
                    <span key={skill} className="featured-skill-pill skill-pill-shared">
                      <Sparkles size={10} className="shared-star" aria-hidden="true" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Common Interests */}
            {interestsList.length > 0 && (
              <div className="featured-interests-row">
                <span className="featured-skills-label">Common Interests:</span>
                <div className="featured-interests-list">
                  {interestsList.map((interest) => (
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
                <span>Available: {displayAvailability}</span>
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
              onClick={() => onConnect(peerId)}
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

            {/* 3. Why this match? Accordion Trigger */}
            <button
              type="button"
              className="featured-why-match-btn"
              onClick={() => setShowExplanation(!showExplanation)}
              aria-expanded={showExplanation}
              aria-label="Toggle compatibility score breakdown"
            >
              <span>{showExplanation ? 'Hide reasons' : 'Why this match?'}</span>
              {showExplanation ? (
                <ChevronUp size={13} aria-hidden="true" />
              ) : (
                <ChevronDown size={13} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Explainable AI Scoring Panel */}
        {showExplanation && (
          <div className="featured-explanation-drawer">
            <MatchExplanation peer={peer} />
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMatch;
