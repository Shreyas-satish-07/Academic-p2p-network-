import React, { useState } from 'react';
import { UserPlus, Search, Check, X } from 'lucide-react';
import { AVAILABLE_PEERS } from '../messagesData';

/**
 * MembersPanel component
 * Renders workspace member roster with role badges, online status indicators,
 * and a modal to search and invite additional peers to the workspace.
 */
export const MembersPanel = ({
  members = [],
  conversationType = 'project',
  onAddMember,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [peerSearchQuery, setPeerSearchQuery] = useState('');
  const [selectedPeer, setSelectedPeer] = useState(null);

  // Filter peers not already in workspace
  const currentMemberIds = new Set(members.map((m) => m.id));
  const availableToAdd = AVAILABLE_PEERS.filter(
    (p) =>
      !currentMemberIds.has(p.id) &&
      (p.name.toLowerCase().includes(peerSearchQuery.toLowerCase()) ||
        p.department.toLowerCase().includes(peerSearchQuery.toLowerCase()))
  );

  const handleConfirmAdd = () => {
    if (!selectedPeer) return;
    onAddMember(selectedPeer);
    setSelectedPeer(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="members-list" role="region" aria-label="Workspace member list">
      {/* Add Member CTA for Project/Group */}
      {conversationType !== 'direct' && (
        <button
          type="button"
          className="add-member-trigger-btn"
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Add a member to this workspace"
        >
          <UserPlus size={14} aria-hidden="true" />
          <span>Add Member</span>
        </button>
      )}

      {/* Member Roster */}
      {members.map((member) => (
        <div key={member.id} className="member-row">
          <div
            className="member-avatar"
            style={{
              backgroundColor: member.avatarBg || 'var(--pine-tint, rgba(47, 93, 80, 0.12))',
              color: member.avatarColor || 'var(--pine, #2f5d50)',
            }}
            aria-hidden="true"
          >
            {member.initials}
          </div>

          <div className="member-info">
            <span className="member-name">{member.name}</span>
            <div className="member-sub">
              <span
                className={`member-status-indicator ${member.status || 'offline'}`}
                title={`Status: ${member.status || 'offline'}`}
              />
              <span>{member.department || 'Student'}</span>
            </div>
          </div>

          {member.role && (
            <span className={`member-role-badge ${member.role.toLowerCase()}`}>
              {member.role}
            </span>
          )}
        </div>
      ))}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div
          className="msg-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-member-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div className="msg-modal-card">
            <div className="msg-modal-header">
              <h3 id="add-member-title" className="msg-modal-title">
                Add Member to Workspace
              </h3>
              <button
                type="button"
                className="msg-modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
                aria-label="Close add member modal"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="msg-modal-body">
              <div className="conv-search-box">
                <Search size={14} className="conv-search-icon" aria-hidden="true" />
                <input
                  type="text"
                  className="conv-search-input"
                  placeholder="Search available peers by name or branch..."
                  value={peerSearchQuery}
                  onChange={(e) => setPeerSearchQuery(e.target.value)}
                  aria-label="Search peers to add"
                />
              </div>

              <div className="peer-pick-list" role="listbox" aria-label="Available peers">
                {availableToAdd.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--ink-soft)', fontSize: '12px' }}>
                    No matching peers found.
                  </div>
                ) : (
                  availableToAdd.map((peer) => {
                    const isSelected = selectedPeer?.id === peer.id;
                    return (
                      <button
                        key={peer.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={`peer-pick-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedPeer(peer)}
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
                              fontSize: '10.5px',
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
                  })
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="conv-filter-chip"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="conv-new-btn"
                  disabled={!selectedPeer}
                  onClick={handleConfirmAdd}
                >
                  Confirm Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPanel;
