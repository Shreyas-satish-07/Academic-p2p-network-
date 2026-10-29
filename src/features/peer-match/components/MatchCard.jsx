import React, { useState } from 'react';
import {
  Sparkles,
  UserPlus,
  Check,
  CheckCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  ExternalLink,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import MatchExplanation from './MatchExplanation';

/**
 * MatchCard component
 * 
 * Displays:
 * - Avatar (image or initials)
 * - Online/away indicator
 * - Name, department, semester
 * - Match percentage (compatibility score)
 * - Technical Skills
 * - Shared interests
 * - Availability
 * - 2-3 short match reasons
 * - Connect button
 * - View Profile button
 */
export const MatchCard = ({
  peer,
  collaborationStatus = 'idle',
  onConnect,
  onViewProfile,
}) => {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  if (!peer) return null;

  const peerId = peer._id || peer.id;
  const matchScore = peer.compatibilityScore ?? peer.matchScore ?? 0;
  const isOnline = peer.isOnline !== undefined ? peer.isOnline : true;

  // Format availability text safely regardless of object or array representation
  const formatAvailability = (avail) => {
    if (!avail) return 'Flexible schedule';
    if (Array.isArray(avail)) return avail.join(', ');
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

  // Score color grading
  const getScoreBadgeClass = (score) => {
    if (score >= 90) return 'score-grade-excellent';
    if (score >= 80) return 'score-grade-great';
    return 'score-grade-good';
  };

  const renderConnectButton = () => {
    switch (collaborationStatus) {
      case 'connected':
        return (
          <>
            <CheckCheck size={14} aria-hidden="true" />
            <span>Connected</span>
          </>
        );
      case 'request-sent':
        return (
          <>
            <Check size={14} aria-hidden="true" />
            <span>Request Sent</span>
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <UserPlus size={14} aria-hidden="true" />
            <span>Connect</span>
          </>
        );
    }
  };

  const skillsList = Array.isArray(peer.skills) ? peer.skills : [];
  const interestsList = Array.isArray(peer.interests) ? peer.interests : [];
  const reasonsList = Array.isArray(peer.matchReasons) ? peer.matchReasons : [];

  return (
    <article
      className="peer-match-card"
      aria-labelledby={`peer-name-${peerId}`}
    >
      {/* Top Header */}
      <div className="peer-match-card-top">
        <div className="peer-avatar-wrap">
          <div
            className="peer-avatar-circle"
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
            {/* Online/Away Indicator */}
            <span
              className={`peer-status-indicator ${
                isOnline ? 'indicator-online' : 'indicator-away'
              }`}
              title={isOnline ? 'Online now' : 'Currently away'}
              aria-label={isOnline ? 'Online now' : 'Away'}
            />
          </div>

          <div className="peer-identity">
            <div className="peer-identity-name-row">
              <h3 id={`peer-name-${peerId}`} className="peer-card-name">
                {peer.name}
              </h3>
              <span className="peer-online-text">
                {isOnline ? 'Active' : 'Away'}
              </span>
            </div>
            <div className="peer-card-academic-meta">
              <GraduationCap size={12} aria-hidden="true" />
              <span>
                {peer.department} • Sem {peer.semester}
              </span>
            </div>
          </div>
        </div>

        {/* Match Percentage Pill */}
        <div
          className={`peer-score-badge ${getScoreBadgeClass(matchScore)}`}
          aria-label={`${matchScore}% compatibility score`}
        >
          <Sparkles size={11} className="score-sparkle" aria-hidden="true" />
          <span>{matchScore}% Match</span>
        </div>
      </div>

      <p className="peer-card-bio">{peer.bio || 'Eager to collaborate and build projects together.'}</p>

      {/* Technical Skills */}
      {skillsList.length > 0 && (
        <div className="peer-card-skills-section">
          <span className="peer-skills-heading">Skills:</span>
          <div className="peer-skills-chips">
            {skillsList.map((skill) => (
              <span key={skill} className="peer-skill-tag tag-standard">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Shared Interests */}
      {interestsList.length > 0 && (
        <div className="peer-card-interests-section">
          <span className="peer-skills-heading">Interests:</span>
          <div className="peer-interests-chips">
            {interestsList.map((interest) => (
              <span key={interest} className="peer-interest-tag">
                <BookOpen size={10} className="mr-1 text-slate" aria-hidden="true" />
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Availability Schedule */}
      <div className="peer-card-meta-bar">
        <div className="meta-bar-item">
          <Calendar size={12} className="text-pine flex-shrink-0" aria-hidden="true" />
          <span>Available: {displayAvailability}</span>
        </div>
      </div>

      {/* 2-3 Short Match Reasons */}
      {reasonsList.length > 0 && (
        <div className="peer-card-reasons-box">
          <span className="card-reasons-heading">Why this match:</span>
          <ul className="card-reasons-list">
            {reasonsList.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="card-reason-item">
                <CheckCircle2 size={12} className="card-reason-icon" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Controls */}
      <div className="peer-card-actions">
        <button
          type="button"
          className="peer-card-btn-outline"
          onClick={() => onViewProfile(peer)}
          aria-label={`View full profile for ${peer.name}`}
        >
          <ExternalLink size={13} aria-hidden="true" />
          <span>View Profile</span>
        </button>

        <button
          type="button"
          className={`peer-card-btn-connect btn-${collaborationStatus}`}
          onClick={() => onConnect(peerId)}
          aria-label={`Connect with ${peer.name}`}
        >
          {renderConnectButton()}
        </button>
      </div>

      {/* Accordion Toggle: Why this match? */}
      <div className="peer-card-accordion-wrap">
        <button
          type="button"
          className="accordion-toggle-btn"
          onClick={() => setIsExplanationOpen(!isExplanationOpen)}
          aria-expanded={isExplanationOpen}
        >
          <span>{isExplanationOpen ? 'Hide breakdown' : 'Why this match?'}</span>
          {isExplanationOpen ? (
            <ChevronUp size={14} aria-hidden="true" />
          ) : (
            <ChevronDown size={14} aria-hidden="true" />
          )}
        </button>

        {isExplanationOpen && (
          <div className="accordion-content-panel">
            <MatchExplanation peer={peer} />
          </div>
        )}
      </div>
    </article>
  );
};

export default MatchCard;
