import React from 'react';
import { UPCOMING_MEETINGS } from '../../data/studyGroupsData';
import { Card, CardHeader, CardTitle } from '../ui/card';
export const UpcomingMeetings = () => {
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-pine">UM</span>
        <CardTitle>Upcoming meetings</CardTitle>
      </CardHeader>
      
      {UPCOMING_MEETINGS.map((meeting) => (<div key={meeting.id} className="meeting-row">
          <div className="meeting-date">
            <div className="d">{meeting.date.day}</div>
            <div className="m">{meeting.date.month}</div>
          </div>
          <div className="meeting-info">
            <div className="t">{meeting.title}</div>
            <div className="s">{meeting.participants}</div>
          </div>
          <div className="meeting-time">
            {meeting.time.split('·')[0]}
            <br />
            {meeting.time.includes('·') ? meeting.time.split('·')[1].trim() : 'attending'}
          </div>
        </div>))}
    </Card>);
};
export default UpcomingMeetings;
