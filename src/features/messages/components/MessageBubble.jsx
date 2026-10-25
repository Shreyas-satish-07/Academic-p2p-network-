import React from 'react';
import { FileText, Download } from 'lucide-react';

/**
 * MessageBubble component
 * Renders individual chat message with alignment (current user vs peer),
 * avatar initials, timestamp, and optional file attachment card.
 */
export const MessageBubble = ({
  message,
  showSenderInfo = false,
  onDownloadAttachment,
}) => {
  const isCurrentUser = message.isCurrentUser;

  return (
    <div
      className={`msg-bubble-wrap ${isCurrentUser ? 'current-user' : 'other-user'}`}
      role="article"
      aria-label={`Message from ${message.senderName} at ${message.createdAt}`}
    >
      {/* Avatar for other peers in groups/projects */}
      {!isCurrentUser && showSenderInfo && (
        <div
          className="msg-sender-avatar"
          style={{
            backgroundColor: 'var(--pine-tint, rgba(47, 93, 80, 0.12))',
            color: 'var(--pine, #2f5d50)',
          }}
          aria-hidden="true"
        >
          {message.senderInitials || message.senderName?.substring(0, 2).toUpperCase()}
        </div>
      )}

      <div className="msg-bubble-body">
        {/* Sender Name for other peers */}
        {!isCurrentUser && showSenderInfo && (
          <span className="msg-sender-name">{message.senderName}</span>
        )}

        {/* Bubble text content */}
        <div className="msg-bubble">
          {message.content && <p style={{ margin: 0 }}>{message.content}</p>}

          {/* Optional Attachment Card */}
          {message.attachment && (
            <div className="msg-attachment-card">
              <FileText size={18} className="flex-shrink-0" aria-hidden="true" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <span className="msg-attach-name">{message.attachment.name}</span>
                <span className="msg-attach-size">{message.attachment.size}</span>
              </div>
              <button
                type="button"
                className="msg-attach-dl-btn"
                onClick={() => onDownloadAttachment(message.attachment)}
                title={`Download ${message.attachment.name}`}
                aria-label={`Download ${message.attachment.name}`}
              >
                <Download size={14} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="msg-meta-row">
          <span>{message.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
