import React from 'react';
import {
  Star,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Edit3,
} from 'lucide-react';

/**
 * FeaturedDiscussion component
 * Spotlights the DBMS normalization discussion with accepted-answer preview, metrics, and quick actions.
 */
export const FeaturedDiscussion = ({
  discussion,
  onViewDiscussion,
  onUpvote,
  onAnswerQuestion,
  hasUpvoted = false,
}) => {
  if (!discussion) return null;

  const discussionId = discussion.id || discussion._id;
  const authorName = typeof discussion.author === 'object' ? discussion.author?.name || 'Cohort Student' : discussion.author || 'Cohort Student';
  const authorInitials = discussion.authorInitials || (typeof authorName === 'string' ? authorName.substring(0, 2).toUpperCase() : 'CO');

  const acceptedAnswer = discussion.answers?.find(
    (a) => a.isAccepted || (a.id || a._id) === discussion.acceptedAnswerId
  );

  return (
    <section className="disc-featured-card" aria-label="Featured Discussion Spotlight">
      <div className="disc-featured-top-row">
        <span className="disc-featured-tag">
          <Star size={13} fill="currentColor" aria-hidden="true" />
          Featured Academic Discussion
        </span>

        <span className="disc-subject-badge">{discussion.subject}</span>
      </div>

      <h2 className="disc-featured-title">
        <button
          type="button"
          className="disc-title-btn"
          onClick={() => onViewDiscussion(discussion)}
          aria-label={`View featured discussion: ${discussion.title}`}
        >
          {discussion.title}
        </button>
      </h2>

      <p className="disc-featured-preview">{discussion.body}</p>

      {/* Accepted Answer Preview */}
      {acceptedAnswer && (
        <div className="disc-featured-accepted-box">
          <div className="disc-featured-accepted-header">
            <CheckCircle size={14} aria-hidden="true" />
            <span>Accepted Answer by {acceptedAnswer.author}</span>
          </div>
          <p className="disc-featured-accepted-text">
            {acceptedAnswer.body.length > 220
              ? `${acceptedAnswer.body.substring(0, 220)}...`
              : acceptedAnswer.body}
          </p>
        </div>
      )}

      {/* Tags */}
      <div className="disc-tags-row">
        {discussion.tags.map((tag) => (
          <span key={tag} className="disc-tag">
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer Metrics & Actions */}
      <div className="disc-featured-footer">
        <div className="disc-author-info">
          <div className="disc-author-avatar" title={authorName}>
            {authorInitials}
          </div>
          <div>
            <span className="disc-author-name">Asked by {authorName}</span>
            <span className="disc-author-sub" style={{ marginLeft: '6px' }}>
              • {discussion.createdAt}
            </span>
          </div>
        </div>

        <div className="disc-featured-actions">
          {/* Upvote Button */}
          <button
            type="button"
            className={`disc-btn ${hasUpvoted ? 'disc-btn-primary' : 'disc-btn-outline'}`}
            onClick={() => onUpvote(discussionId)}
            aria-label={`Upvote featured question. Current votes: ${discussion.voteCount}`}
          >
            <ThumbsUp size={13} aria-hidden="true" />
            <span>{hasUpvoted ? 'Upvoted' : 'Upvote'} ({discussion.voteCount})</span>
          </button>

          {/* Answer Question CTA */}
          <button
            type="button"
            className="disc-btn disc-btn-outline"
            onClick={() => onAnswerQuestion(discussion)}
            aria-label="Answer this question"
          >
            <Edit3 size={13} aria-hidden="true" />
            <span>Answer Question</span>
          </button>

          {/* View Full Discussion */}
          <button
            type="button"
            className="disc-btn disc-btn-primary"
            onClick={() => onViewDiscussion(discussion)}
            aria-label="View full discussion thread"
          >
            <MessageSquare size={13} aria-hidden="true" />
            <span>View Discussion ({discussion.answerCount})</span>
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDiscussion;
