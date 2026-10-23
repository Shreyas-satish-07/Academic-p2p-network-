import React from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import StudyGroupsHero from '../components/study-groups/StudyGroupsHero';
import FeaturedStudyGroup from '../components/study-groups/FeaturedStudyGroup';
import StudyGroupFilters from '../components/study-groups/StudyGroupFilters';
import TopStudyGroups from '../components/study-groups/TopStudyGroups';
import DiscoverStudyGroups from '../components/study-groups/DiscoverStudyGroups';
import LiveStudySessions from '../components/study-groups/LiveStudySessions';
import GroupActivityTimeline from '../components/study-groups/GroupActivityTimeline';
import GroupDiscussions from '../components/study-groups/GroupDiscussions';
import SharedResources from '../components/study-groups/SharedResources';
import UpcomingMeetings from '../components/study-groups/UpcomingMeetings';
import '../styles/study-groups.css';
export const StudyGroups = () => {
    return (<AppLayout>
      <motion.div className="w-full flex flex-col gap-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        {/* 1. Hero Section */}
        <StudyGroupsHero />

        {/* 2. Featured Study Group */}
        <FeaturedStudyGroup />

        {/* 3. Filters + Discover Study Groups Grid */}
        <div className="pm-browse">
          <div className="pm-filters">
            <StudyGroupFilters />
            <TopStudyGroups />
          </div>
          <DiscoverStudyGroups />
        </div>

        {/* 4. Live Study Sessions */}
        <LiveStudySessions />

        {/* 5. Timelines, Resources & Meetings (Two-column layout) */}
        <div className="profile-grid">
          <div className="col-stack">
            <GroupActivityTimeline />
            <GroupDiscussions />
          </div>
          <div className="col-stack">
            <SharedResources />
            <UpcomingMeetings />
          </div>
        </div>
      </motion.div>
    </AppLayout>);
};
export default StudyGroups;
