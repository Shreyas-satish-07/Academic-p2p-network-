import React from 'react';
import { Compass, Users, Sparkles, Target } from 'lucide-react';

/**
 * InterestsSection component
 * Details student academic interests and team size preferences,
 * informing Cohort's peer-match recommendation engine.
 */
export const InterestsSection = ({ profile }) => {
  const { interests = [], availability } = profile;
  const {
    preferredTeamSize = 'Small teams, 2–4 members',
    openTo = ['Study groups', 'Hackathons', 'MERN projects'],
  } = availability || {};

  return (
    <article className="profile-card" aria-labelledby="interests-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <Compass size={18} />
          </div>
          <div>
            <h2 id="interests-heading" className="profile-card-title">
              Interests & Collaboration Preferences
            </h2>
            <p className="profile-card-subtitle">Project domains and teamwork dynamics</p>
          </div>
        </div>
      </div>

      {/* Interest Badges */}
      <div className="interests-block">
        <h3 className="interests-subtitle">Topics of Interest</h3>
        <div className="interests-chips-wrap">
          {interests.length > 0 ? (
            interests.map((interest) => (
              <span key={interest} className="interest-chip">
                <Sparkles size={11} className="interest-chip-icon" aria-hidden="true" />
                <span>{interest}</span>
              </span>
            ))
          ) : (
            <span className="pref-sub-tag">No collaboration interests specified yet.</span>
          )}
        </div>
      </div>

      {/* Collaboration Dynamics */}
      <div className="collaboration-prefs-grid">
        <div className="pref-item">
          <div className="pref-icon-wrap" aria-hidden="true">
            <Users size={16} />
          </div>
          <div className="pref-content">
            <span className="pref-label">Preferred Team Size</span>
            <span className="pref-value">{preferredTeamSize || 'Flexible'}</span>
          </div>
        </div>

        <div className="pref-item">
          <div className="pref-icon-wrap" aria-hidden="true">
            <Target size={16} />
          </div>
          <div className="pref-content">
            <span className="pref-label">Open For</span>
            <div className="pref-tags-list">
              {openTo.length > 0 ? (
                openTo.map((item) => (
                  <span key={item} className="pref-sub-tag">
                    {item}
                  </span>
                ))
              ) : (
                <span className="pref-sub-tag">Study groups & Projects</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-card-note">
        <Sparkles size={13} className="text-marigold flex-shrink-0" aria-hidden="true" />
        <span>Used by the peer-match engine to connect students with aligned collaboration goals.</span>
      </div>
    </article>
  );
};

export default InterestsSection;
