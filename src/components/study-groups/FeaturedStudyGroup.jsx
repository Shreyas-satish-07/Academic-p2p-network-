import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_STUDY_GROUP } from '../../data/studyGroupsData';
import { Button } from '../ui/button';
import { ROUTES } from '../../constants/routes';
export const FeaturedStudyGroup = () => {
    const navigate = useNavigate();
    const [isJoined, setIsJoined] = useState(false);
    return (<div className="featured-group">
      <div className="fg-cover">
        <span className="fg-live">
          <span className="fg-live-dot"/>
          {FEATURED_STUDY_GROUP.activityStatus}
        </span>
      </div>
      <div className="fg-body">
        <div className="fg-icon">GD</div>
        <div className="fg-main">
          <div className="fg-name">{FEATURED_STUDY_GROUP.title}</div>
          <span className="fg-subject">{FEATURED_STUDY_GROUP.subject}</span>
          <p className="fg-desc">{FEATURED_STUDY_GROUP.description}</p>
          <div className="fg-meta-row">
            <div className="fg-meta">
              <div className="l">Members</div>
              <div className="v">{FEATURED_STUDY_GROUP.memberCount} students</div>
            </div>
            <div className="fg-meta">
              <div className="l">Schedule</div>
              <div className="v">{FEATURED_STUDY_GROUP.meetingSchedule}</div>
            </div>
            <div className="fg-meta">
              <div className="l">Level</div>
              <div className="v">Beginner friendly</div>
            </div>
          </div>
        </div>
        <div className="fg-actions">
          <span className="match-pct match-pct-lg">{FEATURED_STUDY_GROUP.matchPercentage}% match</span>
          {isJoined && FEATURED_STUDY_GROUP.workspaceId ? (<Button className="fg-join" onClick={() => navigate(`${ROUTES.MESSAGES}?workspaceId=${FEATURED_STUDY_GROUP.workspaceId}`, { state: { activeWorkspaceId: FEATURED_STUDY_GROUP.workspaceId } })} style={{
                backgroundColor: 'var(--pine)',
                color: '#F6F4EC',
            }}>
              Go to Workspace
            </Button>) : (<Button className="fg-join" onClick={() => setIsJoined(true)} style={{
                backgroundColor: 'var(--pine-tint)',
                color: 'var(--pine-dark)',
            }}>
              Join group
            </Button>)}
        </div>
      </div>
    </div>);
};
export default FeaturedStudyGroup;
