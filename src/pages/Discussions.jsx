import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import DiscussionsHero from '../features/discussions/components/DiscussionsHero';
import FeaturedDiscussion from '../features/discussions/components/FeaturedDiscussion';
import TrendingTopics from '../features/discussions/components/TrendingTopics';
import DiscussionFilters from '../features/discussions/components/DiscussionFilters';
import DiscussionCard from '../features/discussions/components/DiscussionCard';
import EmptyDiscussions from '../features/discussions/components/EmptyDiscussions';
import DiscussionDetailModal from '../features/discussions/components/DiscussionDetailModal';
import CreateDiscussionModal from '../features/discussions/components/CreateDiscussionModal';

import { INITIAL_DISCUSSIONS } from '../features/discussions/discussionsData';
import { ROUTES } from '../constants/routes';

import '../features/discussions/discussions.css';

/**
 * Discussions Page
 * Clean academic discussion forum where students can ask questions, post answers,
 * upvote useful content, mark accepted answers, filter by subject, and discover trending topics.
 * 
 * Future Backend Architecture (Express & MongoDB):
 * GET    /api/discussions                          -> Fetch paginated discussions with search, filter, and sort
 * GET    /api/discussions/:id                      -> Get full discussion with populated answers
 * POST   /api/discussions                          -> Create new discussion question
 * PATCH  /api/discussions/:id/upvote               -> Toggle upvote for discussion (prevents duplicates)
 * POST   /api/discussions/:id/answers              -> Submit an answer
 * PATCH  /api/discussions/:id/answers/:answerId/upvote -> Upvote an answer
 * PATCH  /api/discussions/:id/answers/:answerId/accept -> Mark/unmark an answer as accepted
 * 
 * Future MongoDB Models:
 * - Discussion: title, body, author, subject, tags, voteCount, upvoters, answerCount, viewCount, isSolved, acceptedAnswerId, linkedProjectId, linkedResourceId
 * - Answer: discussionId, author, body, voteCount, upvoters, isAccepted, createdAt
 */
