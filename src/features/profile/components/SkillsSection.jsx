import React from 'react';
import { Code2, Plus, Sparkles } from 'lucide-react';

/**
 * SkillsSection component
 * Displays categorized technical competencies (Frontend, Backend, Database, Tools, Learning)
 * with visual badges and an "Add skill" action.
 * Powers peer-match compatibility calculations.
 */
export const SkillsSection = ({ profile, onAddSkillClick }) => {
  const { skillCategories, skills = [] } = profile;

  // Fallback categorization if user modified flattened skills
  const categories = skillCategories || {
    frontend: skills.filter((s) => ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind'].includes(s)),
    backend: skills.filter((s) => ['Node.js', 'Express.js', 'Python', 'Java'].includes(s)),
    database: skills.filter((s) => ['MongoDB', 'PostgreSQL', 'SQL'].includes(s)),
    tools: skills.filter((s) => ['Git', 'Docker', 'Linux'].includes(s)),
    learning: skills.filter((s) => ['Data Structures and Algorithms', 'Machine Learning'].includes(s)),
  };

  const categoryLabels = [
    { key: 'frontend', title: 'Frontend' },
    { key: 'backend', title: 'Backend' },
    { key: 'database', title: 'Database' },
    { key: 'tools', title: 'Tools & DevOps' },
    { key: 'learning', title: 'Currently Learning' },
  ];

  return (
    <article className="profile-card" aria-labelledby="skills-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <Code2 size={18} />
          </div>
          <div>
            <h2 id="skills-heading" className="profile-card-title">
              Technical Skills
            </h2>
            <p className="profile-card-subtitle">Categorized competencies for peer matching</p>
          </div>
        </div>

        <button
          type="button"
          className="profile-card-action-btn"
          onClick={onAddSkillClick}
          aria-label="Add or edit technical skills"
        >
          <Plus size={14} aria-hidden="true" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="skills-categories-list">
        {categoryLabels.map(({ key, title }) => {
          const list = categories[key] || [];
          if (list.length === 0) return null;

          return (
            <div key={key} className="skill-category-block">
              <h3 className="skill-category-title">{title}</h3>
              <div className="skill-chips-wrap">
                {list.map((skill) => (
                  <span key={skill} className="skill-badge-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Peer match compatibility note */}
      <div className="profile-card-note">
        <Sparkles size={13} className="text-pine flex-shrink-0" aria-hidden="true" />
        <span>Used for peer-match compatibility scoring across hackathons and study circles.</span>
      </div>
    </article>
  );
};

export default SkillsSection;
