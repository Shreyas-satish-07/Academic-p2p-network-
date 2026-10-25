import React from 'react';
import { Trophy, Code2, Rocket, FileUp, UsersRound } from 'lucide-react';

const ACHIEVEMENT_ICONS = {
  Code2,
  Rocket,
  FileUp,
  UsersRound,
};

/**
 * AchievementsCard component
 * Displays tangible student milestone accomplishments across problem-solving,
 * project contributions, shared resource metrics, and study circles.
 */
export const AchievementsCard = ({ achievements = [] }) => {
  return (
    <article className="profile-card" aria-labelledby="achievements-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <Trophy size={18} />
          </div>
          <div>
            <h2 id="achievements-heading" className="profile-card-title">
              Academic Milestones
            </h2>
            <p className="profile-card-subtitle">Verified accomplishments on Cohort</p>
          </div>
        </div>
      </div>

      <div className="achievements-grid" role="list">
        {achievements.map((item) => {
          const IconComp = ACHIEVEMENT_ICONS[item.icon] || Trophy;

          return (
            <div key={item.id} className="achievement-item-card" role="listitem">
              <div className="achievement-icon-box" aria-hidden="true">
                <IconComp size={20} className="achievement-icon" />
              </div>

              <div className="achievement-content">
                <div className="achievement-metric-row">
                  <span className="achievement-metric serif">{item.metric}</span>
                  <span className="achievement-category-tag">{item.category}</span>
                </div>
                <h3 className="achievement-title">{item.title}</h3>
                <p className="achievement-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default AchievementsCard;
