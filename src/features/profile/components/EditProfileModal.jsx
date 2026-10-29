import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  User,
  Building,
  Code2,
  Clock,
  Link as LinkIcon,
  AlertCircle,
} from 'lucide-react';

/**
 * EditProfileModal component
 * Accessible modal allowing students to update their personal details, academic standing,
 * skills, interests, availability, and avatar.
 */
export const EditProfileModal = ({
  isOpen,
  onClose,
  initialData,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    department: '',
    semester: '',
    bio: '',
    skills: '',
    interests: '',
    weekdays: '',
    weekends: '',
    preferredTeamSize: '',
    openTo: '',
    avatarUrl: '',
    github: '',
    linkedin: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Populate form with current profile data when opening modal
  useEffect(() => {
    if (initialData) {
      let semVal = '';
      if (initialData.rawSemester !== undefined && initialData.rawSemester !== null) {
        semVal = String(initialData.rawSemester);
      } else if (typeof initialData.semester === 'number') {
        semVal = String(initialData.semester);
      } else if (typeof initialData.semester === 'string') {
        const match = initialData.semester.match(/\d+/);
        semVal = match ? match[0] : initialData.semester;
      }

      setFormData({
        name: initialData.name || '',
        college: initialData.college || '',
        department: initialData.department || '',
        semester: semVal,
        bio: initialData.bio || '',
        skills: Array.isArray(initialData.skills)
          ? initialData.skills.join(', ')
          : '',
        interests: Array.isArray(initialData.interests)
          ? initialData.interests.join(', ')
          : '',
        weekdays: initialData.availability?.weekdays || '',
        weekends: initialData.availability?.weekends || '',
        preferredTeamSize: initialData.availability?.preferredTeamSize || '',
        openTo: Array.isArray(initialData.availability?.openTo)
          ? initialData.availability.openTo.join(', ')
          : '',
        avatarUrl: initialData.avatar?.url || '',
        github: initialData.github || '',
        linkedin: initialData.linkedin || '',
      });
      setFormError(null);
    }
  }, [initialData, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate semester (must be integer between 1 and 12)
    const semNum = parseInt(String(formData.semester).replace(/\D/g, ''), 10);
    if (!semNum || isNaN(semNum) || semNum < 1 || semNum > 12) {
      setFormError('Semester must be a valid number between 1 and 12.');
      return;
    }

    // Validate bio length (max 500 characters)
    if (formData.bio && formData.bio.trim().length > 500) {
      setFormError('Bio cannot exceed 500 characters.');
      return;
    }

    // Prepare strictly allowed fields payload
    const payload = {
      name: formData.name.trim(),
      college: formData.college.trim(),
      department: formData.department.trim(),
      semester: semNum,
      bio: formData.bio.trim(),
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      interests: formData.interests
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      availability: {
        weekdays: formData.weekdays.trim(),
        weekends: formData.weekends.trim(),
        preferredTeamSize: formData.preferredTeamSize.trim(),
        openTo: formData.openTo
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean),
      },
      avatar: {
        url: formData.avatarUrl.trim(),
      },
    };

    try {
      setIsSubmitting(true);
      await onSaveProfile(payload);
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to save profile. Please verify your inputs and try again.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="profile-modal-overlay"
      onClick={isSubmitting ? undefined : onClose}
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
              Updates will persist to MongoDB and immediately reflect across Cohort
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close edit profile dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-modal-form">
          <div className="profile-modal-scrollable">
            {/* Error Notification inside modal */}
            {formError && (
              <div
                className="announce"
                role="alert"
                style={{
                  margin: '16px 24px 0 24px',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

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
                <label htmlFor="edit-avatar" className="form-label">
                  Avatar Image URL <span className="label-hint">(optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="edit-avatar"
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="edit-bio" className="form-label">
                    Bio / Learning Statement
                  </label>
                  <span
                    className="label-hint"
                    style={{
                      color: formData.bio.length > 500 ? '#dc2626' : undefined,
                    }}
                  >
                    {formData.bio.length}/500
                  </span>
                </div>
                <textarea
                  id="edit-bio"
                  name="bio"
                  rows={3}
                  maxLength={500}
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

              <div className="form-group">
                <label htmlFor="edit-college" className="form-label">
                  College / University
                </label>
                <input
                  id="edit-college"
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="e.g. BMS College of Engineering"
                />
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
                    required
                    className="form-input"
                    placeholder="e.g. Computer Science and Engineering"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-semester" className="form-label">
                    Current Semester <span className="label-hint">(1 - 12)</span>
                  </label>
                  <input
                    id="edit-semester"
                    type="number"
                    min="1"
                    max="12"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="e.g. 6"
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

              <div className="form-group">
                <label htmlFor="edit-opento" className="form-label">
                  Open For <span className="label-hint">(comma-separated, e.g. Study groups, Hackathons)</span>
                </label>
                <input
                  id="edit-opento"
                  type="text"
                  name="openTo"
                  value={formData.openTo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Study groups, Hackathons, MERN projects..."
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
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-primary"
              disabled={isSubmitting}
            >
              <Save size={15} aria-hidden="true" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
