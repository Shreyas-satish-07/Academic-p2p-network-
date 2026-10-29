import React, { useState, useEffect } from 'react';
import { X, Upload, BookOpen, Layers, Tag, FileText, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { SUBJECT_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from '../resourcesData';
import { resourceApi } from '../../../services/api';

/**
 * UploadResourceModal component
 *
 * Section 6: Upload / Share Resource modal
 * Fields:
 * - Title
 * - Description
 * - Subject
 * - Resource type
 * - External resource URL (Required in Phase 6 link-sharing; binary storage is coming soon)
 * - Tags
 */
export const UploadResourceModal = ({
  isOpen,
  onClose,
  onUploadResource,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('DBMS');
  const [type, setType] = useState('PDF');
  const [tagsInput, setTagsInput] = useState('Notes, Semester 6');
  const [externalUrl, setExternalUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setErrorMsg('');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('Please enter a resource title (at least 3 characters).');
      return;
    }
    if (!subject || subject === 'All Subjects') {
      setErrorMsg('Please select a subject area.');
      return;
    }
    if (!type || type === 'All Types') {
      setErrorMsg('Please select a resource type.');
      return;
    }
    if (!externalUrl.trim()) {
      setErrorMsg('Please provide a resource URL (Google Drive, GitHub, ArXiv, docs, etc.).');
      return;
    }
    const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/i;
    if (!urlPattern.test(externalUrl.trim())) {
      setErrorMsg('Please enter a valid HTTP or HTTPS resource URL.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await resourceApi.createResource({
        title: title.trim(),
        description: description.trim() || `Academic material shared for ${subject}.`,
        subject,
        resourceType: type.toLowerCase(),
        type,
        url: externalUrl.trim(),
        tags: parsedTags.length > 0 ? parsedTags : [subject, type],
        level: 'intermediate',
        visibility: 'public',
      });

      const created = res.data?.data?.resource;
      if (created) {
        onUploadResource(created);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create resource:', err);
      const msg = err.response?.data?.message || 'Failed to upload resource. Please check your connection.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validSubjects = SUBJECT_FILTER_OPTIONS.filter((s) => s !== 'All Subjects');
  const validTypes = TYPE_FILTER_OPTIONS.filter((t) => t !== 'All Types');

  return (
    <div
      className="res-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onClick={onClose}
    >
      <div
        className="res-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="res-modal-header">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-pine" aria-hidden="true" />
            <h2 id="upload-modal-title" className="res-modal-title serif">
              Share Academic Resource
            </h2>
          </div>

          <button
            type="button"
            className="res-modal-close-btn"
            onClick={onClose}
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="res-modal-form">
          {/* Notice for Cloudinary / File uploads coming soon */}
          <div className="res-file-picker-trigger bg-sage/20 border-dashed border-2 border-pine/30 rounded-lg p-3 text-center cursor-default">
            <Upload size={20} className="text-pine mx-auto mb-1" aria-hidden="true" />
            <span className="text-xs font-semibold text-ink block">
              Direct Binary File Upload (Cloudinary / S3): <strong className="text-pine">Coming Soon</strong>
            </span>
            <span className="text-[11px] text-ink-soft block mt-0.5">
              Phase 6 supports resource metadata and link sharing. Enter your resource link below (Google Drive, GitHub, Notion, YouTube, ArXiv, etc.).
            </span>
          </div>

          {/* External Resource URL */}
          <div className="res-form-group">
            <label htmlFor="res-external-url" className="res-form-label flex items-center gap-1.5">
              <Globe size={13} className="text-pine" aria-hidden="true" />
              <span>Resource URL (Google Drive, GitHub, PDF link, etc.) *</span>
            </label>
            <input
              id="res-external-url"
              type="url"
              className="res-form-input"
              placeholder="https://drive.google.com/... or https://github.com/..."
              value={externalUrl}
              onChange={(e) => {
                setExternalUrl(e.target.value);
                setErrorMsg('');
              }}
              required
            />
          </div>

          {/* Title */}
          <div className="res-form-group">
            <label htmlFor="upload-res-title" className="res-form-label">
              Resource Title *
            </label>
            <input
              id="upload-res-title"
              type="text"
              className="res-form-input"
              placeholder="e.g. Operating Systems Concurrency Notes.pdf"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMsg('');
              }}
              required
            />
          </div>

          {/* Subject & Type Row */}
          <div className="res-form-row">
            <div className="res-form-group">
              <label htmlFor="upload-res-subject" className="res-form-label flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate" aria-hidden="true" />
                <span>Subject Area *</span>
              </label>
              <select
                id="upload-res-subject"
                className="res-form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {validSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="res-form-group">
              <label htmlFor="upload-res-type" className="res-form-label flex items-center gap-1.5">
                <Layers size={13} className="text-slate" aria-hidden="true" />
                <span>Resource Type *</span>
              </label>
              <select
                id="upload-res-type"
                className="res-form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {validTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="res-form-group">
            <label htmlFor="upload-res-desc" className="res-form-label flex items-center gap-1.5">
              <FileText size={13} className="text-slate" aria-hidden="true" />
              <span>Description & Key Topics</span>
            </label>
            <textarea
              id="upload-res-desc"
              className="res-form-textarea"
              placeholder="Summary of syllabus units, problem solutions, or topics covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Tags */}
          <div className="res-form-group">
            <label htmlFor="upload-res-tags" className="res-form-label flex items-center gap-1.5">
              <Tag size={13} className="text-slate" aria-hidden="true" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              id="upload-res-tags"
              type="text"
              className="res-form-input"
              placeholder="e.g. SQL, Paging, Cheatsheet"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="res-modal-footer">
            <button
              type="button"
              className="res-secondary-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="res-primary-btn flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  <span>Sharing Resource...</span>
                </>
              ) : (
                <span>Share Resource</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResourceModal;
