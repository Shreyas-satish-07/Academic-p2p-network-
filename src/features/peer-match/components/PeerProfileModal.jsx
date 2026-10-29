import React, { useEffect } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Users,
  Target,
  GraduationCap,
  BookOpen,
  UserPlus,
  Check,
  CheckCheck,
} from 'lucide-react';
import MatchExplanation from './MatchExplanation';

/**
 * PeerProfileModal component
 * Comprehensive modal displaying the peer's full profile details:
 * Department, Semester, Bio, Skills, Interests, Availability,
 * Preferred Team Size, Project Goals, Match Score & Reasons, and Connect CTA.
 */
export const PeerProfileModal = ({
  peer,
  collaborationStatus = 'idle',
  onConnect,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!peer) return null;

  const peerId = peer._id || peer.id;
  const matchScore = peer.compatibilityScore ?? peer.matchScore ?? 0;
  const isOnline = peer.isOnline !== undefined ? peer.isOnline : true;

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
  const preferredTeamSize =
    peer.preferredTeamSize ||
    peer.availability?.preferredTeamSize ||
    '2–4 members';

  const skillsList = Array.isArray(peer.skills) ? peer.skills : [];
  const interestsList = Array.isArray(peer.interests) ? peer.interests : [];

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
    <div
      className="peer-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="peer-modal-title"
      onClick={onClose}
    >
      <div
        className="peer-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="peer-modal-header">
          <div className="peer-modal-header-info">
            <div className="peer-avatar-circle modal-avatar">
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
                className={`peer-status-indicator ${
                  isOnline ? 'indicator-online' : 'indicator-away'
                }`}
                aria-label={isOnline ? 'Online now' : 'Away'}
              />
            </div>
            <div>
              <div className="peer-modal-name-row">
                <h2 id="peer-modal-title" className="peer-modal-name serif">
                  {peer.name}
                </h2>
                <div className="peer-score-badge score-grade-excellent">
                  <Sparkles size={11} aria-hidden="true" />
                  <span>{matchScore}% Match</span>
                </div>
              </div>
              <p className="peer-modal-academic">
                <GraduationCap size={13} className="text-pine inline-icon" aria-hidden="true" />
                <span>
                  {peer.department} • Semester {peer.semester}
                </span>
                <span className="peer-modal-status-tag">
                  {isOnline ? 'Active Online' : 'Away'}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            className="peer-modal-close-btn"
            onClick={onClose}
            aria-label="Close peer profile modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="peer-modal-body">
          {/* Bio */}
          <div className="peer-modal-section">
            <h3 className="peer-modal-section-title">About</h3>
            <p className="peer-modal-bio">{peer.bio || 'Eager to collaborate and learn through teamwork.'}</p>
          </div>

          {/* Project Goals */}
          {peer.projectGoals && (
            <div className="peer-modal-section">
              <h3 className="peer-modal-section-title">
                <Target size={14} className="text-marigold inline-icon" aria-hidden="true" />
                <span>Project Goals</span>
              </h3>
              <p className="peer-modal-goals-text">{peer.projectGoals}</p>
            </div>
          )}

          {/* Skills & Interests Grid */}
          <div className="peer-modal-skills-grid">
            <div>
              <h3 className="peer-modal-section-title">Technical Skills</h3>
              <div className="peer-skills-chips">
                {skillsList.map((skill) => (
                  <span key={skill} className="peer-skill-tag tag-standard">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="peer-modal-section-title">
                <BookOpen size={13} className="text-slate inline-icon" aria-hidden="true" />
                <span>Interests</span>
              </h3>
              <div className="peer-interests-chips">
                {interestsList.map((interest) => (
                  <span key={interest} className="peer-interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Availability & Preferred Team Size */}
          <div className="peer-modal-meta-row">
            <div className="meta-box">
              <Calendar size={14} className="text-pine" aria-hidden="true" />
              <div>
                <span className="meta-label">Availability</span>
                <span className="meta-value">{displayAvailability}</span>
              </div>
            </div>

            <div className="meta-box">
              <Users size={14} className="text-pine" aria-hidden="true" />
              <div>
                <span className="meta-label">Preferred Squad Size</span>
                <span className="meta-value">{preferredTeamSize}</span>
              </div>
            </div>
          </div>

          {/* Match Score & Reasons */}
          <div className="peer-modal-section">
            <h3 className="peer-modal-section-title">Compatibility Breakdown</h3>
            <MatchExplanation peer={peer} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="peer-modal-footer">
          <button
            type="button"
            className="peer-modal-secondary-btn"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className={`peer-modal-connect-btn btn-${collaborationStatus}`}
            onClick={() => onConnect(peerId)}
          >
            {renderConnectButton()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeerProfileModal;
