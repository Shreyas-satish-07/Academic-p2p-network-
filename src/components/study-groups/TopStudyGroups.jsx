import React from 'react';
import { TOP_STUDY_GROUPS } from '../../data/studyGroupsData';
import { Card, CardHeader, CardTitle } from '../ui/card';
export const TopStudyGroups = () => {
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-marigold">TG</span>
        <CardTitle>Top study groups</CardTitle>
      </CardHeader>
      
      {TOP_STUDY_GROUPS.map((group) => (<div key={group.rank} className="top-group-row">
          <span className="top-medal">{group.medal}</span>
          <div className="top-group-icon" style={{ backgroundColor: group.bgClass }}/>
          <div className="top-group-info">
            <div className="n">{group.name}</div>
            <div className="s">{group.memberCount} members</div>
          </div>
          <span className="top-group-score">{group.points} pts</span>
        </div>))}
    </Card>);
};
export default TopStudyGroups;
