import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
import { messageApi } from '../services/api';
import { connectSocket, getSocket } from '../services/socket';
import { ROUTES } from '../constants/routes';

import '../features/messages/messages.css';

/**
 * CollaborationWorkspace Page
 * Real-time collaboration workspace for direct peer messaging,
 * study groups, and project team workspaces with Socket.io & REST fallback.
 */
export const CollaborationWorkspace = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve current user from local storage
  const currentUser = useMemo(() => {
    try {
      const stored =
        localStorage.getItem('cohort_user') ||
        sessionStorage.getItem('cohort_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return CURRENT_USER;
  }, []);

  const currentUserId = (currentUser?._id || currentUser?.id)?.toString();

  // Conversations State
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState('conv-rhea-direct');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Screen width detection for responsive behavior
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

  // Right Panel State
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

  /**
   * Fetch user conversations from backend API
   */
  const fetchConversations = useCallback(async () => {
    try {
      const res = await messageApi.getConversations();
      const apiConversations = res.data?.data?.conversations;
      if (Array.isArray(apiConversations) && apiConversations.length > 0) {
        setConversations(apiConversations);
        // Select first conversation if active one is not set or not in list
        setActiveConversationId((prev) => {
          if (!prev || !apiConversations.some((c) => c.id === prev)) {
            return apiConversations[0].id;
          }
          return prev;
        });
      }
    } catch {
      // Retain INITIAL_CONVERSATIONS if offline or initial state
    }
  }, []);

  // Initialize Socket.io connection and load conversations
  useEffect(() => {
    fetchConversations();

    const token =
      localStorage.getItem('cohort_token') ||
      sessionStorage.getItem('cohort_token');

    if (token) {
      connectSocket(token);
    }
  }, [fetchConversations]);

  // Track previous active room for room leave
  const prevActiveConvRef = useRef(activeConversationId);

  /**
   * Handle room join & fetch message history for active conversation
   */
  const loadMessagesForActiveConversation = useCallback(
    async (convId) => {
      if (!convId) return;

      const socket = getSocket();
      // Leave previous room if different
      if (prevActiveConvRef.current && prevActiveConvRef.current !== convId) {
        socket?.emit('conversation:leave', { conversationId: prevActiveConvRef.current });
      }
      prevActiveConvRef.current = convId;

      // Join socket room
      socket?.emit('conversation:join', { conversationId: convId });

      // Mark as read via socket and REST
      socket?.emit('conversation:read', { conversationId: convId });
      messageApi.markAsRead(convId).catch(() => {});

      // Clear unread count locally
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );

      // Fetch messages from backend API
      try {
        const res = await messageApi.getMessages(convId, { limit: 100 });
        const fetchedMessages = res.data?.data?.messages;
        if (Array.isArray(fetchedMessages)) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId
                ? {
                    ...c,
                    messages: fetchedMessages.map((m) => ({
                      ...m,
                      isCurrentUser:
                        m.isCurrentUser ?? (m.senderId?.toString() === currentUserId),
                    })),
                  }
                : c
            )
          );
        }
      } catch {
        // Keep existing conversation messages if offline
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    if (activeConversationId) {
      loadMessagesForActiveConversation(activeConversationId);
    }
  }, [activeConversationId, loadMessagesForActiveConversation]);

  /**
   * Register Socket.io live event listeners for real-time messaging
   */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Incoming new message event
    const handleNewMessage = (payload) => {
      const { conversationId, message } = payload || {};
      if (!conversationId || !message) return;

      const formattedMsg = {
        ...message,
        isCurrentUser:
          message.isCurrentUser ?? (message.senderId?.toString() === currentUserId),
      };

      setConversations((prev) => {
        const targetIndex = prev.findIndex((c) => c.id === conversationId);
        if (targetIndex === -1) {
          fetchConversations();
          return prev;
        }

        const targetConv = prev[targetIndex];
        const isCurrentActive = activeConversationId === conversationId;

        // De-duplicate if optimistic or existing message exists
        const existingMessages = targetConv.messages || [];
        const alreadyExists = existingMessages.some(
          (m) =>
            m.id === formattedMsg.id ||
            m._id === formattedMsg._id ||
            (m.content === formattedMsg.content && m.isCurrentUser && formattedMsg.isCurrentUser)
        );

        let updatedMessages;
        if (alreadyExists) {
          updatedMessages = existingMessages.map((m) =>
            m.id === formattedMsg.id || m._id === formattedMsg._id
              ? formattedMsg
              : m.content === formattedMsg.content && m.isCurrentUser
              ? formattedMsg
              : m
          );
        } else {
          updatedMessages = [...existingMessages, formattedMsg];
        }

        const updatedConv = {
          ...targetConv,
          lastMessage: formattedMsg.content,
          lastMessageAt: formattedMsg.createdAt || 'Just now',
          unreadCount: isCurrentActive ? 0 : (targetConv.unreadCount || 0) + 1,
          messages: updatedMessages,
        };

        // Move active conversation to top of list
        const others = prev.filter((c) => c.id !== conversationId);
        return [updatedConv, ...others];
      });

      // If active conversation received message from other peer, mark read immediately
      if (activeConversationId === conversationId && !formattedMsg.isCurrentUser) {
        socket.emit('conversation:read', { conversationId });
        messageApi.markAsRead(conversationId).catch(() => {});
      }
    };

    // Conversation preview updated event
    const handleConversationUpdated = (payload) => {
      const { conversationId, lastMessage } = payload || {};
      if (!conversationId || !lastMessage) return;

      setConversations((prev) => {
        const target = prev.find((c) => c.id === conversationId);
        if (!target) return prev;
        const updated = {
          ...target,
          lastMessage,
          lastMessageAt: 'Just now',
        };
        return [updated, ...prev.filter((c) => c.id !== conversationId)];
      });
    };

    // Message read receipt event
    const handleMessageRead = (payload) => {
      const { conversationId, userId } = payload || {};
      if (!conversationId || !userId) return;

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId && c.messages) {
            const updated = c.messages.map((m) => {
              const readList = Array.isArray(m.readBy) ? m.readBy : [];
              const isAlreadyRead = readList.some(
                (r) => (r.user?._id || r.user)?.toString() === userId
              );
              if (!isAlreadyRead) {
                return {
                  ...m,
                  readBy: [...readList, { user: userId, readAt: new Date() }],
                  isRead: true,
                };
              }
              return m;
            });
            return { ...c, messages: updated };
          }
          return c;
        })
      );
    };

    socket.on('message:new', handleNewMessage);
    socket.on('conversation:updated', handleConversationUpdated);
    socket.on('message:read', handleMessageRead);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('conversation:updated', handleConversationUpdated);
      socket.off('message:read', handleMessageRead);
    };
  }, [activeConversationId, currentUserId, fetchConversations]);

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
          c._id === targetId ||
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
    return (
      conversations.find((c) => c.id === activeConversationId || c._id === activeConversationId) ||
      null
    );
  }, [conversations, activeConversationId]);

  // Handle switching active conversation
  const handleSelectConversation = (convId) => {
    setActiveConversationId(convId);
    setMobileView('chat');
    setActiveRightTab('overview');
  };

  /**
   * Handle sending a new message with Socket.io & REST fallback
   */
  const handleSendMessage = async (text, attachment = null) => {
    if (!activeConversation || !text?.trim()) return;

    const trimmedText = text.trim();
    const tempId = `temp-${Date.now()}`;
    const targetConvId = activeConversation.id || activeConversation._id;

    // Optimistic message object for immediate UI responsiveness
    const optimisticMsg = {
      id: tempId,
      _id: tempId,
      conversationId: targetConvId,
      senderId: currentUserId || 'current',
      senderName: currentUser.name || 'You',
      senderInitials: currentUser.initials || 'U',
      senderDepartment: currentUser.department || '',
      content: trimmedText,
      createdAt: 'Just now',
      type: attachment ? 'file' : 'text',
      attachment: attachment || undefined,
      isCurrentUser: true,
      readBy: [],
    };

    // Update conversation feed optimistically
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === targetConvId) {
          return {
            ...c,
            lastMessage: trimmedText,
            lastMessageAt: 'Just now',
            unreadCount: 0,
            messages: [...(c.messages || []), optimisticMsg],
          };
        }
        return c;
      })
    );

    const socket = getSocket();
    const isSocketReady = socket && socket.connected;

    if (isSocketReady) {
      // Primary: Broadcast through authenticated Socket.io connection
      socket.emit('message:send', {
        conversationId: targetConvId,
        content: trimmedText,
      });
    } else {
      // Secondary: REST fallback endpoint
      try {
        const res = await messageApi.sendMessage(targetConvId, trimmedText);
        const savedMessage = res.data?.data?.message;

        if (savedMessage) {
          const finalMsg = {
            ...savedMessage,
            isCurrentUser: true,
          };

          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === targetConvId) {
                const cleaned = (c.messages || []).filter(
                  (m) => m.id !== tempId && m.id !== finalMsg.id
                );
                return {
                  ...c,
                  messages: [...cleaned, finalMsg],
                };
              }
              return c;
            })
          );
        }
      } catch (err) {
        console.warn('REST fallback message delivery failed:', err);
        showToast('Message could not be delivered. Please check connection.');
      }
    }
  };

  // Handle file download
  const handleDownloadFile = (file) => {
    showToast(`Downloading ${file.name}...`);
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

  /**
   * Handle creating or reusing a conversation/workspace
   */
  const handleCreateConversation = async (data) => {
    if (data.type === 'direct' && data.recipientId) {
      try {
        const res = await messageApi.createDirectConversation(data.recipientId);
        const conv = res.data?.data?.conversation;

        if (conv) {
          setConversations((prev) => {
            const exists = prev.find((c) => c.id === conv.id || c._id === conv._id);
            if (exists) return prev;
            return [conv, ...prev];
          });
          setActiveConversationId(conv.id || conv._id);
          setMobileView('chat');
          showToast(`Direct message with ${conv.name} opened.`);
          return;
        }
      } catch (err) {
        console.error('Failed to create direct conversation:', err);
        showToast('Could not start direct conversation.');
      }
    }

    // Local / Group / Project workspace creation fallback
    setConversations((prev) => [data, ...prev]);
    setActiveConversationId(data.id);
    setMobileView('chat');
    showToast(`${data.name} created successfully!`);
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
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesLastMsg = c.lastMessage?.toLowerCase().includes(q);
        const matchesMember = c.members?.some((m) => m.name?.toLowerCase().includes(q));
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
              showToast('File uploads and cloud attachments are coming soon in Phase 9.')
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
                          <span className="conv-filter-chip">DBMS</span>
                          <span className="conv-filter-chip">System Design</span>
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
