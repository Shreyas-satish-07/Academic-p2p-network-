import React, { useState } from 'react';
import { STUDY_GROUPS } from '../../data/peerMatchData';
export const StudyGroupSuggestions = () => {
    const [joinedGroupIds, setJoinedGroupIds] = useState([]);
    const toggleJoinGroup = (id) => {
        setJoinedGroupIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    };
    const getMetaText = (title, memberCount, active) => {
        if (active) {
            return `${memberCount} members · Active today`;
        }
        if (title.includes('Placement')) {
            return `${memberCount} members · Active 2h ago`;
        }
        return `${memberCount} members · Active yesterday`;
    };
    return (<div className="card" style={{ marginBottom: '18px' }}>
      <div className="card-head">
        <span className="card-tab tab-pine">SG</span>
        <span className="card-title">Study group suggestions</span>
      </div>
      <div className="sg-scroll">
        {STUDY_GROUPS.map((group) => {
            const isJoined = joinedGroupIds.includes(group.id);
            return (<div key={group.id} className="sg-card">
              <span className="sg-subject">{group.subject}</span>
              <div className="sg-name">{group.title}</div>
              <div className="sg-meta">
                {group.active && <span className="sg-active-dot"/>}
                {getMetaText(group.title, group.memberCount, group.active)}
              </div>
              <div onClick={() => toggleJoinGroup(group.id)} className="sg-join" style={{
                    backgroundColor: isJoined ? 'var(--line)' : 'var(--pine)',
                    color: isJoined ? 'var(--ink-soft)' : '#F6F4EC',
                }}>
                {isJoined ? 'Joined' : 'Join group'}
              </div>
            </div>);
        })}
      </div>
    </div>);
};
export default StudyGroupSuggestions;
