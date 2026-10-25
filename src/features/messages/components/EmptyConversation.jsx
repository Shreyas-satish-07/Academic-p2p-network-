import React from 'react';
import { MessageSquarePlus, Plus } from 'lucide-react';

/**
 * EmptyConversation component
 * Displayed in the central panel when no conversation is currently selected.
 */
export const EmptyConversation = ({ onNewConversation }) => {
  return (
    <div className="empty-conv-wrap" role="status" aria-label="No conversation selected">
      <div className="empty-conv-icon" aria-hidden="true">
        <MessageSquarePlus size={28} />
      </div>

      <h2 className="empty-conv-title">Select a conversation to start collaborating</h2>
      <p className="empty-conv-subtitle">
        Pick a direct peer chat, study group, or project workspace from the sidebar to view shared notes,
        tasks, and active discussions.
      </p>

      <button
        type="button"
        className="conv-new-btn"
        style={{ padding: '8px 16px', fontSize: '13.5px' }}
        onClick={onNewConversation}
        aria-label="Start a new chat or workspace"
      >
        <Plus size={15} aria-hidden="true" />
        <span>New Conversation</span>
      </button>
    </div>
  );
};

export default EmptyConversation;
