import React from 'react';
import { Search, Plus } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { CONVERSATION_FILTERS } from '../messagesData';

/**
 * ConversationList component
 * Left-hand sidebar containing search bar, conversation category filters,
 * "New Conversation" trigger, and scrollable conversation rows.
 */
export const ConversationList = ({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onOpenCreateModal,
}) => {
  return (
    <aside className="conv-sidebar" aria-label="Conversation list">
      <div className="conv-sidebar-header">
        <div className="conv-sidebar-top">
          <h1 className="conv-sidebar-title">Messages</h1>
          <button
            type="button"
            className="conv-new-btn"
            onClick={onOpenCreateModal}
            aria-label="Start new conversation or workspace"
          >
            <Plus size={14} aria-hidden="true" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="conv-search-box">
          <Search size={15} className="conv-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="conv-search-input"
            placeholder="Search messages or peers..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="conv-filter-tabs" role="tablist" aria-label="Filter conversations by type">
        {CONVERSATION_FILTERS.map((filter) => {
          const isActive = selectedFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`conv-filter-chip ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Conversation Rows */}
      <div className="conv-list-scroll" role="feed" aria-label="Active conversations">
        {conversations.length === 0 ? (
          <div className="conv-empty-list" role="status">
            <p>No conversations found matching your filter.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
