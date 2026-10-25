import React, { useEffect } from 'react';
import { X, Download, Bookmark, User, Calendar, FileText, CheckCircle2 } from 'lucide-react';

/**
 * ResourcePreviewModal component
 * 
 * Section 7: Resource preview modal
 * Displays:
 * - Document title, metadata, description, tags, uploader
 * - Styled academic placeholder document viewer area (mock pages & summaries)
 * - Download and Save controls
 */
export const ResourcePreviewModal = ({
  resource,
  isOpen,
  onClose,
  onDownload,
  onToggleSave,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !resource) return null;

  return (
    <div
      className="res-preview-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onClick={onClose}
    >
      <div
        className="res-preview-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="res-preview-header">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="res-type-pill type-pdf">{resource.type}</span>
              <span className="res-subject-pill">{resource.subject}</span>
            </div>
            <h2 id="preview-modal-title" className="res-modal-title serif truncate">
              {resource.title}
            </h2>
          </div>

          <button
            type="button"
            className="res-modal-close-btn"
            onClick={onClose}
            aria-label="Close preview modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="res-preview-body">
          {/* Metadata bar */}
          <div className="flex items-center justify-between text-xs text-ink-soft bg-paper p-3 rounded-lg border border-line flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <User size={13} className="text-pine" aria-hidden="true" />
              <span>Shared by <strong>{resource.uploader}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-slate" aria-hidden="true" />
              <span>{resource.uploadDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <FileText size={13} className="text-slate" aria-hidden="true" />
              <span>{resource.fileSize}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-1">
              Overview & Abstract
            </h4>
            <p className="text-sm text-ink-soft leading-relaxed m-0">
              {resource.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-ink-faint mr-1">Tags:</span>
            {resource.tags.map((tag) => (
              <span key={tag} className="res-tag-pill">
                #{tag}
              </span>
            ))}
          </div>

          {/* Styled Academic Placeholder Document Viewer */}
          <div className="res-preview-doc-mock" aria-label="Document Page 1 Preview">
            <div className="res-preview-mock-header">
              <h3 className="res-preview-mock-title serif">
                {resource.title.replace(/\.[^/.]+$/, '')}
              </h3>
              <span className="res-preview-mock-meta">
                Cohort Academic Repository • {resource.subject} • Verified Peer Material
              </span>
            </div>

            <div className="res-preview-mock-paragraphs">
              <div className="res-preview-mock-line w-11/12" />
              <div className="res-preview-mock-line w-full" />
              <div className="res-preview-mock-line w-4/5" />
              <div className="res-preview-mock-line w-10/12" />
            </div>

            <div className="res-preview-mock-notice">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 size={14} />
                <span>Document verified and ready for download ({resource.fileSize})</span>
              </div>
              <p className="text-xs text-ink-soft mt-1 mb-0">
                Full high-resolution PDF rendering with in-browser page zooming will be enabled upon Cloudinary document delivery integration.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="res-modal-footer">
          <button
            type="button"
            className={`res-save-toggle-btn ${resource.isSaved ? 'saved-active' : ''}`}
            onClick={() => onToggleSave(resource.id)}
            aria-label={resource.isSaved ? `Unsave ${resource.title}` : `Save ${resource.title}`}
          >
            <Bookmark
              size={13}
              fill={resource.isSaved ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
            <span>{resource.isSaved ? 'Saved in Collection' : 'Save Resource'}</span>
          </button>

          <button
            type="button"
            className="res-primary-btn"
            onClick={() => {
              onDownload(resource);
            }}
            aria-label={`Download ${resource.title}`}
          >
            <Download size={13} aria-hidden="true" />
            <span>Download ({resource.fileSize})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreviewModal;
