import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowUpDown, RefreshCw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import PeerMatchHero from '../features/peer-match/components/PeerMatchHero';
import FeaturedMatch from '../features/peer-match/components/FeaturedMatch';
import MatchFilters from '../features/peer-match/components/MatchFilters';
import MatchCard from '../features/peer-match/components/MatchCard';
import CollaborationSuggestions from '../features/peer-match/components/CollaborationSuggestions';
import EmptyMatches from '../features/peer-match/components/EmptyMatches';
import PeerProfileModal from '../features/peer-match/components/PeerProfileModal';
import { useAuth } from '../context/useAuth';
import api from '../services/api';

import { SORT_OPTIONS } from '../features/peer-match/peerMatchData';
import '../features/peer-match/peerMatch.css';

/**
 * PeerMatch discovery page component
 * Connects directly to MongoDB backend /api/users to discover compatible student peers
 * with explainable algorithmic match scoring.
 */
export const PeerMatch = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user: currentUser } = useAuth();

  // Filter state synchronized with URL query parameters
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedDept, setSelectedDept] = useState(() => searchParams.get('dept') || 'All Departments');
  const [selectedSemester, setSelectedSemester] = useState(() => searchParams.get('sem') || 'All Semesters');
  const [selectedSkills, setSelectedSkills] = useState(() => {
    const s = searchParams.get('skills');
    return s ? s.split(',').map((x) => x.trim()).filter(Boolean) : [];
  });
  const [selectedInterest, setSelectedInterest] = useState(() => searchParams.get('interest') || 'All Interests');
  const [selectedAvailability, setSelectedAvailability] = useState(() => searchParams.get('avail') || 'All Times');
  const [minScore, setMinScore] = useState(() => parseInt(searchParams.get('minScore') || '0', 10));

  // Sort state
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'best-match');

  // Peer records & pagination from API
  const [peers, setPeers] = useState([]);
  const [_pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Connection state map: { [peerId]: 'idle' | 'request-sent' | 'connected' }
  const [connectionStatuses, setConnectionStatuses] = useState({});

  // Profile modal state
  const [viewingPeer, setViewingPeer] = useState(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to sync filter changes to URL search parameters
  const syncUrlParams = useCallback(
    (overrides = {}) => {
      const state = {
        search: searchQuery,
        dept: selectedDept,
        sem: selectedSemester,
        skills: selectedSkills,
        interest: selectedInterest,
        avail: selectedAvailability,
        minScore: minScore,
        sort: sortBy,
        ...overrides,
      };

      const params = new URLSearchParams();
      if (state.search && state.search.trim()) params.set('search', state.search.trim());
      if (state.dept && state.dept !== 'All Departments') params.set('dept', state.dept);
      if (state.sem && state.sem !== 'All Semesters') params.set('sem', state.sem);
      if (Array.isArray(state.skills) && state.skills.length > 0) params.set('skills', state.skills.join(','));
      if (state.interest && state.interest !== 'All Interests') params.set('interest', state.interest);
      if (state.avail && state.avail !== 'All Times') params.set('avail', state.avail);
      if (state.minScore > 0) params.set('minScore', String(state.minScore));
      if (state.sort && state.sort !== 'best-match') params.set('sort', state.sort);

      setSearchParams(params, { replace: true });
    },
    [
      searchQuery,
      selectedDept,
      selectedSemester,
      selectedSkills,
      selectedInterest,
      selectedAvailability,
      minScore,
      sortBy,
      setSearchParams,
    ]
  );

  // Handle incoming location navigation state
  useEffect(() => {
    if (location.state) {
      const stateObj = location.state;
      if (stateObj.searchQuery) {
        setSearchQuery(stateObj.searchQuery);
        syncUrlParams({ search: stateObj.searchQuery });
      }
      if (stateObj.focusSearch) {
        setTimeout(() => {
          const el = document.getElementById('pm-search-in');
          if (el) el.focus();
        }, 150);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, syncUrlParams]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Fetch discoverable student peers from MongoDB API
   */
  const fetchPeers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // Translate frontend sort to API sort parameter
      let apiSort = 'compatibility';
      if (sortBy === 'recently-active') apiSort = 'newest';
      if (sortBy === 'name') apiSort = 'name';

      const params = {
        page: 1,
        limit: 100, // Fetch candidates to support frontend minScore slider and pagination
        sort: apiSort,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedDept !== 'All Departments') params.department = selectedDept;
      if (selectedSemester !== 'All Semesters') params.semester = selectedSemester;
      if (selectedSkills.length > 0) params.skills = selectedSkills.join(',');
      if (selectedInterest !== 'All Interests') params.interests = selectedInterest;
      if (selectedAvailability !== 'All Times') params.availability = selectedAvailability;

      const res = await api.get('/users', { params });
      const studentList = res.data?.data?.students || [];
      const pageInfo = res.data?.data?.pagination || { page: 1, limit: 12, total: 0, totalPages: 0 };

      setPeers(studentList);
      setPagination(pageInfo);
    } catch (err) {
      console.error('Failed to fetch peer matches:', err);
      const msg = err.response?.data?.message || 'Could not load student peers. Please check your connection.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [
    searchQuery,
    selectedDept,
    selectedSemester,
    selectedSkills,
    selectedInterest,
    selectedAvailability,
    sortBy,
  ]);

  // Debounced fetch on filter/query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPeers();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchPeers]);

  // Connection request state machine
  const handleConnect = (peerId) => {
    const currentStatus = connectionStatuses[peerId] || 'idle';
    const targetPeer = peers.find((p) => (p._id || p.id) === peerId);
    const peerName = targetPeer?.name || 'peer';

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

  /**
   * Open full peer profile modal using GET /api/users/:id
   */
  const handleViewProfile = async (peer) => {
    const peerId = peer._id || peer.id;
    setViewingPeer(peer);

    try {
      const res = await api.get(`/users/${peerId}`);
      if (res.data?.data?.user) {
        setViewingPeer(res.data.data.user);
      }
    } catch (err) {
      console.warn('Could not fetch full peer profile from API; showing card data:', err);
    }
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) => {
      const next = prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill];
      syncUrlParams({ skills: next });
      return next;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('All Departments');
    setSelectedSemester('All Semesters');
    setSelectedSkills([]);
    setSelectedInterest('All Interests');
    setSelectedAvailability('All Times');
    setMinScore(0);
    setSortBy('best-match');
    setSearchParams(new URLSearchParams(), { replace: true });
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

  // Apply minimum score threshold
  const displayedPeers = useMemo(() => {
    if (minScore <= 0) return peers;
    return peers.filter((p) => {
      const score = p.compatibilityScore ?? p.matchScore ?? 0;
      return score >= minScore;
    });
  }, [peers, minScore]);

  // Featured peer is the highest scored peer among displayed
  const currentFeatured = useMemo(() => {
    return displayedPeers.length > 0 ? displayedPeers[0] : null;
  }, [displayedPeers]);

  // Remaining peers for the grid
  const gridPeers = useMemo(() => {
    if (!currentFeatured) return [];
    const featuredId = currentFeatured._id || currentFeatured.id;
    return displayedPeers.filter((p) => (p._id || p.id) !== featuredId);
  }, [displayedPeers, currentFeatured]);

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
          onSearchChange={(val) => {
            setSearchQuery(val);
            syncUrlParams({ search: val });
          }}
          matchCount={displayedPeers.length}
          currentUser={currentUser}
        />

        {/* Section 2: Featured Best Match */}
        {currentFeatured && !isLoading && (
          <FeaturedMatch
            peer={currentFeatured}
            collaborationStatus={connectionStatuses[currentFeatured._id || currentFeatured.id] || 'idle'}
            onConnect={handleConnect}
            onViewProfile={handleViewProfile}
          />
        )}

        {/* Section 3 & 4: Filter Sidebar + Match Results Grid */}
        <div className="peer-browser-layout">
          <MatchFilters
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              syncUrlParams({ search: val });
            }}
            selectedDept={selectedDept}
            onDeptChange={(val) => {
              setSelectedDept(val);
              syncUrlParams({ dept: val });
            }}
            selectedSemester={selectedSemester}
            onSemesterChange={(val) => {
              setSelectedSemester(val);
              syncUrlParams({ sem: val });
            }}
            selectedSkills={selectedSkills}
            onSkillToggle={handleSkillToggle}
            selectedInterest={selectedInterest}
            onInterestChange={(val) => {
              setSelectedInterest(val);
              syncUrlParams({ interest: val });
            }}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={(val) => {
              setSelectedAvailability(val);
              syncUrlParams({ avail: val });
            }}
            minScore={minScore}
            onMinScoreChange={(val) => {
              setMinScore(val);
              syncUrlParams({ minScore: val });
            }}
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
                    onClick={() => {
                      setSortBy(opt.value);
                      syncUrlParams({ sort: opt.value });
                    }}
                    role="radio"
                    aria-checked={sortBy === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

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
                  onClick={fetchPeers}
                >
                  <RefreshCw size={13} aria-hidden="true" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '40vh',
                  gap: '14px',
                }}
                role="status"
                aria-live="polite"
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    border: '3px solid rgba(47, 93, 80, 0.2)',
                    borderTopColor: 'var(--pine, #2f5d50)',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                  aria-hidden="true"
                />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink-soft)' }}>
                  Discovering compatible peers from MongoDB...
                </span>
              </div>
            )}

            {/* Grid or Empty State */}
            {!isLoading && displayedPeers.length === 0 ? (
              <EmptyMatches onResetFilters={handleResetFilters} />
            ) : (
              !isLoading && (
                <div className="peer-cards-grid" role="list">
                  {gridPeers.map((peer) => (
                    <MatchCard
                      key={peer._id || peer.id}
                      peer={peer}
                      collaborationStatus={connectionStatuses[peer._id || peer.id] || 'idle'}
                      onConnect={handleConnect}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              )
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
            collaborationStatus={connectionStatuses[viewingPeer._id || viewingPeer.id] || 'idle'}
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
