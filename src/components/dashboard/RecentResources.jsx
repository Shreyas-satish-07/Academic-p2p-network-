import React from 'react';
import { RECENT_RESOURCES } from '../../data/resources';
export const RecentResources = () => {
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-slate">RS</span>
        <span className="card-title">Recent resource uploads</span>
      </div>
      
      {RECENT_RESOURCES.map((res) => (<div key={res.id} className="res-item">
          <div className="res-icon" style={{ background: res.bgClass, color: res.textClass }}>
            {res.type}
          </div>
          <div className="res-info">
            <div className="t">{res.title}</div>
            <div className="s">{res.date}</div>
          </div>
          <div className="res-dl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v12m0 0-4-4m4 4 4-4"/>
              <path d="M4 19h16"/>
            </svg>
          </div>
        </div>))}
    </div>);
};
export default RecentResources;
