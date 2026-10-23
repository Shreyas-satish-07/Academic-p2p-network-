import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUGGESTED_PEERS } from '../../data/students';
import { ROUTES } from '../../constants/routes';
export const PeerCard = () => {
    const navigate = useNavigate();
    const [connectedIds, setConnectedIds] = useState([]);
    const handleConnect = (e, peerId) => {
        e.stopPropagation();
        setConnectedIds((prev) => prev.includes(peerId) ? prev.filter(id => id !== peerId) : [...prev, peerId]);
    };
    return (<div className="card span-2 peer-card-featured cursor-pointer" onClick={() => navigate(ROUTES.PEER_MATCH)}>
      <div className="card-head">
        <span className="card-tab tab-marigold">PL</span>
        <span className="card-title">Suggested peers</span>
        <span className="card-count">3 top matches</span>
      </div>
      
      <div className="peer-grid">
        {SUGGESTED_PEERS.map((peer) => {
            const isConnected = connectedIds.includes(peer.id);
            return (<div key={peer.id} className="peer-item" onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to peer match page to find the student
                    navigate(ROUTES.PEER_MATCH);
                }}>
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
              <button className="connect-btn connect-btn-lg" style={{
                    backgroundColor: isConnected ? 'var(--line)' : 'var(--pine)',
                    color: isConnected ? 'var(--ink-soft)' : '#F6F4EC',
                    fontWeight: isConnected ? '500' : '700'
                }} onClick={(e) => handleConnect(e, peer.id)}>
                {isConnected ? 'Request Sent' : 'Connect'}
              </button>
            </div>);
        })}
      </div>
    </div>);
};
export default PeerCard;
