import React from 'react';
import { NETWORK_ACTIVITIES } from '../../data/peerMatchData';
export const NetworkActivity = () => {
    const getActivityDetails = (type) => {
        switch (type) {
            case 'join':
                return {
                    bg: 'var(--pine-tint)',
                    color: 'var(--pine-dark)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="9" r="3"/>
              <circle cx="17" cy="9" r="3"/>
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
            </svg>),
                };
            case 'accept':
                return {
                    bg: 'var(--marigold-tint)',
                    color: 'var(--marigold)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6 9 17l-5-5"/>
            </svg>),
                };
            case 'create':
                return {
                    bg: 'var(--slate-tint)',
                    color: 'var(--slate)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>
            </svg>),
                };
            case 'update':
                return {
                    bg: 'var(--pine-tint)',
                    color: 'var(--pine-dark)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9"/>
              <path d="M9 12h6M12 9v6"/>
            </svg>),
                };
            default:
                return {
                    bg: 'var(--pine-tint)',
                    color: 'var(--pine-dark)',
                    icon: null,
                };
        }
    };
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-slate">NA</span>
        <span className="card-title">Network activity</span>
      </div>
      
      {NETWORK_ACTIVITIES.map((act) => {
            const details = getActivityDetails(act.iconType);
            return (<div key={act.id} className="ach-item">
            <div className="ach-marker">
              <div className="ach-dot" style={{ backgroundColor: details.bg, color: details.color }}>
                {details.icon}
              </div>
              <div className="ach-line"/>
            </div>
            <div className="ach-body">
              <div className="t">{act.title}</div>
              <div className="d">{act.time}</div>
            </div>
          </div>);
        })}
    </div>);
};
export default NetworkActivity;
