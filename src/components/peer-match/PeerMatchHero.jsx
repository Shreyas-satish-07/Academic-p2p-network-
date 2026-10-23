import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
export const PeerMatchHero = () => {
    const navigate = useNavigate();
    const handleSearchFocus = () => {
        const el = document.getElementById('pm-search-in');
        if (el)
            el.focus();
    };
    return (<div className="pm-hero">
      <h1>Find Your Academic Community</h1>
      <p>Connect with students who share your interests, skills, projects, and research goals.</p>
      <div className="pm-hero-actions">
        <button className="pm-hero-btn pm-hero-btn-solid" onClick={handleSearchFocus}>Search Students</button>
        <button className="pm-hero-btn pm-hero-btn-outline" onClick={handleSearchFocus}>Find Collaborators</button>
        <button className="pm-hero-btn pm-hero-btn-outline" onClick={() => navigate(ROUTES.MESSAGES, { state: { openCreateGroupModal: true } })}>Create Study Group</button>
      </div>
      <div className="pm-hero-stats">
        <div className="pm-hero-stat">
          <div className="n">1,250</div>
          <div className="l">Students</div>
        </div>
        <div className="pm-hero-stat">
          <div className="n">320</div>
          <div className="l">Active collaborators</div>
        </div>
        <div className="pm-hero-stat">
          <div className="n">85</div>
          <div className="l">Study groups</div>
        </div>
        <div className="pm-hero-stat">
          <div className="n">500+</div>
          <div className="l">Shared resources</div>
        </div>
      </div>
    </div>);
};
export default PeerMatchHero;
