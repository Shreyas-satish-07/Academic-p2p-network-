import React, { useState } from 'react';
import { SKILL_EXCHANGE } from '../../data/peerMatchData';
export const SkillExchange = () => {
    const [swappedIds, setSwappedIds] = useState([]);
    const toggleSwap = (id) => {
        setSwappedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    };
    return (<div className="card" style={{ marginBottom: '18px' }}>
      <div className="card-head">
        <span className="card-tab tab-marigold">SX</span>
        <span className="card-title">Skill exchange</span>
      </div>
      <div className="exchange-grid">
        <div className="exchange-teach">
          <div className="exchange-col-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            I can teach
          </div>
          <div className="chip-row">
            {SKILL_EXCHANGE.teachSkills.map((skill, idx) => (<span key={idx} className="skill-chip">
                {skill}
              </span>))}
          </div>
        </div>
        <div className="exchange-learn">
          <div className="exchange-col-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M9 12h6M12 9v6"/>
            </svg>
            I want to learn
          </div>
          <div className="chip-row">
            {SKILL_EXCHANGE.learnSkills.map((skill, idx) => (<span key={idx} className="skill-chip">
                {skill}
              </span>))}
          </div>
        </div>
      </div>
      <div className="filter-label" style={{ marginBottom: '2px' }}>
        Recommended for a skill swap
      </div>
      {SKILL_EXCHANGE.swapRecommendations.map((rec) => {
            const isSwapped = swappedIds.includes(rec.id);
            return (<div key={rec.id} className="exchange-rec">
            <div className="rail-peer-avatar" style={{ backgroundColor: rec.bgClass, color: rec.textClass }}>
              {rec.initials}
            </div>
            <div className="exchange-rec-info">
              <div className="n">{rec.name}</div>
              <div className="s">
                Teaches {rec.teaches} · Wants to learn {rec.learns}
              </div>
            </div>
            <button onClick={() => toggleSwap(rec.id)} className="connect-btn" style={{
                    backgroundColor: isSwapped ? 'var(--pine-tint)' : '',
                    color: isSwapped ? 'var(--pine-dark)' : '',
                }}>
              {isSwapped ? 'Swapped' : 'Swap'}
            </button>
          </div>);
        })}
    </div>);
};
export default SkillExchange;
