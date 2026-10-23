import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
export const Achievements = ({ achievements }) => {
    const getAchievementIcon = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('hackathon')) {
            return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/>
        </svg>);
        }
        if (lowerTitle.includes('workshop') || lowerTitle.includes('speaker')) {
            return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>);
        }
        if (lowerTitle.includes('club') || lowerTitle.includes('member')) {
            return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="9" r="3"/>
          <circle cx="17" cy="9" r="3"/>
          <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
        </svg>);
        }
        // Default / competition
        return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/>
      </svg>);
    };
    const highlighted = achievements.find((ach) => ach.isHighlighted);
    const timelineAchievements = achievements.filter((ach) => !ach.isHighlighted);
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-rust">AW</span>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {highlighted && (<div className="ach-highlight">
            <div className="ach-highlight-ico">🏆</div>
            <div className="ach-highlight-body">
              <div className="ach-highlight-tag">Highlighted achievement</div>
              <div className="t">{highlighted.category}</div>
              <div className="s">{highlighted.description}</div>
            </div>
          </div>)}

        {timelineAchievements.map((ach, index) => (<div key={ach.id} className="ach-item">
            <div className="ach-marker">
              <div className="ach-dot">
                {getAchievementIcon(ach.title)}
              </div>
              {index < timelineAchievements.length - 1 && (<div className="ach-line"/>)}
            </div>
            <div className="ach-body">
              <div className="t">{ach.title}</div>
              <div className="s">{ach.description}</div>
              <div className="d">{ach.date}</div>
            </div>
          </div>))}
      </CardContent>
    </Card>);
};
export default Achievements;
