import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, FolderGit2, BookOpen, ExternalLink, X, ArrowLeft } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';

import ConversationList from '../features/messages/components/ConversationList';
import ChatPanel from '../features/messages/components/ChatPanel';
import EmptyConversation from '../features/messages/components/EmptyConversation';
import WorkspaceTabs from '../features/messages/components/WorkspaceTabs';
import FilesPanel from '../features/messages/components/FilesPanel';
import MembersPanel from '../features/messages/components/MembersPanel';
import CreateConversationModal from '../features/messages/components/CreateConversationModal';

import {
  INITIAL_CONVERSATIONS,
  CURRENT_USER,
} from '../features/messages/messagesData';
import { ROUTES } from '../constants/routes';

import '../features/messages/messages.css';

/**
 * CollaborationWorkspace Page
 * Comprehensive real-time collaboration workspace for direct peer messaging,
 * study groups, and project team workspaces.
 * 
 * Future Backend Architecture (Express, MongoDB & Socket.IO):
 * GET    /api/conversations                    -> Fetch conversations with unread counts
 * GET    /api/conversations/:id/messages       -> Paginated message feed for active conversation
 * POST   /api/conversations                    -> Create new DM, study group, or project workspace
 * POST   /api/conversations/:id/messages       -> Submit message & broadcast via Socket.IO
 * POST   /api/conversations/:id/members        -> Add member to workspace
 * GET    /api/conversations/:id/files          -> Fetch workspace files
 * POST   /api/conversations/:id/files          -> Cloudinary upload pipeline for file attachments
 * 
 * Future Socket.IO Events:
 * - connection
 * - join_conversation
 * - leave_conversation
 * - send_message
 * - receive_message
 * - typing_start
 * - typing_stop
 * - message_read
 * 
 * Future MongoDB Models:
 * - Conversation
 * - Message
 * - ConversationMember
 * - FileAttachment
 * - WorkspaceActivity
 */
