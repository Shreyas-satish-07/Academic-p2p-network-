import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, FolderGit2, Check, AlertCircle } from 'lucide-react';
import { AVAILABLE_PEERS, CURRENT_USER } from '../messagesData';

/**
 * CreateConversationModal component
 * Accessible modal enabling students to start a new Direct Message,
 * Study Group Workspace, or Project Collaboration Workspace.
 */
export const CreateConversationModal = ({
  isOpen,
  onClose,
  onCreateConversation,
}) => {
  const [convType, setConvType] = useState('direct'); // 'direct' | 'study-group' | 'project'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState(new Set());
  const [error, setError] = useState('');
  const [peerSearch, setPeerSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleMemberSelection = (peerId) => {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(peerId)) {
        next.delete(peerId);
      } else {
        next.add(peerId);
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (convType === 'direct') {
      if (!selectedPeer) {
        setError('Please select a student peer to message.');
        return;
      }

      const newDirectConv = {
        id: `conv-direct-${Date.now()}`,
        type: 'direct',
        name: selectedPeer.name,
        initials: selectedPeer.initials,
        avatarColor: selectedPeer.avatarColor,
        avatarBg: selectedPeer.avatarBg,
        isOnline: selectedPeer.status === 'online',
        unreadCount: 0,
        lastMessage: 'Conversation started.',
        lastMessageAt: 'Just now',
        memberCount: 2,
        members: [CURRENT_USER, selectedPeer],
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: CURRENT_USER.id,
            senderName: CURRENT_USER.name,
            senderInitials: CURRENT_USER.initials,
            content: `Started direct conversation with ${selectedPeer.name}.`,
            createdAt: 'Just now',
            type: 'system',
            isCurrentUser: true,
          },
        ],
        files: [],
        activity: [],
      };

      onCreateConversation(newDirectConv);
      onClose();
      return;
    }

    // Group or Project Workspace
    if (!title.trim()) {
      setError(`Please provide a ${convType === 'project' ? 'project' : 'study group'} title.`);
      return;
    }

    const initials = title
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');

    const initialMembers = [
      { ...CURRENT_USER, role: 'Owner' },
      ...AVAILABLE_PEERS.filter((p) => selectedMemberIds.has(p.id)),
    ];

    const newWorkspaceConv = {
      id: `workspace-${Date.now()}`,
      type: convType,
      name: title.trim(),
      initials: initials || (convType === 'project' ? 'PW' : 'SG'),
      avatarColor: '#ffffff',
      avatarBg: convType === 'project' ? 'var(--pine, #2f5d50)' : 'var(--marigold, #d97706)',
      isOnline: true,
      unreadCount: 0,
      lastMessage: 'Workspace created.',
      lastMessageAt: 'Just now',
      memberCount: initialMembers.length,
      members: initialMembers,
      description: description.trim() || undefined,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: CURRENT_USER.id,
          senderName: CURRENT_USER.name,
          senderInitials: CURRENT_USER.initials,
          content: `Welcome to the ${title.trim()} workspace! You can collaborate on tasks, share notes, and message here.`,
          createdAt: 'Just now',
          type: 'text',
          isCurrentUser: true,
        },
      ],
      files: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          text: `${CURRENT_USER.name} created the ${title.trim()} workspace`,
          time: 'Just now',
          type: 'member',
        },
      ],
    };

    onCreateConversation(newWorkspaceConv);
    onClose();
  };

  const filteredPeers = AVAILABLE_PEERS.filter(
    (p) =>
      p.name.toLowerCase().includes(peerSearch.toLowerCase()) ||
      p.department.toLowerCase().includes(peerSearch.toLowerCase())
  );

  return (
    <div
      className="msg-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-conv-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="msg-modal-card">
        <div className="msg-modal-header">
          <h2 id="new-conv-modal-title" className="msg-modal-title">
            New Conversation or Workspace
          </h2>
          <button
            type="button"
            className="msg-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="msg-modal-body">
          {/* Conversation Type Picker */}
          <div className="msg-form-group">
            <span className="msg-form-label">Collaboration Type</span>
            <div className="msg-type-selector" role="radiogroup" aria-label="Collaboration Type">
              <button
                type="button"
                className={`msg-type-option-btn ${convType === 'direct' ? 'active' : ''}`}
                onClick={() => {
                  setConvType('direct');
                  setError('');
                }}
                role="radio"
                aria-checked={convType === 'direct'}
              >
                <User size={16} aria-hidden="true" />
                <span>Direct Message</span>
              </button>

              <button
                type="button"
                className={`msg-type-option-btn ${convType === 'study-group' ? 'active' : ''}`}
                onClick={() => {
                  setConvType('study-group');
                  setError('');
                }}
                role="radio"
                aria-checked={convType === 'study-group'}
              >
                <BookOpen size={16} aria-hidden="true" />
                <span>Study Group</span>
              </button>

              <button
                type="button"
                className={`msg-type-option-btn ${convType === 'project' ? 'active' : ''}`}
                onClick={() => {
                  setConvType('project');
                  setError('');
                }}
                role="radio"
                aria-checked={convType === 'project'}
              >
                <FolderGit2 size={16} aria-hidden="true" />
                <span>Project Team</span>
              </button>
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontSize: '12px' }}>
              <AlertCircle size={14} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Conditional Form Fields */}
          {convType === 'direct' ? (
            <div className="msg-form-group">
              <label htmlFor="peer-search-input" className="msg-form-label">
                Select Peer
              </label>
              <input
                id="peer-search-input"
                type="text"
                className="msg-form-input"
                placeholder="Search peers by name or branch..."
                value={peerSearch}
                onChange={(e) => setPeerSearch(e.target.value)}
              />

              <div className="peer-pick-list" role="listbox" style={{ marginTop: '6px' }}>
                {filteredPeers.map((peer) => {
                  const isSelected = selectedPeer?.id === peer.id;
                  return (
                    <button
                      key={peer.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`peer-pick-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedPeer(peer);
                        setError('');
                      }}
                      style={{ width: '100%', textAlign: 'left', border: 'none' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          className="member-avatar"
                          style={{
                            backgroundColor: peer.avatarBg,
                            color: peer.avatarColor,
                            width: '28px',
                            height: '28px',
                            fontSize: '11px',
                          }}
                        >
                          {peer.initials}
                        </div>
                        <div>
                          <span style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', color: 'var(--ink)' }}>
                            {peer.name}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
                            {peer.department} • {peer.semester}
                          </span>
                        </div>
                      </div>

                      {isSelected && <Check size={14} className="text-pine" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              {/* Workspace Title */}
              <div className="msg-form-group">
                <label htmlFor="workspace-title-input" className="msg-form-label">
                  {convType === 'project' ? 'Project Name' : 'Study Group Name'} *
                </label>
                <input
                  id="workspace-title-input"
                  type="text"
                  className="msg-form-input"
                  placeholder={
                    convType === 'project'
                      ? 'e.g. Distributed Key-Value Store'
                      : 'e.g. Computer Architecture Circle'
                  }
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>

              {/* Workspace Description */}
              <div className="msg-form-group">
                <label htmlFor="workspace-desc-input" className="msg-form-label">
                  Goal & Description
                </label>
                <textarea
                  id="workspace-desc-input"
                  rows={2}
                  className="msg-form-textarea"
                  placeholder="Summarize project objectives or study topics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Initial Members Selection */}
              <div className="msg-form-group">
                <span className="msg-form-label">Select Initial Teammates (Optional)</span>
                <div className="peer-pick-list" role="group">
                  {AVAILABLE_PEERS.map((peer) => {
                    const isChecked = selectedMemberIds.has(peer.id);
                    return (
                      <button
                        key={peer.id}
                        type="button"
                        className={`peer-pick-row ${isChecked ? 'selected' : ''}`}
                        onClick={() => toggleMemberSelection(peer.id)}
                        style={{ width: '100%', textAlign: 'left', border: 'none' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            className="member-avatar"
                            style={{
                              backgroundColor: peer.avatarBg,
                              color: peer.avatarColor,
                              width: '28px',
                              height: '28px',
                              fontSize: '11px',
                            }}
                          >
                            {peer.initials}
                          </div>
                          <div>
                            <span style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', color: 'var(--ink)' }}>
                              {peer.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
                              {peer.department}
                            </span>
                          </div>
                        </div>

                        {isChecked && <Check size={14} className="text-pine" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="conv-filter-chip"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="conv-new-btn">
              {convType === 'direct' ? 'Start Direct Chat' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateConversationModal;
