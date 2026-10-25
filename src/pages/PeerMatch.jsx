import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowUpDown } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PeerMatchHero from '../features/peer-match/components/PeerMatchHero';
import FeaturedMatch from '../features/peer-match/components/FeaturedMatch';
import MatchFilters from '../features/peer-match/components/MatchFilters';
import MatchCard from '../features/peer-match/components/MatchCard';
import CollaborationSuggestions from '../features/peer-match/components/CollaborationSuggestions';
import EmptyMatches from '../features/peer-match/components/EmptyMatches';
import PeerProfileModal from '../features/peer-match/components/PeerProfileModal';

import {
  CURRENT_USER,
  FEATURED_PEER,
  PEER_MATCHES,
  SORT_OPTIONS,
} from '../features/peer-match/peerMatchData';

import '../features/peer-match/peerMatch.css';

/**
 * PeerMatch discovery page component
 * 
 * Future Backend Architecture (Express + MongoDB):
 * GET  /api/users/matches      -> Returns algorithmically scored peer list for req.user
 * GET  /api/users/:id          -> Returns full user profile
 * POST /api/connections/:userId -> Toggles/updates connection request status between two students
 */
export const PeerMatch = () => {
  const location = useLocation();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('All Interests');
  const [selectedAvailability, setSelectedAvailability] = useState('All Times');
  const [minScore, setMinScore] = useState(0);

  // Visible Sort Control
  const [sortBy, setSortBy] = useState('best-match');

  // Connection state map: { [peerId]: 'idle' | 'request-sent' | 'connected' }
  const [connectionStatuses, setConnectionStatuses] = useState(() => {
    const initialMap = {};
    PEER_MATCHES.forEach((peer) => {
      initialMap[peer.id] = peer.collaborationStatus || 'idle';
    });
    return initialMap;
  });

  // Profile modal state
  const [viewingPeer, setViewingPeer] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  // Parse location state passed from Dashboard or search bar
  useEffect(() => {
    if (location.state) {
      const stateObj = location.state;
      if (stateObj.searchQuery) {
        setSearchQuery(stateObj.searchQuery);
      }
      if (stateObj.focusSearch) {
        setTimeout(() => {
          const el = document.getElementById('pm-search-in');
          if (el) el.focus();
        }, 150);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Connect state machine:
   * idle -> request-sent -> connected
   * Future Backend API Call:
   * POST /api/connections/:userId
   */
  const handleConnect = (peerId) => {
    const currentStatus = connectionStatuses[peerId] || 'idle';
    const targetPeer = PEER_MATCHES.find((p) => p.id === peerId);
    const peerName = targetPeer?.name || 'collaborator';

    let nextStatus = 'request-sent';
    if (currentStatus === 'idle') {
      nextStatus = 'request-sent';
      showToast(`Connection request sent to ${peerName}!`);
    } else if (currentStatus === 'request-sent') {
      nextStatus = 'connected';
      showToast(`You and ${peerName} are now connected!`);
    } else {
      nextStatus = 'connected';
      showToast(`Already connected with ${peerName}.`);
    }

    setConnectionStatuses((prev) => ({
      ...prev,
      [peerId]: nextStatus,
    }));
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All Departments');
    setSelectedSemester('All Semesters');
    setSelectedSkills([]);
    setSelectedInterest('All Interests');
    setSelectedAvailability('All Times');
    setMinScore(0);
  };

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedDept !== 'All Departments') count += 1;
    if (selectedSemester !== 'All Semesters') count += 1;
    if (selectedSkills.length > 0) count += selectedSkills.length;
    if (selectedInterest !== 'All Interests') count += 1;
    if (selectedAvailability !== 'All Times') count += 1;
    if (minScore > 0) count += 1;
    if (searchQuery.trim().length > 0) count += 1;
    return count;
  }, [
    selectedDept,
    selectedSemester,
    selectedSkills,
    selectedInterest,
    selectedAvailability,
    minScore,
    searchQuery,
  ]);

  // Compute filtered peers
  const filteredPeers = useMemo(() => {
    return PEER_MATCHES.filter((peer) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = peer.name.toLowerCase().includes(query);
        const matchesDept = peer.department.toLowerCase().includes(query);
        const matchesBio = peer.bio?.toLowerCase().includes(query);
        const matchesSkills = peer.skills.some((s) => s.toLowerCase().includes(query));
        const matchesInterests = peer.interests?.some((i) => i.toLowerCase().includes(query));
        const matchesGoals = peer.projectGoals?.toLowerCase().includes(query);

        if (
          !matchesName &&
          !matchesDept &&
          !matchesBio &&
          !matchesSkills &&
          !matchesInterests &&
          !matchesGoals
        ) {
          return false;
        }
      }

      // 2. Department Filter
      if (selectedDept !== 'All Departments' && peer.department !== selectedDept) {
        return false;
      }

      // 3. Semester Filter
      if (selectedSemester !== 'All Semesters') {
        const targetSemNumber = parseInt(selectedSemester.replace(/\D/g, ''), 10);
        if (peer.semester !== targetSemNumber) {
          return false;
        }
      }

      // 4. Interest Filter
      if (selectedInterest !== 'All Interests') {
        if (!peer.interests.includes(selectedInterest)) {
          return false;
        }
      }

      // 5. Minimum Compatibility Score
      if (minScore > 0 && peer.matchScore < minScore) {
        return false;
      }

      // 6. Availability Schedule
      if (selectedAvailability !== 'All Times') {
        if (!peer.availability.includes(selectedAvailability)) {
          return false;
        }
      }

      // 7. Technical Skills (peer must possess all selected skills)
      if (selectedSkills.length > 0) {
        const hasAllSelected = selectedSkills.every((reqSkill) =>
          peer.skills.includes(reqSkill)
        );
        if (!hasAllSelected) return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedDept,
    selectedSemester,
    selectedInterest,
    minScore,
    selectedAvailability,
    selectedSkills,
  ]);

  // Sort filtered peers
  const sortedPeers = useMemo(() => {
    const list = [...filteredPeers];
    switch (sortBy) {
      case 'recently-active':
        // Online peers first, then by match score
        return list.sort((a, b) => {
          if (a.isOnline === b.isOnline) return b.matchScore - a.matchScore;
          return a.isOnline ? -1 : 1;
        });
      case 'same-dept':
        // Same department as CURRENT_USER first, then by score
        return list.sort((a, b) => {
          const aSame = a.department === CURRENT_USER.department;
          const bSame = b.department === CURRENT_USER.department;
          if (aSame === bSame) return b.matchScore - a.matchScore;
          return aSame ? -1 : 1;
        });
      case 'availability':
        // Shared availability first, then by score
        return list.sort((a, b) => {
          const aOverlap = a.availability.some((av) => CURRENT_USER.availability.includes(av));
          const bOverlap = b.availability.some((av) => CURRENT_USER.availability.includes(av));
          if (aOverlap === bOverlap) return b.matchScore - a.matchScore;
          return aOverlap ? -1 : 1;
        });
      case 'best-match':
      default:
        return list.sort((a, b) => b.matchScore - a.matchScore);
    }
  }, [filteredPeers, sortBy]);

  // Featured peer: Ananya Rao if she is in filtered list, else highest scoring match
  const currentFeatured = useMemo(() => {
    if (sortedPeers.some((p) => p.id === FEATURED_PEER.id)) {
      return FEATURED_PEER;
    }
    return sortedPeers.length > 0 ? sortedPeers[0] : null;
  }, [sortedPeers]);

  // Remaining peers for the grid
  const gridPeers = useMemo(() => {
    return sortedPeers.filter((p) => p.id !== currentFeatured?.id);
  }, [sortedPeers, currentFeatured]);

  const handleSelectPeerFromSuggestion = (peerId) => {
    const el = document.getElementById(`peer-name-${peerId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <AppLayout>
      <div className="peer-match-container">
        {/* Section 1: Hero Header */}
        <PeerMatchHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          matchCount={sortedPeers.length}
          currentUser={CURRENT_USER}
        />

        {/* Section 2: Featured Best Match (Ananya Rao) */}
        {currentFeatured && (
          <FeaturedMatch
            peer={currentFeatured}
            collaborationStatus={connectionStatuses[currentFeatured.id] || 'idle'}
            onConnect={handleConnect}
            onViewProfile={(p) => setViewingPeer(p)}
          />
        )}

        {/* Section 3 & 4: Filter Sidebar + Match Results Grid */}
        <div className="peer-browser-layout">
          <MatchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDept={selectedDept}
            onDeptChange={setSelectedDept}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            selectedSkills={selectedSkills}
            onSkillToggle={handleSkillToggle}
            selectedInterest={selectedInterest}
            onInterestChange={setSelectedInterest}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={setSelectedAvailability}
            minScore={minScore}
            onMinScoreChange={setMinScore}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />

          <main className="peer-cards-section" aria-label="Peer Match Results">
            {/* Sort Bar */}
            <div className="peer-sort-bar">
              <div className="peer-sort-label-wrap">
                <ArrowUpDown size={14} className="text-pine" aria-hidden="true" />
                <span className="peer-sort-label">Sort by:</span>
              </div>
              <div className="peer-sort-options" role="radiogroup" aria-label="Sort peers">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`sort-option-btn ${sortBy === opt.value ? 'sort-btn-active' : ''}`}
                    onClick={() => setSortBy(opt.value)}
                    role="radio"
                    aria-checked={sortBy === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid or Empty State */}
            {sortedPeers.length === 0 ? (
              <EmptyMatches onResetFilters={handleResetFilters} />
            ) : (
              <div className="peer-cards-grid" role="list">
                {gridPeers.map((peer) => (
                  <MatchCard
                    key={peer.id}
                    peer={peer}
                    collaborationStatus={connectionStatuses[peer.id] || 'idle'}
                    onConnect={handleConnect}
                    onViewProfile={(p) => setViewingPeer(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Section 6: Collaboration Suggestions */}
        <CollaborationSuggestions
          onSelectPeer={handleSelectPeerFromSuggestion}
        />

        {/* Peer Profile Modal */}
        {viewingPeer && (
          <PeerProfileModal
            peer={viewingPeer}
            collaborationStatus={connectionStatuses[viewingPeer.id] || 'idle'}
            onConnect={handleConnect}
            onClose={() => setViewingPeer(null)}
          />
        )}

        {/* Floating Confirmation Toast */}
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

export default PeerMatch;
