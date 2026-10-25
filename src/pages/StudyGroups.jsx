import React, { useState, useMemo } from 'react';
import { CheckCircle2, ArrowUpDown } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import StudyGroupsHero from '../features/study-groups/components/StudyGroupsHero';
import FeaturedGroup from '../features/study-groups/components/FeaturedGroup';
import GroupFilters from '../features/study-groups/components/GroupFilters';
import StudyGroupCard from '../features/study-groups/components/StudyGroupCard';
import LiveSessions from '../features/study-groups/components/LiveSessions';
import GroupActivity from '../features/study-groups/components/GroupActivity';
import CreateGroupModal from '../features/study-groups/components/CreateGroupModal';
import EmptyGroups from '../features/study-groups/components/EmptyGroups';

import {
  INITIAL_STUDY_GROUPS,
  TODAY_LIVE_SESSIONS,
  REALISTIC_ACTIVITIES,
  SORT_OPTIONS,
} from '../features/study-groups/studyGroupsData';

import '../features/study-groups/studyGroups.css';

/**
 * StudyGroups Discovery Page
 * 
 * Future Backend Architecture (Express + MongoDB):
 * GET    /api/study-groups                -> List study groups with query params (subject, difficulty, search, activity, size)
 * POST   /api/study-groups                -> Create a new study group cohort
 * GET    /api/study-groups/:id            -> Get full details of a study group, syllabus & member roster
 * POST   /api/study-groups/:id/join       -> Join a study group
 * DELETE /api/study-groups/:id/leave      -> Leave a study group
 * GET    /api/study-groups/live-sessions  -> Retrieve real-time active & upcoming sessions scheduled today
 */
export const StudyGroups = () => {
  // Study groups dataset state
  const [groups, setGroups] = useState(INITIAL_STUDY_GROUPS);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
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

  /**
   * Local state toggle for Join Group -> Joined
   * 
   * Future Backend Integration:
   * if (!group.joined) await axios.post(`/api/study-groups/${groupId}/join`);
   * else await axios.delete(`/api/study-groups/${groupId}/leave`);
   */
  const handleToggleJoin = (groupId) => {
    setGroups((prevGroups) =>
      prevGroups.map((g) => {
        if (g.id !== groupId) return g;

        if (g.joined) {
          showToast(`You left ${g.name}.`);
          return {
            ...g,
            joined: false,
            memberCount: Math.max(1, g.memberCount - 1),
          };
        }

        if (g.memberCount >= g.maxMembers) {
          showToast(`${g.name} is currently full.`);
          return g;
        }

        showToast(`You joined ${g.name}! Welcome aboard.`);
        return {
          ...g,
          joined: true,
          memberCount: g.memberCount + 1,
        };
      })
    );
  };

  /**
   * Section 5 Join Live Session action
   */
  const handleJoinLiveSession = (sessionOrGroup) => {
    const title = sessionOrGroup.topic || sessionOrGroup.name || 'study session';
    showToast(`Joining "${title}": Session access will be available after backend integration.`);
  };

  const handleViewGroup = (group) => {
    showToast(`Opening group details for "${group.name}".`);
  };

  /**
   * Section 7 Create Study Group submission
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

  // Filtered groups calculation
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // 1. Joined Groups Only Filter
      if (joinedOnly && !group.joined) {
        return false;
      }

      // 2. Search Query (Group name, Subject, or Tag)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = group.name.toLowerCase().includes(q);
        const matchesSubject = group.subject.toLowerCase().includes(q);
        const matchesDesc = group.description.toLowerCase().includes(q);
        const matchesTags = group.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesName && !matchesSubject && !matchesDesc && !matchesTags) {
          return false;
        }
      }

      // 3. Subject Filter
      if (selectedSubject !== 'All Subjects' && group.subject !== selectedSubject) {
        return false;
      }

      // 4. Difficulty Filter
      if (selectedDifficulty !== 'All Difficulties' && group.difficulty !== selectedDifficulty) {
        return false;
      }

      // 5. Group Size Filter
      if (selectedGroupSize !== 'all') {
        if (selectedGroupSize === 'small' && group.maxMembers > 10) return false;
        if (selectedGroupSize === 'medium' && (group.maxMembers < 11 || group.maxMembers > 25)) return false;
        if (selectedGroupSize === 'large' && group.maxMembers < 26) return false;
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
        return list.sort((a, b) => b.memberCount - a.memberCount);
      case 'available-spots':
        return list.sort(
          (a, b) => (b.maxMembers - b.memberCount) - (a.maxMembers - a.memberCount)
        );
      case 'alphabetical':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [filteredGroups, sortBy]);

  // Featured study group: Gradient Descent
  const featuredGroup = useMemo(() => {
    return groups.find((g) => g.id === 'grp-gradient-descent') || groups[0];
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

        {/* Section 2: Featured Study Group (Gradient Descent) */}
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

        {/* Section 3 & 4: Group Filters + Study Group Grid (3 cols desktop, 2 tablet, 1 mobile) */}
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
                Showing {sortedGroups.length} {sortedGroups.length === 1 ? 'Study Group' : 'Study Groups'}
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

            {/* Section 4: Study Group Cards Grid or Section 8: Empty State */}
            {sortedGroups.length === 0 ? (
              <EmptyGroups
                onResetFilters={handleResetFilters}
                onCreateClick={() => setIsCreateModalOpen(true)}
              />
            ) : (
              <div className="sg-cards-grid" role="list">
                {sortedGroups.map((group) => (
                  <StudyGroupCard
                    key={group.id}
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
