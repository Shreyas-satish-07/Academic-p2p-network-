import React from 'react';
import { ANNOUNCEMENTS } from '../../data/announcements';
export const AnnouncementCard = () => {
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-marigold">AN</span>
        <span className="card-title">Announcements</span>
      </div>
      
      {ANNOUNCEMENTS.map((ann) => (<div key={ann.id} className="ann-item">
          <div className="ann-dot"></div>
          <div className="t">{ann.title}</div>
        </div>))}
    </div>);
};
export default AnnouncementCard;
