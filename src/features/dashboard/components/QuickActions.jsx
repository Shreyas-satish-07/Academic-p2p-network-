import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileUp,
  UserSearch,
  FolderPlus,
  MessageSquarePlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ACTION_ICONS = {
  FileUp,
  UserSearch,
  FolderPlus,
  MessageSquarePlus,
};

/**
 * QuickActions section component
 * Provides high-priority shortcut cards to key student workflows
 * (Sharing notes, matching study partners, initiating projects, and starting discussions).
 */
export const QuickActions = ({ actions = [] }) => {
  return (
    <section className="dashboard-section" aria-labelledby="quick-actions-heading">
      <div className="section-header">
        <div>
          <h2 id="quick-actions-heading" className="section-title">
            Quick Actions
          </h2>
          <p className="section-subtitle">
            Jump straight into your collaborative workspace
          </p>
        </div>
        <div className="section-meta-pill" aria-hidden="true">
          <Sparkles size={14} className="text-marigold" />
          <span>Core Workflows</span>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const IconComp = ACTION_ICONS[action.icon] || FileUp;
          return (
            <Link
              key={action.id}
              to={action.to}
              className="quick-action-card"
              aria-label={`${action.title}: ${action.description}`}
            >
              <div className="quick-action-card-top">
                <div className="quick-action-icon-wrap" aria-hidden="true">
                  <IconComp size={22} className="quick-action-icon" />
                </div>
                <div className="quick-action-arrow-indicator" aria-hidden="true">
                  <ArrowRight size={16} className="arrow-icon" />
                </div>
              </div>

              <div className="quick-action-info">
                <h3 className="quick-action-title">{action.title}</h3>
                <p className="quick-action-desc">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
