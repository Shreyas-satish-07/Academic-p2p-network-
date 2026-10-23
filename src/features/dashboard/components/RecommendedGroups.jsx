import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, ArrowUpRight, Check, Plus, Calendar } from 'lucide-react';

/**
 * RecommendedGroups component
 * Displays curated study groups tailored to current courses and interests.
 * Supports optimistic local joining with accessible status feedback.
 */
export const RecommendedGroups = ({ groups = [] }) => {
  const [joinedGroupIds, setJoinedGroupIds] = useState(new Set());

  const handleJoinGroup = (groupId) => {
    setJoinedGroupIds((prev) => {
      const next = new Set(prev);
      next.add(groupId);
      return next;
    });
    // Future API call:
    // await api.post(`/study-groups/${groupId}/join`);
  };

  return (
    <article className="dashboard-card" aria-labelledby="recommended-groups-heading">
      <div className="dashboard-card-header">
        <div className="card-title-group">
          <div className="card-icon-badge" aria-hidden="true">
            <UsersRound size={18} />
          </div>
          <div>
            <h2 id="recommended-groups-heading" className="card-title">
              Recommended Study Groups
            </h2>
            <p className="card-subtitle">Active peer circles in your courses</p>
          </div>
        </div>

        <Link
          to="/study-groups"
          className="card-action-link"
          aria-label="View all study groups"
        >
          <span>View all</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="study-groups-grid" role="list">
        {groups.map((group) => {
          const isJoined = joinedGroupIds.has(group.id);

          return (
            <div key={group.id} className="study-group-card" role="listitem">
              <div className="group-card-content">
                <div className="group-domain-pill">{group.domain}</div>
                <h3 className="group-name">{group.name}</h3>

                <div className="group-meta-row">
                  <div className="group-members">
                    <UsersRound size={12} aria-hidden="true" />
                    <span>{group.memberCount} members</span>
                  </div>
                  {group.schedule && (
                    <div className="group-schedule">
                      <Calendar size={12} aria-hidden="true" />
                      <span>{group.schedule}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="group-card-action">
                <button
                  type="button"
                  className={`join-group-btn ${isJoined ? 'joined' : ''}`}
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={isJoined}
                  aria-label={
                    isJoined
                      ? `Joined ${group.name} study group`
                      : `Join ${group.name} study group`
                  }
                >
                  {isJoined ? (
                    <>
                      <Check size={13} aria-hidden="true" />
                      <span>Joined</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} aria-hidden="true" />
                      <span>Join</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
};

export default RecommendedGroups;
