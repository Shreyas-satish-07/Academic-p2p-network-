import React from 'react';
import { Award, Download, Bookmark, Eye, FileText, User, Calendar } from 'lucide-react';

/**
 * FeaturedResource component
 * 
 * Section 2: Featured resource
 * - Highlights "DBMS Notes.pdf"
 * - Displays title, type, subject, uploader, description, download count, tags,
 *   and a document-preview-style visual thumbnail.
 * - Actions:
 *   - Preview
 *   - Download (updates local count, toast)
 *   - Save Resource (toggles isSaved state)
 */
export const FeaturedResource = ({
  resource,
  onPreview,
  onDownload,
  onToggleSave,
}) => {
  if (!resource) return null;

  return (
    <section className="res-featured-card" aria-label="Featured Academic Resource">
      {/* Ribbon */}
      <div className="res-featured-ribbon">
        <div className="res-featured-badge">
          <Award size={13} aria-hidden="true" />
          <span>Featured Cohort Resource</span>
        </div>

        <div className="res-featured-downloads-stat">
          <Download size={12} aria-hidden="true" />
          <span>{resource.downloadCount} Total Downloads</span>
        </div>
      </div>

      <div className="res-featured-body">
        {/* Document-preview-style visual thumbnail */}
        <div className="res-doc-preview-visual" aria-hidden="true">
          <span className="res-doc-preview-tag">{resource.type}</span>
          <div className="res-doc-preview-lines">
            <div className="res-doc-line line-long" />
            <div className="res-doc-line line-mid" />
            <div className="res-doc-line line-long" />
            <div className="res-doc-line line-short" />
          </div>
          <div className="res-doc-preview-footer">
            <span>{resource.fileSize}</span>
            <span>{resource.subject}</span>
          </div>
        </div>

        {/* Resource Details */}
        <div className="res-featured-info">
          <div className="res-featured-title-wrap">
            <h2 className="res-featured-title serif">
              {resource.title}
            </h2>
            <span className="res-type-pill type-pdf">
              {resource.type}
            </span>
            <span className="res-subject-pill">
              {resource.subject}
            </span>
          </div>

          <p className="res-featured-desc">{resource.description}</p>

          {/* Tags */}
          <div className="res-tags-list">
            {resource.tags.map((tag) => (
              <span key={tag} className="res-tag-pill">
                #{tag}
              </span>
            ))}
          </div>

          {/* Metadata */}
          <div className="res-featured-meta-row">
            <div className="flex items-center gap-1.5">
              <User size={13} className="text-pine" aria-hidden="true" />
              <span>Shared by <strong>{resource.uploader}</strong></span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-slate" aria-hidden="true" />
              <span>{resource.uploadDate}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-slate" aria-hidden="true" />
              <span>{resource.fileSize}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="res-featured-actions">
          <div className="res-action-btn-group">
            {/* Preview Button */}
            <button
              type="button"
              className="res-secondary-btn"
              onClick={() => onPreview(resource)}
              aria-label={`Preview ${resource.title}`}
            >
              <Eye size={13} aria-hidden="true" />
              <span>Preview</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              className="res-primary-btn"
              onClick={() => onDownload(resource)}
              aria-label={`Download ${resource.title}`}
            >
              <Download size={13} aria-hidden="true" />
              <span>Download</span>
            </button>

            {/* Save Resource Button */}
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
              <span>{resource.isSaved ? 'Saved' : 'Save Resource'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResource;
