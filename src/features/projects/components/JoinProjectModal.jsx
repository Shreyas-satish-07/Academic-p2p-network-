import React, { useState, useEffect } from 'react';
import { X, Send, User, CheckCircle2 } from 'lucide-react';

/**
 * JoinProjectModal component
 * Displays requirements breakdown, lets the student attach an optional personal note,
 * and submits a join request transitioning the project status to 'request-sent'.
 * 
 * Future Backend Architecture:
 * POST /api/projects/:id/join
 * Body: { note: String }
 * Server creates a membership application notification for the project owner.
 */
export const JoinProjectModal = ({ project, isOpen, onClose, onConfirmJoin }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const openSpots = project.maxMembers - project.members.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmJoin(project.id, message);
    setMessage('');
    onClose();
  };

  return (
    <div
      className="proj-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="join-proj-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="proj-form-modal" style={{ maxWidth: '520px' }}>
        <div className="proj-modal-header">
          <div>
            <h2 id="join-proj-title" className="proj-modal-title">
              Request to Join Project
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '4px 0 0 0' }}>
              Connect with <strong>{project.owner}</strong> to join this collaborative effort.
            </p>
          </div>

          <button
            type="button"
            className="proj-modal-close-btn"
            onClick={onClose}
            aria-label="Close join request modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="proj-form-body">
          {/* Project Summary Box */}
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--paper)',
              borderRadius: '10px',
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
                {project.title}
              </span>
              <span className="proj-category-badge">{project.category}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--ink-soft)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} className="text-pine" aria-hidden="true" />
                Lead: {project.owner}
              </span>
              <span>•</span>
              <span>
                Open Spots: <strong>{openSpots > 0 ? openSpots : 0}</strong>
              </span>
            </div>

            {project.requiredSkills && project.requiredSkills.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ink-faint)' }}>
                  DESIRED SKILLS:
                </span>
                <div className="proj-featured-chips">
                  {project.requiredSkills.map((skill) => (
                    <span key={skill} className="proj-chip required" style={{ fontSize: '11.5px' }}>
                      <CheckCircle2 size={11} aria-hidden="true" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Optional Message Field */}
          <div className="proj-form-group">
            <label htmlFor="join-note-input" className="proj-form-label">
              Short Note to Project Lead (Optional)
            </label>
            <textarea
              id="join-note-input"
              rows={3}
              className="proj-form-textarea"
              placeholder="Hi! I'd love to contribute my experience with React and APIs to help build..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <span style={{ fontSize: '11.5px', color: 'var(--ink-faint)' }}>
              A brief note explaining your relevant background significantly increases acceptance rates.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="proj-btn proj-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="proj-btn proj-btn-primary">
              <Send size={13} aria-hidden="true" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinProjectModal;
