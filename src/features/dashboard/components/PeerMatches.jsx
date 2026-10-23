import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, Check, ArrowUpRight, Sparkles } from 'lucide-react';

/**
 * PeerMatches component
 * Showcases top compatible academic peers based on skillset overlap and semester coursework.
 * Manages local connection state to immediately confirm user action.
 */
export const PeerMatches = ({ peers = [] }) => {
  // Local state tracking which peer IDs have had a connection request sent
  const [requestedPeerIds, setRequestedPeerIds] = useState(new Set());

  const handleConnect = (peerId) => {
    setRequestedPeerIds((prev) => {
      const next = new Set(prev);
      next.add(peerId);
      return next;
    });
    // Placeholder comment for future backend integration:
    // await api.post(`/peers/${peerId}/connect`);
  };

  return (
    <article className="dashboard-card" aria-labelledby="peer-matches-heading">
      <div className="dashboard-card-header">
        <div className="card-title-group">
          <div className="card-icon-badge" aria-hidden="true">
            <Users size={18} />
          </div>
          <div>
            <h2 id="peer-matches-heading" className="card-title">
              Top Peer Matches
            </h2>
            <p className="card-subtitle">Students with complementary skills & courses</p>
          </div>
        </div>

        <Link
          to="/peers"
          className="card-action-link"
          aria-label="View all peer matches"
        >
          <span>View all matches</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="peer-matches-list" role="list">
        {peers.map((peer) => {
          const isRequested = requestedPeerIds.has(peer.id);

          return (
            <div key={peer.id} className="peer-match-card" role="listitem">
              <div className="peer-card-main">
                {/* CSS-based avatar with initials */}
                <div
                  className="peer-avatar"
                  aria-label={`${peer.name}'s avatar initials ${peer.avatarInitials}`}
                >
                  {peer.avatarInitials}
                </div>

                <div className="peer-details">
                  <div className="peer-name-row">
                    <h3 className="peer-name">{peer.name}</h3>
                    <div
                      className="match-score-badge"
                      aria-label={`${peer.matchScore}% compatibility score`}
                    >
                      <Sparkles size={11} className="match-icon" aria-hidden="true" />
                      <span>{peer.matchScore}% match</span>
                    </div>
                  </div>

                  <div className="peer-department-meta">
                    {peer.department} • {peer.year}
                  </div>

                  {/* Skills tags */}
                  <div className="peer-skills-tags" aria-label="Student skills">
                    {peer.skills.map((skill) => (
                      <span key={skill} className="peer-skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="peer-card-action">
                <button
                  type="button"
                  className={`connect-btn ${isRequested ? 'connect-btn-sent' : 'connect-btn-idle'}`}
                  onClick={() => handleConnect(peer.id)}
                  disabled={isRequested}
                  aria-label={
                    isRequested
                      ? `Connection request sent to ${peer.name}`
                      : `Connect with ${peer.name}`
                  }
                >
                  {isRequested ? (
                    <>
                      <Check size={14} aria-hidden="true" />
                      <span>Request Sent</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} aria-hidden="true" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default PeerMatches;
