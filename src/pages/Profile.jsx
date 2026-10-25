import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ProfileHero from '../features/profile/components/ProfileHero';
import ProfileCompletion from '../features/profile/components/ProfileCompletion';
import AboutCard from '../features/profile/components/AboutCard';
import AcademicInfo from '../features/profile/components/AcademicInfo';
import SkillsSection from '../features/profile/components/SkillsSection';
import InterestsSection from '../features/profile/components/InterestsSection';
import AvailabilityCard from '../features/profile/components/AvailabilityCard';
import AchievementsCard from '../features/profile/components/AchievementsCard';
import RecentActivity from '../features/profile/components/RecentActivity';
import EditProfileModal from '../features/profile/components/EditProfileModal';

import {
  INITIAL_PROFILE_DATA,
  RECENT_PROFILE_ACTIVITIES,
} from '../features/profile/profileData';

import '../features/profile/profile.css';

/**
 * Profile page component
 * Renders the comprehensive student academic and collaboration profile on Cohort.
 * 
 * Future Backend Architecture (Express + MongoDB):
 * - GET  /api/users/me          -> Fetch authenticated student profile
 * - PUT  /api/users/me          -> Update personal details, bio, skills, availability
 * - POST /api/users/me/avatar   -> Upload custom profile image
 * - GET  /api/users/me/activity -> Fetch recent activity stream
 */
export const Profile = () => {
  // Profile and activity state initialized with structured mock data
  const [profile, setProfile] = useState(INITIAL_PROFILE_DATA);
  const [activities, _setActivities] = useState(RECENT_PROFILE_ACTIVITIES);

  // Modal and toast states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Loading and error states prepared for future Axios requests
  const [_isLoading, _setIsLoading] = useState(false);
  const [errorMessage, _setErrorMessage] = useState(null);

  useEffect(() => {
    /**
     * Future API Integration:
     * const fetchProfileData = async () => {
     *   try {
     *     _setIsLoading(true);
     *     const [profileRes, activityRes] = await Promise.all([
     *       api.get('/users/me'),
     *       api.get('/users/me/activity'),
     *     ]);
     *     setProfile(profileRes.data);
     *     _setActivities(activityRes.data);
     *   } catch (err) {
     *     console.error('Failed to load profile data:', err);
     *     _setErrorMessage('Could not sync live profile. Showing cached view.');
     *   } finally {
     *     _setIsLoading(false);
     *   }
     * };
     * 
     * fetchProfileData();
     */
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    showToast('Profile updated successfully!');
  };

  return (
    <AppLayout>
      <div className="profile-page-container">
        {errorMessage && (
          <div className="announce" role="alert" style={{ marginBottom: '16px' }}>
            <span className="tag">NOTICE</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Profile Hero Section */}
        <ProfileHero
          profile={profile}
          onEditClick={() => setIsEditModalOpen(true)}
          onShowToast={showToast}
        />

        {/* Main Content Grid: Balanced 2-Column Responsive Layout */}
        <div className="profile-main-grid">
          {/* Primary Column: Personal Statement, Academics, Skills, Interests */}
          <div className="profile-column">
            <AboutCard profile={profile} />
            <AcademicInfo profile={profile} />
            <SkillsSection
              profile={profile}
              onAddSkillClick={() => setIsEditModalOpen(true)}
            />
            <InterestsSection profile={profile} />
          </div>

          {/* Secondary Column: Strength, Availability, Milestones, Activity */}
          <div className="profile-column">
            <ProfileCompletion
              completionData={profile.profileCompletion}
              onCompleteClick={() => setIsEditModalOpen(true)}
            />
            <AvailabilityCard availability={profile.availability} />
            <AchievementsCard achievements={profile.achievements} />
            <RecentActivity activities={activities} />
          </div>
        </div>

        {/* Interactive Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={profile}
          onSaveProfile={handleSaveProfile}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="profile-toast" role="status" aria-live="polite">
            <CheckCircle2 size={18} className="toast-icon" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Profile;
