import React from 'react';
import {
  Globe,
  Brain,
  Smartphone,
  Cpu,
  FlaskConical,
  FolderGit2,
  Calendar,
  Send,
  MessageSquare,
  UserCheck,
  Eye,
} from 'lucide-react';

/**
 * Returns an appropriate Lucide icon for project category
 */
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Web Development':
      return <Globe size={13} aria-hidden="true" />;
    case 'AI/ML':
      return <Brain size={13} aria-hidden="true" />;
    case 'Mobile App':
      return <Smartphone size={13} aria-hidden="true" />;
    case 'IoT':
      return <Cpu size={13} aria-hidden="true" />;
    case 'Research':
      return <FlaskConical size={13} aria-hidden="true" />;
    default:
      return <FolderGit2 size={13} aria-hidden="true" />;
  }
};

/**
 * ProjectCard component
 * Displays high-level project summary, tech stack, team avatars, progress, and join/view actions.
 */
export const ProjectCard = ({
  project,
  onViewDetails,
  onRequestJoin,
  onOpenWorkspace,
}) => {
  const isJoined = project.recruitmentStatus === 'joined';
  const isRequestSent = project.recruitmentStatus === 'request-sent';
  const isOpen = project.recruitmentStatus === 'open';
  const isClosed = project.recruitmentStatus === 'closed';

  return (
    <article className="proj-card" aria-label={`Project: ${project.title}`}>
      <div className="proj-card-top">
        {/* Category & Status Header */}
        <div className="proj-card-header">
          <span className="proj-category-badge">
            {getCategoryIcon(project.category)}
            <span>{project.category}</span>
          </span>

          <span className={`proj-status-pill ${project.status}`}>
            {project.status}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-desc">{project.description}</p>

        {/* Tech stack chips */}
        <div className="proj-card-chips" aria-label="Technologies used">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="proj-chip">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="proj-chip" style={{ color: 'var(--ink-faint)' }}>
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Required skills */}
        {project.requiredSkills && project.requiredSkills.length > 0 && (
          <div className="proj-card-skills-block">
            <span className="proj-card-skills-label">Seeking Skills</span>
            <div className="proj-card-chips">
              {project.requiredSkills.slice(0, 3).map((skill) => (
                <span key={skill} className="proj-chip required">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="proj-card-bottom">
        {/* Progress Bar */}
        <div className="proj-progress-block">
          <div className="proj-progress-label-row">
            <span style={{ fontSize: '11.5px', color: 'var(--ink-soft)' }}>Progress</span>
            <span style={{ fontSize: '11.5px', color: 'var(--pine)', fontWeight: 700 }}>
              {project.progress}%
            </span>
          </div>
          <div className="proj-progress-track">
            <div className="proj-progress-fill" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        {/* Team Avatars & Member Capacity */}
        <div className="proj-card-team-row">
          <div className="proj-avatar-stack">
            {project.members.slice(0, 4).map((m) => (
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

          <span className="proj-member-count">
            {project.members.length} / {project.maxMembers} Members
          </span>
        </div>

        {/* Deadline & Meta */}
        <div className="proj-card-meta-row">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} className="text-marigold" aria-hidden="true" />
            {project.deadline}
          </span>

          <span style={{ fontSize: '11px', textTransform: 'capitalize' }}>
            By <strong>{project.ownerInitials}</strong>
          </span>
        </div>

        {/* Footer Actions */}
        <div className="proj-card-actions">
          <button
            type="button"
            className="proj-card-btn details"
            onClick={() => onViewDetails(project)}
            aria-label={`View details for ${project.title}`}
          >
            <Eye size={13} aria-hidden="true" />
            <span>Details</span>
          </button>

          {isOpen && (
            <button
              type="button"
              className="proj-card-btn join-open"
              onClick={() => onRequestJoin(project)}
              aria-label={`Request to join ${project.title}`}
            >
              <Send size={12} aria-hidden="true" />
              <span>Join</span>
            </button>
          )}

          {isRequestSent && (
            <button
              type="button"
              className="proj-card-btn join-sent"
              disabled
              aria-label={`Request pending for ${project.title}`}
            >
              <UserCheck size={12} aria-hidden="true" />
              <span>Pending</span>
            </button>
          )}

          {isJoined && (
            <button
              type="button"
              className="proj-card-btn join-joined"
              onClick={() => onOpenWorkspace(project)}
              aria-label={`Open workspace for ${project.title}`}
            >
              <MessageSquare size={12} aria-hidden="true" />
              <span>Workspace</span>
            </button>
          )}

          {isClosed && (
            <button
              type="button"
              className="proj-card-btn join-closed"
              disabled
              aria-label={`Team full for ${project.title}`}
            >
              <span>Full</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
