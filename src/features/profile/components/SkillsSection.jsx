import React from 'react';
import { Code2, Plus, Sparkles } from 'lucide-react';

/**
 * SkillsSection component
 * Displays categorized technical competencies (Frontend, Backend, Database, Tools, Learning, Custom)
 * with visual badges and an "Add skill" action.
 */
export const SkillsSection = ({ profile, onAddSkillClick }) => {
  const { skillCategories, skills = [] } = profile;

  // Build categorizations including dynamic user-added skills
  let categories = skillCategories;
  if (!categories) {
    const knownSet = new Set();
    const frontend = skills.filter((s) =>
      ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Vue', 'Angular', 'Next.js', 'TypeScript'].includes(s)
    );
    frontend.forEach((s) => knownSet.add(s));

    const backend = skills.filter((s) =>
      ['Node.js', 'Express.js', 'Python', 'Java', 'Go', 'Rust', 'Django', 'Flask', 'C++', 'C#'].includes(s)
    );
    backend.forEach((s) => knownSet.add(s));

    const database = skills.filter((s) =>
      ['MongoDB', 'PostgreSQL', 'SQL', 'MySQL', 'Redis', 'Firebase'].includes(s)
    );
    database.forEach((s) => knownSet.add(s));

    const tools = skills.filter((s) =>
      ['Git', 'Docker', 'Linux', 'AWS', 'Kubernetes', 'CI/CD'].includes(s)
    );
    tools.forEach((s) => knownSet.add(s));

    const learning = skills.filter((s) =>
      ['Data Structures and Algorithms', 'Machine Learning', 'AI', 'System Design'].includes(s)
    );
    learning.forEach((s) => knownSet.add(s));

    const custom = skills.filter((s) => !knownSet.has(s));

    categories = {
      frontend,
      backend,
      database,
      tools,
      learning,
      custom,
    };
  }

  const categoryLabels = [
    { key: 'frontend', title: 'Frontend' },
    { key: 'backend', title: 'Backend' },
    { key: 'database', title: 'Database' },
    { key: 'tools', title: 'Tools & DevOps' },
    { key: 'learning', title: 'Currently Learning' },
    { key: 'custom', title: 'Specialized & Additional Skills' },
  ];

  const hasSkills = skills.length > 0;

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

      {hasSkills ? (
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
      ) : (
        <div className="about-bio-wrap" style={{ textAlign: 'center', padding: '16px' }}>
          <p className="about-bio-text" style={{ color: 'var(--ink-soft)' }}>
            No technical skills added yet. Click &quot;Add Skill&quot; to showcase your tech stack for peer matching.
          </p>
        </div>
      )}

      {/* Peer match compatibility note */}
      <div className="profile-card-note">
        <Sparkles size={13} className="text-pine flex-shrink-0" aria-hidden="true" />
        <span>Used for peer-match compatibility scoring across hackathons and study circles.</span>
      </div>
    </article>
  );
};

export default SkillsSection;
