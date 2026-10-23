import React from 'react';
import { PROJECT_ACTIVITY } from '../../data/students';
export const ActivityTimeline = () => {
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-slate">AC</span>
        <span className="card-title">Project activity</span>
      </div>
      
      {PROJECT_ACTIVITY.map((activity) => (<div key={activity.id} className="activity-item">
          <div style={{ position: 'relative' }}>
            <div className="activity-dot"></div>
            <div className="activity-line"></div>
          </div>
          <div className="activity-body">
            <div className="t">{activity.title}</div>
            <div className="s">{activity.time}</div>
          </div>
        </div>))}
    </div>);
};
export default ActivityTimeline;
