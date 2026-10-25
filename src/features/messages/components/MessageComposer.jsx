import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Smile, Send } from 'lucide-react';

/**
 * MessageComposer component
 * Input area supporting text typing, Enter-to-send, attach file placeholder,
 * and emoji quick picker placeholder.
 */
export const MessageComposer = ({
  onSendMessage,
  onAttachClick,
  placeholder = 'Type a message... (Press Enter to send)',
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    onSendMessage(content.trim());
    setContent('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <footer className="chat-composer-box" aria-label="Message composer">
      <form onSubmit={handleSubmit} className="chat-composer-form">
        <textarea
          ref={textareaRef}
          className="chat-composer-textarea"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          aria-label="Message input"
        />

        <div className="chat-composer-actions">
          {/* Attach File Button */}
          <button
            type="button"
            className="chat-action-btn"
            onClick={onAttachClick}
            title="Attach a file"
            aria-label="Attach a file"
          >
            <Paperclip size={17} aria-hidden="true" />
          </button>

          {/* Emoji Button (visual-only) */}
          <button
            type="button"
            className="chat-action-btn"
            title="Insert emoji"
            aria-label="Insert emoji"
            onClick={() => setContent((prev) => `${prev} 👍`)}
          >
            <Smile size={17} aria-hidden="true" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!content.trim()}
            aria-label="Send message"
          >
            <Send size={14} aria-hidden="true" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </footer>
  );
};

export default MessageComposer;
