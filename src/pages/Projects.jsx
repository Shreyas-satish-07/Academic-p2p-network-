import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/button';
import { ROUTES } from '../constants/routes';
import { INITIAL_PROJECTS, CONNECTIONS, CURRENT_USER_MEMBER } from '../data/projectsData';
import '../styles/projects.css';
export const Projects = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDept, setSelectedDept] = useState('All');
    // Project Detail state
    const [selectedProject, setSelectedProject] = useState(null);
    const [detailTab, setDetailTab] = useState('overview');
    useEffect(() => {
        if (location.state) {
            const stateObj = location.state;
            if (stateObj.openCreateModal) {
                handleOpenCreateModal();
            }
            if (stateObj.projectId) {
                const proj = projects.find(p => p.id === stateObj.projectId);
                if (proj) {
                    setSelectedProject(proj);
                    setDetailTab('overview');
                }
            }
            // Clear location state to prevent repeating actions on page reloads/renders
            window.history.replaceState({}, document.title);
        }
    }, [location.state, projects]);
    // Confirmation dialog state
    const [confirmJoinProject, setConfirmJoinProject] = useState(null);
    // Create Project Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newDept, setNewDept] = useState('Computer Science');
    const [newCategory, setNewCategory] = useState('Web App');
    const [newSkills, setNewSkills] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [newLooking, setNewLooking] = useState(true);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    // Toast Alerts
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    const handleDownload = (filename) => {
        showToast(`Download started: ${filename}`);
    };
    const handleOpenCreateModal = () => {
        setNewTitle('');
        setNewDesc('');
        setNewDept('Computer Science');
        setNewCategory('Web App');
        setNewSkills('');
        setNewDeadline('');
        setNewLooking(true);
        setSelectedMemberIds([]);
        setShowCreateModal(true);
    };
    const handleCreateProjectSubmit = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) {
            showToast('Project title is required.');
            return;
        }
        const newProjId = `p-${Date.now()}`;
        const skillsList = newSkills.split(',').map(s => s.trim()).filter(Boolean);
        // Current user is pre-populated as member
        const projMembers = [CURRENT_USER_MEMBER];
        selectedMemberIds.forEach(id => {
            const conn = CONNECTIONS.find(c => c.id === id);
            if (conn)
                projMembers.push(conn);
        });
        // Setup initial empty tasks and resources
        const initialTasks = [
            { id: `t_${newProjId}_1`, text: 'Setup project repositories', completed: false },
            { id: `t_${newProjId}_2`, text: 'Define system architecture designs', completed: false },
            { id: `t_${newProjId}_3`, text: 'Build responsive mockup UI screens', completed: false }
        ];
        const newProj = {
            id: newProjId,
            title: newTitle.trim(),
            description: newDesc.trim() || 'No description provided.',
            technologies: skillsList.length > 0 ? skillsList : ['React', 'JavaScript'],
            status: 'In progress',
            featured: false,
            repositoryUrl: '#',
            department: newDept,
            uploader: CURRENT_USER_MEMBER.name,
            membersCount: projMembers.length,
            neededSkills: skillsList,
            recruitmentStatus: 'Joined',
            completedTasks: 0,
            totalTasks: initialTasks.length,
            deadline: newDeadline.trim() || 'TBD',
            avatarBg: 'var(--pine-tint)',
            avatarColor: 'var(--pine-dark)',
            members: projMembers,
            tasks: initialTasks,
            resources: [],
            timeline: [
                { id: `l_${newProjId}_1`, time: 'Just now', text: 'Project created and initialized by You.' }
            ]
        };
        setProjects(prev => [newProj, ...prev]);
        setShowCreateModal(false);
        showToast(`Project created successfully: ${newTitle}`);
    };
    const handleRequestJoinProject = () => {
        if (!confirmJoinProject)
            return;
        // Add log entry to the project timeline
        const nowLog = {
            id: `l-join-${Date.now()}`,
            time: 'Just now',
            text: 'Request to join project submitted by You.'
        };
        setProjects(prev => prev.map(p => {
            if (p.id === confirmJoinProject.id) {
                const originalTimeline = p.timeline || [];
                return {
                    ...p,
                    recruitmentStatus: 'Request Sent',
                    timeline: [nowLog, ...originalTimeline]
                };
            }
            return p;
        }));
        // Update selectedProject state as well if it is currently viewed
        if (selectedProject && selectedProject.id === confirmJoinProject.id) {
            setSelectedProject(prev => {
                if (!prev)
                    return null;
                const originalTimeline = prev.timeline || [];
                return {
                    ...prev,
                    recruitmentStatus: 'Request Sent',
                    timeline: [nowLog, ...originalTimeline]
                };
            });
        }
        showToast('Join request sent');
        setConfirmJoinProject(null);
    };
    const handleGoToWorkspace = (workspaceId) => {
        if (workspaceId) {
            navigate(ROUTES.MESSAGES, { state: { activeWorkspaceId: workspaceId } });
        }
        else {
            navigate(ROUTES.MESSAGES);
        }
    };
    const handleViewProject = (proj) => {
        setSelectedProject(proj);
        setDetailTab('overview');
    };
    const handleToggleDetailTask = (taskId) => {
        if (!selectedProject || !selectedProject.tasks)
            return;
        const updatedTasks = selectedProject.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
        const completedCount = updatedTasks.filter(t => t.completed).length;
        // Append to timeline log on completion
        const targetTask = selectedProject.tasks.find(t => t.id === taskId);
        const timelineUpdates = [...(selectedProject.timeline || [])];
        if (targetTask) {
            const isNowCompleted = !targetTask.completed;
            timelineUpdates.unshift({
                id: `l-task-${Date.now()}`,
                time: 'Just now',
                text: `Task "${targetTask.text}" marked as ${isNowCompleted ? 'completed' : 'incomplete'} by You.`
            });
        }
        const updatedProject = {
            ...selectedProject,
            tasks: updatedTasks,
            completedTasks: completedCount,
            timeline: timelineUpdates
        };
        setSelectedProject(updatedProject);
        setProjects(prev => prev.map(p => (p.id === selectedProject.id ? updatedProject : p)));
    };
    // Helper to extract unique departments for filters
    const uniqueDepts = ['All', ...Array.from(new Set(projects.map(p => p.department).filter(Boolean)))];
    // Filters logic
    const filteredProjects = projects.filter(proj => {
        // 1. Tab filter
        if (activeTab === 'open' && proj.recruitmentStatus !== 'Open')
            return false;
        if (activeTab === 'joined' && proj.recruitmentStatus !== 'Joined')
            return false;
        // 2. Department filter
        if (selectedDept !== 'All' && proj.department !== selectedDept)
            return false;
        // 3. Search query
        const query = searchQuery.toLowerCase().trim();
        if (!query)
            return true;
        return (proj.title.toLowerCase().includes(query) ||
            proj.description.toLowerCase().includes(query) ||
            proj.uploader?.toLowerCase().includes(query) ||
            proj.technologies.some(t => t.toLowerCase().includes(query)) ||
            proj.neededSkills?.some(s => s.toLowerCase().includes(query)));
    });
    // Featured list
    const featuredList = projects.filter(p => p.featured === true);
    return (<AppLayout>
      <motion.div className="w-full flex flex-col gap-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="projects-container">

          {/* Render Project Detail Experience if a project is selected */}
          {selectedProject ? (<div className="project-details-container">
              {/* Back navigation */}
              <button className="project-details-back-link" onClick={() => setSelectedProject(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5m7 7-7-7 7-7"/>
                </svg>
                Back to Projects
              </button>

              {/* Project Header */}
              <div className="project-details-header">
                <div className="details-header-title-row">
                  <div className="details-header-icon" style={{ background: selectedProject.avatarBg, color: selectedProject.avatarColor }}>
                    🚀
                  </div>
                  <h2 className="details-header-title text-wrap-protect">{selectedProject.title}</h2>
                </div>
                <div className="details-header-meta">
                  <span>Lead: <strong>{selectedProject.uploader}</strong></span>
                  <span>•</span>
                  <span>Dept: <strong>{selectedProject.department}</strong></span>
                  <span>•</span>
                  <span>Members: <strong>{selectedProject.membersCount}</strong></span>
                  <span>•</span>
                  <span>Progress: <strong>{selectedProject.completedTasks} / {selectedProject.totalTasks}</strong></span>
                </div>
              </div>

              {/* Tab Navigation row */}
              <div className="details-tabs-nav">
                <button className={`details-tab-btn ${detailTab === 'overview' ? 'active' : ''}`} onClick={() => setDetailTab('overview')}>
                  Overview
                </button>
                <button className={`details-tab-btn ${detailTab === 'tasks' ? 'active' : ''}`} onClick={() => setDetailTab('tasks')}>
                  Tasks
                </button>
                <button className={`details-tab-btn ${detailTab === 'resources' ? 'active' : ''}`} onClick={() => setDetailTab('resources')}>
                  Resources
                </button>
                <button className={`details-tab-btn ${detailTab === 'members' ? 'active' : ''}`} onClick={() => setDetailTab('members')}>
                  Members
                </button>
                <button className={`details-tab-btn ${detailTab === 'timeline' ? 'active' : ''}`} onClick={() => setDetailTab('timeline')}>
                  Timeline
                </button>
              </div>

              {/* Tab Content Panes */}
              <div className="details-tab-panel">
                
                {/* A. OVERVIEW PANEL */}
                {detailTab === 'overview' && (<div className="details-overview-wrap">
                    <div className="details-info-section">
                      <span className="details-info-label">Description</span>
                      <p className="details-info-val text-wrap-protect">{selectedProject.description}</p>
                    </div>

                    <div className="details-info-section">
                      <span className="details-info-label">Technologies</span>
                      <div className="library-project-skills-needed" style={{ marginTop: '4px' }}>
                        {selectedProject.technologies.map(tech => (<span key={tech} className="skill-pill">{tech}</span>))}
                      </div>
                    </div>

                    {selectedProject.neededSkills && selectedProject.neededSkills.length > 0 && (<div className="details-info-section">
                        <span className="details-info-label">Required Skills Needed</span>
                        <div className="library-project-skills-needed" style={{ marginTop: '4px' }}>
                          {selectedProject.neededSkills.map(skill => (<span key={skill} className="skill-pill" style={{ borderColor: 'var(--marigold)' }}>
                              {skill}
                            </span>))}
                        </div>
                      </div>)}

                    <div className="details-info-section">
                      <span className="details-info-label">Deadline</span>
                      <p className="details-info-val">📅 {selectedProject.deadline}</p>
                    </div>

                    <div className="details-info-section" style={{ maxWidth: '320px' }}>
                      <span className="details-info-label">Tasks Progress</span>
                      <div className="library-project-tasks-wrap" style={{ marginTop: '4px' }}>
                        <div className="tasks-meta-row">
                          <span>{selectedProject.completedTasks} / {selectedProject.totalTasks} Completed</span>
                          <span>{selectedProject.totalTasks ? Math.round((selectedProject.completedTasks / selectedProject.totalTasks) * 100) : 0}%</span>
                        </div>
                        <div className="tasks-progress-bar-track">
                          <div className="tasks-progress-bar-fill" style={{ width: `${selectedProject.totalTasks ? (selectedProject.completedTasks / selectedProject.totalTasks) * 100 : 0}%` }}/>
                        </div>
                      </div>
                    </div>

                    <div className="details-info-section">
                      <span className="details-info-label">Recruitment Status</span>
                      <div style={{ marginTop: '4px' }}>
                        {selectedProject.recruitmentStatus === 'Joined' ? (<span className="library-project-status-badge status-badge-joined">Joined</span>) : selectedProject.recruitmentStatus === 'Request Sent' ? (<span className="library-project-status-badge status-badge-request">Request Sent</span>) : selectedProject.recruitmentStatus === 'Closed' ? (<span className="library-project-status-badge status-badge-closed">Closed</span>) : (<Button className="outline library-project-join-btn" onClick={() => setConfirmJoinProject(selectedProject)}>
                            Join Project
                          </Button>)}
                      </div>
                    </div>

                    {selectedProject.recruitmentStatus === 'Joined' && selectedProject.workspaceId && (<div className="details-info-section">
                        <span className="details-info-label">Project Workspace</span>
                        <div style={{ marginTop: '4px' }}>
                          <Button className="primary" onClick={() => handleGoToWorkspace(selectedProject.workspaceId)}>
                            Go to Collaboration Workspace
                          </Button>
                        </div>
                      </div>)}
                  </div>)}

                {/* B. TASKS PANEL */}
                {detailTab === 'tasks' && (<div className="details-tasks-list">
                    <h4 className="details-info-label" style={{ marginBottom: '8px' }}>Project Checklist</h4>
                    {!selectedProject.tasks || selectedProject.tasks.length === 0 ? (<p className="no-items-text" style={{ fontSize: '13px', color: 'var(--ink-faint)' }}>No tasks assigned.</p>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {selectedProject.tasks.map(task => (<label key={task.id} className="details-task-row">
                            <input type="checkbox" className="details-task-checkbox" checked={task.completed} onChange={() => handleToggleDetailTask(task.id)}/>
                            <span className={`details-task-text text-wrap-protect ${task.completed ? 'task-text-checked' : ''}`}>
                              {task.text}
                            </span>
                          </label>))}
                      </div>)}
                  </div>)}

                {/* C. RESOURCES PANEL */}
                {detailTab === 'resources' && (<div className="projects-library-section">
                    <h4 className="details-info-label" style={{ marginBottom: '8px' }}>Shared Resources</h4>
                    {!selectedProject.resources || selectedProject.resources.length === 0 ? (<div className="projects-empty-state">
                        <span className="projects-empty-icon">📁</span>
                        <span className="projects-empty-text">No resources shared yet</span>
                        <span className="projects-empty-sub">Files shared in this project will appear here.</span>
                      </div>) : (<div className="projects-library-grid">
                        {selectedProject.resources.map(res => (<div key={res.id} className="library-resource-card">
                            <div className="library-card-header">
                              <div className="library-card-icon" style={{ background: res.bgClass, color: res.textClass }}>
                                {res.type === 'Research Paper' ? 'REP' : res.type === 'Cheat Sheet' ? 'CHT' : res.type === 'Presentation' ? 'PRE' : res.type?.substring(0, 3).toUpperCase()}
                              </div>
                              <div className="library-card-header-info">
                                <h4 className="library-card-title text-wrap-protect">{res.title}</h4>
                                <span className="library-card-subject">{res.subject} • {res.type}</span>
                              </div>
                            </div>
                            <p className="library-card-body text-wrap-protect">{res.description}</p>
                            <div className="library-card-footer">
                              <div className="library-card-uploader-info">
                                <span className="uploader-name">By {res.uploader}</span>
                                <span className="uploader-date">{res.date}{res.fileSize ? ` · ${res.fileSize}` : ''}</span>
                              </div>
                              <Button className="outline library-card-download-btn" onClick={() => handleDownload(res.title || '')}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '12px', height: '12px' }}>
                                  <path d="M12 3v12m0 0-4-4m4 4 4-4"/>
                                  <path d="M4 19h16"/>
                                </svg>
                                Download
                              </Button>
                            </div>
                          </div>))}
                      </div>)}
                  </div>)}

                {/* D. MEMBERS PANEL */}
                {detailTab === 'members' && (<div className="projects-library-section">
                    <h4 className="details-info-label" style={{ marginBottom: '8px' }}>Project Contributors</h4>
                    <div className="projects-library-grid">
                      {selectedProject.members?.map(m => (<div key={m.id} className="library-resource-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '14px', padding: '14px' }}>
                          <div className="project-avatar-mini" style={{ width: '38px', height: '38px', fontSize: '13px', margin: 0, background: 'var(--pine)' }}>
                            {m.initials}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 className="library-project-title text-wrap-protect" style={{ fontSize: '13.5px' }}>{m.name}</h4>
                            <span className="library-project-subtitle" style={{ display: 'block', marginTop: '2px' }}>
                              {m.department} • {m.semester}
                            </span>
                          </div>
                        </div>))}
                    </div>
                  </div>)}

                {/* E. TIMELINE PANEL */}
                {detailTab === 'timeline' && (<div className="timeline-logs-list">
                    <h4 className="details-info-label" style={{ marginBottom: '4px' }}>Project Activity Feed</h4>
                    {!selectedProject.timeline || selectedProject.timeline.length === 0 ? (<p className="no-items-text" style={{ fontSize: '13px', color: 'var(--ink-faint)', padding: '12px' }}>No updates logged yet.</p>) : (selectedProject.timeline.map(log => (<div key={log.id} className="timeline-log-entry">
                          <span className="timeline-log-time">{log.time}</span>
                          <div className="timeline-log-card text-wrap-protect">
                            {log.text}
                          </div>
                        </div>)))}
                  </div>)}

              </div>
            </div>) : (<>
              {/* 1. Header Section */}
              <div className="projects-header-section">
                <h2 className="serif" style={{ fontSize: '26px', fontWeight: 600 }}>Projects</h2>
                <p className="projects-desc-text">
                  Discover • Build • Collaborate
                </p>

                <div className="projects-search-row">
                  <div className="projects-search-input-wrap">
                    <svg className="projects-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <input type="text" className="projects-search-input" placeholder="Search projects by title, description, skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                  </div>
                  <Button className="primary projects-create-btn" onClick={handleOpenCreateModal}>
                    <span>➕</span> New Project
                  </Button>
                </div>
              </div>

              {/* 2. Filters Bar */}
              <div className="projects-filters-bar">
                <div className="projects-tabs-row">
                  <button className={`filter-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
                    All Projects
                  </button>
                  <button className={`filter-tab-btn ${activeTab === 'open' ? 'active' : ''}`} onClick={() => setActiveTab('open')}>
                    Open Roles
                  </button>
                  <button className={`filter-tab-btn ${activeTab === 'joined' ? 'active' : ''}`} onClick={() => setActiveTab('joined')}>
                    My Projects
                  </button>
                </div>

                <div className="projects-dropdowns-row">
                  <div className="filter-select-wrap">
                    <label htmlFor="dept-select">Department:</label>
                    <select id="dept-select" className="filter-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                      {uniqueDepts.map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Featured Spotlights */}
              {!searchQuery && activeTab === 'all' && selectedDept === 'All' && featuredList.length > 0 && (<div className="projects-featured-section">
                  <h3 className="section-title-secondary">Featured Projects</h3>
                  <div className="projects-featured-grid">
                    {featuredList.map(proj => (<div key={proj.id} className="featured-project-card" style={{ background: proj.avatarBg }}>
                        <div className="featured-project-icon-box" style={{ background: proj.avatarColor, color: '#fff' }}>
                          🚀
                        </div>
                        <div className="featured-project-content">
                          <div className="featured-project-meta-row">
                            <span className="featured-project-lead">{proj.department} • Lead: {proj.uploader}</span>
                            <span className="featured-project-badge">Featured</span>
                          </div>
                          <h4 className="featured-project-title text-wrap-protect">{proj.title}</h4>
                          <p className="featured-project-desc text-wrap-protect">{proj.description}</p>
                          
                          <div className="library-project-skills-needed" style={{ marginTop: '4px' }}>
                            {proj.technologies.slice(0, 3).map(tech => (<span key={tech} className="skill-pill">{tech}</span>))}
                          </div>

                          <div className="library-project-footer" style={{ border: 'none', padding: 0, marginTop: '8px' }}>
                            <div className="library-project-avatars-stack">
                              {proj.members?.map(m => (<div key={m.id} className="project-avatar-mini" style={{ background: 'var(--pine)', color: '#fff' }} title={m.name}>
                                  {m.initials}
                                </div>))}
                            </div>

                            <div className="library-project-actions">
                              <Button className="outline library-project-join-btn" onClick={() => handleViewProject(proj)}>
                                View Project
                              </Button>

                              {proj.recruitmentStatus === 'Joined' && proj.workspaceId && (<Button className="primary library-project-workspace-btn" onClick={() => handleGoToWorkspace(proj.workspaceId)}>
                                  Workspace
                                </Button>)}
                              {proj.recruitmentStatus === 'Open' && (<Button className="outline library-project-join-btn" onClick={() => setConfirmJoinProject(proj)}>
                                  Join Project
                                </Button>)}
                              {proj.recruitmentStatus === 'Request Sent' && (<span className="library-project-status-badge status-badge-request">Request Sent</span>)}
                            </div>
                          </div>
                        </div>
                      </div>))}
                  </div>
                </div>)}

              {/* 4. Project Grid */}
              <div className="projects-library-section">
                <h3 className="section-title-secondary">Projects For You</h3>
                {filteredProjects.length === 0 ? (<div className="projects-empty-state">
                    <span className="projects-empty-icon">📂</span>
                    <span className="projects-empty-text">No projects found</span>
                    <span className="projects-empty-sub">Try adjusting your filters or query search keywords.</span>
                  </div>) : (<div className="projects-library-grid">
                    {filteredProjects.map(proj => (<div key={proj.id} className="library-project-card">
                        <div className="library-project-header">
                          <div className="library-project-icon" style={{ background: proj.avatarBg, color: proj.avatarColor }}>
                            🚀
                          </div>
                          <div className="library-project-header-info">
                            <h4 className="library-project-title text-wrap-protect">{proj.title}</h4>
                            <span className="library-project-subtitle">{proj.department} • Lead: {proj.uploader}</span>
                          </div>
                        </div>

                        <p className="library-project-desc text-wrap-protect">{proj.description}</p>

                        <div className="library-project-skills-needed">
                          {proj.technologies.map(tech => (<span key={tech} className="skill-pill">{tech}</span>))}
                        </div>

                        {/* Progress tracking indicator */}
                        <div className="library-project-tasks-wrap">
                          <div className="tasks-meta-row">
                            <span>Tasks Progress</span>
                            <span>{proj.completedTasks} / {proj.totalTasks}</span>
                          </div>
                          <div className="tasks-progress-bar-track">
                            <div className="tasks-progress-bar-fill" style={{ width: `${proj.totalTasks ? (proj.completedTasks / proj.totalTasks) * 100 : 0}%` }}/>
                          </div>
                        </div>

                        <div className="library-project-footer">
                          <div className="library-project-avatars-stack">
                            {proj.members?.map(m => (<div key={m.id} className="project-avatar-mini" style={{ background: 'var(--pine)', color: '#fff' }} title={m.name}>
                                {m.initials}
                              </div>))}
                          </div>

                          <div className="library-project-actions">
                            <Button className="outline library-project-join-btn" onClick={() => handleViewProject(proj)}>
                              View Project
                            </Button>

                            {proj.recruitmentStatus === 'Joined' ? (<>
                                {proj.workspaceId && (<Button className="primary library-project-workspace-btn" onClick={() => handleGoToWorkspace(proj.workspaceId)}>
                                    Workspace
                                  </Button>)}
                              </>) : proj.recruitmentStatus === 'Request Sent' ? (<span className="library-project-status-badge status-badge-request">Request Sent</span>) : proj.recruitmentStatus === 'Closed' ? (<span className="library-project-status-badge status-badge-closed">Closed</span>) : (<Button className="outline library-project-join-btn" onClick={() => setConfirmJoinProject(proj)}>
                                Join Project
                              </Button>)}
                          </div>
                        </div>

                      </div>))}
                  </div>)}
              </div>
            </>)}

        </div>
      </motion.div>

      {/* 5. CREATE NEW PROJECT MODAL */}
      {showCreateModal && (<div className="collab-modal-overlay">
          <div className="collab-modal">
            <h3 className="collab-modal-title">Create Academic Project</h3>
            
            <form onSubmit={handleCreateProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="proj-title-in">Project Name</label>
                <input id="proj-title-in" type="text" className="collab-modal-input" placeholder="e.g. Autonomous Drones Navigation" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="proj-dept-select">Department</label>
                <select id="proj-dept-select" className="collab-modal-select" value={newDept} onChange={(e) => setNewDept(e.target.value)}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="proj-cat-select">Project Category</label>
                <select id="proj-cat-select" className="collab-modal-select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Web App">Web App</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Research">Research Work</option>
                  <option value="IoT">IoT / Embedded</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="proj-skills-in">Skills Needed (comma-separated)</label>
                <input id="proj-skills-in" type="text" className="collab-modal-input" placeholder="e.g. React Native, Firebase, UI Design" value={newSkills} onChange={(e) => setNewSkills(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="proj-deadline-in">Deadline</label>
                <input id="proj-deadline-in" type="text" className="collab-modal-input" placeholder="e.g. Sep 30 or Milestone 1: Aug 25" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)}/>
              </div>

              <div className="collab-modal-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="proj-looking-toggle" checked={newLooking} onChange={(e) => setNewLooking(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--pine)', cursor: 'pointer' }}/>
                <label className="collab-modal-label" htmlFor="proj-looking-toggle" style={{ cursor: 'pointer' }}>
                  Looking for Collaborators
                </label>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label">Add Members (from connections)</label>
                <div className="collab-modal-student-list">
                  {CONNECTIONS.map(conn => (<label key={conn.id} className="student-select-row" style={{ cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedMemberIds.includes(conn.id)} onChange={() => {
                    if (selectedMemberIds.includes(conn.id)) {
                        setSelectedMemberIds(prev => prev.filter(id => id !== conn.id));
                    }
                    else {
                        setSelectedMemberIds(prev => [...prev, conn.id]);
                    }
                }} style={{ accentColor: 'var(--pine)', cursor: 'pointer' }}/>
                      <div className="student-avatar-mini" style={{ background: 'var(--pine)' }}>
                        {conn.initials}
                      </div>
                      <div className="student-details text-wrap-protect">
                        <span className="student-select-name">{conn.name}</span>
                        <span className="student-select-sub">{conn.department} • Semester {conn.semester}</span>
                      </div>
                    </label>))}
                </div>
              </div>

              <div className="collab-modal-actions" style={{ marginTop: '8px' }}>
                <Button className="outline" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button className="primary" type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>)}

      {/* 6. JOIN PROJECT CONFIRMATION DIALOG */}
      {confirmJoinProject && (<div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <h3 className="confirmation-title">Request to Join Project</h3>
            <p className="confirmation-body text-wrap-protect">
              Are you sure you want to send a request to join the project <strong>"{confirmJoinProject.title}"</strong> led by {confirmJoinProject.uploader}?
            </p>
            <div className="confirmation-actions">
              <Button className="outline" onClick={() => setConfirmJoinProject(null)}>Cancel</Button>
              <Button className="primary" onClick={handleRequestJoinProject}>Request to Join</Button>
            </div>
          </div>
        </div>)}

      {/* 7. TOAST NOTIFICATIONS */}
      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}

    </AppLayout>);
};
export default Projects;
