import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/button';
import { ROUTES } from '../constants/routes';
import { INITIAL_DISCUSSIONS, CURRENT_USER_MEMBER } from '../data/discussionsData';
import { INITIAL_PROJECTS } from '../data/projectsData';
import { RECENT_RESOURCES } from '../data/resources';
import { DISCOVER_STUDY_GROUPS } from '../data/studyGroupsData';
import '../styles/discussions.css';
export const Discussions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // State
    const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDept, setSelectedDept] = useState('All');
    const [sortOrder, setSortOrder] = useState('latest');
    useEffect(() => {
        if (location.state) {
            const stateObj = location.state;
            if (stateObj.openCreateDiscussionModal || stateObj.openCreateDiscussion) {
                handleOpenCreateModal();
            }
            if (stateObj.discussionId) {
                const disc = discussions.find(d => d.id === stateObj.discussionId);
                if (disc) {
                    handleOpenDiscussion(disc);
                }
            }
            // Clear location state to prevent repeating actions on page reloads/renders
            window.history.replaceState({}, document.title);
        }
    }, [location.state, discussions]);
    // In-page Detail view state
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [newAnswerText, setNewAnswerText] = useState('');
    // Start Discussion Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newType, setNewType] = useState('Question');
    const [newSubject, setNewSubject] = useState('Computer Science');
    const [newTags, setNewTags] = useState('');
    const [linkedProjId, setLinkedProjId] = useState('');
    const [linkedResId, setLinkedResId] = useState('');
    const [linkedSgId, setLinkedSgId] = useState('');
    // Toast alert
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    const handleOpenDiscussion = (disc) => {
        // Increment view count locally when thread is opened
        const updated = {
            ...disc,
            views: disc.views + 1
        };
        setSelectedDiscussion(updated);
        setDiscussions(prev => prev.map(d => (d.id === disc.id ? updated : d)));
    };
    const handleLikeAnswer = (answerId) => {
        if (!selectedDiscussion)
            return;
        const updatedAnswers = selectedDiscussion.answers.map(ans => ans.id === answerId ? { ...ans, likes: ans.likes + 1 } : ans);
        const updatedDiscussion = {
            ...selectedDiscussion,
            answers: updatedAnswers
        };
        setSelectedDiscussion(updatedDiscussion);
        setDiscussions(prev => prev.map(d => (d.id === selectedDiscussion.id ? updatedDiscussion : d)));
    };
    const handleAcceptAnswer = (answerId) => {
        if (!selectedDiscussion)
            return;
        const updatedAnswers = selectedDiscussion.answers.map(ans => ({
            ...ans,
            accepted: ans.id === answerId ? !ans.accepted : false
        }));
        const acceptedAns = updatedAnswers.find(ans => ans.accepted);
        const updatedDiscussion = {
            ...selectedDiscussion,
            answers: updatedAnswers,
            acceptedAnswerId: acceptedAns ? acceptedAns.id : undefined
        };
        setSelectedDiscussion(updatedDiscussion);
        setDiscussions(prev => prev.map(d => (d.id === selectedDiscussion.id ? updatedDiscussion : d)));
        showToast(acceptedAns ? "Answer marked as accepted" : "Accepted answer removed");
    };
    const handlePostAnswer = (e) => {
        e.preventDefault();
        if (!newAnswerText.trim() || !selectedDiscussion)
            return;
        const newAns = {
            id: `ans-${Date.now()}`,
            author: CURRENT_USER_MEMBER,
            content: newAnswerText.trim(),
            createdAt: 'Just now',
            likes: 0,
            accepted: false
        };
        const updatedDiscussion = {
            ...selectedDiscussion,
            replies: selectedDiscussion.replies + 1,
            commentsCount: (selectedDiscussion.commentsCount || 0) + 1,
            answers: [...selectedDiscussion.answers, newAns]
        };
        setSelectedDiscussion(updatedDiscussion);
        setDiscussions(prev => prev.map(d => (d.id === selectedDiscussion.id ? updatedDiscussion : d)));
        setNewAnswerText('');
        showToast("Answer posted");
    };
    const handleOpenCreateModal = () => {
        setNewTitle('');
        setNewDesc('');
        setNewType('Question');
        setNewSubject('Computer Science');
        setNewTags('');
        setLinkedProjId('');
        setLinkedResId('');
        setLinkedSgId('');
        setShowCreateModal(true);
    };
    const handleGoToWorkspace = (workspaceId) => {
        if (workspaceId) {
            navigate(ROUTES.MESSAGES, { state: { activeWorkspaceId: workspaceId } });
        }
        else {
            navigate(ROUTES.MESSAGES);
        }
    };
    const handleStartDiscussionSubmit = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            showToast("Discussion title is required.");
            return;
        }
        if (!newDesc.trim()) {
            showToast("Discussion description is required.");
            return;
        }
        const tagsList = newTags.split(',').map(t => t.trim()).filter(Boolean);
        const newDisc = {
            id: `d-${Date.now()}`,
            title: newTitle.trim(),
            description: newDesc.trim(),
            type: newType,
            subject: newSubject,
            author: CURRENT_USER_MEMBER,
            tags: tagsList.length > 0 ? tagsList : [newSubject],
            createdAt: 'Just now',
            replies: 0,
            views: 0,
            trending: false,
            projectId: linkedProjId || undefined,
            resourceId: linkedResId || undefined,
            studyGroupId: linkedSgId || undefined,
            answers: [],
            votes: 0,
            commentsCount: 0,
            category: newType === 'Question' ? 'Academics' : newType === 'Project' ? 'Projects' : newType === 'Research' ? 'Research' : 'Clubs'
        };
        setDiscussions(prev => [newDisc, ...prev]);
        setShowCreateModal(false);
        showToast("Discussion started");
    };
    // Helper selectors to verify data connections existence
    const getConnectedProject = (id) => INITIAL_PROJECTS.find((p) => p.id === id);
    const getConnectedResource = (id) => RECENT_RESOURCES.find((r) => r.id === id);
    const getConnectedStudyGroup = (id) => DISCOVER_STUDY_GROUPS.find((g) => g.id === id);
    // Filters and Sorting
    const uniqueDepts = ['All', ...Array.from(new Set(discussions.map(d => d.subject).filter(Boolean)))];
    const filteredDiscussions = discussions.filter(disc => {
        // Tab filter
        if (activeTab !== 'all' && disc.type !== activeTab)
            return false;
        // Dept filter
        if (selectedDept !== 'All' && disc.subject !== selectedDept)
            return false;
        // Search query
        const q = searchQuery.toLowerCase().trim();
        if (!q)
            return true;
        return (disc.title.toLowerCase().includes(q) ||
            disc.description.toLowerCase().includes(q) ||
            disc.author.name.toLowerCase().includes(q) ||
            disc.subject.toLowerCase().includes(q) ||
            disc.tags.some(t => t.toLowerCase().includes(q)));
    });
    // Sort logic
    const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
        if (sortOrder === 'discussed') {
            return b.replies - a.replies;
        }
        if (sortOrder === 'viewed') {
            return b.views - a.views;
        }
        // Default latest: mock ordering by id desc since we push newer entries first
        return b.id.localeCompare(a.id);
    });
    // Highlight trending banner item
    const trendingTopic = discussions.find(d => d.trending === true);
    return (<AppLayout>
      <motion.div className="w-full flex flex-col gap-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="discussions-container">

          {/* Render Detail view if selected */}
          {selectedDiscussion ? (<div className="discussion-details-container">
              <button className="discussion-details-back-link" onClick={() => setSelectedDiscussion(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5m7 7-7-7 7-7"/>
                </svg>
                Back to Discussions
              </button>

              <div className="discussion-details-header">
                <div className="details-header-title-row">
                  <span className={`disc-type-badge disc-type-${selectedDiscussion.type.toLowerCase().replace(' ', '-')}`}>
                    {selectedDiscussion.type}
                  </span>
                  <span className="skill-pill">{selectedDiscussion.subject}</span>
                </div>
                <h2 className="discussion-details-title text-wrap-protect">{selectedDiscussion.title}</h2>
                <div className="details-header-meta">
                  <span>Started by <strong>{selectedDiscussion.author.name}</strong></span>
                  <span>•</span>
                  <span>{selectedDiscussion.createdAt}</span>
                  <span>•</span>
                  <span>{selectedDiscussion.views} views</span>
                  <span>•</span>
                  <span>{selectedDiscussion.replies} replies</span>
                </div>
                <div className="disc-tags-row" style={{ marginTop: '6px' }}>
                  {selectedDiscussion.tags.map(t => (<span key={t} className="disc-tag">{t}</span>))}
                </div>
              </div>

              <div className="discussion-details-body">
                <p className="discussion-details-desc text-wrap-protect">{selectedDiscussion.description}</p>

                {/* Related Context integrations */}
                {(selectedDiscussion.projectId || selectedDiscussion.resourceId || selectedDiscussion.studyGroupId) && (<div className="discussion-related-context">
                    <span className="related-context-title">Related Context</span>
                    
                    {selectedDiscussion.projectId && getConnectedProject(selectedDiscussion.projectId) && (<div className="related-context-card" style={{ marginTop: '8px' }}>
                        <span className="related-context-info">🚀 Project: {getConnectedProject(selectedDiscussion.projectId)?.title}</span>
                        <Button className="outline" onClick={() => navigate(ROUTES.PROJECTS, { state: { projectId: selectedDiscussion.projectId } })}>View Project</Button>
                      </div>)}

                    {selectedDiscussion.resourceId && getConnectedResource(selectedDiscussion.resourceId) && (<div className="related-context-card" style={{ marginTop: '8px' }}>
                        <span className="related-context-info">📁 Resource: {getConnectedResource(selectedDiscussion.resourceId)?.title || getConnectedResource(selectedDiscussion.resourceId)?.fileName}</span>
                        <Button className="outline" onClick={() => navigate(ROUTES.RESOURCES, { state: { resourceId: selectedDiscussion.resourceId } })}>Open Resource</Button>
                      </div>)}

                    {selectedDiscussion.studyGroupId && getConnectedStudyGroup(selectedDiscussion.studyGroupId) && (<div className="related-context-card" style={{ marginTop: '8px' }}>
                        <span className="related-context-info">📚 Study Group: {getConnectedStudyGroup(selectedDiscussion.studyGroupId)?.title}</span>
                        <Button className="outline" onClick={() => navigate(ROUTES.STUDY_GROUPS)}>Open Study Group</Button>
                      </div>)}

                    {selectedDiscussion.workspaceId && (<div className="related-context-card" style={{ marginTop: '8px' }}>
                        <span className="related-context-info">💬 Private Team Chat Workspace</span>
                        <Button className="primary" onClick={() => handleGoToWorkspace(selectedDiscussion.workspaceId)}>
                          Go to Workspace
                        </Button>
                      </div>)}
                  </div>)}

                {/* Answers Section */}
                <div className="discussion-answers-section">
                  <h3 className="section-title-secondary">Answers ({selectedDiscussion.answers.length})</h3>
                  
                  <div className="answers-list">
                    {selectedDiscussion.answers.map(ans => (<div key={ans.id} className={`answer-card ${selectedDiscussion.acceptedAnswerId === ans.id ? 'accepted-answer' : ''}`}>
                        <div className="answer-author-row">
                          <div className="answer-avatar" style={{ background: ans.author.avatarBg || 'var(--pine)', color: '#fff' }}>
                            {ans.author.initials}
                          </div>
                          <div className="answer-author-info">
                            <span className="answer-author-name">{ans.author.name}</span>
                            <span className="answer-author-sub">{ans.author.department} • {ans.author.semester} • {ans.createdAt}</span>
                          </div>
                        </div>

                        <p className="answer-content text-wrap-protect">{ans.content}</p>

                        <div className="answer-footer">
                          <button className="answer-likes-btn" onClick={() => handleLikeAnswer(ans.id)}>
                            👍 {ans.likes}
                          </button>

                          {selectedDiscussion.acceptedAnswerId === ans.id && (<span className="answer-accepted-badge">✓ Accepted Answer</span>)}

                          {selectedDiscussion.type === 'Question' &&
                    selectedDiscussion.author.id === CURRENT_USER_MEMBER.id &&
                    selectedDiscussion.acceptedAnswerId !== ans.id && (<Button className="outline answer-accept-btn" onClick={() => handleAcceptAnswer(ans.id)}>
                              Accept Answer
                            </Button>)}

                          {selectedDiscussion.type === 'Question' &&
                    selectedDiscussion.author.id === CURRENT_USER_MEMBER.id &&
                    selectedDiscussion.acceptedAnswerId === ans.id && (<Button className="outline answer-accept-btn" onClick={() => handleAcceptAnswer(ans.id)} style={{ color: 'var(--rust)' }}>
                              Unaccept
                            </Button>)}
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Write Answer Form */}
                <div className="write-answer-section">
                  <h3 className="details-info-label">Write an Answer</h3>
                  <form onSubmit={handlePostAnswer} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <textarea className="answer-input-textarea" placeholder="Share your answer, calculations, or explanations..." required value={newAnswerText} onChange={(e) => setNewAnswerText(e.target.value)}/>
                    <Button className="primary post-answer-btn" type="submit">Post Answer</Button>
                  </form>
                </div>

              </div>
            </div>) : (<>
              {/* Header section */}
              <div className="discussions-header-section">
                <h2 className="serif" style={{ fontSize: '26px', fontWeight: 600 }}>Discussions</h2>
                <p className="discussions-desc-text">
                  Ask questions • Share knowledge • Learn together
                </p>

                <div className="discussions-search-row">
                  <div className="discussions-search-input-wrap">
                    <svg className="discussions-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <input type="text" className="discussions-search-input" placeholder="Search discussions by title, content, or tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                  </div>
                  <Button className="primary discussions-create-btn" onClick={handleOpenCreateModal}>
                    <span>➕</span> Start Discussion
                  </Button>
                </div>
              </div>

              {/* Filters bar */}
              <div className="discussions-filters-bar">
                <div className="discussions-tabs-row">
                  <button className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                    All
                  </button>
                  <button className={`filter-tab-btn ${activeTab === 'Question' ? 'active' : ''}`} onClick={() => setActiveTab('Question')}>
                    Questions
                  </button>
                  <button className={`filter-tab-btn ${activeTab === 'Research' ? 'active' : ''}`} onClick={() => setActiveTab('Research')}>
                    Research
                  </button>
                  <button className={`filter-tab-btn ${activeTab === 'Project' ? 'active' : ''}`} onClick={() => setActiveTab('Project')}>
                    Projects
                  </button>
                  <button className={`filter-tab-btn ${activeTab === 'Study Group' ? 'active' : ''}`} onClick={() => setActiveTab('Study Group')}>
                    Study Groups
                  </button>
                </div>

                <div className="discussions-dropdowns-row">
                  <div className="filter-select-wrap">
                    <label htmlFor="dept-select">Subject:</label>
                    <select id="dept-select" className="filter-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                      {uniqueDepts.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                    </select>
                  </div>

                  <div className="filter-select-wrap">
                    <label htmlFor="sort-select">Sort By:</label>
                    <select id="sort-select" className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                      <option value="latest">Latest</option>
                      <option value="discussed">Most Discussed</option>
                      <option value="viewed">Most Viewed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Trending Spotlight banner */}
              {!searchQuery && activeTab === 'all' && selectedDept === 'All' && trendingTopic && (<div className="discussions-trending-section">
                  <h3 className="section-title-secondary">Trending Discussion</h3>
                  <div className="trending-discussion-card">
                    <div className="trending-badge-row">
                      <span className="trending-label">🔥 Trending now</span>
                      <span className={`disc-type-badge disc-type-${trendingTopic.type.toLowerCase().replace(' ', '-')}`}>
                        {trendingTopic.type}
                      </span>
                    </div>
                    <h4 className="trending-title text-wrap-protect">{trendingTopic.title}</h4>
                    <p className="trending-desc text-wrap-protect">{trendingTopic.description.substring(0, 150)}...</p>
                    
                    <div className="disc-tags-row">
                      {trendingTopic.tags.map(tag => (<span key={tag} className="disc-tag">{tag}</span>))}
                    </div>

                    <div className="trending-actions">
                      <div className="trending-meta">
                        <span>By {trendingTopic.author.name}</span>
                        <span>•</span>
                        <span>{trendingTopic.replies} replies</span>
                        <span>•</span>
                        <span>{trendingTopic.views} views</span>
                      </div>
                      <Button className="primary" onClick={() => handleOpenDiscussion(trendingTopic)}>
                        Open Discussion
                      </Button>
                    </div>
                  </div>
                </div>)}

              {/* 4. Recent discussions library */}
              <div className="discussions-library-section">
                <h3 className="section-title-secondary">Recent Discussions</h3>
                {sortedDiscussions.length === 0 ? (<div className="disc-empty-state">
                    <span className="disc-empty-icon">💬</span>
                    <span className="disc-empty-text">No discussions found</span>
                    <span className="disc-empty-sub">Be the first to start a thread about this topic!</span>
                  </div>) : (<div className="discussions-library-grid">
                    {sortedDiscussions.map(disc => (<div key={disc.id} className="library-discussion-card">
                        <div className="library-discussion-header">
                          <span className={`disc-type-badge disc-type-${disc.type.toLowerCase().replace(' ', '-')}`}>
                            {disc.type}
                          </span>
                          <span className="skill-pill">{disc.subject}</span>
                          <span className="disc-meta-item" style={{ marginLeft: 'auto' }}>
                            ⌚ {disc.createdAt}
                          </span>
                        </div>

                        <div className="library-discussion-body">
                          <h4 className="library-discussion-title text-wrap-protect">{disc.title}</h4>
                          <p className="library-discussion-desc text-wrap-protect">
                            {disc.description.length > 180 ? `${disc.description.substring(0, 180)}...` : disc.description}
                          </p>
                        </div>

                        <div className="disc-tags-row">
                          {disc.tags.map(tag => (<span key={tag} className="disc-tag">{tag}</span>))}
                        </div>

                        <div className="library-discussion-footer">
                          <div className="answer-author-row">
                            <div className="answer-avatar" style={{ background: disc.author.avatarBg || 'var(--pine)', color: '#fff', width: '24px', height: '24px', fontSize: '9px' }}>
                              {disc.author.initials}
                            </div>
                            <span className="answer-author-name" style={{ fontSize: '12px' }}>{disc.author.name}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span className="disc-meta-item">💬 {disc.replies} replies</span>
                            <span className="disc-meta-item">👁 {disc.views} views</span>
                            <Button className="outline" onClick={() => handleOpenDiscussion(disc)} style={{ padding: '4px 12px', fontSize: '11px', height: '28px' }}>
                              Open Discussion
                            </Button>
                          </div>
                        </div>

                      </div>))}
                  </div>)}
              </div>
            </>)}

        </div>
      </motion.div>

      {/* Start Discussion modal overlay */}
      {showCreateModal && (<div className="collab-modal-overlay">
          <div className="collab-modal">
            <h3 className="collab-modal-title">Start Academic Discussion</h3>
            
            <form onSubmit={handleStartDiscussionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-title-in">Discussion Title</label>
                <input id="disc-title-in" type="text" className="collab-modal-input" placeholder="e.g. How does normalization reduce redundancy in DBMS?" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-desc-in">Question / Description Details</label>
                <textarea id="disc-desc-in" className="collab-modal-input" placeholder="Describe your question or research topics in detail..." required style={{ minHeight: '80px', resize: 'vertical' }} value={newDesc} onChange={(e) => setNewDesc(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-type-select">Discussion Type</label>
                <select id="disc-type-select" className="collab-modal-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option value="Question">Question</option>
                  <option value="Research">Research Discussion</option>
                  <option value="Project">Project Collaboration</option>
                  <option value="Study Group">Study Group Circle</option>
                </select>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-subject-in">Subject / Topic</label>
                <input id="disc-subject-in" type="text" className="collab-modal-input" placeholder="e.g. DBMS, Data Structures, Machine Learning" required value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-tags-in">Tags (comma-separated)</label>
                <input id="disc-tags-in" type="text" className="collab-modal-input" placeholder="e.g. SQL, Dijkstra, React, PyTorch" value={newTags} onChange={(e) => setNewTags(e.target.value)}/>
              </div>

              {/* Optional related configurations */}
              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-proj-select">Link Related Project (Optional)</label>
                <select id="disc-proj-select" className="collab-modal-select" value={linkedProjId} onChange={(e) => setLinkedProjId(e.target.value)}>
                  <option value="">None</option>
                  {INITIAL_PROJECTS.map(p => (<option key={p.id} value={p.id}>{p.title}</option>))}
                </select>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-res-select">Link Related Resource (Optional)</label>
                <select id="disc-res-select" className="collab-modal-select" value={linkedResId} onChange={(e) => setLinkedResId(e.target.value)}>
                  <option value="">None</option>
                  {RECENT_RESOURCES.map(r => (<option key={r.id} value={r.id}>{r.title || r.fileName}</option>))}
                </select>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="disc-sg-select">Link Related Study Group (Optional)</label>
                <select id="disc-sg-select" className="collab-modal-select" value={linkedSgId} onChange={(e) => setLinkedSgId(e.target.value)}>
                  <option value="">None</option>
                  {DISCOVER_STUDY_GROUPS.map(g => (<option key={g.id} value={g.id}>{g.title}</option>))}
                </select>
              </div>

              <div className="collab-modal-actions" style={{ marginTop: '8px' }}>
                <Button className="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button className="primary" type="submit">Start</Button>
              </div>
            </form>
          </div>
        </div>)}

      {/* TOAST ALERTS */}
      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}

    </AppLayout>);
};
export default Discussions;
