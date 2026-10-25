import React from 'react';
import { CheckCircle2, Circle, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * ProfileCompletion component
 * Highlights profile strength to incentivize complete student records,
 * leading to higher peer compatibility matches.
 */
export const ProfileCompletion = ({ completionData, onCompleteClick }) => {
  const { percentage = 75, checklist = [] } = completionData || {};

  return (
    <article className="profile-card profile-completion-card" aria-labelledby="completion-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 id="completion-heading" className="profile-card-title">
              Profile Strength
            </h2>
            <p className="profile-card-subtitle">Boost your peer match ranking</p>
          </div>
        </div>

        <span className="profile-completion-pct-tag">{percentage}%</span>
      </div>

      <div className="profile-completion-bar-wrap">
        <div
          className="profile-completion-track"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Profile completion status"
        >
          <div
            className="profile-completion-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="profile-completion-note">
          Profiles over 80% receive <strong>3x more study group invitations</strong>.
        </p>
      </div>

      <div className="profile-checklist" role="list" aria-label="Profile completion items">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`checklist-item ${item.completed ? 'checklist-item-done' : 'checklist-item-pending'}`}
            role="listitem"
          >
            {item.completed ? (
              <CheckCircle2 size={16} className="checklist-icon-done" aria-hidden="true" />
            ) : (
              <Circle size={16} className="checklist-icon-pending" aria-hidden="true" />
            )}
            <span className="checklist-label">{item.label}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="profile-complete-cta-btn"
        onClick={onCompleteClick}
        aria-label="Complete missing profile sections"
      >
        <span>Complete Profile</span>
        <ArrowRight size={14} aria-hidden="true" />
      </button>
    </article>
  );
};

export default ProfileCompletion;
