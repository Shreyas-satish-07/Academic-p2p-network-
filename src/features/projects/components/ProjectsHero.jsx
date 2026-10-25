import React from 'react';
import { Plus, Sparkles, FolderGit2, Users, Flag } from 'lucide-react';

/**
 * ProjectsHero component
 * Prominent header with title, value proposition, summary metrics, and Create Project CTA.
 */
export const ProjectsHero = ({ onCreateClick }) => {
  return (
    <section className="proj-hero" aria-label="Projects Hub Introduction">
      <div className="proj-hero-accent" aria-hidden="true" />

      <div className="proj-hero-main">
        <div className="proj-hero-title-area">
          <div>
            <h1 className="proj-hero-title">Build meaningful projects together</h1>
            <p className="proj-hero-subtitle">
              Find teammates, turn ideas into working products, and showcase your work across the academic community.
            </p>
          </div>

          <button
            type="button"
            className="proj-hero-create-btn"
            onClick={onCreateClick}
            aria-label="Create a new academic project"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Create Project</span>
          </button>
        </div>

        <div className="proj-hero-badges" role="region" aria-label="Cohort project statistics">
          <div className="proj-hero-badge">
            <span className="proj-hero-badge-dot active" aria-hidden="true" />
            <FolderGit2 size={14} className="text-pine flex-shrink-0" aria-hidden="true" />
            <span>5 active projects</span>
          </div>

          <div className="proj-hero-badge">
            <span className="proj-hero-badge-dot roles" aria-hidden="true" />
            <Users size={14} className="text-marigold flex-shrink-0" aria-hidden="true" />
            <span>12 open roles</span>
          </div>

          <div className="proj-hero-badge">
            <span className="proj-hero-badge-dot milestones" aria-hidden="true" />
            <Flag size={14} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
            <span>3 upcoming milestones</span>
          </div>

          <div className="proj-hero-badge" style={{ marginLeft: 'auto' }}>
            <Sparkles size={14} className="text-marigold flex-shrink-0" aria-hidden="true" />
            <span>MERN Stack Cohort</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsHero;
