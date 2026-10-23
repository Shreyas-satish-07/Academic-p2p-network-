import React from 'react';
import { History, UsersRound, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

const ACTIVITY_ICON_MAP = {
  UsersRound,
  UserCheck,
  FileText,
  CheckCircle2,
};

/**
 * RecentActivity component
 * Displays chronological notifications and events across study groups,
 * resources, and peer connections in a clean vertical timeline.
 */
export const RecentActivity = ({ activities = [] }) => {
  return (
    <article className="dashboard-card" aria-labelledby="activity-heading">
      <div className="dashboard-card-header">
        <div className="card-title-group">
          <div className="card-icon-badge" aria-hidden="true">
            <History size={18} />
          </div>
          <div>
            <h2 id="activity-heading" className="card-title">
              Recent Activity
            </h2>
            <p className="card-subtitle">Real-time updates from your cohorts</p>
          </div>
        </div>
      </div>

      <div className="activity-timeline-wrap" role="feed" aria-label="Recent activity stream">
        {activities.map((act, index) => {
          const IconComp = ACTIVITY_ICON_MAP[act.icon] || CheckCircle2;
          const isLast = index === activities.length - 1;

          return (
            <div key={act.id} className="timeline-item" role="article">
              <div className="timeline-spine">
                <div
                  className={`timeline-icon-wrap timeline-icon-${act.type || 'generic'}`}
                  aria-hidden="true"
                >
                  <IconComp size={14} className="timeline-icon" />
                </div>
                {!isLast && <div className="timeline-connector-line" aria-hidden="true" />}
              </div>

              <div className="timeline-content">
                <p className="timeline-message">{act.message}</p>
                <time className="timeline-time">{act.timeAgo}</time>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default RecentActivity;
