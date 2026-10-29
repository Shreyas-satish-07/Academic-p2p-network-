import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
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
import { useAuth } from '../context/useAuth';
import api from '../services/api';

import {
  INITIAL_PROFILE_DATA,
  RECENT_PROFILE_ACTIVITIES,
} from '../features/profile/profileData';

import '../features/profile/profile.css';

/**
 * Format raw user data from MongoDB /api/users/me into the UI shape
 * while preserving static mock data for achievements, activities, and portfolio.
 */
const formatProfileData = (userData) => {
  if (!userData) return INITIAL_PROFILE_DATA;

  const rawSemester = userData.semester;
  const displaySemester =
    typeof rawSemester === 'number'
      ? `Semester ${rawSemester}`
      : rawSemester || INITIAL_PROFILE_DATA.semester;

  return {
    ...INITIAL_PROFILE_DATA,
    ...userData,
    id: userData._id || userData.id || INITIAL_PROFILE_DATA.id,
    name: userData.name || INITIAL_PROFILE_DATA.name,
    email: userData.email || INITIAL_PROFILE_DATA.email,
    college: userData.college || INITIAL_PROFILE_DATA.college,
    department: userData.department || INITIAL_PROFILE_DATA.department,
    semester: displaySemester,
    rawSemester:
      typeof rawSemester === 'number'
        ? rawSemester
        : parseInt(rawSemester, 10) || '',
    bio: userData.bio ?? INITIAL_PROFILE_DATA.bio,
    role:
      userData.role === 'student'
        ? 'Student'
        : userData.role || INITIAL_PROFILE_DATA.role,
    skills: Array.isArray(userData.skills)
      ? userData.skills
      : INITIAL_PROFILE_DATA.skills,
    interests: Array.isArray(userData.interests)
      ? userData.interests
      : INITIAL_PROFILE_DATA.interests,
    availability: {
      status: 'Available for collaboration',
      isAvailable: true,
      ...INITIAL_PROFILE_DATA.availability,
      ...(userData.availability || {}),
      weekdays:
        userData.availability?.weekdays ??
        INITIAL_PROFILE_DATA.availability.weekdays,
      weekends:
        userData.availability?.weekends ??
        INITIAL_PROFILE_DATA.availability.weekends,
      preferredTeamSize:
        userData.availability?.preferredTeamSize ??
        INITIAL_PROFILE_DATA.availability.preferredTeamSize,
      openTo: Array.isArray(userData.availability?.openTo)
        ? userData.availability.openTo
        : INITIAL_PROFILE_DATA.availability.openTo,
    },
    avatar: userData.avatar || { url: '' },
    initials:
      userData.initials ||
      userData.name
        ?.trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('') ||
      INITIAL_PROFILE_DATA.initials,
    // Preserve static mock data for achievements, activities, and completion
    achievements: INITIAL_PROFILE_DATA.achievements,
    profileCompletion: INITIAL_PROFILE_DATA.profileCompletion,
  };
};

/**
 * Profile page component
 * Connects to MongoDB backend /api/users/me for viewing and editing student profiles.
 */
export const Profile = () => {
  const { updateUser } = useAuth();

  // Profile and activity state
  const [profile, setProfile] = useState(INITIAL_PROFILE_DATA);
  const [activities] = useState(RECENT_PROFILE_ACTIVITIES);

  // Modal and toast states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Fetch authenticated student profile from MongoDB via GET /api/users/me
   */
  const fetchProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await api.get('/users/me');
      const remoteUser = res.data?.data?.user;
      if (remoteUser) {
        setProfile(formatProfileData(remoteUser));
        if (typeof updateUser === 'function') {
          updateUser(remoteUser);
        }
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
      const msg =
        err.response?.data?.message ||
        'Unable to synchronize live profile. Please check your connection and retry.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  /**
   * Dispatches PATCH /api/users/me to persist updates in MongoDB
   */
  const handleSaveProfile = async (payload) => {
    const res = await api.patch('/users/me', payload);
    const updatedUser = res.data?.data?.user;

    if (updatedUser) {
      const formatted = formatProfileData(updatedUser);
      setProfile(formatted);
      if (typeof updateUser === 'function') {
        updateUser(updatedUser);
      }
      showToast('Profile updated successfully!');
    }

    return updatedUser;
  };

  return (
    <AppLayout>
      <div className="profile-page-container">
        {/* Loading Spinner */}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '45vh',
              gap: '14px',
            }}
            role="status"
            aria-live="polite"
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(47, 93, 80, 0.2)',
                borderTopColor: 'var(--pine, #2f5d50)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
              aria-hidden="true"
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--ink-soft)',
              }}
            >
              Loading your student profile...
            </span>
          </div>
        )}

        {/* Error / Retry Alert */}
        {errorMessage && !isLoading && (
          <div
            className="announce"
            role="alert"
            style={{
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag">NOTICE</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              className="profile-btn profile-btn-secondary"
              style={{ padding: '6px 14px', fontSize: '12.5px' }}
              onClick={fetchProfileData}
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!isLoading && (
          <>
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
          </>
        )}

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
