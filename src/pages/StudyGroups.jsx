import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CheckCircle2, ArrowUpDown, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StudyGroupsHero from '../features/study-groups/components/StudyGroupsHero';
import FeaturedGroup from '../features/study-groups/components/FeaturedGroup';
import GroupFilters from '../features/study-groups/components/GroupFilters';
import StudyGroupCard from '../features/study-groups/components/StudyGroupCard';
import LiveSessions from '../features/study-groups/components/LiveSessions';
import GroupActivity from '../features/study-groups/components/GroupActivity';
import CreateGroupModal from '../features/study-groups/components/CreateGroupModal';
import EmptyGroups from '../features/study-groups/components/EmptyGroups';
import { studyGroupApi } from '../services/api';

import {
  TODAY_LIVE_SESSIONS,
  REALISTIC_ACTIVITIES,
  SORT_OPTIONS,
} from '../features/study-groups/studyGroupsData';

import '../features/study-groups/studyGroups.css';

/**
 * StudyGroups Discovery Page
 *
 * Backend Endpoints (Express + MongoDB):
 * GET    /api/study-groups                -> List study groups with search, subject, level, pagination & sort
 * POST   /api/study-groups                -> Create a new study group cohort
 * GET    /api/study-groups/:id            -> Get full details of a study group & member roster
 * PATCH  /api/study-groups/:id            -> Update study group details (owner only)
 * DELETE /api/study-groups/:id            -> Soft-delete / archive study group (owner only)
 * POST   /api/study-groups/:id/join       -> Join a study group
 * POST   /api/study-groups/:id/leave      -> Leave a study group
 */
