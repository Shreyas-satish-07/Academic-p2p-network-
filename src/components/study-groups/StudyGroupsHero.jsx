import React from 'react';
import { HERO_STATS } from '../../data/studyGroupsData';
import { Button } from '../ui/button';
export const StudyGroupsHero = () => {
    return (<div className="pm-hero">
      <h1>Learn Better Together</h1>
      <p>Find, join, and create study groups that match your academic interests.</p>
      
      <div className="pm-hero-actions">
        <Button className="pm-hero-btn pm-hero-btn-solid">Explore Groups</Button>
        <Button className="pm-hero-btn pm-hero-btn-outline">Create Group</Button>
        <Button className="pm-hero-btn pm-hero-btn-outline">Join Session</Button>
      </div>

      <div className="pm-hero-stats">
        <div className="pm-hero-stat">
          <div className="n">{HERO_STATS.activeGroupsCount.toLocaleString()}</div>
          <div className="l">Active groups</div>
        </div>
        <div className="pm-hero-stat">
          <div className="n">{HERO_STATS.studentsCount.toLocaleString()}</div>
          <div className="l">Students</div>
        </div>
        <div className="pm-hero-stat">
          <div className="n">{HERO_STATS.liveSessionsCount.toLocaleString()}</div>
          <div className="l">Live sessions</div>
        </div>
        <div className="pm-hero-stat">
          <div className="n">{HERO_STATS.sharedResourcesCount.toLocaleString()}</div>
          <div className="l">Shared resources</div>
        </div>
      </div>
    </div>);
};
export default StudyGroupsHero;
