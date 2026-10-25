import React from 'react';
import { MessageSquare, FileText, Users, Activity, User } from 'lucide-react';

/**
 * WorkspaceTabs component
 * Right details panel tabs for switching between Overview/Chat, Files, Members, and Activity.
 */
export const WorkspaceTabs = ({
  conversationType = 'direct',
  activeTab,
  onTabChange,
  filesCount = 0,
  membersCount = 0,
}) => {
  if (conversationType === 'direct') {
    return (
      <nav className="workspace-tabs-row" role="tablist" aria-label="Direct conversation details tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`workspace-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => onTabChange('overview')}
        >
          <User size={13} aria-hidden="true" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'files'}
          className={`workspace-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => onTabChange('files')}
        >
          <FileText size={13} aria-hidden="true" />
          <span>Files ({filesCount})</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="workspace-tabs-row" role="tablist" aria-label="Workspace collaboration tabs">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'overview'}
        className={`workspace-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
        onClick={() => onTabChange('overview')}
      >
        <MessageSquare size={13} aria-hidden="true" />
        <span>About</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'files'}
        className={`workspace-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
        onClick={() => onTabChange('files')}
      >
        <FileText size={13} aria-hidden="true" />
        <span>Files ({filesCount})</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'members'}
        className={`workspace-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
        onClick={() => onTabChange('members')}
      >
        <Users size={13} aria-hidden="true" />
        <span>Members ({membersCount})</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'activity'}
        className={`workspace-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
        onClick={() => onTabChange('activity')}
      >
        <Activity size={13} aria-hidden="true" />
        <span>Activity</span>
      </button>
    </nav>
  );
};

export default WorkspaceTabs;
