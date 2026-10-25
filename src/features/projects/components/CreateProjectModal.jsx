import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../projectsData';

/**
 * CreateProjectModal component
 * Controlled modal for creating and publishing a student academic collaboration project.
 * 
 * Future Backend Architecture:
 * POST /api/projects
 * Body: { title, description, category, technologies, requiredSkills, maxMembers, deadline, tags }
 * Server validates JWT, attaches req.user._id as owner, creates initial todo task, and persists to MongoDB.
 */
export const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    technologies: '',
    requiredSkills: '',
    maxMembers: 4,
    deadline: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Field validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Project title is required.';
    if (!formData.description.trim()) newErrors.description = 'Project description is required.';
    if (!formData.deadline.trim()) newErrors.deadline = 'Target deadline is required.';
    if (formData.maxMembers < 2 || formData.maxMembers > 10) {
      newErrors.maxMembers = 'Team size must be between 2 and 10.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const techList = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const skillsList = formData.requiredSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const tagList = formData.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newProjectId = `proj-${Date.now()}`;

    // Structure matching project schema requirements
    const newProject = {
      id: newProjectId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      technologies: techList.length > 0 ? techList : ['JavaScript', 'React'],
      owner: 'Shreyas Rao',
      ownerInitials: 'SR',
      members: [
        {
          id: `m-owner-${Date.now()}`,
          name: 'Shreyas Rao',
          initials: 'SR',
          role: 'Project Creator & Lead',
          avatarBg: 'var(--pine)',
        },
      ],
      maxMembers: Number(formData.maxMembers),
      requiredSkills: skillsList.length > 0 ? skillsList : ['Problem Solving', 'Git'],
      status: 'planning',
      recruitmentStatus: 'open',
      progress: 0,
      deadline: formData.deadline.trim(),
      createdAt: new Date().toISOString(),
      tasks: [
        {
          id: `task-${Date.now()}-1`,
          title: 'Define project tasks, milestones & architecture',
          assigneeInitials: 'SR',
          priority: 'high',
          dueDate: formData.deadline.trim(),
          status: 'todo',
        },
      ],
      activity: [
        {
          id: `act-${Date.now()}-1`,
          user: 'Shreyas Rao',
          action: 'Created the project workspace and published recruitment post',
          time: 'Just now',
        },
      ],
      tags: tagList.length > 0 ? tagList : [formData.category.replace(/\s+/g, '')],
    };

    onCreateProject(newProject);
    onClose();

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'Web Development',
      technologies: '',
      requiredSkills: '',
      maxMembers: 4,
      deadline: '',
      tags: '',
    });
    setErrors({});
  };

  const categories = CATEGORY_OPTIONS.filter((c) => c !== 'All Categories');

  return (
    <div
      className="proj-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-proj-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="proj-form-modal">
        <div className="proj-modal-header">
          <div>
            <h2 id="create-proj-title" className="proj-modal-title">
              Create New Project
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--ink-soft)', margin: '4px 0 0 0' }}>
              Publish your initiative, recruit talented student teammates, and coordinate milestones.
            </p>
          </div>

          <button
            type="button"
            className="proj-modal-close-btn"
            onClick={onClose}
            aria-label="Close create project modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="proj-form-body">
          {/* Project Title */}
          <div className="proj-form-group">
            <label htmlFor="create-proj-title-input" className="proj-form-label">
              Project Title *
            </label>
            <input
              id="create-proj-title-input"
              name="title"
              type="text"
              className="proj-form-input"
              placeholder="e.g. Distributed Course Resource Crawler"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <span className="proj-form-error" role="alert">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="proj-form-group">
            <label htmlFor="create-proj-desc-input" className="proj-form-label">
              Project Description *
            </label>
            <textarea
              id="create-proj-desc-input"
              name="description"
              rows={3}
              className="proj-form-textarea"
              placeholder="Outline what problem this project solves, architecture goals, and what you plan to build..."
              value={formData.description}
              onChange={handleChange}
            />
            {errors.description && (
              <span className="proj-form-error" role="alert">
                <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {errors.description}
              </span>
            )}
          </div>

          {/* Category & Max Team Members */}
          <div className="proj-form-row">
            <div className="proj-form-group">
              <label htmlFor="create-proj-category" className="proj-form-label">
                Category *
              </label>
              <select
                id="create-proj-category"
                name="category"
                className="proj-form-select"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="proj-form-group">
              <label htmlFor="create-proj-team-size" className="proj-form-label">
                Max Team Size (2-10) *
              </label>
              <input
                id="create-proj-team-size"
                name="maxMembers"
                type="number"
                min="2"
                max="10"
                className="proj-form-input"
                value={formData.maxMembers}
                onChange={handleChange}
              />
              {errors.maxMembers && (
                <span className="proj-form-error" role="alert">
                  <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {errors.maxMembers}
                </span>
              )}
            </div>
          </div>

          {/* Technologies & Required Skills */}
          <div className="proj-form-row">
            <div className="proj-form-group">
              <label htmlFor="create-proj-tech" className="proj-form-label">
                Technologies (comma-separated)
              </label>
              <input
                id="create-proj-tech"
                name="technologies"
                type="text"
                className="proj-form-input"
                placeholder="React, Express, MongoDB, Redis"
                value={formData.technologies}
                onChange={handleChange}
              />
            </div>

            <div className="proj-form-group">
              <label htmlFor="create-proj-skills" className="proj-form-label">
                Required Skills (comma-separated)
              </label>
              <input
                id="create-proj-skills"
                name="requiredSkills"
                type="text"
                className="proj-form-input"
                placeholder="Node.js, Docker, UI Design"
                value={formData.requiredSkills}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Deadline & Tags */}
          <div className="proj-form-row">
            <div className="proj-form-group">
              <label htmlFor="create-proj-deadline" className="proj-form-label">
                Target Deadline *
              </label>
              <input
                id="create-proj-deadline"
                name="deadline"
                type="text"
                className="proj-form-input"
                placeholder="e.g. Sep 30, 2026 or Milestone 1: Aug 20"
                value={formData.deadline}
                onChange={handleChange}
              />
              {errors.deadline && (
                <span className="proj-form-error" role="alert">
                  <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {errors.deadline}
                </span>
              )}
            </div>

            <div className="proj-form-group">
              <label htmlFor="create-proj-tags" className="proj-form-label">
                Tags (comma-separated)
              </label>
              <input
                id="create-proj-tags"
                name="tags"
                type="text"
                className="proj-form-input"
                placeholder="Hackathon, Cloud, MERN"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="proj-btn proj-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="proj-btn proj-btn-primary">
              <Plus size={14} aria-hidden="true" />
              <span>Publish Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
