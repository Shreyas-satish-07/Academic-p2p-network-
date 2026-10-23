import React from 'react';
import { TOP_COLLABORATORS } from '../../data/peerMatchData';
export const TopCollaborators = () => {
    const getSlotClass = (rank) => {
        switch (rank) {
            case 1:
                return 'podium-slot first';
            case 2:
                return 'podium-slot second';
            case 3:
                return 'podium-slot third';
            default:
                return 'podium-slot';
        }
    };
    return (<div className="card" style={{ marginBottom: '18px' }}>
      <div className="card-head">
        <span className="card-tab tab-rust">TC</span>
        <span className="card-title">Top collaborators</span>
      </div>
      
      <div className="podium-wrap">
        {TOP_COLLABORATORS.podium.map((slot) => (<div key={slot.rank} className={getSlotClass(slot.rank)}>
            <div className="podium-medal">{slot.medal}</div>
            <div className="podium-avatar" style={{ backgroundColor: slot.bgClass, color: slot.textClass }}>
              {slot.initials}
            </div>
            <div className="podium-name">{slot.name}</div>
            <div className="podium-dept">
              {slot.dept} · {slot.semester}
            </div>
            <span className="podium-score">{slot.points} pts</span>
          </div>))}
      </div>

      {TOP_COLLABORATORS.leaderboard.map((row) => (<div key={row.rank} className="lead-row">
          <div className="lead-rank">{row.rank}</div>
          <div className="lead-avatar" style={{ backgroundColor: row.bgClass, color: row.textClass }}>
            {row.initials}
          </div>
          <div className="lead-name">{row.name}</div>
          <span className="lead-score">{row.points} pts</span>
        </div>))}
    </div>);
};
export default TopCollaborators;
