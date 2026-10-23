import React from 'react';
import { GROUP_DISCUSSIONS } from '../../data/studyGroupsData';
import { Card, CardHeader, CardTitle } from '../ui/card';
export const GroupDiscussions = () => {
    const getAvatarStyles = (initials) => {
        switch (initials) {
            case 'AR':
                return { background: 'var(--pine-tint)', color: 'var(--pine-dark)' };
            case 'RS':
                return { background: 'var(--marigold-tint)', color: 'var(--marigold)' };
            case 'PN':
            case 'KV':
                return { background: 'var(--slate-tint)', color: 'var(--slate)' };
            case 'DP':
                return { background: 'var(--rust-tint)', color: 'var(--rust)' };
            default:
                return { background: 'var(--pine-tint)', color: 'var(--pine-dark)' };
        }
    };
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-marigold">GD</span>
        <CardTitle>Group discussions</CardTitle>
      </CardHeader>
      
      {GROUP_DISCUSSIONS.map((discussion) => (<div key={discussion.id} className="disc-forum-item">
          <div className="disc-forum-avatars">
            {discussion.participants.map((p, idx) => (<div key={idx} style={getAvatarStyles(p)}>
                {p}
              </div>))}
          </div>
          
          <div className="disc-forum-info">
            <div className="t">{discussion.title}</div>
            <div className="s">{discussion.lastActivity}</div>
          </div>
          
          <div className="disc-forum-stats">
            <div className="n">{discussion.replies}</div>
            <div className="l">replies</div>
          </div>
        </div>))}
    </Card>);
};
export default GroupDiscussions;
