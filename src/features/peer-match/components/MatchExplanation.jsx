import React from 'react';
import { CheckCircle2, Sparkles, BrainCircuit } from 'lucide-react';
import { calculateMatchScore } from '../utils/matchingEngine';
import { CURRENT_USER } from '../peerMatchData';

/**
 * MatchExplanation component
 * 
 * Section 5: Match explanation component
 * Shows a clear, interview-ready compatibility breakdown such as:
 * Compatibility score: 95%
 * + 35 points — 4 shared technical skills
 * + 25 points — shared project interests
 * + 15 points — same department
 * + 15 points — same semester
 * + 10 points — overlapping availability
 */
export const MatchExplanation = ({ peer, currentUser = CURRENT_USER }) => {
  if (!peer) return null;

  // Run the explainable scoring logic
  const calculated = calculateMatchScore(peer, currentUser);
  const matchScore = peer.matchScore ?? calculated.matchScore;
  const breakdown = calculated.breakdown;

  return (
    <div className="match-explanation-card" aria-label={`Match breakdown for ${peer.name}`}>
      {/* Compatibility score header */}
      <div className="explanation-score-header">
        <div className="explanation-score-left">
          <Sparkles size={16} className="text-marigold" aria-hidden="true" />
          <span className="explanation-score-title">
            Compatibility score: <strong>{matchScore}%</strong>
          </span>
        </div>
        <div className="explanation-badge">
          <BrainCircuit size={13} className="text-pine" aria-hidden="true" />
          <span>Explainable AI Engine</span>
        </div>
      </div>

      {/* Point-by-point breakdown list */}
      <div className="explanation-points-list" role="list">
        {breakdown.map((item) => (
          <div key={item.category} className="explanation-point-row" role="listitem">
            <div className="point-badge-wrap">
              <span className={`point-badge ${item.points > 0 ? 'point-badge-active' : 'point-badge-zero'}`}>
                +{item.points} pts
              </span>
            </div>
            <div className="point-text">
              <span className="point-category-label">{item.label}:</span>{' '}
              <span className="point-detail-desc">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Peer Specific Key Match Reasons */}
      {peer.matchReasons && peer.matchReasons.length > 0 && (
        <div className="explanation-reasons-box">
          <h4 className="explanation-reasons-title">Core Synergy Highlights:</h4>
          <ul className="reasons-bullet-list">
            {peer.matchReasons.map((reason, idx) => (
              <li key={idx} className="reason-bullet-item">
                <CheckCircle2 size={13} className="reason-check-icon" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Educational / Interview Footer Note */}
      <div className="explanation-interview-note">
        <span className="interview-note-tag">Algorithm Weights</span>
        <span className="interview-note-text">
          Skills (35 pts) • Interests (25 pts) • Department (15 pts) • Semester (15 pts) • Schedule (10 pts)
        </span>
      </div>
    </div>
  );
};

export default MatchExplanation;