export const CollaborationWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Conversations State
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState('conv-rhea-direct');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Screen width detection for responsive behavior (laptop/tablet vs large screen vs mobile)
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLargeScreen = windowWidth >= 1440;
  const isTabletOrLaptop = windowWidth >= 768 && windowWidth < 1440;
  const isMobile = windowWidth < 768;

  // Right Panel State:
  // On large screens (1440px+): default open
  // On tablet/laptop (768px-1439px): default collapsed/hidden
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1440;
    }
    return false;
  });
  const [activeRightTab, setActiveRightTab] = useState('overview');

  // Mobile navigation state ('list', 'chat', or 'details')
  const [mobileView, setMobileView] = useState('chat');

  // Close drawer on Escape key when on tablet/laptop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isRightPanelOpen && !isLargeScreen) {
        setIsRightPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRightPanelOpen, isLargeScreen]);

  // Modal & Toast notification states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Synchronize route state and query params from other pages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryWorkspaceId = params.get('workspaceId');
    const stateWorkspaceId = location.state?.activeWorkspaceId || location.state?.conversationId;
    const targetId = queryWorkspaceId || stateWorkspaceId;

    if (targetId) {
      const match = conversations.find(
        (c) =>
          c.id === targetId ||
          c.projectId === targetId ||
          c.groupId === targetId ||
          (targetId === 'project-1' && c.id === 'team-nimbus') ||
          (targetId === 'os-circle' && c.id === 'os-internals')
      );
      if (match) {
        setActiveConversationId(match.id);
        setMobileView('chat');
      }
    }

    if (location.state?.openCreateWorkspace || location.state?.openNewConversation) {
      setIsCreateModalOpen(true);
    }

    // Clean up history state after handling
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, [location.search, location.state, conversations]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Handle switching active conversation
  const handleSelectConversation = (convId) => {
    setActiveConversationId(convId);
    setMobileView('chat');
    setActiveRightTab('overview');

    // Mark unread count as 0 locally
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Handle sending a new message
  const handleSendMessage = (text, attachment = null) => {
    if (!activeConversation) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderInitials: CURRENT_USER.initials,
      content: text,
      createdAt: 'Just now',
      type: attachment ? 'file' : 'text',
      attachment: attachment || undefined,
      isCurrentUser: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: text,
            lastMessageAt: 'Just now',
            unreadCount: 0,
            messages: [...(c.messages || []), newMsg],
          };
        }
        return c;
      })
    );
  };

  // Handle file download
  const handleDownloadFile = (file) => {
    showToast(`Downloading ${file.name}...`);
    // Optionally increment download count locally
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation?.id && c.files) {
          return {
            ...c,
            files: c.files.map((f) =>
              f.id === file.id ? { ...f, downloadsCount: (f.downloadsCount || 0) + 1 } : f
            ),
          };
        }
        return c;
      })
    );
  };

  // Handle adding peer to active workspace
  const handleAddMember = (peer) => {
    if (!activeConversation) return;

    const newMember = {
      ...peer,
      role: 'Member',
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      text: `${peer.name} joined the workspace`,
      time: 'Just now',
      type: 'member',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          const updatedMembers = [...(c.members || []), newMember];
          return {
            ...c,
            members: updatedMembers,
            memberCount: updatedMembers.length,
            activity: [newActivity, ...(c.activity || [])],
          };
        }
        return c;
      })
    );

    showToast(`${peer.name} added to ${activeConversation.name}!`);
  };

  // Handle creating a new conversation/workspace
  const handleCreateConversation = (newConv) => {
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setMobileView('chat');
    showToast(`${newConv.name} created successfully!`);
  };

  // Filter conversations list locally
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Type or unread filter
      if (selectedFilter === 'direct' && c.type !== 'direct') return false;
      if (selectedFilter === 'study-group' && c.type !== 'study-group') return false;
      if (selectedFilter === 'project' && c.type !== 'project') return false;
      if (selectedFilter === 'unread' && (!c.unreadCount || c.unreadCount === 0)) return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesLastMsg = c.lastMessage?.toLowerCase().includes(q);
        const matchesMember = c.members?.some((m) => m.name.toLowerCase().includes(q));
        if (!matchesName && !matchesLastMsg && !matchesMember) return false;
      }

      return true;
    });
  }, [conversations, selectedFilter, searchQuery]);

  const handleToggleDetails = () => {
    if (isMobile) {
      setMobileView((prev) => (prev === 'details' ? 'chat' : 'details'));
    } else {
      setIsRightPanelOpen((prev) => !prev);
    }
  };

  const handleCloseDetails = () => {
    if (isMobile) {
      setMobileView('chat');
    } else {
      setIsRightPanelOpen(false);
    }
  };

  return (
    <AppLayout>
      <div
        className={`messages-page-wrapper ${
          isMobile
            ? mobileView === 'list'
              ? 'mobile-list-active'
              : mobileView === 'details'
              ? 'mobile-details-active'
              : 'mobile-chat-active'
            : ''
        } ${isTabletOrLaptop ? 'is-tablet-laptop' : ''} ${isLargeScreen ? 'is-large-screen' : ''}`}
      >
        {/* 1. Left Sidebar: Conversation List */}
        <ConversationList
          conversations={filteredConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        {/* 2. Center: Chat Panel or Empty State */}
        {activeConversation ? (
          <ChatPanel
            conversation={activeConversation}
            onBack={() => setMobileView('list')}
            onToggleDetails={handleToggleDetails}
            isDetailsOpen={isMobile ? mobileView === 'details' : isRightPanelOpen}
            onSendMessage={handleSendMessage}
            onAttachClick={() =>
              showToast('File uploads will be connected to Cloudinary later.')
            }
            onDownloadAttachment={handleDownloadFile}
          />
        ) : (
          <EmptyConversation onNewConversation={() => setIsCreateModalOpen(true)} />
        )}

        {/* Drawer Backdrop for Tablet / Laptop View */}
        {isTabletOrLaptop && isRightPanelOpen && activeConversation && (
          <div
            className="workspace-drawer-backdrop"
            onClick={() => setIsRightPanelOpen(false)}
            aria-label="Close workspace details overlay"
          />
        )}

        {/* 3. Right Details & Workspace Panel */}
        {activeConversation && (isMobile ? mobileView === 'details' : isRightPanelOpen) && (
          <aside
            className={`workspace-details-panel ${isTabletOrLaptop ? 'drawer-mode' : ''}`}
            aria-label="Workspace details and resources"
          >
            <div className="workspace-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isMobile && (
                  <button
                    type="button"
                    className="chat-back-btn"
                    onClick={() => setMobileView('chat')}
                    aria-label="Back to chat conversation"
                    style={{ display: 'inline-flex' }}
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                  </button>
                )}
                <h3 className="workspace-title">Workspace Details</h3>
              </div>
              <button
                type="button"
                className="msg-modal-close-btn"
                onClick={handleCloseDetails}
                aria-label="Close details panel"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <WorkspaceTabs
              conversationType={activeConversation.type}
              activeTab={activeRightTab}
              onTabChange={setActiveRightTab}
              filesCount={activeConversation.files?.length || 0}
              membersCount={activeConversation.memberCount || activeConversation.members?.length || 0}
            />

            {/* Tab Body Content */}
            <div className="workspace-tab-content">
              {/* Tab 1: Overview / About / Profile */}
              {activeRightTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeConversation.type === 'direct' ? (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <div
                        className="conv-avatar"
                        style={{
                          width: '56px',
                          height: '56px',
                          margin: '0 auto 12px auto',
                          fontSize: '18px',
                          backgroundColor: activeConversation.avatarBg,
                          color: activeConversation.avatarColor,
                        }}
                      >
                        {activeConversation.initials}
                      </div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--ink)' }}>
                        {activeConversation.name}
                      </h4>
                      <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)' }}>
                        {activeConversation.isOnline ? '🟢 Online now' : '⚪ Offline'}
                      </span>

                      <div style={{ marginTop: '16px', textAlign: 'left' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                          PEER COLLABORATION SKILLS
                        </span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                          <span className="conv-filter-chip">DSA</span>
                          <span className="conv-filter-chip">C++</span>
                          <span className="conv-filter-chip">Algorithms</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Description */}
                      <div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase' }}>
                          About Workspace
                        </span>
                        <p style={{ fontSize: '13px', color: 'var(--ink)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                          {activeConversation.description ||
                            'Dedicated student collaboration workspace for sharing technical notes, code walkthroughs, and project milestone updates.'}
                        </p>
                      </div>

                      {/* Linked Project Context */}
                      {activeConversation.projectId && (
                        <div
                          style={{
                            padding: '10px 12px',
                            background: 'var(--paper)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FolderGit2 size={15} className="text-pine flex-shrink-0" />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                              Linked Project
                            </span>
                          </div>
                          <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)', margin: '4px 0 8px 0' }}>
                            {activeConversation.projectName || 'Academic Peer-to-Peer Network'}
                          </span>
                          <button
                            type="button"
                            className="conv-filter-chip"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() =>
                              navigate(ROUTES.PROJECTS, {
                                state: { projectId: activeConversation.projectId },
                              })
                            }
                          >
                            <span>Open Project Board</span>
                            <ExternalLink size={11} />
                          </button>
                        </div>
                      )}

                      {/* Linked Study Group Context */}
                      {activeConversation.groupId && (
                        <div
                          style={{
                            padding: '10px 12px',
                            background: 'var(--paper)',
                            border: '1px solid var(--line)',
                            borderRadius: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <BookOpen size={15} className="text-marigold flex-shrink-0" />
                            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                              Linked Study Group
                            </span>
                          </div>
                          <span style={{ display: 'block', fontSize: '12px', color: 'var(--ink-soft)', margin: '4px 0 8px 0' }}>
                            {activeConversation.groupName || 'Study Circle'}
                          </span>
                          <button
                            type="button"
                            className="conv-filter-chip"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            onClick={() => navigate(ROUTES.STUDY_GROUPS)}
                          >
                            <span>Open Study Group</span>
                            <ExternalLink size={11} />
                          </button>
                        </div>
                      )}

                      {/* Quick Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ padding: '8px 10px', background: 'var(--paper)', borderRadius: '6px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: 'var(--pine)' }}>
                            {activeConversation.memberCount || activeConversation.members?.length || 0}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Members</span>
                        </div>
                        <div style={{ padding: '8px 10px', background: 'var(--paper)', borderRadius: '6px', textAlign: 'center' }}>
                          <span style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: 'var(--marigold)' }}>
                            {activeConversation.files?.length || 0}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Shared Files</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tab 2: Files Panel */}
              {activeRightTab === 'files' && (
                <FilesPanel
                  files={activeConversation.files || []}
                  onDownloadFile={handleDownloadFile}
                />
              )}

              {/* Tab 3: Members Panel */}
              {activeRightTab === 'members' && (
                <MembersPanel
                  members={activeConversation.members || []}
                  conversationType={activeConversation.type}
                  onAddMember={handleAddMember}
                />
              )}

              {/* Tab 4: Activity Panel */}
              {activeRightTab === 'activity' && (
                <div className="activity-timeline" role="region" aria-label="Workspace activity log">
                  {activeConversation.activity && activeConversation.activity.length > 0 ? (
                    activeConversation.activity.map((act) => (
                      <div key={act.id} className="activity-item">
                        <span className="activity-dot" aria-hidden="true" />
                        <div className="activity-text-wrap">
                          <span>{act.text}</span>
                          <span className="activity-time">{act.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '24px 0', fontSize: '13px' }}>
                      No recent workspace activity recorded.
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* 4. Create Conversation Modal */}
        <CreateConversationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateConversation={handleCreateConversation}
        />

        {/* 5. Toast Alerts */}
        {toastMessage && (
          <div className="msg-toast" role="status" aria-live="polite">
            <CheckCircle2 size={16} className="text-pine flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CollaborationWorkspace;
