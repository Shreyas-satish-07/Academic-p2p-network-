import React from 'react';
import {
  ArrowLeft,
  Users,
  FolderGit2,
  BookOpen,
  User,
  Info,
} from 'lucide-react';

/**
 * MessagesHeader component
 * Header bar for the active conversation, displaying avatar, title, type badge,
 * member count, mobile back navigation, and right-panel toggle button.
 */
export const MessagesHeader = ({
  conversation,
  onBack,
  onToggleDetails,
  isDetailsOpen = false,
}) => {
  if (!conversation) return null;

  const renderTypeIcon = () => {
    switch (conversation.type) {
      case 'project':
        return <FolderGit2 size={12} aria-hidden="true" />;
      case 'study-group':
        return <BookOpen size={12} aria-hidden="true" />;
      default:
        return <User size={12} aria-hidden="true" />;
    }
  };

  const getTypeLabel = () => {
    switch (conversation.type) {
      case 'project':
        return 'Project Workspace';
      case 'study-group':
        return 'Study Group';
      default:
        return 'Direct Message';
    }
  };

  return (
    <header className="chat-header" aria-label={`Conversation header for ${conversation.name}`}>
      <div className="chat-header-left">
        {/* Mobile Back Button */}
        <button
          type="button"
          className="chat-back-btn"
          onClick={onBack}
          aria-label="Back to conversations list"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>

        {/* Conversation Avatar */}
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

        {/* Title and Meta */}
        <div style={{ minWidth: 0 }}>
          <h2 className="chat-header-title">{conversation.name}</h2>
          <div className="chat-header-meta">
            <span className={`chat-type-badge ${conversation.type}`}>
              {renderTypeIcon()}
              <span>{getTypeLabel()}</span>
            </span>

            {conversation.type === 'direct' ? (
              <span>{conversation.isOnline ? 'Online now' : 'Offline'}</span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Users size={12} aria-hidden="true" />
                <span>{conversation.memberCount || conversation.members?.length || 0} members</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="chat-header-right">
        <button
          type="button"
          className={`chat-details-btn ${isDetailsOpen ? 'active' : ''}`}
          onClick={onToggleDetails}
          title={isDetailsOpen ? 'Hide workspace details' : 'Show workspace details'}
          aria-label={isDetailsOpen ? 'Hide workspace details' : 'Show workspace details'}
          aria-pressed={isDetailsOpen}
        >
          <Info size={15} aria-hidden="true" />
          <span className="chat-details-btn-text">Details</span>
        </button>
      </div>
    </header>
  );
};

export default MessagesHeader;
