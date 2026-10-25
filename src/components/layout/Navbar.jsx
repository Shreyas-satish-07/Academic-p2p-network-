import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import NotificationDropdown from '../dashboard/NotificationDropdown';
import { useAuth } from '../../context/useAuth';
import { ROUTES } from '../../constants/routes';

export const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleNotif = (e) => {
    e.stopPropagation();
    setIsNotifOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const handleToggleProfile = (e) => {
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
    setIsNotifOpen(false);
  };

  const handleNavigateProfile = () => {
    setIsProfileOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const handleSignOut = () => {
    setIsProfileOpen(false);
    logout();
    navigate(ROUTES.LOGIN);
  };

  const initials = user?.initials || 'SR';
  const displayName = user?.name || 'Shreyas Rao';
  const displayEmail = user?.email || 'shreyas@example.com';
  const displayDepartment = user?.department || 'Computer Science';

  return (
    <div className="topbar">
      <button
        className="menu-fab"
        id="menuFab"
        aria-label="Open navigation"
        onClick={(e) => {
          e.stopPropagation();
          onMenuClick();
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* SEARCH WRAP */}
      <div className="search-wrap" ref={searchRef}>
        <button
          type="button"
          className="search"
          id="searchTrigger"
          onClick={(e) => {
            e.stopPropagation();
            setIsSearchOpen(!isSearchOpen);
          }}
          aria-label="Search people, groups, resources"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Search people, groups, resources…
          <kbd>⌘K</kbd>
        </button>

        <div className={`search-panel ${isSearchOpen ? 'open' : ''}`} id="searchPanel">
          <div className="search-cats">
            <span
              className="search-cat cursor-pointer"
              onClick={() => {
                navigate(ROUTES.PEER_MATCH);
                setIsSearchOpen(false);
              }}
            >
              Students
            </span>
            <span
              className="search-cat cursor-pointer"
              onClick={() => {
                navigate(ROUTES.STUDY_GROUPS);
                setIsSearchOpen(false);
              }}
            >
              Study Groups
            </span>
            <span
              className="search-cat cursor-pointer"
              onClick={() => {
                navigate(ROUTES.RESOURCES);
                setIsSearchOpen(false);
              }}
            >
              Resources
            </span>
            <span
              className="search-cat cursor-pointer"
              onClick={() => {
                navigate(ROUTES.PROJECTS);
                setIsSearchOpen(false);
              }}
            >
              Projects
            </span>
            <span
              className="search-cat cursor-pointer"
              onClick={() => {
                navigate(ROUTES.DISCUSSIONS);
                setIsSearchOpen(false);
              }}
            >
              Discussions
            </span>
          </div>
          <div className="search-sub">Recent searches</div>
          <div
            className="search-item cursor-pointer"
            onClick={() => {
              navigate(ROUTES.RESOURCES, { state: { searchQuery: 'DBMS' } });
              setIsSearchOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            DBMS unit 4 notes
          </div>
          <div
            className="search-item cursor-pointer"
            onClick={() => {
              navigate(ROUTES.PEER_MATCH, { state: { searchQuery: 'Rahul Sharma' } });
              setIsSearchOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            Rahul Sharma
          </div>
          <div className="search-sub">Suggested for you</div>
          <div
            className="search-item cursor-pointer"
            onClick={() => {
              navigate(ROUTES.PEER_MATCH, { state: { searchQuery: 'React' } });
              setIsSearchOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            React study partners
          </div>
          <div
            className="search-item cursor-pointer"
            onClick={() => {
              navigate(ROUTES.RESOURCES, { state: { searchQuery: 'Machine Learning' } });
              setIsSearchOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Machine Learning resources
          </div>
        </div>
      </div>

      {/* TOPBAR ICONS */}
      <div className="topbar-icons">
        {/* Notifications Dropdown */}
        <div className="notif-wrap" ref={notifRef}>
          <button
            type="button"
            className="icon-btn notif-btn"
            id="notifTrigger"
            onClick={handleToggleNotif}
            aria-label="Open notifications"
            aria-expanded={isNotifOpen}
          >
            <span aria-hidden="true">🔔</span>
            <span className="notif-count-badge">12</span>
          </button>

          <NotificationDropdown isOpen={isNotifOpen} />
        </div>

        {/* User Profile Dropdown */}
        <div className="user-menu-wrap" ref={profileRef}>
          <button
            type="button"
            className="avatar-btn"
            id="userMenuTrigger"
            onClick={handleToggleProfile}
            aria-label="Open user menu"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            {initials}
          </button>

          {isProfileOpen && (
            <div
              className="user-menu-panel"
              role="menu"
              aria-label="User account options"
            >
              {/* User Summary Header */}
              <div className="user-menu-header">
                <div className="user-menu-avatar" aria-hidden="true">
                  {initials}
                </div>
                <div className="user-menu-meta">
                  <span className="user-menu-name" title={displayName}>
                    {displayName}
                  </span>
                  <span className="user-menu-email" title={displayEmail}>
                    {displayEmail}
                  </span>
                  <span className="user-menu-badge">
                    {displayDepartment}
                  </span>
                </div>
              </div>

              <div className="user-menu-divider" role="separator" />

              {/* Action: My Profile */}
              <button
                type="button"
                className="user-menu-item"
                role="menuitem"
                onClick={handleNavigateProfile}
              >
                <User size={15} className="user-menu-icon" aria-hidden="true" />
                <span>My Profile</span>
              </button>

              <div className="user-menu-divider" role="separator" />

              {/* Action: Sign Out */}
              <button
                type="button"
                className="user-menu-item sign-out"
                role="menuitem"
                onClick={handleSignOut}
              >
                <LogOut size={15} className="user-menu-icon" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
