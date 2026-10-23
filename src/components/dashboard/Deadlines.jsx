import React from 'react';
import { DEADLINES } from '../../data/students';
export const Deadlines = () => {
    return (<div className="card span-2">
      <div className="card-head">
        <span className="card-tab tab-rust">DL</span>
        <span className="card-title">Upcoming events &amp; deadlines</span>
        <span className="card-count">4 items</span>
      </div>
      
      {DEADLINES.map((item) => (<div key={item.id} className="deadline-row">
          <div className="date-badge">
            <div className="d">{item.day}</div>
            <div className="m">{item.month}</div>
          </div>
          <div className="deadline-info">
            <div className="t">{item.title}</div>
            <div className="s">{item.subtitle}</div>
          </div>
          {item.urgentText && (<span className="urgent-tag">{item.urgentText}</span>)}
        </div>))}
    </div>);
};
export default Deadlines;
