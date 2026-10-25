import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Sparkles, ArrowRight, Users } from 'lucide-react';
import { COLLABORATION_SUGGESTIONS } from '../peerMatchData';

/**
 * CollaborationSuggestions component
 * 
 * Section 6: Collaboration suggestions
 * Smaller card section with suggestions:
 * - "Build a MERN study planner with Ananya"
 * - "Join Rahul for an AI-powered campus project"
 * - "Practice DSA weekly with Priya"
 * Each suggestion includes relevant peers and a CTA linking to /projects or /study-groups.
 */
export const CollaborationSuggestions = ({ onSelectPeer }) => {
  return (
    <section className="collab-suggestions-section" aria-labelledby="collab-suggestions-heading">
      <div className="collab-header">
        <div className="collab-title-group">
          <div className="collab-icon-badge" aria-hidden="true">
            <Rocket size={18} />
          </div>
          <div>
            <h2 id="collab-suggestions-heading" className="collab-title">
              Collaboration Suggestions
            </h2>
            <p className="collab-subtitle">
              Ready-to-start project squads and peer study sprints tailored to your profile
            </p>
          </div>
        </div>
      </div>

      <div className="collab-cards-grid" role="list">
        {COLLABORATION_SUGGESTIONS.map((suggestion) => (
          <article key={suggestion.id} className="collab-card" role="listitem">
            <div className="collab-card-top">
              <span className="collab-domain-tag">{suggestion.domain}</span>
              <div className="collab-team-size">
                <Users size={12} className="text-pine" aria-hidden="true" />
                <span>{suggestion.teamSize}</span>
              </div>
            </div>

            <h3 className="collab-card-title">{suggestion.title}</h3>
            <p className="collab-card-description">{suggestion.description}</p>

            <div className="collab-card-footer">
              <button
                type="button"
                className="collab-peer-chip"
                onClick={() => onSelectPeer(suggestion.matchedPeerId)}
                aria-label={`Highlight partner ${suggestion.matchedPeerName}`}
              >
                <Sparkles size={11} className="text-marigold" aria-hidden="true" />
                <span>With {suggestion.matchedPeerName}</span>
              </button>

              <Link
                to={suggestion.actionRoute}
                className="collab-cta-btn"
                aria-label={`${suggestion.actionText} for ${suggestion.title}`}
              >
                <span>{suggestion.actionText}</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CollaborationSuggestions;
