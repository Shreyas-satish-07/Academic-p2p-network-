import React from 'react';
import { GROUP_ACTIVITIES } from '../../data/studyGroupsData';
import { Card, CardHeader, CardTitle } from '../ui/card';
export const GroupActivityTimeline = () => {
    const getIcon = (type) => {
        switch (type) {
            case 'join':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <circle cx="8" cy="9" r="3"/>
            <circle cx="17" cy="9" r="3"/>
            <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
          </svg>);
            case 'upload':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>);
            case 'discussion':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-5A8.4 8.4 0 0 1 12.6 3a8.4 8.4 0 0 1 8.4 8.5z"/>
          </svg>);
            case 'live':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
          </svg>);
            default:
                return null;
        }
    };
    const getStyleClasses = (type) => {
        switch (type) {
            case 'join':
                return { backgroundColor: 'var(--pine-tint)', color: 'var(--pine-dark)' };
            case 'upload':
                return { backgroundColor: 'var(--slate-tint)', color: 'var(--slate)' };
            case 'discussion':
                return { backgroundColor: 'var(--marigold-tint)', color: 'var(--marigold)' };
            case 'live':
                return { backgroundColor: 'var(--rust-tint)', color: 'var(--rust)' };
            default:
                return { backgroundColor: 'var(--pine-tint)', color: 'var(--pine-dark)' };
        }
    };
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-slate">GA</span>
        <CardTitle>Group activity</CardTitle>
      </CardHeader>
      
      {GROUP_ACTIVITIES.map((activity, index) => {
            const style = getStyleClasses(activity.type);
            const isLast = index === GROUP_ACTIVITIES.length - 1;
            return (<div key={activity.id} className="ach-item">
            <div className="ach-marker">
              <div className="ach-dot" style={style}>
                {getIcon(activity.type)}
              </div>
              {!isLast && <div className="ach-line"/>}
            </div>
            <div className="ach-body">
              <div className="t">{activity.title}</div>
              <div className="d">{activity.time}</div>
            </div>
          </div>);
        })}
    </Card>);
};
export default GroupActivityTimeline;
