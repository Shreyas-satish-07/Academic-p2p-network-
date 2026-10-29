import React, { useEffect } from 'react';
import { X, ExternalLink, Bookmark, User, Calendar, FileText, CheckCircle2, Heart } from 'lucide-react';

/**
 * ResourcePreviewModal component
 * 
 * Section 7: Resource preview modal
 * Displays:
 * - Document title, metadata, description, tags, uploader
 * - Styled academic placeholder document viewer area
 * - External URL link, Download/Open, Like and Save controls
 */
export const ResourcePreviewModal = ({
  resource,
  isOpen,
  onClose,
  onDownload,
  onToggleSave,
  onToggleLike,
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

  const resId = resource.id || resource._id;
  const tagsList = resource.tags || resource.topics || [];
  const isSaved = Boolean(resource.isSaved || resource.isSavedByCurrentUser);
  const isLiked = Boolean(resource.isLikedByCurrentUser);
  const targetUrl = resource.url || resource.fileUrl;

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
              <span className="res-type-pill type-pdf">{resource.type || 'Resource'}</span>
              <span className="res-subject-pill">{resource.subject}</span>
              {resource.level && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-marigold border border-amber-200 capitalize">
                  {resource.level}
                </span>
              )}
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

            <div className="flex items-center gap-2">
              <span><strong>{resource.viewCount || 0}</strong> views</span>
              <span>•</span>
              <span><strong>{resource.likeCount || 0}</strong> likes</span>
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
          {tagsList.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-ink-faint mr-1">Tags:</span>
              {tagsList.map((tag) => (
                <span key={tag} className="res-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}

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
              <div className="flex items-center gap-2 font-semibold text-pine">
                <CheckCircle2 size={14} />
                <span>Resource verified and available</span>
              </div>
              {targetUrl && (
                <p className="text-xs text-ink-soft mt-1 mb-0 break-all">
                  Source URL: <a href={targetUrl} target="_blank" rel="noopener noreferrer" className="text-pine underline hover:text-pine-dark">{targetUrl}</a>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="res-modal-footer">
          <div className="flex items-center gap-2">
            {onToggleLike && (
              <button
                type="button"
                className={`res-save-toggle-btn ${isLiked ? 'saved-active' : ''}`}
                onClick={() => onToggleLike(resId)}
                aria-label={isLiked ? 'Unlike resource' : 'Like resource'}
              >
                <Heart
                  size={13}
                  fill={isLiked ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>
            )}

            <button
              type="button"
              className={`res-save-toggle-btn ${isSaved ? 'saved-active' : ''}`}
              onClick={() => onToggleSave(resId)}
              aria-label={isSaved ? `Unsave ${resource.title}` : `Save ${resource.title}`}
            >
              <Bookmark
                size={13}
                fill={isSaved ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              <span>{isSaved ? 'Saved in Collection' : 'Save Resource'}</span>
            </button>
          </div>

          <button
            type="button"
            className="res-primary-btn"
            onClick={() => {
              onDownload(resource);
            }}
            aria-label={`Open or download ${resource.title}`}
          >
            <ExternalLink size={13} aria-hidden="true" />
            <span>Open Resource</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcePreviewModal;
