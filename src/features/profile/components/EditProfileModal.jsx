import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, Code2, Clock, Link as LinkIcon } from 'lucide-react';

/**
 * EditProfileModal component
 * Accessible, responsive modal allowing the student to update their personal bio,
 * academic standing, skills, interests, availability, and social links.
 * 
 * Future Backend Integration:
 * When connected to the Express backend, submitting this form will dispatch:
 * await api.put('/api/users/me', updatedProfilePayload);
 */
export const EditProfileModal = ({ isOpen, onClose, initialData, onSaveProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    department: '',
    semester: '',
    skills: '',
    interests: '',
    weekdays: '',
    weekends: '',
    preferredTeamSize: '',
    github: '',
    linkedin: '',
  });

  // Populate form with current profile data when opening modal
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        bio: initialData.bio || '',
        department: initialData.department || '',
        semester: initialData.semester || '',
        skills: Array.isArray(initialData.skills) ? initialData.skills.join(', ') : '',
        interests: Array.isArray(initialData.interests) ? initialData.interests.join(', ') : '',
        weekdays: initialData.availability?.weekdays || '',
        weekends: initialData.availability?.weekends || '',
        preferredTeamSize: initialData.availability?.preferredTeamSize || '',
        github: initialData.github || '',
        linkedin: initialData.linkedin || '',
      });
    }
  }, [initialData, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse comma-separated skills and interests into arrays
    const parsedSkills = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedInterests = formData.interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const updatedProfile = {
      ...initialData,
      name: formData.name,
      bio: formData.bio,
      department: formData.department,
      semester: formData.semester,
      skills: parsedSkills.length > 0 ? parsedSkills : initialData.skills,
      interests: parsedInterests.length > 0 ? parsedInterests : initialData.interests,
      availability: {
        ...initialData.availability,
        weekdays: formData.weekdays,
        weekends: formData.weekends,
        preferredTeamSize: formData.preferredTeamSize,
      },
      github: formData.github,
      githubHandle: formData.github.replace(/^https?:\/\//, ''),
      linkedin: formData.linkedin,
      linkedinHandle: formData.linkedin.replace(/^https?:\/\//, ''),
    };

    /**
     * Future Backend API Call:
     * try {
     *   const res = await api.put('/api/users/me', updatedProfile);
     *   onSaveProfile(res.data);
     * } catch (error) {
     *   console.error('Failed to update profile:', error);
     * }
     */

    // Apply local update and trigger success toast
    onSaveProfile(updatedProfile);
    onClose();
  };

  return (
    <div
      className="profile-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        className="profile-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-header">
          <div className="modal-title-group">
            <h2 id="edit-profile-title" className="profile-modal-title">
              Edit Student Profile
            </h2>
            <p className="profile-modal-subtitle">
              Updates will immediately reflect in your profile and peer-match visibility
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close edit profile dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-modal-form">
          <div className="profile-modal-scrollable">
            {/* Section 1: Basic Identity */}
            <div className="modal-form-section">
              <div className="modal-section-heading">
                <User size={15} className="text-pine" aria-hidden="true" />
                <span>Basic Details</span>
              </div>

              <div className="form-group">
                <label htmlFor="edit-name" className="form-label">
                  Full Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g. Shreyas Rao"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-bio" className="form-label">
                  Bio / Learning Statement
                </label>
                <textarea
                  id="edit-bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Briefly describe what you enjoy building and what you are learning..."
                />
              </div>
            </div>

            {/* Section 2: Academic Standing */}
            <div className="modal-form-section">
              <div className="modal-section-heading">
                <Building size={15} className="text-pine" aria-hidden="true" />
                <span>Academic Info</span>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="edit-department" className="form-label">
                    Department
                  </label>
                  <input
                    id="edit-department"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. Computer Science and Engineering"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-semester" className="form-label">
                    Current Semester
                  </label>
                  <input
                    id="edit-semester"
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 6th Semester"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Technical Skills & Interests */}
            <div className="modal-form-section">
              <div className="modal-section-heading">
                <Code2 size={15} className="text-pine" aria-hidden="true" />
                <span>Skills & Match Preferences</span>
              </div>

              <div className="form-group">
                <label htmlFor="edit-skills" className="form-label">
                  Technical Skills <span className="label-hint">(comma-separated)</span>
                </label>
                <input
                  id="edit-skills"
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="React, JavaScript, Node.js, MongoDB, Python, Git..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-interests" className="form-label">
                  Collaboration Interests <span className="label-hint">(comma-separated)</span>
                </label>
                <input
                  id="edit-interests"
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Full Stack Development, Machine Learning, Hackathons..."
                />
              </div>
            </div>

            {/* Section 4: Availability & Team Dynamics */}
            <div className="modal-form-section">
              <div className="modal-section-heading">
                <Clock size={15} className="text-pine" aria-hidden="true" />
                <span>Availability & Team Size</span>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="edit-weekdays" className="form-label">
                    Weekday Hours
                  </label>
                  <input
                    id="edit-weekdays"
                    type="text"
                    name="weekdays"
                    value={formData.weekdays}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 6:00 PM – 9:00 PM"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-weekends" className="form-label">
                    Weekend Hours
                  </label>
                  <input
                    id="edit-weekends"
                    type="text"
                    name="weekends"
                    value={formData.weekends}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 10:00 AM – 5:00 PM"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-teamsize" className="form-label">
                  Preferred Team Size
                </label>
                <input
                  id="edit-teamsize"
                  type="text"
                  name="preferredTeamSize"
                  value={formData.preferredTeamSize}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Small teams, 2–4 members"
                />
              </div>
            </div>

            {/* Section 5: Online Profiles */}
            <div className="modal-form-section">
              <div className="modal-section-heading">
                <LinkIcon size={15} className="text-pine" aria-hidden="true" />
                <span>Social & Coding Profiles</span>
              </div>

              <div className="form-group">
                <label htmlFor="edit-github" className="form-label">
                  GitHub Profile URL
                </label>
                <input
                  id="edit-github"
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://github.com/shreyasrao"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-linkedin" className="form-label">
                  LinkedIn Profile URL
                </label>
                <input
                  id="edit-linkedin"
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/shreyasrao"
                />
              </div>
            </div>
          </div>

          <div className="profile-modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
            >
              <Save size={15} aria-hidden="true" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
