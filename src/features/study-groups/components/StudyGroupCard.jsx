import React from 'react';
import {
  Calendar,
  UserPlus,
  Check,
  Sparkles,
  BrainCircuit,
  Terminal,
  Briefcase,
  Database,
  Code,
  Globe,
  Server,
  Binary,
  Shield,
  BookOpen,
} from 'lucide-react';

/**
 * Helper to return a subject icon for visual distinction
 */
const getSubjectIcon = (subject) => {
  switch (subject) {
    case 'Machine Learning':
      return <BrainCircuit size={15} aria-hidden="true" />;
    case 'Operating Systems':
      return <Terminal size={15} aria-hidden="true" />;
    case 'Career Preparation':
      return <Briefcase size={15} aria-hidden="true" />;
    case 'Database Systems':
      return <Database size={15} aria-hidden="true" />;
    case 'Computer Science':
      return <Code size={15} aria-hidden="true" />;
    case 'Web Development':
      return <Globe size={15} aria-hidden="true" />;
    case 'Systems & Cloud':
      return <Server size={15} aria-hidden="true" />;
    case 'Mathematics':
      return <Binary size={15} aria-hidden="true" />;
    case 'Cybersecurity':
      return <Shield size={15} aria-hidden="true" />;
    default:
      return <BookOpen size={15} aria-hidden="true" />;
  }
};

/**
 * StudyGroupCard component
 * 
 * Section 4: Study group grid card
 * Displays:
 * - Subject icon
 * - Group name
 * - Difficulty badge
 * - Description
 * - Tags
 * - Member count / capacity
 * - Progress-style capacity indicator
 * - Schedule
 * - Live or active badge
 * - Join button ("Join Group" -> "Joined") with "Full" indicator when full
 */
export const StudyGroupCard = ({
  group,
  onToggleJoin,
}) => {
  const groupId = group.id || group._id;
  const isFull = group.memberCount >= group.maxMembers && !group.joined;
  const capacityPercent = Math.min(100, Math.round((group.memberCount / group.maxMembers) * 100));

  const getDifficultyClass = (diff) => {
    switch (diff) {
      case 'Beginner': return 'diff-beginner';
      case 'Intermediate': return 'diff-intermediate';
      case 'Advanced': return 'diff-advanced';
      default: return 'diff-intermediate';
    }
  };

  const tagsList = group.tags || group.topics || [];

  return (
    <article
      className={`sg-card ${isFull ? 'sg-card-full-border' : ''}`}
      aria-labelledby={`sg-name-${groupId}`}
    >
      {/* Top Header */}
      <div className="sg-card-top">
        <div className="sg-card-avatar-title">
          <div
            className="sg-card-avatar"
            style={{ background: group.avatarColor || '#2F5D50' }}
            role="img"
            aria-label={`${group.subject} icon`}
          >
            {getSubjectIcon(group.subject)}
          </div>

          <div className="sg-card-title-group">
            <h3 id={`sg-name-${groupId}`} className="sg-card-name">
              {group.name}
            </h3>
            <span className="sg-card-subject">{group.subject}</span>
          </div>
        </div>

        {/* Live or Active Badge + Difficulty */}
        <div className="sg-card-badges">
          <span className={`sg-difficulty-pill ${getDifficultyClass(group.difficulty)}`}>
            {group.difficulty}
          </span>

          {group.isLive ? (
            <span className="sg-featured-live-badge" title="Live audio/study room active">
              <span className="sg-live-dot" aria-hidden="true" />
              <span>Live</span>
            </span>
          ) : group.activeToday ? (
            <span className="sg-active-today-badge" title="Active discussions today">
              <Sparkles size={10} aria-hidden="true" />
              <span>Active today</span>
            </span>
          ) : null}
        </div>
      </div>

      <p className="sg-card-desc">{group.description}</p>

      {/* Tags */}
      <div className="sg-card-tags">
        {tagsList.slice(0, 4).map((tag) => (
          <span key={tag} className="sg-tag-pill">
            #{tag}
          </span>
        ))}
      </div>

      {/* Progress-style capacity indicator */}
      <div className="sg-card-capacity-bar-wrap">
        <div className="sg-capacity-header">
          <span className="sg-capacity-label">
            {isFull ? (
              <strong className="text-rust">Full</strong>
            ) : (
              <span>Capacity</span>
            )}
          </span>
          <span className="sg-capacity-nums">
            <strong>{group.memberCount}</strong> / {group.maxMembers} members
          </span>
        </div>
        <div
          className="sg-capacity-track"
          role="progressbar"
          aria-valuenow={group.memberCount}
          aria-valuemin={0}
          aria-valuemax={group.maxMembers}
          aria-label={`${group.memberCount} of ${group.maxMembers} members filled`}
        >
          <div
            className={`sg-capacity-fill ${isFull ? 'sg-capacity-fill-full' : ''}`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="sg-card-meta-bar">
        <div className="sg-card-schedule">
          <Calendar size={12} className="text-pine flex-shrink-0" aria-hidden="true" />
          <span>{group.meetingSchedule}</span>
        </div>

        {isFull && !group.joined && (
          <span className="sg-full-tag">
            Full
          </span>
        )}
      </div>

      {/* Action Controls */}
      <div className="sg-card-actions">
        <div className="sg-members-stack" aria-label="Group member initials">
          {(group.members || []).slice(0, 3).map((m, idx) => (
            <div
              key={m.id || m._id || idx}
              className="sg-member-pill-avatar"
              title={`${m.name} (${m.role})`}
            >
              {m.initials}
            </div>
          ))}
          {group.memberCount > 3 && (
            <div className="sg-member-pill-avatar" title={`${group.memberCount - 3} more members`}>
              +{group.memberCount - 3}
            </div>
          )}
        </div>

        {/* Join button with state transition: Join Group -> Joined */}
        <button
          type="button"
          className={`sg-join-action-btn ${
            group.joined
              ? 'sg-join-btn-joined'
              : isFull
              ? 'sg-join-btn-full'
              : 'sg-join-btn-unjoined'
          }`}
          onClick={() => onToggleJoin(groupId)}
          disabled={isFull && !group.joined}
          aria-label={
            group.joined
              ? `Leave ${group.name}`
              : isFull
              ? `${group.name} is full`
              : `Join ${group.name}`
          }
        >
          {group.joined ? (
            <>
              <Check size={13} aria-hidden="true" />
              <span>Joined</span>
            </>
          ) : isFull ? (
            <span>Full</span>
          ) : (
            <>
              <UserPlus size={13} aria-hidden="true" />
              <span>Join Group</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};

export default StudyGroupCard;
