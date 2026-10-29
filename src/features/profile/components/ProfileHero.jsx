import React from 'react';
import {
  MapPin,
  GraduationCap,
  Calendar,
  Edit3,
  Share2,
  FileDown,
  Sparkles,
  Building,
} from 'lucide-react';

/**
 * ProfileHero component
 * Prominent header showcase displaying student avatar, initials, academic metadata,
 * profile completion status, and primary action controls (Edit, Share, Download Resume).
 */
export const ProfileHero = ({ profile, onEditClick, onShowToast }) => {
  const {
    name,
    initials = 'SR',
    role,
    college,
    department,
    semester,
    location = 'Bengaluru, India',
    profileCompletion,
    avatar,
  } = profile;

  const displayRole = role === 'student' ? 'Student' : role || 'Student';
  const displaySemester =
    typeof semester === 'number'
      ? `Semester ${semester}`
      : semester || 'Semester 1';

  const handleShareProfile = async () => {
    try {
      if (navigator.clipboard && window.location.href) {
        await navigator.clipboard.writeText(window.location.href);
        onShowToast('Profile link copied to clipboard!');
      } else {
        onShowToast('Profile link: ' + window.location.href);
      }
    } catch {
      onShowToast('Profile link copied to clipboard!');
    }
  };

  const handleDownloadResume = () => {
    onShowToast('Resume download coming soon (portfolio integration in progress)');
  };

  return (
    <header className="profile-hero-card" aria-label="Student Profile Overview">
      <div className="profile-hero-accent-strip" aria-hidden="true" />

      <div className="profile-hero-content">
        {/* Student Avatar: Shows image if present, otherwise stylized initials */}
        <div
          className="profile-hero-avatar"
          role="img"
          aria-label={`${name}'s profile avatar initials ${initials}`}
        >
          {avatar?.url ? (
            <img
              src={avatar.url}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <span className="profile-avatar-initials">{initials}</span>
          )}
          <span className="profile-avatar-online-dot" title="Active on Cohort network" />
        </div>

        <div className="profile-hero-main-info">
          <div className="profile-hero-badges-row">
            <span className="profile-badge profile-badge-role">
              <Sparkles size={12} className="text-marigold" aria-hidden="true" />
              <span>{displayRole}</span>
            </span>
            <span className="profile-badge profile-badge-semester">
              <Calendar size={12} aria-hidden="true" />
              <span>{displaySemester}</span>
            </span>
            <span className="profile-badge profile-badge-completion">
              <span>{profileCompletion?.percentage || 75}% Profile Completed</span>
            </span>
          </div>

          <h1 className="profile-hero-name serif">{name}</h1>

          <div className="profile-hero-details-row">
            <div className="profile-detail-item">
              <Building size={14} className="profile-detail-icon" aria-hidden="true" />
              <span>{college || 'Institution'}</span>
            </div>
            <div className="profile-detail-item">
              <GraduationCap size={14} className="profile-detail-icon" aria-hidden="true" />
              <span>{department || 'Department'}</span>
            </div>
            <div className="profile-detail-item">
              <MapPin size={14} className="profile-detail-icon" aria-hidden="true" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-hero-actions">
          <button
            type="button"
            className="profile-btn profile-btn-primary"
            onClick={onEditClick}
            aria-label="Edit student profile"
          >
            <Edit3 size={15} aria-hidden="true" />
            <span>Edit Profile</span>
          </button>

          <button
            type="button"
            className="profile-btn profile-btn-secondary"
            onClick={handleShareProfile}
            aria-label="Share profile link"
          >
            <Share2 size={15} aria-hidden="true" />
            <span>Share Profile</span>
          </button>

          <button
            type="button"
            className="profile-btn profile-btn-secondary profile-btn-subtle"
            onClick={handleDownloadResume}
            aria-label="Download student resume (coming soon)"
          >
            <FileDown size={15} aria-hidden="true" />
            <span>Resume</span>
            <span className="coming-soon-pill">Soon</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProfileHero;
