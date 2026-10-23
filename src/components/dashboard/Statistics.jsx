import React from 'react';
import { CURRENT_STUDENT } from '../../data/students';
export const Statistics = () => {
    const { stats } = CURRENT_STUDENT;
    return (<div className="stats-grid">
      {/* Connections */}
      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-ico" style={{ background: 'var(--pine-tint)', color: 'var(--pine-dark)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="9" r="3"/>
              <circle cx="17" cy="9" r="3"/>
              <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
            </svg>
          </div>
        </div>
        <div className="stat-num">{stats.connections}</div>
        <div className="stat-label">Connections</div>
      </div>

      {/* Study Groups */}
      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-ico" style={{ background: 'var(--marigold-tint)', color: 'var(--marigold)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>
            </svg>
          </div>
        </div>
        <div className="stat-num">{stats.studyGroups}</div>
        <div className="stat-label">Study groups</div>
      </div>

      {/* Resources Shared */}
      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-ico" style={{ background: 'var(--slate-tint)', color: 'var(--slate)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
        </div>
        <div className="stat-num">{stats.resourcesShared}</div>
        <div className="stat-label">Resources shared</div>
      </div>

      {/* Active Projects */}
      <div className="stat-card">
        <div className="stat-top">
          <div className="stat-ico" style={{ background: 'var(--rust-tint)', color: 'var(--rust)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2"/>
              <path d="M3 9h18M8 4v5"/>
            </svg>
          </div>
        </div>
        <div className="stat-num">{stats.activeProjects}</div>
        <div className="stat-label">Active projects</div>
      </div>
    </div>);
};
export default Statistics;
