import React from 'react';
import { FolderGit2, BookOpen } from 'lucide-react';

/**
 * ConversationItem component
 * Individual selectable row in the conversation sidebar with avatar, title,
 * type badge, last message preview, timestamp, and unread count badge.
 */
export const ConversationItem = ({
  conversation,
  isActive = false,
  onSelect,
}) => {
  const renderMiniTypeBadge = () => {
    if (conversation.type === 'project') {
      return (
        <span className="conv-type-badge-mini project">
          <FolderGit2 size={9} aria-hidden="true" />
          <span>Project</span>
        </span>
      );
    }
    if (conversation.type === 'study-group') {
      return (
        <span className="conv-type-badge-mini study-group">
          <BookOpen size={9} aria-hidden="true" />
          <span>Group</span>
        </span>
      );
    }
    return null;
  };

  return (
    <button
      type="button"
      className={`conv-item-btn ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(conversation.id)}
      aria-label={`Open conversation with ${conversation.name}. ${
        conversation.unreadCount > 0 ? `${conversation.unreadCount} unread messages.` : ''
      }`}
      aria-pressed={isActive}
    >
      {/* Avatar with status */}
      <div className="conv-avatar-wrap">
        <div
          className="conv-avatar"
          style={{
            backgroundColor: conversation.avatarBg || 'var(--pine-tint)',
            color: conversation.avatarColor || 'var(--pine)',
          }}
          aria-hidden="true"
        >
          {conversation.initials}
        </div>
        {conversation.type === 'direct' && conversation.isOnline && (
          <span className="conv-online-dot" title="Online" aria-hidden="true" />
        )}
      </div>

      {/* Main Info */}
      <div className="conv-info">
        <div className="conv-name-row">
          <span className="conv-name">{conversation.name}</span>
          <span className="conv-time">{conversation.lastMessageAt}</span>
        </div>

        <div className="conv-preview-row">
          <p className="conv-preview">
            {conversation.lastMessage || 'No messages yet'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {renderMiniTypeBadge()}
            {conversation.unreadCount > 0 && (
              <span className="conv-unread-badge" aria-label={`${conversation.unreadCount} unread`}>
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
