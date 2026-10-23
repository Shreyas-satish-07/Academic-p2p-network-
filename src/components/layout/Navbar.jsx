import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../dashboard/NotificationDropdown';
import { ROUTES } from '../../constants/routes';
export const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const searchRef = useRef(null);
    const notifRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    return (<div className="topbar">
      <button className="menu-fab" id="menuFab" aria-label="Open navigation" onClick={(e) => {
            e.stopPropagation();
            onMenuClick();
        }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* SEARCH WRAP */}
      <div className="search-wrap" ref={searchRef}>
        <div className="search" id="searchTrigger" onClick={(e) => {
            e.stopPropagation();
            setIsSearchOpen(!isSearchOpen);
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          Search people, groups, resources…
          <kbd>⌘K</kbd>
        </div>
        
        <div className={`search-panel ${isSearchOpen ? 'open' : ''}`} id="searchPanel">
          <div className="search-cats">
            <span className="search-cat cursor-pointer" onClick={() => { navigate(ROUTES.PEER_MATCH); setIsSearchOpen(false); }}>Students</span>
            <span className="search-cat cursor-pointer" onClick={() => { navigate(ROUTES.STUDY_GROUPS); setIsSearchOpen(false); }}>Study Groups</span>
            <span className="search-cat cursor-pointer" onClick={() => { navigate(ROUTES.RESOURCES); setIsSearchOpen(false); }}>Resources</span>
            <span className="search-cat cursor-pointer" onClick={() => { navigate(ROUTES.PROJECTS); setIsSearchOpen(false); }}>Projects</span>
            <span className="search-cat cursor-pointer" onClick={() => { navigate(ROUTES.DISCUSSIONS); setIsSearchOpen(false); }}>Discussions</span>
          </div>
          <div className="search-sub">Recent searches</div>
          <div className="search-item cursor-pointer" onClick={() => { navigate(ROUTES.RESOURCES, { state: { searchQuery: 'DBMS' } }); setIsSearchOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            DBMS unit 4 notes
          </div>
          <div className="search-item cursor-pointer" onClick={() => { navigate(ROUTES.PEER_MATCH, { state: { searchQuery: 'Rahul Sharma' } }); setIsSearchOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            Rahul Sharma
          </div>
          <div className="search-sub">Suggested for you</div>
          <div className="search-item cursor-pointer" onClick={() => { navigate(ROUTES.PEER_MATCH, { state: { searchQuery: 'React' } }); setIsSearchOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            React study partners
          </div>
          <div className="search-item cursor-pointer" onClick={() => { navigate(ROUTES.RESOURCES, { state: { searchQuery: 'Machine Learning' } }); setIsSearchOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            Machine Learning resources
          </div>
        </div>
      </div>

      {/* TOPBAR ICONS */}
      <div className="topbar-icons">
        <div className="notif-wrap" ref={notifRef}>
          <div className="icon-btn notif-btn" id="notifTrigger" onClick={(e) => {
            e.stopPropagation();
            setIsNotifOpen(!isNotifOpen);
        }}>
            <span aria-hidden="true">🔔</span>
            <span className="notif-count-badge">12</span>
          </div>
          
          <NotificationDropdown isOpen={isNotifOpen}/>
        </div>
        <div className="avatar cursor-pointer" onClick={() => navigate(ROUTES.PROFILE)}>SR</div>
      </div>
    </div>);
};
export default Navbar;
