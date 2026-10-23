import React, { useState } from 'react';
import { FEATURED_COLLABORATOR } from '../../data/peerMatchData';
export const FeaturedCollaborator = () => {
    const c = FEATURED_COLLABORATOR;
    const [isConnected, setIsConnected] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    // Custom initials generator
    const initials = c.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase();
    const handleConnect = () => {
        if (isConnected)
            return;
        setIsConnected(true);
        setToastMessage(`Connection request sent to ${c.name}`);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    return (<div className="featured-collab">
      <div className="featured-collab-avatar" style={{ backgroundColor: 'var(--pine-tint)', color: 'var(--pine-dark)' }}>
        {initials}
      </div>
      <div className="featured-collab-body">
        <span className="featured-collab-tag">🌟 Recommended collaborator</span>
        <div className="featured-collab-name">{c.name}</div>
        <div className="featured-collab-meta">
          {c.department} · {c.semester}
        </div>
        <div className="featured-collab-note">
          Strongest overall match this week — shares your interest in web development and full-stack projects, and is actively looking for teammates.
        </div>
        <div className="featured-collab-chips">
          {c.skills?.map((skill, idx) => (<span key={idx} className="skill-chip">
              {skill}
            </span>))}
        </div>
      </div>
      <div className="featured-collab-actions">
        <div className="featured-collab-pct">
          {c.matchPercentage}%<span className="l">Match</span>
        </div>
        <button className="mbtn mbtn-solid" style={{
            backgroundColor: isConnected ? 'var(--line)' : 'var(--pine)',
            color: isConnected ? 'var(--ink-soft)' : '#F6F4EC',
            fontWeight: isConnected ? '500' : '700'
        }} onClick={handleConnect}>
          {isConnected ? 'Request Sent' : 'Connect'}
        </button>
      </div>

      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}
    </div>);
};
export default FeaturedCollaborator;