export const StudyGroups = () => {
  // Study groups dataset state
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [selectedGroupSize, setSelectedGroupSize] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [joinedOnly, setJoinedOnly] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState('most-active');

  // Modal & Toast states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Debounce search input to avoid request flooding
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Fetch study groups from backend
   */
  const fetchStudyGroups = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = {
        page: 1,
        limit: 100, // Load all groups to allow responsive client filtering & sorting
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (selectedSubject !== 'All Subjects') {
        params.subject = selectedSubject;
      }

      if (selectedDifficulty !== 'All Difficulties') {
        params.level = selectedDifficulty.toLowerCase();
      }

      if (joinedOnly) {
        params.joinedOnly = 'true';
      }

      // Translate sort parameter
      if (sortBy === 'most-members') params.sort = 'most-members';
      else if (sortBy === 'available-spots') params.sort = 'available-spots';
      else if (sortBy === 'alphabetical') params.sort = 'alphabetical';
      else params.sort = 'most-active';

      const res = await studyGroupApi.getGroups(params);
      const fetchedGroups = res.data?.data?.groups || [];
      setGroups(fetchedGroups);
    } catch (err) {
      console.error('Failed to load study groups:', err);
      const msg =
        err.response?.data?.message ||
        'Could not load study groups. Please check your network connection.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedSubject, selectedDifficulty, joinedOnly, sortBy]);

  useEffect(() => {
    fetchStudyGroups();
  }, [fetchStudyGroups]);

  /**
   * Toggle Join / Leave Group via backend endpoints
   */
  const handleToggleJoin = async (groupId) => {
    const targetGroup = groups.find((g) => (g.id || g._id) === groupId);
    if (!targetGroup) return;

    if (targetGroup.joined) {
      // Leave group
      try {
        const res = await studyGroupApi.leaveGroup(groupId);
        const updatedGroup = res.data?.data?.group;
        setGroups((prevGroups) =>
          prevGroups.map((g) => {
            if ((g.id || g._id) !== groupId) return g;
            return {
              ...g,
              ...(updatedGroup || {}),
              joined: false,
              memberCount: Math.max(1, (g.memberCount || 1) - 1),
            };
          })
        );
        showToast(`You left ${targetGroup.name}.`);
      } catch (err) {
        console.error('Failed to leave group:', err);
        const msg = err.response?.data?.message || `Failed to leave ${targetGroup.name}.`;
        showToast(msg);
      }
    } else {
      // Join group
      if (targetGroup.memberCount >= targetGroup.maxMembers) {
        showToast(`${targetGroup.name} is currently full.`);
        return;
      }

      try {
        const res = await studyGroupApi.joinGroup(groupId);
        const updatedGroup = res.data?.data?.group;
        setGroups((prevGroups) =>
          prevGroups.map((g) => {
            if ((g.id || g._id) !== groupId) return g;
            return {
              ...g,
              ...(updatedGroup || {}),
              joined: true,
              memberCount: (g.memberCount || 0) + 1,
            };
          })
        );
        showToast(`You joined ${targetGroup.name}! Welcome aboard.`);
      } catch (err) {
        console.error('Failed to join group:', err);
        const msg = err.response?.data?.message || `Failed to join ${targetGroup.name}.`;
        showToast(msg);
      }
    }
  };

  /**
   * Join Live Session action
   */
  const handleJoinLiveSession = (sessionOrGroup) => {
    const title = sessionOrGroup.topic || sessionOrGroup.name || 'study session';
    showToast(`Joining "${title}": Session access will be available soon.`);
  };

  const handleViewGroup = (group) => {
    showToast(`Opening group details for "${group.name}".`);
  };

  /**
   * Create Study Group submission handler
   */
  const handleCreateGroup = (newGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    showToast(`Study squad "${newGroup.name}" created successfully!`);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All Subjects');
    setSelectedDifficulty('All Difficulties');
    setSelectedGroupSize('all');
    setSelectedActivity('all');
    setJoinedOnly(false);
  };

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSubject !== 'All Subjects') count += 1;
    if (selectedDifficulty !== 'All Difficulties') count += 1;
    if (selectedGroupSize !== 'all') count += 1;
    if (selectedActivity !== 'all') count += 1;
    if (joinedOnly) count += 1;
    if (searchQuery.trim().length > 0) count += 1;
    return count;
  }, [
    selectedSubject,
    selectedDifficulty,
    selectedGroupSize,
    selectedActivity,
    joinedOnly,
    searchQuery,
  ]);

  // Client-side refined filtering (group size & activity level)
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // 1. Joined Groups Only Filter
      if (joinedOnly && !group.joined) {
        return false;
      }

      // 2. Search Query (Group name, Subject, Description, or Tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (group.name || '').toLowerCase().includes(q);
        const matchesSubject = (group.subject || '').toLowerCase().includes(q);
        const matchesDesc = (group.description || '').toLowerCase().includes(q);
        const tagsList = group.tags || group.topics || [];
        const matchesTags = tagsList.some((t) => t.toLowerCase().includes(q));

        if (!matchesName && !matchesSubject && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 3. Subject Filter
      if (selectedSubject !== 'All Subjects' && group.subject !== selectedSubject) {
        return false;
      }

      // 4. Difficulty Filter
      if (
        selectedDifficulty !== 'All Difficulties' &&
        (group.difficulty || '').toLowerCase() !== selectedDifficulty.toLowerCase() &&
        (group.level || '').toLowerCase() !== selectedDifficulty.toLowerCase()
      ) {
        return false;
      }

      // 5. Group Size Filter
      if (selectedGroupSize !== 'all') {
        const max = group.maxMembers || 0;
        if (selectedGroupSize === 'small' && max > 10) return false;
        if (selectedGroupSize === 'medium' && (max < 11 || max > 25)) return false;
        if (selectedGroupSize === 'large' && max < 26) return false;
      }

      // 6. Activity Filter (All, Active Today, Live Now)
      if (selectedActivity === 'active-today' && !group.activeToday && !group.isLive) {
        return false;
      }
      if (selectedActivity === 'live-now' && !group.isLive) {
        return false;
      }

      return true;
    });
  }, [
    groups,
    joinedOnly,
    searchQuery,
    selectedSubject,
    selectedDifficulty,
    selectedGroupSize,
    selectedActivity,
  ]);

  // Sorted groups calculation
  const sortedGroups = useMemo(() => {
    const list = [...filteredGroups];
    switch (sortBy) {
      case 'most-active':
        return list.sort((a, b) => {
          if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
          const order = { High: 3, Medium: 2, Low: 1 };
          return (order[b.activityLevel] || 0) - (order[a.activityLevel] || 0);
        });
      case 'most-members':
        return list.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
      case 'available-spots':
        return list.sort(
          (a, b) =>
            ((b.maxMembers || 0) - (b.memberCount || 0)) -
            ((a.maxMembers || 0) - (a.memberCount || 0))
        );
      case 'alphabetical':
        return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      default:
        return list;
    }
  }, [filteredGroups, sortBy]);

  // Featured study group: Gradient Descent or first available group
  const featuredGroup = useMemo(() => {
    if (groups.length === 0) return null;
    return (
      groups.find((g) => g.name === 'Gradient Descent') ||
      groups.find((g) => (g.id || g._id) === 'grp-gradient-descent') ||
      groups[0]
    );
  }, [groups]);

  return (
    <AppLayout>
      <div className="study-groups-container">
        {/* Section 1: Hero Section */}
        <StudyGroupsHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />

        {/* Section 2: Featured Study Group Spotlight */}
        {featuredGroup && (
          <FeaturedGroup
            group={featuredGroup}
            onToggleJoin={handleToggleJoin}
            onViewGroup={handleViewGroup}
            onJoinLiveSession={handleJoinLiveSession}
          />
        )}

        {/* Section 5: Live Study Sessions Happening Today */}
        <LiveSessions
          sessions={TODAY_LIVE_SESSIONS}
          onJoinSession={handleJoinLiveSession}
        />

        {/* Section 3 & 4: Group Filters + Study Group Grid */}
        <div className="sg-browser-layout">
          <GroupFilters
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            selectedGroupSize={selectedGroupSize}
            onGroupSizeChange={setSelectedGroupSize}
            selectedActivity={selectedActivity}
            onActivityChange={setSelectedActivity}
            joinedOnly={joinedOnly}
            onJoinedOnlyToggle={setJoinedOnly}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />

          <main className="sg-content-area" aria-label="Study Groups Cards Grid">
            {/* Sort Toolbar */}
            <div className="sg-toolbar">
              <span className="text-xs font-semibold text-ink-soft">
                Showing {sortedGroups.length}{' '}
                {sortedGroups.length === 1 ? 'Study Group' : 'Study Groups'}
              </span>

              <div className="sg-sort-wrap">
                <ArrowUpDown size={12} className="text-pine" aria-hidden="true" />
                <label htmlFor="sg-sort-select" className="sg-sort-label">
                  Sort:
                </label>
                <select
                  id="sg-sort-select"
                  className="sg-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort study groups"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading, Error, Empty, or Cards Grid */}
            {isLoading && groups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-ink-faint">
                <Loader2 size={32} className="animate-spin text-pine mb-3" aria-hidden="true" />
                <p className="text-sm font-medium">Loading study squads...</p>
              </div>
            ) : errorMessage && groups.length === 0 ? (
              <div className="sg-empty-card" role="alert">
                <div className="sg-empty-icon text-rust" aria-hidden="true">
                  <AlertCircle size={32} />
                </div>
                <h3 className="sg-empty-title serif text-rust">Failed to load study squads</h3>
                <p className="sg-empty-subtitle">{errorMessage}</p>
                <div className="sg-empty-actions">
                  <button
                    type="button"
                    className="sg-modal-submit-btn flex items-center gap-2"
                    onClick={fetchStudyGroups}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            ) : sortedGroups.length === 0 ? (
              <EmptyGroups
                onResetFilters={handleResetFilters}
                onCreateClick={() => setIsCreateModalOpen(true)}
              />
            ) : (
              <div className="sg-cards-grid" role="list">
                {sortedGroups.map((group) => (
                  <StudyGroupCard
                    key={group.id || group._id}
                    group={group}
                    onToggleJoin={handleToggleJoin}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Section 6: Group Activity Panel */}
        <GroupActivity activities={REALISTIC_ACTIVITIES} />

        {/* Section 7: Create Study Group Modal */}
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateGroup={handleCreateGroup}
        />

        {/* Floating Confirmation Toast */}
        {toastMessage && (
          <div className="sg-toast" role="status" aria-live="polite">
            <CheckCircle2 size={18} className="sg-toast-icon" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StudyGroups;
