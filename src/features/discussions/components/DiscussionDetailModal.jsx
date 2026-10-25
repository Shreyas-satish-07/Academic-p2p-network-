import React, { useState, useEffect } from 'react';
import {
  X,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  FolderGit2,
  FileText,
  Send,
  ExternalLink,
} from 'lucide-react';
import AnswerCard from './AnswerCard';

/**
 * DiscussionDetailModal component
 * Accessible modal displaying the full discussion thread, linked projects/resources,
 * community answers (with accepted solution highlighted), and a form to write a new answer.
 */
export const DiscussionDetailModal = ({
  discussion,
  isOpen,
  onClose,
  onUpvoteDiscussion,
  onUpvoteAnswer,
  onToggleAcceptAnswer,
  onSubmitAnswer,
  onNavigateToProject,
  onNavigateToResource,
  userUpvotedDiscussion = false,
  userUpvotedAnswers = {},
}) => {
  const [answerBody, setAnswerBody] = useState('');
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !discussion) return null;

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (!answerBody.trim()) {
      setAnswerError('Please write an answer explanation before posting.');
      return;
    }
    setAnswerError('');
    onSubmitAnswer(discussion.id, answerBody.trim());
    setAnswerBody('');
  };

  // Sort answers so accepted answers appear first
  const sortedAnswers = [...(discussion.answers || [])].sort((a, b) => {
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    return b.voteCount - a.voteCount;
  });

  return (
    <div
      className="disc-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="discussion-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="disc-detail-modal">
        {/* Modal Header */}
        <div className="disc-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="disc-subject-badge">{discussion.subject}</span>

            <span className={`disc-status-badge ${discussion.isSolved ? 'solved' : 'unsolved'}`}>
              {discussion.isSolved ? (
                <>
                  <CheckCircle size={12} aria-hidden="true" />
                  <span>Solved Question</span>
                </>
              ) : (
                <>
                  <HelpCircle size={12} aria-hidden="true" />
                  <span>Open Question</span>
                </>
              )}
            </span>
          </div>

          <button
            type="button"
            className="disc-modal-close-btn"
            onClick={onClose}
            aria-label="Close discussion details modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="disc-modal-body">
          {/* Question Section */}
          <div className="disc-question-full">
            <button
              type="button"
              className={`disc-vote-btn ${userUpvotedDiscussion ? 'upvoted' : ''}`}
              onClick={() => onUpvoteDiscussion(discussion.id)}
              aria-label={`Upvote question. Currently ${discussion.voteCount} votes`}
            >
              <ThumbsUp size={16} aria-hidden="true" />
              <span className="disc-vote-count">{discussion.voteCount}</span>
            </button>

            <div className="disc-question-content">
              <h2 id="discussion-modal-title" className="disc-question-title">
                {discussion.title}
              </h2>

              <div className="disc-author-info">
                <div className="disc-author-avatar" title={discussion.author}>
                  {discussion.authorInitials || discussion.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="disc-author-name">{discussion.author}</span>
                  <span className="disc-author-sub" style={{ marginLeft: '6px' }}>
                    {discussion.authorDepartment ? `${discussion.authorDepartment} • ` : ''}
                    Asked {discussion.createdAt}
                  </span>
                </div>
              </div>

              <p className="disc-question-body-text">{discussion.body}</p>

              <div className="disc-tags-row">
                {discussion.tags.map((tag) => (
                  <span key={tag} className="disc-tag">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Linked Project Card */}
              {discussion.linkedProjectId && (
                <div className="disc-linked-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FolderGit2 size={16} className="text-pine flex-shrink-0" aria-hidden="true" />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                        Linked Project Context
                      </span>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)' }}>
                        {discussion.linkedProjectId === 'proj-academic-p2p'
                          ? 'Academic Peer-to-Peer Network'
                          : discussion.linkedProjectId}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="disc-btn disc-btn-outline"
                    style={{ fontSize: '12px', padding: '5px 12px' }}
                    onClick={() => onNavigateToProject(discussion.linkedProjectId)}
                  >
                    <span>View Project</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Linked Resource Card */}
              {discussion.linkedResourceId && (
                <div className="disc-linked-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} className="text-marigold flex-shrink-0" aria-hidden="true" />
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                        Linked Academic Resource
                      </span>
                      <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)' }}>
                        {discussion.linkedResourceId === 'res-dbms-notes'
                          ? 'DBMS Complete Notes & ER Diagram Formulas'
                          : discussion.linkedResourceId}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="disc-btn disc-btn-outline"
                    style={{ fontSize: '12px', padding: '5px 12px' }}
                    onClick={() => onNavigateToResource(discussion.linkedResourceId)}
                  >
                    <span>Open Resource</span>
                    <ExternalLink size={12} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Answers Section */}
          <section className="disc-answers-section" aria-label="Community Answers">
            <div className="disc-answers-heading">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} className="text-pine" aria-hidden="true" />
                Answers ({discussion.answerCount})
              </span>
            </div>

            <div className="disc-answers-list">
              {sortedAnswers.length === 0 ? (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    background: 'var(--paper)',
                    borderRadius: '10px',
                    border: '1px dashed var(--line)',
                    color: 'var(--ink-soft)',
                    fontSize: '13.5px',
                  }}
                >
                  No answers posted yet. Be the first to share your insights with your peers!
                </div>
              ) : (
                sortedAnswers.map((answer) => (
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    isAccepted={answer.isAccepted || discussion.acceptedAnswerId === answer.id}
                    onUpvote={(ansId) => onUpvoteAnswer(discussion.id, ansId)}
                    onToggleAccept={(ansId) => onToggleAcceptAnswer(discussion.id, ansId)}
                    hasUpvoted={Boolean(userUpvotedAnswers[answer.id])}
                  />
                ))
              )}
            </div>
          </section>

          {/* Write an Answer Form */}
          <section className="disc-post-answer-box" aria-label="Post your answer">
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
              Your Answer
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', margin: 0 }}>
              Provide clear explanations, formula breakdowns, or practical code examples.
            </p>

            <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                className="disc-answer-textarea"
                placeholder="Write your explanation or code walkthrough here..."
                value={answerBody}
                onChange={(e) => {
                  setAnswerBody(e.target.value);
                  if (answerError) setAnswerError('');
                }}
                rows={4}
                aria-label="Write your answer"
              />

              {answerError && (
                <span className="disc-form-error" role="alert">
                  {answerError}
                </span>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="submit" className="disc-btn disc-btn-primary">
                  <Send size={14} aria-hidden="true" />
                  <span>Post Answer</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetailModal;
