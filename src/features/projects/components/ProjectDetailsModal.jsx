import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Layers,
  Users,
  Activity as ActivityIcon,
  CheckSquare,
  UserCheck,
  Send,
  MessageSquare,
} from 'lucide-react';
import TaskBoard from './TaskBoard';

/**
 * ProjectDetailsModal component
 * Accessible, comprehensive modal for project inspection.
 * Includes Overview, Tasks (Kanban board), Members, and Activity timeline tabs.
 */
export const ProjectDetailsModal = ({
  project,
  isOpen,
  initialTab = 'overview',
  onClose,
  onTaskStatusChange,
  onRequestJoin,
  onOpenWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const completedCount = project.tasks
    ? project.tasks.filter((t) => t.status === 'completed').length
    : 0;
  const totalTasks = project.tasks ? project.tasks.length : 0;

  return (
    <div
      className="proj-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proj-modal-heading"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="proj-modal-container">
        {/* Header */}
        <div className="proj-modal-header">
          <div className="proj-modal-title-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="proj-category-badge">{project.category}</span>
              <span className={`proj-status-pill ${project.status}`}>{project.status}</span>
              <span className="proj-chip" style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                Recruitment: {project.recruitmentStatus.replace('-', ' ')}
              </span>
            </div>
            <h2 id="proj-modal-heading" className="proj-modal-title">
              {project.title}
            </h2>
            <div className="proj-modal-meta-row">
              <span>
                Owner: <strong>{project.owner}</strong>
              </span>
              <span>•</span>
              <span>
                Deadline: <strong>{project.deadline}</strong>
              </span>
              <span>•</span>
              <span>
                Team: <strong>{project.members.length} / {project.maxMembers}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="proj-modal-close-btn"
            onClick={onClose}
            aria-label="Close project details modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="proj-modal-tabs" role="tablist" aria-label="Project detail sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`proj-modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={15} aria-hidden="true" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tasks'}
            className={`proj-modal-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <CheckSquare size={15} aria-hidden="true" />
            <span>Tasks ({totalTasks})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'members'}
            className={`proj-modal-tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={15} aria-hidden="true" />
            <span>Members ({project.members.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'activity'}
            className={`proj-modal-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <ActivityIcon size={15} aria-hidden="true" />
            <span>Activity ({project.activity ? project.activity.length : 0})</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="proj-modal-body">
          {/* A. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <>
              <div className="proj-modal-section">
                <h3 className="proj-modal-section-title">About the Project</h3>
                <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: '1.6', margin: 0 }}>
                  {project.description}
                </p>
              </div>

              <div className="proj-modal-section">
                <h3 className="proj-modal-section-title">Technologies</h3>
                <div className="proj-featured-chips">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="proj-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="proj-modal-section">
                <h3 className="proj-modal-section-title">Required Skills</h3>
                <div className="proj-featured-chips">
                  {project.requiredSkills.map((skill) => (
                    <span key={skill} className="proj-chip required">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="proj-modal-section">
                <h3 className="proj-modal-section-title">Progress & Milestones</h3>
                <div className="proj-progress-block">
                  <div className="proj-progress-label-row">
                    <span>
                      {completedCount} of {totalTasks} Tasks Completed
                    </span>
                    <span style={{ color: 'var(--pine)', fontWeight: 700 }}>{project.progress}%</span>
                  </div>
                  <div className="proj-progress-track">
                    <div className="proj-progress-fill" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="proj-modal-section">
                  <h3 className="proj-modal-section-title">Project Tags</h3>
                  <div className="proj-featured-chips">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="proj-chip"
                        style={{ fontSize: '11px', background: 'var(--paper)', color: 'var(--ink-soft)' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* B. TASKS TAB (KANBAN BOARD) */}
          {activeTab === 'tasks' && (
            <div className="proj-modal-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 className="proj-modal-section-title">Kanban Task Board</h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                  Overall completion: <strong>{project.progress}%</strong>
                </span>
              </div>
              <TaskBoard
                tasks={project.tasks || []}
                onTaskStatusChange={(taskId, newStatus) =>
                  onTaskStatusChange(project.id, taskId, newStatus)
                }
              />
            </div>
          )}

          {/* C. MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="proj-modal-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 className="proj-modal-section-title">Team Roster</h3>
                <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                  Capacity: {project.members.length} / {project.maxMembers}
                </span>
              </div>
              <div className="proj-members-grid">
                {project.members.map((member) => (
                  <div key={member.id} className="proj-member-card">
                    <div
                      className="proj-member-avatar"
                      style={{ background: member.avatarBg || 'var(--pine)' }}
                    >
                      {member.initials}
                    </div>
                    <div className="proj-member-info">
                      <span className="proj-member-name">{member.name}</span>
                      <span className="proj-member-role">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D. ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="proj-modal-section">
              <h3 className="proj-modal-section-title">Recent Project Updates</h3>
              <div className="proj-activity-list">
                {!project.activity || project.activity.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                    No recent activity recorded.
                  </p>
                ) : (
                  project.activity.map((act) => (
                    <div key={act.id} className="proj-activity-item">
                      <div className="proj-activity-avatar">
                        {act.user
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="proj-activity-content">
                        <span className="proj-activity-text">
                          <strong className="proj-activity-user">{act.user}</strong> {act.action}
                        </span>
                        <span className="proj-activity-time">{act.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="proj-modal-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--ink-soft)' }}>
            <Calendar size={14} className="text-marigold" aria-hidden="true" />
            <span>Target Deadline: {project.deadline}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button" className="proj-btn proj-btn-outline" onClick={onClose}>
              Close
            </button>

            {project.recruitmentStatus === 'open' && (
              <button
                type="button"
                className="proj-btn proj-btn-primary"
                onClick={() => onRequestJoin(project)}
              >
                <Send size={13} aria-hidden="true" />
                <span>Request to Join</span>
              </button>
            )}

            {project.recruitmentStatus === 'request-sent' && (
              <button
                type="button"
                className="proj-btn"
                style={{
                  background: 'rgba(217, 119, 6, 0.12)',
                  color: 'var(--marigold)',
                  borderColor: 'rgba(217, 119, 6, 0.3)',
                }}
                disabled
              >
                <UserCheck size={13} aria-hidden="true" />
                <span>Request Pending</span>
              </button>
            )}

            {project.recruitmentStatus === 'joined' && (
              <button
                type="button"
                className="proj-btn proj-btn-primary"
                onClick={() => onOpenWorkspace(project)}
              >
                <MessageSquare size={13} aria-hidden="true" />
                <span>Open Workspace</span>
              </button>
            )}

            {project.recruitmentStatus === 'closed' && (
              <button
                type="button"
                className="proj-btn"
                style={{ background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }}
                disabled
              >
                Team Full
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
