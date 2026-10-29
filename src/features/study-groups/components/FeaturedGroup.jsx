import React from 'react';
import { Award, Radio, Calendar, Users, Check, UserPlus, Eye, ArrowRight } from 'lucide-react';

/**
 * FeaturedGroup component
 * 
 * Section 2: Featured study group
 * - Highlights Gradient Descent as the featured group.
 * - Shows subject, member count, activity status, schedule, tags, and 3 member initials.
 * - Includes:
 *   - Join Group / Joined button
 *   - View Group button
 *   - Join Live Session button when isLive is true
 * - Uses local state for join status.
 */
export const FeaturedGroup = ({
  group,
  onToggleJoin,
  onViewGroup,
  onJoinLiveSession,
}) => {
  if (!group) return null;

  const groupId = group.id || group._id;
  const isFull = group.memberCount >= group.maxMembers && !group.joined;
  const tagsList = group.tags || group.topics || [];
  const groupInitials = group.name
    ? group.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('')
    : 'SG';

  return (
    <section className="sg-featured-card" aria-label="Featured Study Group Spotlight">
      {/* Ribbon */}
      <div className="sg-featured-ribbon">
        <div className="sg-featured-badge">
          <Award size={13} aria-hidden="true" />
          <span>Featured Study Group</span>
        </div>

        {group.isLive && (
          <div className="sg-featured-live-badge">
            <span className="sg-live-dot" aria-hidden="true" />
            <Radio size={12} aria-hidden="true" />
            <span>Live Session Active Today</span>
          </div>
        )}
      </div>

      <div className="sg-featured-body">
        {/* Avatar */}
        <div
          className="sg-featured-avatar"
          style={{ background: group.avatarColor || '#2F5D50' }}
          role="img"
          aria-label={`${group.name} avatar`}
        >
          <span>{groupInitials}</span>
        </div>

        {/* Info */}
        <div className="sg-featured-info">
          <div className="sg-featured-title-wrap">
            <h2 className="sg-featured-title serif">
              {group.name}
            </h2>
            <span className="sg-subject-pill">
              {group.subject}
            </span>
            <span className="sg-difficulty-pill diff-intermediate">
              {group.difficulty}
            </span>
            <span className="sg-activity-status-badge">
              Active today
            </span>
          </div>

          <p className="sg-featured-desc">{group.description}</p>

          {/* Tags */}
          <div className="sg-featured-tags">
            {tagsList.map((tag) => (
              <span key={tag} className="sg-tag-pill">
                #{tag}
              </span>
            ))}
          </div>

          {/* Metadata & 3 Member Initials */}
          <div className="sg-featured-meta-row">
            <div className="sg-meta-item">
              <Calendar size={13} className="text-pine" aria-hidden="true" />
              <span>Schedule: <strong>{group.meetingSchedule}</strong></span>
            </div>

            <div className="sg-meta-item">
              <Users size={13} className="text-pine" aria-hidden="true" />
              <span>
                <strong>{group.memberCount} / {group.maxMembers}</strong> members
              </span>
            </div>

            {/* 3 Member Initials Stack */}
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-xs text-ink-faint mr-1">Members:</span>
              <div className="sg-members-stack">
                {(group.members || []).slice(0, 3).map((m, idx) => (
                  <div
                    key={m.id || m._id || idx}
                    className="sg-member-pill-avatar"
                    title={`${m.name} (${m.role})`}
                  >
                    {m.initials}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="sg-featured-actions">
          {/* Join Live Session button when isLive is true */}
          {group.isLive && (
            <button
              type="button"
              className="sg-live-join-btn"
              onClick={() => onJoinLiveSession(group)}
              aria-label={`Join Live Session for ${group.name}`}
            >
              <Radio size={14} aria-hidden="true" />
              <span>Join Live Session</span>
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          )}

          <div className="flex items-center gap-2">
            {/* View Group button */}
            <button
              type="button"
              className="sg-view-group-btn"
              onClick={() => onViewGroup(group)}
              aria-label={`View group details for ${group.name}`}
            >
              <Eye size={13} aria-hidden="true" />
              <span>View Group</span>
            </button>

            {/* Join Group / Joined button */}
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
              aria-label={group.joined ? `Leave ${group.name}` : `Join ${group.name}`}
            >
              {group.joined ? (
                <>
                  <Check size={14} aria-hidden="true" />
                  <span>Joined</span>
                </>
              ) : isFull ? (
                <span>Full</span>
              ) : (
                <>
                  <UserPlus size={14} aria-hidden="true" />
                  <span>Join Group</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGroup;
