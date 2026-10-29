import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { SUBJECT_OPTIONS } from '../discussionsData';

/**
 * CreateDiscussionModal component
 * Controlled modal for creating and publishing academic questions to the cohort.
 * 
 * Future Backend Architecture:
 * POST /api/discussions
 * Body: { title, body, subject, tags, linkedProjectId, linkedResourceId }
 * Server validates session, assigns req.user._id as author, saves document to MongoDB,
 * and notifies active cohort members.
 */
export const CreateDiscussionModal = ({
  isOpen,
  onClose,
  onCreateDiscussion,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    subject: 'DBMS',
    tags: '',
    linkedProjectId: '',
    linkedResourceId: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Question title is required.';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Question title must be at least 5 characters.';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Detailed question explanation is required.';
    } else if (formData.body.trim().length < 20) {
      newErrors.body = 'Explanation must be at least 20 characters long.';
    }

    if (!formData.subject || formData.subject === 'All Subjects') {
      newErrors.subject = 'Please select a valid subject category.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tagList = formData.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const discussionPayload = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      content: formData.body.trim(),
      subject: formData.subject,
      tags: tagList.length > 0 ? tagList : [formData.subject],
      linkedProjectId: formData.linkedProjectId || null,
      linkedResourceId: formData.linkedResourceId || null,
    };

    setIsSubmitting(true);
    setApiError('');

    try {
      await onCreateDiscussion(discussionPayload);
      onClose();

      // Reset form
      setFormData({
        title: '',
        body: '',
        subject: 'DBMS',
        tags: '',
        linkedProjectId: '',
        linkedResourceId: '',
      });
      setErrors({});
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to post question. Please try again.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectableSubjects = SUBJECT_OPTIONS.filter((s) => s !== 'All Subjects');

  return (
    <div
      className="disc-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-disc-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="disc-form-modal">
        <div className="disc-modal-header">
          <div>
            <h2 id="create-disc-title" className="disc-question-title" style={{ fontSize: '19px' }}>
              Ask an Academic Question
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '4px 0 0 0' }}>
              Pose your question to the cohort. Be specific to receive the most helpful answers.
            </p>
          </div>

          <button
            type="button"
            className="disc-modal-close-btn"
            onClick={onClose}
            aria-label="Close ask question modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="disc-form-body">
          {/* Title */}
          <div className="disc-form-group">
            <label htmlFor="create-disc-title-input" className="disc-form-label">
              Question Title *
            </label>
            <input
              id="create-disc-title-input"
              name="title"
              type="text"
              className="disc-form-input"
              placeholder="e.g. How does Dijkstra handle negative cycle detection?"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <span className="disc-form-error" role="alert">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.title}
              </span>
            )}
          </div>

          {/* Details / Body */}
          <div className="disc-form-group">
            <label htmlFor="create-disc-body-input" className="disc-form-label">
              Question Details & Context *
            </label>
            <textarea
              id="create-disc-body-input"
              name="body"
              rows={4}
              className="disc-form-textarea"
              placeholder="Include background context, what you have already tried, code snippets, or textbook formula references..."
              value={formData.body}
              onChange={handleChange}
            />
            {errors.body && (
              <span className="disc-form-error" role="alert">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.body}
              </span>
            )}
          </div>

          {/* Subject & Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="disc-form-group">
              <label htmlFor="create-disc-subject" className="disc-form-label">
                Subject Category *
              </label>
              <select
                id="create-disc-subject"
                name="subject"
                className="disc-form-select"
                value={formData.subject}
                onChange={handleChange}
              >
                {selectableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="disc-form-group">
              <label htmlFor="create-disc-tags" className="disc-form-label">
                Tags (comma-separated)
              </label>
              <input
                id="create-disc-tags"
                name="tags"
                type="text"
                className="disc-form-input"
                placeholder="Graphs, Shortest Path, C++"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Optional Linked Project & Resource */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="disc-form-group">
              <label htmlFor="create-disc-proj" className="disc-form-label">
                Link Project (Optional)
              </label>
              <select
                id="create-disc-proj"
                name="linkedProjectId"
                className="disc-form-select"
                value={formData.linkedProjectId}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="proj-academic-p2p">Academic Peer-to-Peer Network</option>
                <option value="proj-campus-nav">Campus Navigator App</option>
                <option value="proj-regional-sentiment">Regional Sentiment Analyzer</option>
                <option value="proj-smart-attendance">Smart Attendance System</option>
              </select>
            </div>

            <div className="disc-form-group">
              <label htmlFor="create-disc-res" className="disc-form-label">
                Link Resource (Optional)
              </label>
              <select
                id="create-disc-res"
                name="linkedResourceId"
                className="disc-form-select"
                value={formData.linkedResourceId}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="res-dbms-notes">DBMS Complete Notes & ER Diagram Formulas</option>
                <option value="res-os-cheatsheet">Operating Systems Kernel Cheat Sheet</option>
                <option value="res-ml-slides">Machine Learning Mathematics Lecture Slides</option>
              </select>
            </div>
          </div>

          {apiError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                fontSize: '13px',
                border: '1px solid #fecaca',
              }}
              role="alert"
            >
              <AlertCircle size={16} aria-hidden="true" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="disc-btn disc-btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="disc-btn disc-btn-primary" disabled={isSubmitting}>
              <Plus size={14} aria-hidden="true" />
              <span>{isSubmitting ? 'Posting...' : 'Post Question'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussionModal;
