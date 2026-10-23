import React from 'react';
import { COLLABORATION_OPPORTUNITIES } from '../../data/peerMatchData';
export const CollaborationOpportunities = () => {
    const getOppDetails = (title) => {
        switch (title.toLowerCase()) {
            case 'hackathons':
                return {
                    bg: 'var(--marigold-tint)',
                    color: 'var(--marigold)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/>
            </svg>),
                };
            case 'research projects':
                return {
                    bg: 'var(--pine-tint)',
                    color: 'var(--pine-dark)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>),
                };
            case 'open-source projects':
                return {
                    bg: 'var(--slate-tint)',
                    color: 'var(--slate)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
            </svg>),
                };
            case 'study partnerships':
                return {
                    bg: 'var(--rust-tint)',
                    color: 'var(--rust)',
                    icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="9" r="3"/>
              <circle cx="17" cy="9" r="3"/>
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
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
    return (<div className="card" style={{ marginBottom: '18px' }}>
      <div className="card-head">
        <span className="card-tab tab-slate">CO</span>
        <span className="card-title">Collaboration opportunities</span>
      </div>
      <div className="opp-grid">
        {COLLABORATION_OPPORTUNITIES.map((opp) => {
            const details = getOppDetails(opp.title);
            return (<div key={opp.id} className="opp-card">
              <div className="opp-icon" style={{ backgroundColor: details.bg, color: details.color }}>
                {details.icon}
              </div>
              <div className="opp-title">{opp.title}</div>
              <div className="opp-desc">{opp.description}</div>
              <div className="opp-count">{opp.category}</div>
            </div>);
        })}
      </div>
    </div>);
};
export default CollaborationOpportunities;
