import React from 'react';
import { History, Sparkles, UsersRound, FileText, CheckCircle2 } from 'lucide-react';

const PROFILE_ACTIVITY_ICONS = {
  Sparkles,
  UsersRound,
  FileText,
  CheckCircle2,
};

/**
 * RecentActivity component
 * Displays chronological student timeline events across skill updates,
 * study group activities, and academic resource uploads.
 */
export const RecentActivity = ({ activities = [] }) => {
  return (
    <article className="profile-card" aria-labelledby="profile-activity-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <History size={18} />
          </div>
          <div>
            <h2 id="profile-activity-heading" className="profile-card-title">
              Recent Profile Activity
            </h2>
            <p className="profile-card-subtitle">Contribution and engagement log</p>
          </div>
        </div>
      </div>

      <div className="profile-timeline-wrap" role="feed" aria-label="Student recent activities">
        {activities.map((act, index) => {
          const IconComp = PROFILE_ACTIVITY_ICONS[act.icon] || CheckCircle2;
          const isLast = index === activities.length - 1;

          return (
            <div key={act.id} className="profile-timeline-item" role="article">
              <div className="profile-timeline-spine">
                <div
                  className={`profile-timeline-icon-wrap timeline-icon-${act.type || 'generic'}`}
                  aria-hidden="true"
                >
                  <IconComp size={14} />
                </div>
                {!isLast && (
                  <div className="profile-timeline-line" aria-hidden="true" />
                )}
              </div>

              <div className="profile-timeline-content">
                <p className="profile-timeline-msg">{act.message}</p>
                <time className="profile-timeline-time">{act.timeAgo}</time>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default RecentActivity;
