import React from 'react';
import { User, Mail, ExternalLink } from 'lucide-react';

/**
 * AboutCard component
 * Displays student biography, academic intent, and verified social/contact links.
 */
export const AboutCard = ({ profile }) => {
  const {
    bio,
    email = 'shreyas@example.com',
    github = 'https://github.com/shreyasrao',
    githubHandle = 'github.com/shreyasrao',
    linkedin = 'https://linkedin.com/in/shreyasrao',
    linkedinHandle = 'linkedin.com/in/shreyasrao',
  } = profile;

  return (
    <article className="profile-card" aria-labelledby="about-heading">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <div className="profile-card-icon-badge" aria-hidden="true">
            <User size={18} />
          </div>
          <div>
            <h2 id="about-heading" className="profile-card-title">
              About
            </h2>
            <p className="profile-card-subtitle">Personal statement & contact links</p>
          </div>
        </div>
      </div>

      <div className="about-bio-wrap">
        <p className="about-bio-text">{bio}</p>
      </div>

      <div className="about-links-section">
        <h3 className="about-links-label">Connect & Socials</h3>
        <div className="about-links-grid">
          {/* Email link */}
          <a
            href={`mailto:${email}`}
            className="about-link-pill"
            aria-label={`Send email to ${email}`}
          >
            <Mail size={15} className="about-link-icon" aria-hidden="true" />
            <span className="about-link-text">{email}</span>
            <ExternalLink size={12} className="about-external-icon" aria-hidden="true" />
          </a>

          {/* GitHub link */}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="about-link-pill"
            aria-label={`Open GitHub profile: ${githubHandle}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
              className="about-link-icon"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="about-link-text">{githubHandle}</span>
            <ExternalLink size={12} className="about-external-icon" aria-hidden="true" />
          </a>

          {/* LinkedIn link */}
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="about-link-pill"
            aria-label={`Open LinkedIn profile: ${linkedinHandle}`}
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
              className="about-link-icon"
              aria-hidden="true"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0-.02-3.24 1.62 1.62 0 0 0 .02 3.24m-1.39 9.74h2.79v-8.37H5.07v8.37z" />
            </svg>
            <span className="about-link-text">{linkedinHandle}</span>
            <ExternalLink size={12} className="about-external-icon" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default AboutCard;
