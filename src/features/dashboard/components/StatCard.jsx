import React from 'react';
import { Users, UsersRound, FileUp, FolderKanban, TrendingUp } from 'lucide-react';

const ICON_MAP = {
  Users,
  UsersRound,
  FileUp,
  FolderKanban,
};

/**
 * StatCard component
 * Displays a single key metric with Lucide icon, supporting trend indicator,
 * and accessible metadata.
 */
export const StatCard = ({ label, value, trend, isPositive = true, icon, ariaLabel }) => {
  const IconComponent = ICON_MAP[icon] || Users;

  return (
    <article
      className="dashboard-stat-card"
      tabIndex={0}
      aria-label={ariaLabel || `${value} ${label}, ${trend}`}
    >
      <div className="stat-card-header">
        <div className="stat-card-icon-wrap" aria-hidden="true">
          <IconComponent className="stat-card-icon" size={20} />
        </div>
        {trend && (
          <div
            className={`stat-card-trend ${isPositive ? 'trend-positive' : 'trend-neutral'}`}
            aria-label={`Trend: ${trend}`}
          >
            <TrendingUp size={13} className="trend-icon" aria-hidden="true" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <h3 className="stat-card-label">{label}</h3>
      </div>
    </article>
  );
};

export default StatCard;
