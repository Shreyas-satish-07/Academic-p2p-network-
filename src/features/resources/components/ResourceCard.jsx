import React from 'react';
import {
  FileText,
  BookOpen,
  Presentation,
  FileSpreadsheet,
  GraduationCap,
  Video,
  Link as LinkIcon,
  Download,
  Eye,
  Bookmark,
  Calendar,
  Heart,
} from 'lucide-react';

/**
 * Returns type-specific icon and color styling
 */
const getTypeConfig = (type) => {
  switch (type) {
    case 'PDF':
    case 'Document':
      return {
        icon: <FileText size={18} className="text-pine" aria-hidden="true" />,
        badgeClass: 'type-pdf',
        boxBg: 'rgba(47, 93, 80, 0.1)',
      };
    case 'Notes':
      return {
        icon: <BookOpen size={18} className="text-marigold" aria-hidden="true" />,
        badgeClass: 'type-notes',
        boxBg: 'rgba(225, 153, 58, 0.1)',
      };
    case 'PPT':
      return {
        icon: <Presentation size={18} className="text-slate" aria-hidden="true" />,
        badgeClass: 'type-ppt',
        boxBg: 'rgba(68, 83, 114, 0.1)',
      };
    case 'Cheat Sheet':
      return {
        icon: <FileSpreadsheet size={18} className="text-pine-dark" aria-hidden="true" />,
        badgeClass: 'type-cheatsheet',
        boxBg: 'rgba(31, 64, 56, 0.12)',
      };
    case 'Research Paper':
      return {
        icon: <GraduationCap size={18} className="text-rust" aria-hidden="true" />,
        badgeClass: 'type-research',
        boxBg: 'rgba(193, 80, 46, 0.1)',
      };
    case 'Video':
      return {
        icon: <Video size={18} className="text-rust" aria-hidden="true" />,
        badgeClass: 'type-research',
        boxBg: 'rgba(193, 80, 46, 0.1)',
      };
    default:
      return {
        icon: <LinkIcon size={18} className="text-ink-soft" aria-hidden="true" />,
        badgeClass: 'type-other',
        boxBg: 'var(--paper)',
      };
  }
};

/**
 * ResourceCard component
 * 
 * Section 4: Resource library grid card
 * Displays:
 * - Type icon and badge with unique visual styling per type
 * - Title & short description
 * - Subject & tags
 * - Uploader initials & name
 * - Upload date
 * - Download, like, and view counts
 * - Save button, Preview button, Download/Open button
 */
export const ResourceCard = ({
  resource,
  onPreview,
  onDownload,
  onToggleSave,
  onToggleLike,
}) => {
  const resId = resource.id || resource._id;
  const typeConfig = getTypeConfig(resource.type);
  const tagsList = resource.tags || resource.topics || [];
  const isSaved = Boolean(resource.isSaved || resource.isSavedByCurrentUser);
  const isLiked = Boolean(resource.isLikedByCurrentUser);

  return (
    <article
      className="res-card"
      aria-labelledby={`res-title-${resId}`}
    >
      {/* Top Header: Type Icon & Badges */}
      <div className="res-card-header">
        <div
          className="res-card-type-icon-box"
          style={{ background: typeConfig.boxBg }}
          aria-hidden="true"
        >
          {typeConfig.icon}
        </div>

        <div className="res-card-badges">
          <span className={`res-type-pill ${typeConfig.badgeClass}`}>
            {resource.type}
          </span>
          <span className="res-subject-pill">
            {resource.subject}
          </span>
        </div>
      </div>

      {/* Title & Short Description */}
      <div>
        <h3 id={`res-title-${resId}`} className="res-card-title">
          {resource.title}
        </h3>
        <p className="res-card-desc mt-1">
          {resource.description}
        </p>
      </div>

      {/* Tags Chips */}
      <div className="res-card-tags">
        {tagsList.slice(0, 3).map((tag) => (
          <span key={tag} className="res-tag-pill">
            #{tag}
          </span>
        ))}
      </div>

      {/* Uploader & Metric Stats */}
      <div className="res-card-meta-bar">
        <div className="res-uploader-info">
          <div className="res-uploader-avatar" title={`Uploaded by ${resource.uploader}`}>
            {resource.uploaderInitials}
          </div>
          <span className="font-medium text-ink">{resource.uploader}</span>
        </div>

        <div className="flex items-center gap-1.5 text-ink-faint">
          <Calendar size={11} aria-hidden="true" />
          <span>{resource.uploadDate}</span>
        </div>
      </div>

      {/* Likes, Views & Size */}
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <div className="res-stats-info flex items-center gap-2">
          {onToggleLike ? (
            <button
              type="button"
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? 'text-rust font-semibold' : 'hover:text-rust'
              }`}
              onClick={() => onToggleLike(resId)}
              title={isLiked ? 'Unlike' : 'Like'}
              aria-label={isLiked ? 'Unlike resource' : 'Like resource'}
            >
              <Heart
                size={12}
                fill={isLiked ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              <span>{resource.likeCount || 0}</span>
            </button>
          ) : (
            <span title={`${resource.likeCount || 0} likes`}>
              <strong>{resource.likeCount || 0}</strong> likes
            </span>
          )}
          <span>•</span>
          <span title={`${resource.viewCount || 0} views`}>
            <strong>{resource.viewCount || 0}</strong> views
          </span>
        </div>
        <span className="text-ink-faint">{resource.fileSize}</span>
      </div>

      {/* Actions Bar */}
      <div className="res-card-actions">
        {/* Preview Button */}
        <button
          type="button"
          className="res-card-action-btn btn-card-preview"
          onClick={() => onPreview(resource)}
          aria-label={`Preview ${resource.title}`}
        >
          <Eye size={13} aria-hidden="true" />
          <span>Preview</span>
        </button>

        {/* Download / Open Button */}
        <button
          type="button"
          className="res-card-action-btn btn-card-download"
          onClick={() => onDownload(resource)}
          aria-label={`Open or download ${resource.title}`}
        >
          <Download size={13} aria-hidden="true" />
          <span>Open</span>
        </button>

        {/* Save Bookmark Button */}
        <button
          type="button"
          className={`res-card-action-btn btn-card-save ${isSaved ? 'is-saved' : ''}`}
          onClick={() => onToggleSave(resId)}
          aria-label={isSaved ? `Unsave ${resource.title}` : `Save ${resource.title}`}
          title={isSaved ? 'Resource saved' : 'Save for later'}
        >
          <Bookmark
            size={14}
            fill={isSaved ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
};

export default ResourceCard;
