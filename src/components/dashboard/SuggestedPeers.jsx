import React from 'react';
import { SUGGESTED_PEERS } from '../../data/students';
export const SuggestedPeers = () => {
    return (<div className="card span-2 peer-card-featured">
      <div className="card-head">
        <span className="card-tab tab-marigold">PL</span>
        <span className="card-title">Suggested peers</span>
        <span className="card-count">3 top matches</span>
      </div>
      
      <div className="peer-grid">
        {SUGGESTED_PEERS.map((peer) => (<div key={peer.id} className="peer-item">
            <div className="peer-avatar" style={{ background: peer.bgClass, color: peer.textClass }}>
              {peer.initials}
            </div>
            <span className="match-pct match-pct-lg">{peer.matchPct}% match</span>
            <div className="peer-info">
              <div className="n">{peer.name}</div>
              <div className="d">{peer.department}</div>
              <div className="peer-skills">
                {peer.skills.map((skill, idx) => (<span key={idx} className="peer-skill">{skill}</span>))}
              </div>
            </div>
            <button className="connect-btn connect-btn-lg">Connect</button>
          </div>))}
      </div>
    </div>);
};
export default SuggestedPeers;
