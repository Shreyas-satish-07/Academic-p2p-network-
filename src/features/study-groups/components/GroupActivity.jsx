import React from 'react';
import { Activity, Clock, FileText, UserPlus, Calendar, MessageSquare } from 'lucide-react';
import { REALISTIC_ACTIVITIES } from '../studyGroupsData';

/**
 * Helper to display appropriate action icon
 */
const getActivityIcon = (type) => {
  switch (type) {
    case 'notes':
      return <FileText size={13} className="text-pine" aria-hidden="true" />;
    case 'members':
      return <UserPlus size={13} className="text-marigold" aria-hidden="true" />;
    case 'schedule':
      return <Calendar size={13} className="text-slate" aria-hidden="true" />;
    case 'discussion':
      return <MessageSquare size={13} className="text-rust" aria-hidden="true" />;
    default:
      return <Activity size={13} className="text-pine" aria-hidden="true" />;
  }
};

/**
 * GroupActivity component
 * 
 * Section 6: Group activity panel
 * Displays realistic recent activity:
 * - "Ananya shared CNN notes in Gradient Descent"
 * - "3 new members joined Placement Prep 2027"
 * - "OS Internals Circle scheduled a session"
 * - "Rahul started a discussion on deadlocks"
 */
export const GroupActivity = ({
  activities = REALISTIC_ACTIVITIES,
}) => {
  return (
    <section className="sg-activity-section" aria-labelledby="sg-activity-heading">
      <div className="sg-activity-header">
        <Activity size={18} className="text-pine" aria-hidden="true" />
        <h2 id="sg-activity-heading" className="sg-activity-title">
          Recent Study Group Activity
        </h2>
      </div>

      <div className="sg-activity-list" role="feed" aria-label="Recent group activities">
        {activities.map((act) => (
          <article key={act.id} className="sg-activity-item">
            <div className="sg-activity-icon-badge" aria-hidden="true">
              {getActivityIcon(act.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="sg-activity-content">
                {act.text}
              </p>

              <div className="flex items-center gap-1.5 sg-activity-meta">
                <Clock size={11} aria-hidden="true" />
                <span>{act.time}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default GroupActivity;
