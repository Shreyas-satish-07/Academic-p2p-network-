import React from 'react';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

/**
 * AvailabilityCard component
 * Visualizes the student's available study and hacking hours,
 * crucial for scheduling study group sessions and calculating time-overlap compatibility.
 */
export const AvailabilityCard = ({ availability }) => {
  const {
    status = 'Available for collaboration',
    isAvailable = true,
    weekdays,
    weekends,
  } = availability || {};

  const displayWeekdays = weekdays && weekdays.trim() ? weekdays : 'Flexible / As scheduled';
  const displayWeekends = weekends && weekends.trim() ? weekends : 'Flexible / As scheduled';

  return (
    <article className="profile-card" aria-labelledby="availability-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <Clock size={18} />
          </div>
          <div>
            <h2 id="availability-heading" className="profile-card-title">
              Weekly Availability
            </h2>
            <p className="profile-card-subtitle">Active study hours and peer sync windows</p>
          </div>
        </div>

        {/* Status Badge with Live Pulse Indicator */}
        <div
          className={`availability-status-pill ${
            isAvailable ? 'status-pill-available' : 'status-pill-busy'
          }`}
          aria-label={`Status: ${status}`}
        >
          <span className="availability-pulse-dot" aria-hidden="true" />
          <span>{status}</span>
        </div>
      </div>

      <div className="availability-hours-grid">
        <div className="availability-slot-card">
          <div className="slot-header">
            <Calendar size={14} className="slot-icon" aria-hidden="true" />
            <span className="slot-day-label">Monday – Friday</span>
          </div>
          <div className="slot-time-value">{displayWeekdays}</div>
          <span className="slot-subtext">Evening study sprints & async reviews</span>
        </div>

        <div className="availability-slot-card">
          <div className="slot-header">
            <Calendar size={14} className="slot-icon" aria-hidden="true" />
            <span className="slot-day-label">Saturday – Sunday</span>
          </div>
          <div className="slot-time-value">{displayWeekends}</div>
          <span className="slot-subtext">Extended hackathon & project build hours</span>
        </div>
      </div>

      <div className="availability-sync-note">
        <CheckCircle2 size={13} className="text-pine flex-shrink-0" aria-hidden="true" />
        <span>Time overlap is factored into peer match percentage calculations.</span>
      </div>
    </article>
  );
};

export default AvailabilityCard;
