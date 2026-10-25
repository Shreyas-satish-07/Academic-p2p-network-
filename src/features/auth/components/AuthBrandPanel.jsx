import React from 'react';
import { Sparkles, Users, FolderGit2, MessageSquare } from 'lucide-react';
import { BRAND_HIGHLIGHTS } from '../authData';

/**
 * AuthBrandPanel component
 * Left-side showcase panel displaying Cohort's academic value proposition,
 * brand tagline, and feature highlight cards.
 */
export const AuthBrandPanel = () => {
  const renderIcon = (index) => {
    switch (index) {
      case 0:
        return <Users size={18} className="text-white" aria-hidden="true" />;
      case 1:
        return <FolderGit2 size={18} className="text-white" aria-hidden="true" />;
      case 2:
      default:
        return <MessageSquare size={18} className="text-white" aria-hidden="true" />;
    }
  };

  return (
    <aside className="auth-brand-panel" aria-label="Cohort platform showcase">
      <div className="auth-brand-bg-circle auth-brand-circle-1" aria-hidden="true" />
      <div className="auth-brand-bg-circle auth-brand-circle-2" aria-hidden="true" />

      {/* Brand Header */}
      <div className="auth-brand-header">
        <div className="auth-brand-logo-badge" aria-hidden="true">
          C
        </div>
        <span className="auth-brand-name">Cohort</span>
      </div>

      {/* Main Pitch */}
      <div className="auth-brand-content">
        <div className="auth-brand-pill">
          <Sparkles size={13} aria-hidden="true" />
          <span>Academic Collaboration Platform</span>
        </div>

        <h1 className="auth-brand-title">
          Find your people. <span>Build what matters.</span>
        </h1>

        <p className="auth-brand-subtitle">
          Connect with verified classmates, collaborate on engineering portfolio projects,
          and turn coursework hurdles into shared milestones.
        </p>

        {/* Highlight Cards */}
        <div className="auth-highlights-grid">
          {BRAND_HIGHLIGHTS.map((item, idx) => (
            <div key={item.title} className="auth-highlight-card">
              <div className="auth-highlight-icon">
                {renderIcon(idx)}
              </div>
              <div>
                <h2 className="auth-highlight-title">{item.title}</h2>
                <p className="auth-highlight-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="auth-brand-footer">
        <span>© {new Date().getFullYear()} Cohort Network</span>
        <span>MERN Portfolio Architecture</span>
      </div>
    </aside>
  );
};

export default AuthBrandPanel;
