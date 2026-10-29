import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import DiscussionsHero from '../features/discussions/components/DiscussionsHero';
import FeaturedDiscussion from '../features/discussions/components/FeaturedDiscussion';
import TrendingTopics from '../features/discussions/components/TrendingTopics';
import DiscussionFilters from '../features/discussions/components/DiscussionFilters';
import DiscussionCard from '../features/discussions/components/DiscussionCard';
import EmptyDiscussions from '../features/discussions/components/EmptyDiscussions';
import DiscussionDetailModal from '../features/discussions/components/DiscussionDetailModal';
import CreateDiscussionModal from '../features/discussions/components/CreateDiscussionModal';

import { discussionApi } from '../services/api';
import { ROUTES } from '../constants/routes';

import '../features/discussions/discussions.css';

/**
 * Discussions Page
 * Clean academic discussion forum where students can ask questions, post answers,
 * upvote useful content, mark accepted answers, filter by subject, and discover trending topics.
 * Connected to Express + MongoDB backend (/api/discussions).
 */
export const Discussions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Discussions state
  const [discussions, setDiscussions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [userUpvotedDiscussions, setUserUpvotedDiscussions] = useState({});
  const [userUpvotedAnswers, setUserUpvotedAnswers] = useState({});

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [myDiscussionsOnly, setMyDiscussionsOnly] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  // Modal states
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Debounce search input for responsive backend queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Fetch discussions from the backend API
   */
  const fetchDiscussions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = {
        page: 1,
        limit: 100, // Load discussions to support rich client-side responsiveness
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (selectedSubject !== 'All Subjects') {
        params.subject = selectedSubject;
      }

      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }

      if (selectedTopic) {
        params.tags = selectedTopic;
      }

      if (myDiscussionsOnly) {
        params.mine = 'true';
      }

      // Map frontend sort values to API sort parameters
      switch (sortBy) {
        case 'upvoted':
          params.sort = 'mostVoted';
          break;
        case 'answered':
          params.sort = 'mostAnswered';
          break;
        case 'viewed':
          params.sort = 'mostViewed';
          break;
        case 'recent':
        default:
          params.sort = 'newest';
          break;
      }

      const res = await discussionApi.getDiscussions(params);
      const items = res.data?.data?.discussions || [];
      setDiscussions(items);

      // Populate upvote states from backend response
      const initialUpvotedDiscussions = {};
      const initialUpvotedAnswers = {};

      items.forEach((d) => {
        const dId = d.id || d._id;
        if (d.isVotedByCurrentUser) {
          initialUpvotedDiscussions[dId] = true;
        }
        if (Array.isArray(d.answers)) {
          d.answers.forEach((ans) => {
            const ansId = ans.id || ans._id;
            if (ans.isVotedByCurrentUser) {
              initialUpvotedAnswers[ansId] = true;
            }
          });
        }
      });

      setUserUpvotedDiscussions((prev) => ({ ...initialUpvotedDiscussions, ...prev }));
      setUserUpvotedAnswers((prev) => ({ ...initialUpvotedAnswers, ...prev }));
    } catch (err) {
      console.error('Failed to load discussions:', err);
      const msg =
        err.response?.data?.message ||
        'Could not load discussions. Please check your network connection.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedSubject, selectedStatus, selectedTopic, myDiscussionsOnly, sortBy]);

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  // Synchronize route state triggers (e.g. from Dashboard quick actions or cards)
  useEffect(() => {
    if (location.state) {
      const stateObj = location.state;
      if (stateObj.openCreateDiscussionModal || stateObj.openCreateDiscussion) {
        setIsCreateModalOpen(true);
      }
      if (stateObj.discussionId && discussions.length > 0) {
        const disc = discussions.find((d) => (d.id || d._id) === stateObj.discussionId);
        if (disc) {
          handleOpenDiscussion(disc);
        }
      }
      // Clear location state to prevent repeating on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, discussions]);

  // Featured discussion spotlight: DBMS normalization discussion or top-voted solved
  const featuredDiscussion = useMemo(() => {
    if (discussions.length === 0) return null;
    return (
      discussions.find((d) => (d.id || d._id) === 'disc-dbms-norm') ||
      discussions.find((d) => d.isSolved && d.voteCount >= 4) ||
      discussions.find((d) => d.title.toLowerCase().includes('normalization')) ||
      discussions[0]
    );
  }, [discussions]);

  // Open discussion detail & increment view count via API
  const handleOpenDiscussion = async (disc) => {
    const discId = disc.id || disc._id;
    const currentViewCount = Number(disc.viewCount || disc.views || 0);

    const updated = {
      ...disc,
      viewCount: currentViewCount + 1,
      views: currentViewCount + 1,
    };
    setSelectedDiscussion(updated);
    setDiscussions((prev) =>
      prev.map((d) => ((d.id || d._id) === discId ? updated : d))
    );

    // Call API view endpoint and fetch latest details
    try {
      discussionApi.viewDiscussion(discId).catch(() => {});
      const freshRes = await discussionApi.getDiscussionById(discId);
      if (freshRes.data?.data) {
        setSelectedDiscussion(freshRes.data.data);
      }
    } catch (err) {
      console.warn('Could not refresh full discussion details:', err);
    }
  };

  // Open discussion and scroll to answer section
  const handleAnswerQuestion = (disc) => {
    handleOpenDiscussion(disc);
  };

  // Discussion Upvote Toggle
  const handleUpvoteDiscussion = async (discussionId) => {
    const hasUpvoted = Boolean(userUpvotedDiscussions[discussionId]);
    const voteDelta = hasUpvoted ? -1 : 1;

    // Optimistic UI update
    setUserUpvotedDiscussions((prev) => ({
      ...prev,
      [discussionId]: !hasUpvoted,
    }));

    setDiscussions((prev) =>
      prev.map((d) => {
        if ((d.id || d._id) === discussionId) {
          return {
            ...d,
            voteCount: Math.max(0, d.voteCount + voteDelta),
            isVotedByCurrentUser: !hasUpvoted,
          };
        }
        return d;
      })
    );

    if (selectedDiscussion && (selectedDiscussion.id || selectedDiscussion._id) === discussionId) {
      setSelectedDiscussion((prev) => ({
        ...prev,
        voteCount: Math.max(0, prev.voteCount + voteDelta),
        isVotedByCurrentUser: !hasUpvoted,
      }));
    }

    try {
      const res = await discussionApi.voteDiscussion(discussionId);
      const serverVoteCount = res.data?.data?.voteCount;
      const serverIsVoted = res.data?.data?.isVotedByCurrentUser;

      if (serverVoteCount !== undefined) {
        setDiscussions((prev) =>
          prev.map((d) =>
            (d.id || d._id) === discussionId
              ? { ...d, voteCount: serverVoteCount, isVotedByCurrentUser: serverIsVoted }
              : d
          )
        );
        if (selectedDiscussion && (selectedDiscussion.id || selectedDiscussion._id) === discussionId) {
          setSelectedDiscussion((prev) => ({
            ...prev,
            voteCount: serverVoteCount,
            isVotedByCurrentUser: serverIsVoted,
          }));
        }
      }
    } catch (err) {
      console.error('Discussion vote failed:', err);
      // Revert optimistic update
      setUserUpvotedDiscussions((prev) => ({
        ...prev,
        [discussionId]: hasUpvoted,
      }));
      fetchDiscussions();
      showToast('Could not record vote. Please check your connection.');
    }
  };

  // Answer Upvote Toggle
  const handleUpvoteAnswer = async (discussionId, answerId) => {
    const hasUpvoted = Boolean(userUpvotedAnswers[answerId]);
    const voteDelta = hasUpvoted ? -1 : 1;

    // Optimistic UI update
    setUserUpvotedAnswers((prev) => ({
      ...prev,
      [answerId]: !hasUpvoted,
    }));

    const updateAnswers = (answersList) =>
      answersList.map((a) => {
        if ((a.id || a._id) === answerId) {
          return {
            ...a,
            voteCount: Math.max(0, a.voteCount + voteDelta),
            isVotedByCurrentUser: !hasUpvoted,
          };
        }
        return a;
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if ((d.id || d._id) === discussionId) {
          return {
            ...d,
            answers: updateAnswers(d.answers || []),
          };
        }
        return d;
      })
    );

    if (selectedDiscussion && (selectedDiscussion.id || selectedDiscussion._id) === discussionId) {
      setSelectedDiscussion((prev) => ({
        ...prev,
        answers: updateAnswers(prev.answers || []),
      }));
    }

    try {
      const res = await discussionApi.voteAnswer(discussionId, answerId);
      const serverVoteCount = res.data?.data?.voteCount;
      const serverIsVoted = res.data?.data?.isVotedByCurrentUser;

      if (serverVoteCount !== undefined) {
        const syncAnswers = (answersList) =>
          answersList.map((a) =>
            (a.id || a._id) === answerId
              ? { ...a, voteCount: serverVoteCount, isVotedByCurrentUser: serverIsVoted }
              : a
          );

        setDiscussions((prev) =>
          prev.map((d) =>
            (d.id || d._id) === discussionId
              ? { ...d, answers: syncAnswers(d.answers || []) }
              : d
          )
        );
        if (selectedDiscussion && (selectedDiscussion.id || selectedDiscussion._id) === discussionId) {
          setSelectedDiscussion((prev) => ({
            ...prev,
            answers: syncAnswers(prev.answers || []),
          }));
        }
      }
    } catch (err) {
      console.error('Answer vote failed:', err);
      // Revert optimistic update
      setUserUpvotedAnswers((prev) => ({
        ...prev,
        [answerId]: hasUpvoted,
      }));
      showToast('Could not record vote on answer.');
    }
  };

  // Toggle Accept / Unaccept Answer via API
  const handleToggleAcceptAnswer = async (discussionId, answerId) => {
    try {
      const res = await discussionApi.acceptAnswer(discussionId, answerId);
      const updatedDiscussion = res.data?.data?.discussion;
      const isAccepted = res.data?.data?.isAccepted;

      if (updatedDiscussion) {
        setDiscussions((prev) =>
          prev.map((d) => ((d.id || d._id) === discussionId ? updatedDiscussion : d))
        );
        if (selectedDiscussion && (selectedDiscussion.id || selectedDiscussion._id) === discussionId) {
          setSelectedDiscussion(updatedDiscussion);
        }
      }

      showToast(
        isAccepted
          ? 'Answer marked as accepted solution!'
          : 'Accepted solution marker removed.'
      );
    } catch (err) {
      console.error('Toggle accept answer failed:', err);
      const msg = err.response?.data?.message || 'Failed to update accepted answer.';
      showToast(msg);
    }
  };

  // Post New Answer via API
  const handleSubmitAnswer = async (discussionId, body) => {
    try {
      const res = await discussionApi.addAnswer(discussionId, { content: body, body });
      const updatedDiscussion = res.data?.data?.discussion;

      if (updatedDiscussion) {
        setDiscussions((prev) =>
          prev.map((d) => ((d.id || d._id) === discussionId ? updatedDiscussion : d))
        );
        if (selectedDiscussion && (selectedDiscussion.id || selectedDiscussion._id) === discussionId) {
          setSelectedDiscussion(updatedDiscussion);
        }
      }

      showToast('Your answer has been posted to the cohort!');
    } catch (err) {
      console.error('Submit answer failed:', err);
      const msg = err.response?.data?.message || 'Failed to post answer.';
      showToast(msg);
    }
  };

  // Create New Discussion via API
  const handleCreateDiscussion = async (newDiscussionPayload) => {
    const res = await discussionApi.createDiscussion(newDiscussionPayload);
    const created = res.data?.data;
    if (created) {
      setDiscussions((prev) => [created, ...prev]);
    }
    showToast('Question published successfully!');
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedSubject('All Subjects');
    setSelectedStatus('all');
    setSortBy('recent');
    setMyDiscussionsOnly(false);
    setSelectedTopic('');
  };

  // Topic selection toggle from TrendingTopics
  const handleSelectTopic = (topicName) => {
    if (selectedTopic === topicName || !topicName) {
      setSelectedTopic('');
    } else {
      setSelectedTopic(topicName);
    }
  };

  // Navigation callbacks
  const handleNavigateToProject = (projectId) => {
    if (projectId) {
      navigate(ROUTES.PROJECTS, { state: { projectId } });
    } else {
      navigate(ROUTES.PROJECTS);
    }
  };

  const handleNavigateToResource = (resourceId) => {
    if (resourceId) {
      navigate(ROUTES.RESOURCES, { state: { resourceId } });
    } else {
      navigate(ROUTES.RESOURCES);
    }
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedSubject !== 'All Subjects') count++;
    if (selectedStatus !== 'all') count++;
    if (sortBy !== 'recent') count++;
    if (myDiscussionsOnly) count++;
    if (selectedTopic) count++;
    return count;
  }, [searchQuery, selectedSubject, selectedStatus, sortBy, myDiscussionsOnly, selectedTopic]);

  // Client-side quick filter/sort fallback ensuring immediate responsive updates
  const filteredDiscussions = useMemo(() => {
    return discussions
      .filter((disc) => {
        // Solved status filter client check
        if (selectedStatus === 'solved' && !disc.isSolved) {
          return false;
        }
        if (selectedStatus === 'unsolved' && disc.isSolved) {
          return false;
        }

        // Subject filter client check
        if (selectedSubject !== 'All Subjects') {
          if (disc.subject?.toLowerCase() !== selectedSubject.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'upvoted') {
          return b.voteCount - a.voteCount;
        }
        if (sortBy === 'answered') {
          return b.answerCount - a.answerCount;
        }
        if (sortBy === 'viewed') {
          return b.viewCount - a.viewCount;
        }
        return 0;
      });
  }, [discussions, selectedStatus, selectedSubject, sortBy]);

  return (
    <AppLayout>
      <div className="discussions-page-container">
        {/* 1. Hero Section */}
        <DiscussionsHero onAskQuestionClick={() => setIsCreateModalOpen(true)} />

        {/* 2. Featured Discussion Spotlight */}
        {featuredDiscussion && (
          <FeaturedDiscussion
            discussion={featuredDiscussion}
            onViewDiscussion={handleOpenDiscussion}
            onUpvote={handleUpvoteDiscussion}
            onAnswerQuestion={handleAnswerQuestion}
            hasUpvoted={Boolean(
              userUpvotedDiscussions[featuredDiscussion.id || featuredDiscussion._id] ||
                featuredDiscussion.isVotedByCurrentUser
            )}
          />
        )}

        {/* 3. Trending Academic Topics */}
        <TrendingTopics
          selectedTopic={selectedTopic}
          onSelectTopic={handleSelectTopic}
        />

        {/* 4. Search and Filter Controls */}
        <DiscussionFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          myDiscussionsOnly={myDiscussionsOnly}
          onToggleMyDiscussions={() => setMyDiscussionsOnly((prev) => !prev)}
          onClearFilters={handleClearFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* 5. Discussion Feed */}
        <section className="disc-feed-section" aria-label="Academic Discussion Feed">
          <div className="disc-feed-header">
            <span className="disc-feed-count">
              Showing {filteredDiscussions.length}{' '}
              {filteredDiscussions.length === 1 ? 'discussion' : 'discussions'}
              {activeFilterCount > 0 && ' (filtered)'}
            </span>
          </div>

          {isLoading && discussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-ink-faint">
              <Loader2 size={32} className="animate-spin text-pine mb-3" aria-hidden="true" />
              <p className="text-sm font-medium">Loading academic discussions...</p>
            </div>
          ) : errorMessage && discussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center" role="alert">
              <AlertCircle size={36} className="text-rust mb-3" aria-hidden="true" />
              <h3 className="serif text-lg font-bold text-rust mb-1">Failed to load discussions</h3>
              <p className="text-sm text-ink-soft max-w-md mb-4">{errorMessage}</p>
              <button
                type="button"
                className="disc-btn disc-btn-outline inline-flex items-center gap-2"
                onClick={fetchDiscussions}
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Try Again</span>
              </button>
            </div>
          ) : filteredDiscussions.length === 0 ? (
            <EmptyDiscussions
              onResetFilters={handleClearFilters}
              onAskQuestionClick={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="disc-feed-list">
              {filteredDiscussions.map((disc) => {
                const discId = disc.id || disc._id;
                return (
                  <DiscussionCard
                    key={discId}
                    discussion={disc}
                    onViewDiscussion={handleOpenDiscussion}
                    onUpvote={handleUpvoteDiscussion}
                    hasUpvoted={Boolean(
                      userUpvotedDiscussions[discId] || disc.isVotedByCurrentUser
                    )}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 6. Discussion Detail Modal */}
        <DiscussionDetailModal
          discussion={selectedDiscussion}
          isOpen={Boolean(selectedDiscussion)}
          onClose={() => setSelectedDiscussion(null)}
          onUpvoteDiscussion={handleUpvoteDiscussion}
          onUpvoteAnswer={handleUpvoteAnswer}
          onToggleAcceptAnswer={handleToggleAcceptAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNavigateToProject={handleNavigateToProject}
          onNavigateToResource={handleNavigateToResource}
          userUpvotedDiscussion={Boolean(
            selectedDiscussion &&
              (userUpvotedDiscussions[selectedDiscussion.id || selectedDiscussion._id] ||
                selectedDiscussion.isVotedByCurrentUser)
          )}
          userUpvotedAnswers={userUpvotedAnswers}
        />

        {/* 7. Create Discussion Modal */}
        <CreateDiscussionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateDiscussion={handleCreateDiscussion}
        />

        {/* 8. Toast Feedback */}
        {toastMessage && (
          <div className="disc-toast" role="status" aria-live="polite">
            <CheckCircle2 size={16} className="text-pine flex-shrink-0" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Discussions;
