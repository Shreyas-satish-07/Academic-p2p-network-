import React from 'react';
import {
  ThumbsUp,
  Eye,
  CheckCircle,
  HelpCircle,
  FolderGit2,
  FileText,
  ArrowRight,
} from 'lucide-react';

/**
 * DiscussionCard component
 * Compact, responsive card for the discussion feed with voting metrics, badges, tags, and action buttons.
 */
export const DiscussionCard = ({
  discussion,
  onViewDiscussion,
  onUpvote,
  hasUpvoted = false,
}) => {
  return (
    <article className="disc-card" aria-label={`Discussion: ${discussion.title}`}>
      {/* Left Metrics Pillar */}
      <div className="disc-card-metrics">
        <button
          type="button"
          className={`disc-vote-btn ${hasUpvoted ? 'upvoted' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(discussion.id);
          }}
          aria-label={`Upvote question. Current votes: ${discussion.voteCount}`}
        >
          <ThumbsUp size={14} aria-hidden="true" />
          <span className="disc-vote-count">{discussion.voteCount}</span>
        </button>

        <div
          className={`disc-answers-pill ${discussion.answerCount > 0 ? 'has-answers' : ''} ${
            discussion.isSolved ? 'is-solved' : ''
          }`}
          title={`${discussion.answerCount} answers`}
        >
          <span style={{ fontSize: '13px', fontWeight: 700 }}>{discussion.answerCount}</span>
          <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            {discussion.answerCount === 1 ? 'Answer' : 'Answers'}
          </span>
        </div>

        <div className="disc-views-count" title={`${discussion.viewCount} views`}>
          <Eye size={11} aria-hidden="true" />
          <span>{discussion.viewCount}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="disc-card-main">
        <div className="disc-card-badges-row">
          <span className="disc-subject-badge">{discussion.subject}</span>

          <span
            className={`disc-status-badge ${discussion.isSolved ? 'solved' : 'unsolved'}`}
          >
            {discussion.isSolved ? (
              <>
                <CheckCircle size={11} aria-hidden="true" />
                <span>Solved</span>
              </>
            ) : (
              <>
                <HelpCircle size={11} aria-hidden="true" />
                <span>Open Question</span>
              </>
            )}
          </span>

          {discussion.linkedProjectId && (
            <span className="disc-linked-badge">
              <FolderGit2 size={11} aria-hidden="true" />
              <span>Linked Project</span>
            </span>
          )}

          {discussion.linkedResourceId && (
            <span className="disc-linked-badge">
              <FileText size={11} aria-hidden="true" />
              <span>Linked Resource</span>
            </span>
          )}
        </div>

        <h3 className="disc-card-title">
          <button
            type="button"
            className="disc-title-btn"
            onClick={() => onViewDiscussion(discussion)}
            aria-label={`View discussion: ${discussion.title}`}
          >
            {discussion.title}
          </button>
        </h3>

        <p className="disc-card-body">{discussion.body}</p>

        {/* Tags */}
        <div className="disc-tags-row" aria-label="Question tags">
          {discussion.tags.map((tag) => (
            <span key={tag} className="disc-tag">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer with Author and View Action */}
        <div className="disc-card-footer">
          <div className="disc-author-info">
            <div className="disc-author-avatar" title={discussion.author}>
              {discussion.authorInitials || discussion.author.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="disc-author-name">{discussion.author}</span>
              <span className="disc-author-sub" style={{ marginLeft: '6px' }}>
                {discussion.authorDepartment ? `${discussion.authorDepartment} • ` : ''}
                {discussion.createdAt}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="disc-btn disc-btn-outline"
            style={{ padding: '6px 14px', fontSize: '12.5px' }}
            onClick={() => onViewDiscussion(discussion)}
            aria-label={`View discussion: ${discussion.title}`}
          >
            <span>View Discussion</span>
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default DiscussionCard;
