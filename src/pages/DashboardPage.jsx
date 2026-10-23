import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import WelcomeHero from '../features/dashboard/components/WelcomeHero';
import StatCard from '../features/dashboard/components/StatCard';
import QuickActions from '../features/dashboard/components/QuickActions';
import AIAssistantCard from '../features/dashboard/components/AIAssistantCard';
import UpcomingDeadlines from '../features/dashboard/components/UpcomingDeadlines';
import PeerMatches from '../features/dashboard/components/PeerMatches';
import LearningProgress from '../features/dashboard/components/LearningProgress';
import RecentActivity from '../features/dashboard/components/RecentActivity';
import RecommendedGroups from '../features/dashboard/components/RecommendedGroups';

import {
  INITIAL_USER_PROFILE,
  INITIAL_STATS,
  QUICK_ACTIONS,
  AI_ASSISTANT_PREVIEW,
  UPCOMING_DEADLINES,
  TOP_PEER_MATCHES,
  LEARNING_PROGRESS,
  RECENT_ACTIVITIES,
  RECOMMENDED_STUDY_GROUPS,
} from '../features/dashboard/dashboardData';

import '../features/dashboard/dashboard.css';

/**
 * DashboardPage component
 * Primary overview page for Cohort student collaboration platform.
 * Assembles academic statistics, quick actions, peer recommendations,
 * deadlines, syllabus progress, and study group circles.
 */
export const DashboardPage = () => {
  // State containers initialized with mock data
  const [userProfile, _setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [stats, _setStats] = useState(INITIAL_STATS);
  const [deadlines, _setDeadlines] = useState(UPCOMING_DEADLINES);
  const [peerMatches, _setPeerMatches] = useState(TOP_PEER_MATCHES);
  const [learningProgress, _setLearningProgress] = useState(LEARNING_PROGRESS);
  const [recentActivities, _setRecentActivities] = useState(RECENT_ACTIVITIES);
  const [recommendedGroups, _setRecommendedGroups] = useState(RECOMMENDED_STUDY_GROUPS);

  // Loading-ready state for future Axios API fetch integration
  const [_isLoading, _setIsLoading] = useState(false);
  const [errorMessage, _setErrorMessage] = useState(null);

  useEffect(() => {
    /**
     * Future Express + MongoDB API integration hook:
     * When backend endpoints are live, replace the initial state with real API calls:
     * 
     * const fetchDashboardData = async () => {
     *   try {
     *     setIsLoading(true);
     *     // Option A: Aggregated dashboard endpoint
     *     const res = await api.get('/dashboard');
     *     setUserProfile(res.data.profile);
     *     setStats(res.data.stats);
     *     setDeadlines(res.data.deadlines);
     *     setPeerMatches(res.data.peerMatches);
     *     setLearningProgress(res.data.learningProgress);
     *     setRecentActivities(res.data.recentActivities);
     *     setRecommendedGroups(res.data.recommendedGroups);
     * 
     *     // Option B: Granular parallel fetches
     *     // const [statsRes, deadlinesRes, peersRes] = await Promise.all([
     *     //   api.get('/dashboard/stats'),
     *     //   api.get('/dashboard/deadlines'),
     *     //   api.get('/peers/top-matches'),
     *     // ]);
     *   } catch (err) {
     *     console.error('Failed to load dashboard data:', err);
     *     setErrorMessage('Unable to fetch live dashboard updates. Showing cached view.');
     *   } finally {
     *     setIsLoading(false);
     *   }
     * };
     * 
     * fetchDashboardData();
     */
  }, []);

  return (
    <AppLayout>
      <div className="dashboard-container">
        {errorMessage && (
          <div className="announce" role="alert" style={{ marginBottom: '16px' }}>
            <span className="tag">NOTICE</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Welcome Hero Section */}
        <WelcomeHero userProfile={userProfile} />

        {/* 2. Statistics Section */}
        <section aria-label="Academic statistics overview">
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
                isPositive={stat.isPositive}
                icon={stat.icon}
                ariaLabel={stat.ariaLabel}
              />
            ))}
          </div>
        </section>

        {/* 3. Quick Actions Section */}
        <QuickActions actions={QUICK_ACTIONS} />

        {/* 4. Main Content Grid */}
        <div className="dashboard-main-grid">
          {/* Left Column: AI Assistant Preview, Deadlines, Learning Progress */}
          <div className="dashboard-column">
            <AIAssistantCard previewData={AI_ASSISTANT_PREVIEW} />
            <UpcomingDeadlines deadlines={deadlines} />
            <LearningProgress subjects={learningProgress} />
          </div>

          {/* Right Column: Top Peer Matches, Recent Activity, Recommended Groups */}
          <div className="dashboard-column">
            <PeerMatches peers={peerMatches} />
            <RecentActivity activities={recentActivities} />
            <RecommendedGroups groups={recommendedGroups} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
