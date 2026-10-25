import React from 'react';
import { Star, Calendar, CheckSquare, ArrowRight, ExternalLink, Activity, Users } from 'lucide-react';

/**
 * FeaturedProject component
 * Spotlights the flagship "Academic Peer-to-Peer Network" project with progress, tasks, and direct actions.
 */
export const FeaturedProject = ({
  project,
  onOpenDetails,
  onOpenTasks,
  onOpenWorkspace,
}) => {
  if (!project) return null;

  const completedCount = project.tasks
    ? project.tasks.filter((t) => t.status === 'completed').length
    : 0;
  const totalTasks = project.tasks ? project.tasks.length : 0;
  const latestActivity = project.activity && project.activity.length > 0 ? project.activity[0] : null;

  return (
    <section className="proj-featured-card" aria-label="Featured Project Spotlight">
      <div className="proj-featured-top-row">
        <span className="proj-featured-tag">
          <Star size={13} fill="currentColor" aria-hidden="true" />
          Featured Academic Project
        </span>

        <span className="proj-chip" style={{ background: 'var(--paper)', fontWeight: 600 }}>
          Lead: {project.owner} ({project.ownerInitials})
        </span>
      </div>

      <div className="proj-featured-content">
        <div className="proj-featured-main-info">
          <h2 className="proj-featured-title">{project.title}</h2>
          <p className="proj-featured-desc">{project.description}</p>

          <div className="proj-featured-chips" aria-label="Project technologies">
            {project.technologies.map((tech) => (
              <span key={tech} className="proj-chip">
                {tech}
              </span>
            ))}
          </div>

          <div className="proj-featured-chips" style={{ marginTop: '2px' }} aria-label="Required skills">
            <span style={{ fontSize: '11px', color: 'var(--ink-faint)', alignSelf: 'center', fontWeight: 600 }}>
              NEEDED:
            </span>
            {project.requiredSkills.map((skill) => (
              <span key={skill} className="proj-chip required">
                {skill}
              </span>
            ))}
          </div>

          {latestActivity && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--ink-soft)',
                marginTop: '6px',
                padding: '6px 10px',
                background: 'var(--paper)',
                borderRadius: '8px',
                border: '1px solid var(--line)',
              }}
            >
              <Activity size={13} className="text-pine flex-shrink-0" aria-hidden="true" />
              <span>
                <strong>{latestActivity.user}</strong> {latestActivity.action} ({latestActivity.time})
              </span>
            </div>
          )}
        </div>

        <div className="proj-featured-metrics-box">
          <div className="proj-progress-block">
            <div className="proj-progress-label-row">
              <span>Overall Progress</span>
              <span style={{ color: 'var(--pine)', fontWeight: 700 }}>{project.progress}%</span>
            </div>
            <div className="proj-progress-track" role="progressbar" aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">
              <div className="proj-progress-fill" style={{ width: `${project.progress}%` }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={14} className="text-pine" aria-hidden="true" />
                Tasks:
              </span>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>
                {completedCount} of {totalTasks} Completed
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} className="text-marigold" aria-hidden="true" />
                Deadline:
              </span>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{project.deadline}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <span style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} className="text-pine" aria-hidden="true" />
                Team Capacity:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div className="proj-avatar-stack">
                  {project.members.map((m) => (
                    <div
                      key={m.id}
                      className="proj-avatar-circle"
                      style={{ background: m.avatarBg || 'var(--pine)' }}
                      title={`${m.name} (${m.role})`}
                    >
                      {m.initials}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: '11.5px', fontWeight: 600 }}>
                  {project.members.length}/{project.maxMembers}
                </span>
              </div>
            </div>
          </div>

          <div className="proj-featured-actions">
            <button
              type="button"
              className="proj-btn proj-btn-primary"
              onClick={() => onOpenWorkspace(project)}
              title="Open collaboration workspace chat and files"
            >
              <ExternalLink size={13} aria-hidden="true" />
              <span>View Workspace</span>
            </button>

            <button
              type="button"
              className="proj-btn proj-btn-outline"
              onClick={() => onOpenTasks(project)}
              title="View and update Kanban tasks"
            >
              <CheckSquare size={13} aria-hidden="true" />
              <span>View Tasks</span>
            </button>

            <button
              type="button"
              className="proj-btn proj-btn-secondary"
              onClick={() => onOpenDetails(project)}
              title="View full project details"
            >
              <span>Project Details</span>
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
