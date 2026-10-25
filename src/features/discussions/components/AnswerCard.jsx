import React from 'react';
import { ThumbsUp, CheckCircle, Check } from 'lucide-react';

/**
 * AnswerCard component
 * Renders an answer with author information, formatted text, upvotes, and accepted answer badge/controls.
 */
export const AnswerCard = ({
  answer,
  isAccepted,
  onUpvote,
  onToggleAccept,
  hasUpvoted = false,
}) => {
  return (
    <article
      className={`answer-card ${isAccepted ? 'accepted' : ''}`}
      aria-label={`Answer by ${answer.author}`}
    >
      {/* Upvote Column */}
      <button
        type="button"
        className={`disc-vote-btn ${hasUpvoted ? 'upvoted' : ''}`}
        onClick={() => onUpvote(answer.id)}
        aria-label={`Upvote answer by ${answer.author}. Currently ${answer.voteCount} votes`}
      >
        <ThumbsUp size={14} aria-hidden="true" />
        <span className="disc-vote-count">{answer.voteCount}</span>
      </button>

      {/* Answer Main Column */}
      <div className="answer-main-column">
        <div className="answer-header-row">
          <div className="disc-author-info">
            <div className="disc-author-avatar" title={answer.author}>
              {answer.authorInitials || answer.author.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="disc-author-name">{answer.author}</span>
              <span className="disc-author-sub" style={{ marginLeft: '6px' }}>
                • {answer.createdAt}
              </span>
            </div>
          </div>

          {isAccepted && (
            <span className="answer-accepted-tag">
              <CheckCircle size={13} aria-hidden="true" />
              <span>Accepted Answer</span>
            </span>
          )}
        </div>

        {/* Answer Content */}
        <p className="answer-body-text">{answer.body}</p>

        {/* Action Controls */}
        <div className="answer-actions-row">
          <button
            type="button"
            className={`answer-accept-btn ${isAccepted ? 'active' : ''}`}
            onClick={() => onToggleAccept(answer.id)}
            title={isAccepted ? 'Unmark this as the accepted solution' : 'Mark this answer as the accepted solution'}
            aria-label={isAccepted ? 'Unmark accepted solution' : 'Mark as accepted solution'}
          >
            <Check size={12} aria-hidden="true" />
            <span>{isAccepted ? 'Accepted Solution' : 'Mark as Accepted'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default AnswerCard;
