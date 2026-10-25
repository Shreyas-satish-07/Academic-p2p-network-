import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_GROUPS } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useTheme } from '../../context/useTheme';

export const Sidebar = ({ isOpen, onClose }) => {
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();

    const renderIcon = (iconName) => {
        switch (iconName) {
            case 'Dashboard':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <rect x="3" y="3" width="7" height="9" rx="1.5"/>
            <rect x="14" y="3" width="7" height="5" rx="1.5"/>
            <rect x="14" y="12" width="7" height="9" rx="1.5"/>
            <rect x="3" y="16" width="7" height="5" rx="1.5"/>
          </svg>);
            case 'Profile':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
          </svg>);
            case 'PeerMatch':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>
          </svg>);
            case 'StudyGroups':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <circle cx="8" cy="9" r="3"/>
            <circle cx="17" cy="9" r="3"/>
            <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
          </svg>);
            case 'Messages':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>);
            case 'Resources':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>);
            case 'Projects':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <path d="M3 9h18M8 4v5"/>
          </svg>);
            case 'Discussions':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[17px] h-[17px] flex-shrink-0 opacity-85">
            <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-5A8.4 8.4 0 0 1 12.6 3a8.4 8.4 0 0 1 8.4 8.5z"/>
          </svg>);
            default:
                return null;
        }
    };
    return (<>
      {/* Mobile Drawer Overlay */}
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}/>
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} id="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div className="brand-name">Cohort</div>
        </div>

        {NAVIGATION_GROUPS.map((group, groupIdx) => (<div key={groupIdx}>
            <div className="nav-group-label">{group.label}</div>
            <ul className="nav-list">
              {group.items.map((item, itemIdx) => {
                const isActive =
                  location.pathname === item.route ||
                  (item.route === ROUTES.DASHBOARD && location.pathname === '/');
                return (<Link key={itemIdx} to={item.route} className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
                    {renderIcon(item.iconName)}
                    {item.label}
                    {item.badge && (<span className="nav-badge">{item.badge}</span>)}
                  </Link>);
            })}
            </ul>
          </div>))}

        <div className="sidebar-foot">
          <button
            type="button"
            className="theme-toggle"
            id="themeToggle"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={isDark}
          >
            <span id="themeLabel">{isDark ? 'Dark mode' : 'Light mode'}</span>
            <div className="switch" aria-hidden="true"></div>
          </button>
        </div>
      </aside>
    </>);
};
export default Sidebar;
