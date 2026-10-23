import React from 'react';
import Button from '../ui/button';
export const ProfileHero = ({ name, headline, department, semester, college, avatar, coverImage, statistics, socialLinks, onEditClick, onShowToast, }) => {
    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: `${name}'s Profile`,
                url: window.location.href,
            }).catch(() => { });
        }
        else {
            navigator.clipboard.writeText(window.location.href);
            onShowToast('Profile link copied');
        }
    };
    const handleDownloadResume = () => {
        onShowToast('Resume download is not available in this demo.');
    };
    const handleSocialClick = (e, label, url) => {
        if (!url || url === '#') {
            e.preventDefault();
            onShowToast(`${label} link is not configured in this demo.`);
        }
    };
    return (<div className="hero">
      <div className="hero-cover" style={coverImage ? { backgroundImage: `url(${coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}/>
      <div className="hero-body">
        <div className="hero-avatar">{avatar}</div>
        <div className="hero-top-row">
          <div>
            <div className="hero-name">{name}</div>
            <div className="hero-headline">{headline}</div>
            
            <div className="hero-meta">
              <span className="term-chip">{department}</span>
              <span className="term-chip">{semester}</span>
              <span className="term-chip">{college}</span>
            </div>

            {/* Social Links integrated near the top as part of student's identity */}
            <div className="social-row mt-4">
              <a href={socialLinks?.github || '#'} onClick={(e) => handleSocialClick(e, 'GitHub', socialLinks?.github)} className="social-btn" title="GitHub" aria-label="GitHub Profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
              </a>
              <a href={socialLinks?.linkedin || '#'} onClick={(e) => handleSocialClick(e, 'LinkedIn', socialLinks?.linkedin)} className="social-btn" title="LinkedIn" aria-label="LinkedIn Profile">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 13v4"/></svg>
              </a>
              <a href={socialLinks?.portfolio || '#'} onClick={(e) => handleSocialClick(e, 'Portfolio', socialLinks?.portfolio)} className="social-btn" title="Portfolio" aria-label="Portfolio Website">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
              </a>
              <a href={socialLinks?.resume || '#'} onClick={(e) => handleSocialClick(e, 'Resume', socialLinks?.resume)} className="social-btn" title="Resume" aria-label="Academic Resume">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </a>
            </div>
          </div>
          
          <div className="hero-actions">
            <Button className="hero-btn hero-btn-outline" onClick={handleShareClick}>Share Profile</Button>
            <Button className="hero-btn hero-btn-outline" onClick={handleDownloadResume}>Download Resume</Button>
            <Button className="hero-btn hero-btn-primary" onClick={onEditClick}>Edit Profile</Button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="n">{statistics.connections}</div>
            <div className="l">Connections</div>
          </div>
          <div className="hero-stat">
            <div className="n">{statistics.studyGroups}</div>
            <div className="l">Study groups</div>
          </div>
          <div className="hero-stat">
            <div className="n">{statistics.projects}</div>
            <div className="l">Projects</div>
          </div>
          <div className="hero-stat">
            <div className="n">{statistics.resources}</div>
            <div className="l">Resources</div>
          </div>
        </div>
      </div>
    </div>);
};
export default ProfileHero;
