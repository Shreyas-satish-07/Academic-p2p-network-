import React, { useRef, useEffect } from 'react';
import MessagesHeader from './MessagesHeader';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';

/**
 * ChatPanel component
 * Central panel coordinating conversation header, scrollable message feed,
 * date separators, and the message composer.
 */
export const ChatPanel = ({
  conversation,
  onBack,
  onToggleDetails,
  isDetailsOpen = false,
  onSendMessage,
  onAttachClick,
  onDownloadAttachment,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  if (!conversation) return null;

  const isGroupOrProject = conversation.type === 'study-group' || conversation.type === 'project';

  return (
    <main className="chat-panel" aria-label={`Chat with ${conversation.name}`}>
      {/* Header */}
      <MessagesHeader
        conversation={conversation}
        onBack={onBack}
        onToggleDetails={onToggleDetails}
        isDetailsOpen={isDetailsOpen}
      />

      {/* Messages Feed */}
      <div className="chat-messages-area" role="log" aria-live="polite">
        <div className="chat-date-separator">
          <span className="chat-date-text">Today</span>
        </div>

        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              showSenderInfo={isGroupOrProject}
              onDownloadAttachment={onDownloadAttachment}
            />
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--ink-soft)',
              fontSize: '13px',
              padding: '24px 0',
            }}
          >
            No messages yet. Send a message to start collaborating!
          </div>
        )}

        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={onSendMessage}
        onAttachClick={onAttachClick}
        placeholder={`Message ${conversation.name}... (Press Enter to send)`}
      />
    </main>
  );
};

export default ChatPanel;
