import React from 'react';
import { CURRENT_STUDENT } from '../../data/students';
export const WelcomeBanner = () => {
    const student = CURRENT_STUDENT;
    const degrees = (student.profileCompletion / 100) * 360;
    return (<div className="greeting-row">
      <div className="greeting">
        <h1>
          <span aria-hidden="true">👋</span> Welcome back,{' '}
          <span className="highlight">
            {student.name}
            <svg viewBox="0 0 200 10" preserveAspectRatio="none">
              <path d="M2 7 Q 50 2 100 6 T 198 5" stroke="var(--marigold)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.55"/>
            </svg>
          </span>
        </h1>
        <p className="ai-found-label">Your AI study network found:</p>
        <ul className="ai-found-list">
          <li>{student.aiFound.peerMatches} new peer matches</li>
          <li>{student.aiFound.projectInvitations} project invitations</li>
          <li>{student.aiFound.newResources} new resources available</li>
        </ul>
      </div>
      <div className="greeting-side">
        <div className="term-chip">
          {student.term} · {student.college}
        </div>
        <div className="profile-complete">
          <div className="pc-ring" style={{ background: `conic-gradient(var(--pine) ${degrees}deg, var(--line) 0deg)` }}>
            <div className="pc-inner">{student.profileCompletion}%</div>
          </div>
          <div className="pc-label">Profile completion</div>
        </div>
      </div>
    </div>);
};
export default WelcomeBanner;