export const Discussions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Discussions state
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [userUpvotedDiscussions, setUserUpvotedDiscussions] = useState({});
  const [userUpvotedAnswers, setUserUpvotedAnswers] = useState({});

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
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

  // Synchronize route state triggers (e.g. from Dashboard quick actions or cards)
  useEffect(() => {
    if (location.state) {
      const stateObj = location.state;
      if (stateObj.openCreateDiscussionModal || stateObj.openCreateDiscussion) {
        setIsCreateModalOpen(true);
      }
      if (stateObj.discussionId) {
        const disc = discussions.find((d) => d.id === stateObj.discussionId);
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
    return (
      discussions.find((d) => d.id === 'disc-dbms-norm') ||
      discussions.find((d) => d.isSolved && d.voteCount >= 40) ||
      discussions[0]
    );
  }, [discussions]);

  // Open discussion detail & increment view count locally
  const handleOpenDiscussion = (disc) => {
    const updated = {
      ...disc,
      viewCount: disc.viewCount + 1,
    };
    setSelectedDiscussion(updated);
    setDiscussions((prev) => prev.map((d) => (d.id === disc.id ? updated : d)));
  };

  // Open discussion and scroll to answer section
  const handleAnswerQuestion = (disc) => {
    handleOpenDiscussion(disc);
  };

  // Discussion Upvote Toggle
  const handleUpvoteDiscussion = (discussionId) => {
    const hasUpvoted = Boolean(userUpvotedDiscussions[discussionId]);
    const voteDelta = hasUpvoted ? -1 : 1;

    setUserUpvotedDiscussions((prev) => ({
      ...prev,
      [discussionId]: !hasUpvoted,
    }));

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discussionId) {
          return {
            ...d,
            voteCount: Math.max(0, d.voteCount + voteDelta),
          };
        }
        return d;
      })
    );

    if (selectedDiscussion && selectedDiscussion.id === discussionId) {
      setSelectedDiscussion((prev) => ({
        ...prev,
        voteCount: Math.max(0, prev.voteCount + voteDelta),
      }));
    }
  };

  // Answer Upvote Toggle
  const handleUpvoteAnswer = (discussionId, answerId) => {
    const hasUpvoted = Boolean(userUpvotedAnswers[answerId]);
    const voteDelta = hasUpvoted ? -1 : 1;

    setUserUpvotedAnswers((prev) => ({
      ...prev,
      [answerId]: !hasUpvoted,
    }));

    const updateAnswers = (answersList) =>
      answersList.map((a) => {
        if (a.id === answerId) {
          return {
            ...a,
            voteCount: Math.max(0, a.voteCount + voteDelta),
          };
        }
        return a;
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id === discussionId) {
          return {
            ...d,
            answers: updateAnswers(d.answers),
          };
        }
        return d;
      })
    );

    if (selectedDiscussion && selectedDiscussion.id === discussionId) {
      setSelectedDiscussion((prev) => ({
        ...prev,
        answers: updateAnswers(prev.answers),
      }));
    }
  };

  // Toggle Accept / Unaccept Answer (mock control)
  const handleToggleAcceptAnswer = (discussionId, answerId) => {
    let nowAccepted = false;

    const updateDiscussionObj = (disc) => {
      const updatedAnswers = disc.answers.map((a) => {
        if (a.id === answerId) {
          const nextState = !a.isAccepted;
          nowAccepted = nextState;
          return { ...a, isAccepted: nextState };
        }
        // Only one accepted answer allowed
        return { ...a, isAccepted: false };
      });

      const acceptedAns = updatedAnswers.find((a) => a.isAccepted);

      return {
        ...disc,
        answers: updatedAnswers,
        isSolved: Boolean(acceptedAns),
        acceptedAnswerId: acceptedAns ? acceptedAns.id : null,
      };
    };

    setDiscussions((prev) =>
      prev.map((d) => (d.id === discussionId ? updateDiscussionObj(d) : d))
    );

    if (selectedDiscussion && selectedDiscussion.id === discussionId) {
      setSelectedDiscussion((prev) => updateDiscussionObj(prev));
    }

    showToast(
      nowAccepted
        ? 'Answer marked as accepted solution!'
        : 'Accepted solution marker removed.'
    );
  };

  // Post New Answer
  const handleSubmitAnswer = (discussionId, body) => {
    const newAnswer = {
      id: `ans-${Date.now()}`,
      author: 'Shreyas Rao',
      authorInitials: 'SR',
      authorDepartment: 'Computer Science',
      body,
      createdAt: 'Just now',
      voteCount: 0,
      isAccepted: false,
    };

    const updateDiscussionObj = (disc) => ({
      ...disc,
      answerCount: disc.answerCount + 1,
      answers: [...disc.answers, newAnswer],
    });

    setDiscussions((prev) =>
      prev.map((d) => (d.id === discussionId ? updateDiscussionObj(d) : d))
    );

    if (selectedDiscussion && selectedDiscussion.id === discussionId) {
      setSelectedDiscussion((prev) => updateDiscussionObj(prev));
    }

    showToast('Your answer has been posted to the cohort!');
  };

  // Create New Discussion
  const handleCreateDiscussion = (newDiscussion) => {
    setDiscussions((prev) => [newDiscussion, ...prev]);
    showToast('Question published successfully!');
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearchQuery('');
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

  // Filter & Sort Pipeline
  const filteredDiscussions = useMemo(() => {
    return discussions
      .filter((disc) => {
        // My Discussions toggle
        if (myDiscussionsOnly) {
          if (disc.author !== 'Shreyas Rao' && disc.authorInitials !== 'SR') {
            return false;
          }
        }

        // Subject filter
        if (selectedSubject !== 'All Subjects') {
          if (disc.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
            return false;
          }
        }

        // Solved status filter
        if (selectedStatus === 'solved' && !disc.isSolved) {
          return false;
        }
        if (selectedStatus === 'unsolved' && disc.isSolved) {
          return false;
        }

        // Trending topic filter
        if (selectedTopic) {
          const tLower = selectedTopic.toLowerCase();
          const matchesSubject = disc.subject.toLowerCase().includes(tLower);
          const matchesTags = disc.tags.some((t) => t.toLowerCase().includes(tLower));
          const matchesTitle = disc.title.toLowerCase().includes(tLower);
          if (!matchesSubject && !matchesTags && !matchesTitle) {
            return false;
          }
        }

        // Search Query (title, body, author, subject, tags)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesTitle = disc.title.toLowerCase().includes(query);
          const matchesBody = disc.body.toLowerCase().includes(query);
          const matchesAuthor = disc.author.toLowerCase().includes(query);
          const matchesSubject = disc.subject.toLowerCase().includes(query);
          const matchesTags = disc.tags.some((t) => t.toLowerCase().includes(query));

          if (!matchesTitle && !matchesBody && !matchesAuthor && !matchesSubject && !matchesTags) {
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
        // Default 'recent'
        return b.id.localeCompare(a.id);
      });
  }, [
    discussions,
    myDiscussionsOnly,
    selectedSubject,
    selectedStatus,
    selectedTopic,
    searchQuery,
    sortBy,
  ]);

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
            hasUpvoted={Boolean(userUpvotedDiscussions[featuredDiscussion.id])}
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
              Showing {filteredDiscussions.length} {filteredDiscussions.length === 1 ? 'discussion' : 'discussions'}
              {activeFilterCount > 0 && ' (filtered)'}
            </span>
          </div>

          {filteredDiscussions.length === 0 ? (
            <EmptyDiscussions
              onResetFilters={handleClearFilters}
              onAskQuestionClick={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="disc-feed-list">
              {filteredDiscussions.map((disc) => (
                <DiscussionCard
                  key={disc.id}
                  discussion={disc}
                  onViewDiscussion={handleOpenDiscussion}
                  onUpvote={handleUpvoteDiscussion}
                  hasUpvoted={Boolean(userUpvotedDiscussions[disc.id])}
                />
              ))}
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
          userUpvotedDiscussion={Boolean(selectedDiscussion && userUpvotedDiscussions[selectedDiscussion.id])}
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
