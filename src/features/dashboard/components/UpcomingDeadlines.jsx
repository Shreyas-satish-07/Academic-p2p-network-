import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';

/**
 * UpcomingDeadlines component
 * Displays prioritized coursework milestones, assignment deadlines, and hackathon schedules.
 */
export const UpcomingDeadlines = ({ deadlines = [] }) => {
  return (
    <article className="dashboard-card" aria-labelledby="deadlines-heading">
      <div className="dashboard-card-header">
        <div className="card-title-group">
          <div className="card-icon-badge" aria-hidden="true">
            <Calendar size={18} />
          </div>
          <div>
            <h2 id="deadlines-heading" className="card-title">
              Upcoming Deadlines
            </h2>
            <p className="card-subtitle">Prioritized milestones for this semester</p>
          </div>
        </div>

        <Link
          to="/projects"
          className="card-action-link"
          aria-label="View all project deadlines"
        >
          <span>View all</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="deadlines-list" role="list">
        {deadlines.map((item) => {
          const isUrgent = item.urgency === 'high';
          const isWarning = item.urgency === 'medium';

          return (
            <div
              key={item.id}
              className={`deadline-row ${isUrgent ? 'deadline-urgent' : ''}`}
              role="listitem"
            >
              <div className="deadline-date-box" aria-hidden="true">
                <span className="deadline-month">
                  {item.dueDate.split(' ')[0]}
                </span>
                <span className="deadline-day">
                  {item.dueDate.split(' ')[1]}
                </span>
              </div>

              <div className="deadline-content">
                <div className="deadline-title-row">
                  <h3 className="deadline-title">{item.title}</h3>
                  {item.timeRemaining && (
                    <span
                      className={`urgency-badge ${
                        isUrgent
                          ? 'badge-urgent'
                          : isWarning
                          ? 'badge-warning'
                          : 'badge-normal'
                      }`}
                    >
                      <Clock size={11} className="urgency-icon" aria-hidden="true" />
                      {item.timeRemaining}
                    </span>
                  )}
                </div>
                <div className="deadline-meta">
                  <span className="deadline-course">{item.course}</span>
                  <span className="deadline-dot" aria-hidden="true">•</span>
                  <span className="deadline-type">{item.type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default UpcomingDeadlines;
