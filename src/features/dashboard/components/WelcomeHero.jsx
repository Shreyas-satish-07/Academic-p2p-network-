import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';

/**
 * WelcomeHero component
 * Prominent header displaying user greeting, student network readiness,
 * and profile completeness indicator with direct CTA to profile setup.
 */
export const WelcomeHero = ({ userProfile }) => {
  const {
    greeting = 'Welcome back, Shreyas',
    subtitle = 'Your learning network is active and ready.',
    profileCompletion = 75,
    department = 'Computer Science & Engineering',
    semester = '6th Semester',
  } = userProfile || {};

  return (
    <header className="dashboard-welcome-hero" aria-label="Dashboard Welcome Overview">
      <div className="hero-left-content">
        <div className="hero-meta-badges">
          <span className="hero-badge hero-badge-academic">
            <GraduationCap size={13} aria-hidden="true" />
            <span>{department} • {semester}</span>
          </span>
          <span className="hero-badge hero-badge-status">
            <span className="hero-status-pulse" aria-hidden="true" />
            <span>Network Active</span>
          </span>
        </div>

        <h1 className="hero-heading serif">{greeting}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>

      <div className="hero-right-content">
        <div className="profile-completion-widget" aria-label={`Profile ${profileCompletion}% complete`}>
          <div className="profile-completion-header">
            <span className="completion-label">Profile Completion</span>
            <span className="completion-value">{profileCompletion}%</span>
          </div>

          <div
            className="completion-progress-track"
            role="progressbar"
            aria-valuenow={profileCompletion}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion progress"
          >
            <div
              className="completion-progress-fill"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>

          <p className="completion-hint">
            Add your GitHub and semester courses to unlock higher compatibility matches.
          </p>

          <Link
            to="/profile"
            className="complete-profile-btn"
            aria-label="Navigate to profile to complete setup"
          >
            <span>Complete Profile</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default WelcomeHero;
