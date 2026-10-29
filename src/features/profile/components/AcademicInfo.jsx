import React from 'react';
import { GraduationCap, Building, Calendar, BookOpen, Sparkles } from 'lucide-react';

/**
 * AcademicInfo component
 * Summarizes the student's institutional standing, semester status,
 * graduation timeline, and key academic focus areas.
 */
export const AcademicInfo = ({ profile }) => {
  const {
    college = 'BMS College of Engineering',
    department = 'Computer Science and Engineering',
    semester = '6th Semester',
    graduationYear = '2026',
    academicFocus = 'MERN Stack · DSA · AI Applications',
  } = profile;

  const displaySemester =
    typeof semester === 'number'
      ? `Semester ${semester}`
      : semester || 'Semester 1';

  return (
    <article className="profile-card" aria-labelledby="academic-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 id="academic-heading" className="profile-card-title">
              Academic Information
            </h2>
            <p className="profile-card-subtitle">Institutional status and coursework focus</p>
          </div>
        </div>
      </div>

      <div className="academic-grid">
        <div className="academic-info-item">
          <div className="academic-item-icon" aria-hidden="true">
            <Building size={16} />
          </div>
          <div className="academic-item-content">
            <span className="academic-item-label">Institution</span>
            <span className="academic-item-value">{college || 'Institution'}</span>
          </div>
        </div>

        <div className="academic-info-item">
          <div className="academic-item-icon" aria-hidden="true">
            <BookOpen size={16} />
          </div>
          <div className="academic-item-content">
            <span className="academic-item-label">Department</span>
            <span className="academic-item-value">{department || 'Department'}</span>
          </div>
        </div>

        <div className="academic-info-item">
          <div className="academic-item-icon" aria-hidden="true">
            <Calendar size={16} />
          </div>
          <div className="academic-item-content">
            <span className="academic-item-label">Current Term</span>
            <span className="academic-item-value">{displaySemester}</span>
          </div>
        </div>

        <div className="academic-info-item">
          <div className="academic-item-icon" aria-hidden="true">
            <GraduationCap size={16} />
          </div>
          <div className="academic-item-content">
            <span className="academic-item-label">Expected Graduation</span>
            <span className="academic-item-value">{graduationYear}</span>
          </div>
        </div>
      </div>

      {/* Academic Focus Callout */}
      <div className="academic-focus-callout">
        <div className="academic-focus-header">
          <Sparkles size={14} className="text-marigold" aria-hidden="true" />
          <span className="academic-focus-label">Primary Academic Focus</span>
        </div>
        <p className="academic-focus-value">{academicFocus}</p>
      </div>
    </article>
  );
};

export default AcademicInfo;
