import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import Progress from '../ui/progress';
export const ProfileCompletion = ({ percentage, items, }) => {
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-pine">PC</span>
        <CardTitle>Profile completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="pc-compact">
          <Progress variant="circle" value={percentage} size="sm"/>
          
          <div className="pc-compact-chips">
            {items.map((item, index) => (<span key={index} className={`pc-chip ${item.done ? 'done' : ''}`}>
                {item.done && (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>)}
                {item.label}
              </span>))}
          </div>
        </div>
      </CardContent>
    </Card>);
};
export default ProfileCompletion;
