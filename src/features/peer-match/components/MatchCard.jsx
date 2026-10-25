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
 * Section 4: Match results
 * Each card displays:
 * - Avatar initials
 * - Online/away indicator
 * - Name, department, semester (and year)
 * - Match percentage
 * - Skills
 * - Shared interests
 * - Availability
 * - 2-3 short match reasons
 * - Connect button (idle -> request-sent -> connected)
 * - View Profile button
 */
export const MatchCard = ({
  peer,
  collaborationStatus = 'idle',
  onConnect,
  onViewProfile,
}) => {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

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

  return (
    <article
      className="peer-match-card"
      aria-labelledby={`peer-name-${peer.id}`}
    >
      {/* Top Header */}
      <div className="peer-match-card-top">
        <div className="peer-avatar-wrap">
          <div
            className="peer-avatar-circle"
            role="img"
            aria-label={`${peer.name}'s avatar initials ${peer.initials}`}
          >
            <span>{peer.initials}</span>
            {/* Online/Away Indicator */}
            <span
              className={`peer-status-indicator ${
                peer.isOnline ? 'indicator-online' : 'indicator-away'
              }`}
              title={peer.isOnline ? 'Online now' : 'Currently away'}
              aria-label={peer.isOnline ? 'Online now' : 'Away'}
            />
          </div>

          <div className="peer-identity">
            <div className="peer-identity-name-row">
              <h3 id={`peer-name-${peer.id}`} className="peer-card-name">
                {peer.name}
              </h3>
              <span className="peer-online-text">
                {peer.isOnline ? 'Active' : 'Away'}
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
          className={`peer-score-badge ${getScoreBadgeClass(peer.matchScore)}`}
          aria-label={`${peer.matchScore}% compatibility score`}
        >
          <Sparkles size={11} className="score-sparkle" aria-hidden="true" />
          <span>{peer.matchScore}% Match</span>
        </div>
      </div>

      <p className="peer-card-bio">{peer.bio}</p>

      {/* Technical Skills */}
      <div className="peer-card-skills-section">
        <span className="peer-skills-heading">Skills:</span>
        <div className="peer-skills-chips">
          {peer.skills.map((skill) => (
            <span key={skill} className="peer-skill-tag tag-standard">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Shared Interests */}
      {peer.interests && peer.interests.length > 0 && (
        <div className="peer-card-interests-section">
          <span className="peer-skills-heading">Shared Interests:</span>
          <div className="peer-interests-chips">
            {peer.interests.map((interest) => (
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
          <span>Available: {peer.availability.join(', ')}</span>
        </div>
      </div>

      {/* 2-3 Short Match Reasons */}
      {peer.matchReasons && peer.matchReasons.length > 0 && (
        <div className="peer-card-reasons-box">
          <span className="card-reasons-heading">Why this match:</span>
          <ul className="card-reasons-list">
            {peer.matchReasons.slice(0, 3).map((reason, idx) => (
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
        {/* Connect Button */}
        <button
          type="button"
          className={`peer-connect-action-btn btn-${collaborationStatus}`}
          onClick={() => onConnect(peer.id)}
          aria-label={`Connect with ${peer.name}. Status: ${collaborationStatus}`}
        >
          {renderConnectButton()}
        </button>

        {/* View Profile Button */}
        <button
          type="button"
          className="peer-view-profile-btn"
          onClick={() => onViewProfile(peer)}
          aria-label={`View full profile of ${peer.name}`}
        >
          <ExternalLink size={13} aria-hidden="true" />
          <span>View Profile</span>
        </button>

        {/* Breakdown Toggle Button */}
        <button
          type="button"
          className="peer-explain-toggle-btn"
          onClick={() => setIsExplanationOpen(!isExplanationOpen)}
          aria-expanded={isExplanationOpen}
          aria-controls={`explain-panel-${peer.id}`}
        >
          <span>Score</span>
          {isExplanationOpen ? (
            <ChevronUp size={13} aria-hidden="true" />
          ) : (
            <ChevronDown size={13} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Expandable Match Explanation Breakdown */}
      {isExplanationOpen && (
        <div id={`explain-panel-${peer.id}`} className="card-explanation-container">
          <MatchExplanation peer={peer} />
        </div>
      )}
    </article>
  );
};

export default MatchCard;
