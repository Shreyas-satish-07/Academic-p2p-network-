import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/button';
import '../styles/messages.css';
const CURRENT_USER = {
    id: 'current-user',
    name: 'You',
    initials: 'YO',
    department: 'CSE',
    semester: '1',
    status: 'online'
};
const AVAILABLE_STUDENTS = [
    { id: 's1', name: 'Rahul Sharma', initials: 'RS', department: 'CSE', semester: '1', status: 'online' },
    { id: 's2', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: '1', status: 'online' },
    { id: 's3', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: '1', status: 'offline' },
    { id: 's4', name: 'Rhea Kulkarni', initials: 'RK', department: 'ECE', semester: '2', status: 'online' },
    { id: 's5', name: 'Amit Verma', initials: 'AV', department: 'ME', semester: '3', status: 'offline' },
    { id: 's6', name: 'Kunal Shah', initials: 'KS', department: 'EE', semester: '1', status: 'online' },
    { id: 's7', name: 'Sanjay M.', initials: 'SM', department: 'CSE', semester: '2', status: 'offline' },
    { id: 's8', name: 'Nisha Gupta', initials: 'NG', department: 'ISE', semester: '1', status: 'online' },
    { id: 's10', name: 'Shreyas Satish', initials: 'SS', department: 'CSE', semester: '1', status: 'online' }
];
const INITIAL_WORKSPACES = [
    {
        id: 'dbms-circle',
        name: 'DBMS Circle',
        category: 'group',
        categoryLabel: '📚 Study Group',
        icon: '📚',
        avatarBg: 'var(--marigold-tint)',
        avatarColor: 'var(--marigold)',
        membersCount: 7,
        lastActivityText: '📄 ER_Diagram.pdf uploaded',
        lastActivityTime: '15 min ago',
        unreadCount: 3,
        deadlineText: '2 days remaining',
        sharedResources: {
            filesCount: 3,
            messagesCount: 32,
            meetingsCount: 1
        },
        members: [
            { id: 's1', name: 'Rahul Sharma', initials: 'RS', department: 'CSE', semester: '1', status: 'online' },
            { id: 's2', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: '1', status: 'online' },
            { id: 's3', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: '1', status: 'offline' },
            { id: 's4', name: 'Rhea Kulkarni', initials: 'RK', department: 'ECE', semester: '2', status: 'online' },
            { id: 's5', name: 'Amit Verma', initials: 'AV', department: 'ME', semester: '3', status: 'offline' },
            { id: 's10', name: 'Shreyas Satish', initials: 'SS', department: 'CSE', semester: '1', status: 'online' },
            CURRENT_USER
        ],
        files: [
            { name: 'DBMS_Notes.pdf', size: '2.4 MB' },
            { name: 'ER_Diagram.pdf', size: '1.2 MB' },
            { name: 'Normalization_Cheatsheet.pdf', size: '850 KB' }
        ],
        tasks: [
            { id: 't1', text: 'Research database schema', completed: true },
            { id: 't2', text: 'Prepare presentation', completed: false },
            { id: 't3', text: 'Submit assignment', completed: false }
        ],
        meetings: [
            { title: 'DBMS Review Session', time: 'Tomorrow, 6:00 PM', link: 'Online Meet' }
        ],
        timeline: [
            { id: 'l1', time: '10:30 AM', type: 'file', text: '📎 DBMS_Notes.pdf uploaded.', user: 'Ananya' },
            { id: 'l2', time: '11:15 AM', type: 'task', text: '☑ Normalization task completed.', user: 'Rahul' },
            { id: 'l3', time: '12:00 PM', type: 'meeting', text: '📅 Meeting scheduled: DBMS Review Session.', user: 'Priya' },
            { id: 'l4', time: '2:00 PM', type: 'announcement', text: '📌 ER diagram finalized.', user: 'Ananya' }
        ]
    },
    {
        id: 'smart-attendance',
        name: 'Smart Attendance System',
        category: 'project',
        categoryLabel: '🚀 Project Team',
        icon: '🚀',
        avatarBg: 'var(--pine-tint)',
        avatarColor: 'var(--pine-dark)',
        membersCount: 5,
        lastActivityText: 'Task completed',
        lastActivityTime: '45 min ago',
        unreadCount: 0,
        deadlineText: '5 days remaining',
        sharedResources: {
            filesCount: 3,
            messagesCount: 20,
            meetingsCount: 1
        },
        members: [
            { id: 's1', name: 'Rahul Sharma', initials: 'RS', department: 'CSE', semester: '1', status: 'online' },
            { id: 's2', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: '1', status: 'online' },
            { id: 's3', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: '1', status: 'offline' },
            { id: 's10', name: 'Shreyas Satish', initials: 'SS', department: 'CSE', semester: '1', status: 'online' },
            CURRENT_USER
        ],
        files: [
            { name: 'SmartAttendance_Specs.pdf', size: '1.8 MB' },
            { name: 'UML_Documentation.pdf', size: '3.1 MB' },
            { name: 'SmartAttendance_System.zip', size: '15.4 MB' }
        ],
        tasks: [
            { id: 't4', text: 'Create ER diagram', completed: false },
            { id: 't5', text: 'Normalize tables', completed: true },
            { id: 't6', text: 'Review presentation', completed: true },
            { id: 't7', text: 'Complete documentation', completed: false }
        ],
        meetings: [
            { title: 'Phase 1 Sync Meeting', time: 'Tomorrow, 4:00 PM', link: 'Seminar Hall 3' }
        ],
        timeline: [
            { id: 'l5', time: 'Yesterday', type: 'file', text: '📎 SmartAttendance_Specs.pdf uploaded.', user: 'Priya' },
            { id: 'l6', time: 'Yesterday', type: 'task', text: '☑ Normalize tables completed.', user: 'Rahul' },
            { id: 'l7', time: 'Today', type: 'task', text: '☑ Review presentation completed.', user: 'You' }
        ]
    },
    {
        id: 'rahul-dm',
        name: 'Rahul Sharma',
        category: 'direct',
        categoryLabel: '📩 Direct Message',
        icon: '📩',
        avatarBg: 'var(--slate-tint)',
        avatarColor: 'var(--slate)',
        membersCount: 2,
        lastActivityText: '💬 Did you complete the assignment?',
        lastActivityTime: '25 min ago',
        unreadCount: 0,
        deadlineText: 'No pending deadlines',
        sharedResources: {
            filesCount: 1,
            messagesCount: 12,
            meetingsCount: 0
        },
        members: [
            { id: 's1', name: 'Rahul Sharma', initials: 'RS', department: 'CSE', semester: '1', status: 'online' },
            CURRENT_USER
        ],
        files: [
            { name: 'Assignment1_Draft.pdf', size: '1.1 MB' }
        ],
        resources: [
            { name: 'Stanford DBMS Lecture Notes', url: '#', category: 'Lecture Notes' },
            { name: 'Official PostgreSQL Cheat Sheet', url: '#', category: 'Reference Guide' }
        ],
        tasks: [
            { id: 't8', text: 'Complete SQL exercises', completed: false }
        ],
        meetings: [],
        timeline: [
            { id: 'l8', time: 'Yesterday', type: 'update', text: '💬 Hey, let\'s coordinate on SQL assignments.', user: 'Rahul Sharma' },
            { id: 'l9', time: '25m ago', type: 'update', text: '💬 Did you complete the assignment?', user: 'Rahul Sharma' }
        ]
    },
    {
        id: 'os-circle',
        name: 'OS Internals Circle',
        category: 'research',
        categoryLabel: '🔬 Research Discussion',
        icon: '🔬',
        avatarBg: 'var(--rust-tint)',
        avatarColor: 'var(--rust)',
        membersCount: 8,
        lastActivityText: 'New material uploaded',
        lastActivityTime: '2h ago',
        unreadCount: 0,
        deadlineText: '10 days remaining',
        sharedResources: {
            filesCount: 1,
            messagesCount: 8,
            meetingsCount: 0
        },
        members: [
            { id: 's5', name: 'Amit Verma', initials: 'AV', department: 'ME', semester: '3', status: 'offline' },
            { id: 's4', name: 'Rhea Kulkarni', initials: 'RK', department: 'ECE', semester: '2', status: 'online' },
            { id: 's6', name: 'Kunal Shah', initials: 'KS', department: 'EE', semester: '1', status: 'online' },
            { id: 's1', name: 'Rahul Sharma', initials: 'RS', department: 'CSE', semester: '1', status: 'online' },
            CURRENT_USER
        ],
        files: [
            { name: 'OS_Lab_Manual.pdf', size: '4.2 MB' }
        ],
        tasks: [
            { id: 't9', text: 'Read scheduling algorithms', completed: false }
        ],
        meetings: [],
        timeline: [
            { id: 'l10', time: '2h ago', type: 'file', text: '📎 OS_Lab_Manual.pdf uploaded.', user: 'System Bot' }
        ]
    }
];
const getBlockProgressBar = (percent) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round(percent / 10);
    const emptyBlocks = totalBlocks - filledBlocks;
    return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
};
export const CollaborationWorkspace = () => {
    const location = useLocation();
    const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
    const [activeTab, setActiveTab] = useState('discussion');
    const [updateText, setUpdateText] = useState('');
    const [postType, setPostType] = useState('update');
    const [fabOpen, setFabOpen] = useState(false);
    // Modal State Manager
    const [modalType, setModalType] = useState(null);
    useEffect(() => {
        if (location.state) {
            const stateObj = location.state;
            if (stateObj.openCreateGroupModal || (stateObj.openCreateWorkspace && stateObj.workspaceType === 'study-group')) {
                setModalType('group');
            }
        }
    }, [location.state]);
    // Modal Form states
    const [newCollabName, setNewCollabName] = useState('');
    const [newCollabDesc, setNewCollabDesc] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const [selectedAddStudentIds, setSelectedAddStudentIds] = useState([]);
    // Meeting Join Modal
    const [activeMeetingModal, setActiveMeetingModal] = useState(null);
    // Toast alert state
    const [toastMessage, setToastMessage] = useState(null);
    const timelineEndRef = useRef(null);
    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || null;
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    useEffect(() => {
        // 1. Check state passed via navigate()
        if (location.state && location.state.activeWorkspaceId) {
            const stateId = location.state.activeWorkspaceId;
            if (workspaces.some(w => w.id === stateId)) {
                setActiveWorkspaceId(stateId);
                window.history.replaceState({}, document.title);
                return;
            }
        }
        // 2. Check search parameters
        const params = new URLSearchParams(location.search);
        const queryId = params.get('workspaceId') || params.get('id') || params.get('workspace');
        if (queryId) {
            if (workspaces.some(w => w.id === queryId)) {
                setActiveWorkspaceId(queryId);
                return;
            }
        }
        // 3. Fallback to first if null
        if (!activeWorkspaceId && workspaces.length > 0) {
            setActiveWorkspaceId(workspaces[0].id);
        }
    }, [location.search, location.state, workspaces]);
    // Keep tabs correct and clear unread counts on active Workspace change
    useEffect(() => {
        if (activeWorkspaceId) {
            setWorkspaces(prev => prev.map(w => (w.id === activeWorkspaceId ? { ...w, unreadCount: 0 } : w)));
            const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
            if (currentWorkspace) {
                const availableTabs = getTabsForCategory(currentWorkspace.category);
                if (!availableTabs.some(t => t.id === activeTab)) {
                    setActiveTab(availableTabs[0].id);
                }
            }
        }
    }, [activeWorkspaceId]);
    // Scroll to bottom of timeline when logs expand
    useEffect(() => {
        if (activeTab === 'discussion') {
            timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeWorkspace?.timeline, activeTab]);
    const handlePostUpdate = () => {
        if (!updateText.trim() || !activeWorkspaceId)
            return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let prefixedText = updateText.trim();
        if (postType === 'announcement')
            prefixedText = `📌 ${prefixedText}`;
        else if (postType === 'file')
            prefixedText = `📎 ${prefixedText}`;
        else if (postType === 'meeting')
            prefixedText = `📅 ${prefixedText}`;
        else
            prefixedText = `💬 ${prefixedText}`;
        const newLog = {
            id: `l-user-${Date.now()}`,
            time: timeStr,
            type: postType === 'announcement' ? 'announcement' : postType === 'file' ? 'file' : postType === 'meeting' ? 'meeting' : 'update',
            text: prefixedText,
            user: 'You'
        };
        setWorkspaces(prev => prev.map(w => {
            if (w.id === activeWorkspaceId) {
                const updatedFiles = [...w.files];
                if (postType === 'file') {
                    updatedFiles.push({ name: updateText.trim(), size: 'Uploaded just now' });
                }
                const updatedMeetings = [...w.meetings];
                if (postType === 'meeting') {
                    updatedMeetings.push({ title: updateText.trim(), time: 'Scheduled', link: 'Workspace Link' });
                }
                return {
                    ...w,
                    lastActivityText: prefixedText,
                    lastActivityTime: 'Just now',
                    files: updatedFiles,
                    meetings: updatedMeetings,
                    sharedResources: {
                        ...w.sharedResources,
                        filesCount: postType === 'file' ? w.sharedResources.filesCount + 1 : w.sharedResources.filesCount,
                        meetingsCount: postType === 'meeting' ? w.sharedResources.meetingsCount + 1 : w.sharedResources.meetingsCount,
                        messagesCount: w.sharedResources.messagesCount + 1
                    },
                    timeline: [...w.timeline, newLog]
                };
            }
            return w;
        }));
        setUpdateText('');
    };
    const handleToggleTask = (taskId) => {
        if (!activeWorkspaceId)
            return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setWorkspaces(prev => prev.map(w => {
            if (w.id === activeWorkspaceId) {
                let toggledTaskName = '';
                let isNowCompleted = false;
                const updatedTasks = w.tasks.map(t => {
                    if (t.id === taskId) {
                        toggledTaskName = t.text;
                        isNowCompleted = !t.completed;
                        return { ...t, completed: isNowCompleted };
                    }
                    return t;
                });
                const taskLog = {
                    id: `l-task-${Date.now()}`,
                    time: timeStr,
                    type: 'task',
                    text: isNowCompleted ? `☑ ${toggledTaskName} completed.` : `☐ ${toggledTaskName} marked incomplete.`,
                    user: 'You'
                };
                return {
                    ...w,
                    lastActivityText: isNowCompleted ? `☑ Task completed` : `Task changed`,
                    lastActivityTime: 'Just now',
                    tasks: updatedTasks,
                    timeline: [...w.timeline, taskLog]
                };
            }
            return w;
        }));
    };
    const handleOpenCreateModal = (typeKey) => {
        setModalType(typeKey);
        setNewCollabName('');
        setNewCollabDesc('');
        setSearchQuery('');
        setSelectedStudentId(null);
        setSelectedStudentIds([]);
        setFabOpen(false);
    };
    const handleCloseModal = () => {
        setModalType(null);
        setNewCollabName('');
        setNewCollabDesc('');
        setSearchQuery('');
        setSelectedStudentId(null);
        setSelectedStudentIds([]);
        setSelectedAddStudentIds([]);
    };
    const handleCreateDM = () => {
        if (!selectedStudentId)
            return;
        const selectedStudent = AVAILABLE_STUDENTS.find(s => s.id === selectedStudentId);
        if (!selectedStudent)
            return;
        const id = `dm-${Date.now()}`;
        const newWorkspace = {
            id,
            name: selectedStudent.name,
            category: 'direct',
            categoryLabel: '📩 Direct Message',
            icon: '📩',
            avatarBg: 'var(--slate-tint)',
            avatarColor: 'var(--slate)',
            membersCount: 2,
            lastActivityText: 'Workspace initialized.',
            lastActivityTime: 'Just now',
            unreadCount: 0,
            sharedResources: { filesCount: 0, messagesCount: 0, meetingsCount: 0 },
            members: [CURRENT_USER, selectedStudent],
            files: [],
            tasks: [],
            meetings: [],
            timeline: [{ id: `l-init-${Date.now()}`, time: 'Just now', type: 'announcement', text: '📌 Workspace initialized.', user: 'System' }]
        };
        setWorkspaces(prev => [newWorkspace, ...prev]);
        setActiveWorkspaceId(id);
        setModalType(null);
        showToast(`Conversation started with ${selectedStudent.name}`);
    };
    const handleCreateGroupProjectResearch = () => {
        if (!newCollabName.trim() || !modalType)
            return;
        const selectedStudents = AVAILABLE_STUDENTS.filter(s => selectedStudentIds.includes(s.id));
        const id = `${modalType}-${Date.now()}`;
        const categoryLabel = modalType === 'group' ? '📚 Study Group' :
            modalType === 'project' ? '🚀 Project Team' : '🔬 Research Discussion';
        const newWorkspace = {
            id,
            name: newCollabName.trim(),
            category: modalType,
            categoryLabel,
            icon: modalType === 'group' ? '📚' : modalType === 'project' ? '🚀' : '🔬',
            avatarBg: modalType === 'group' ? 'var(--marigold-tint)' :
                modalType === 'project' ? 'var(--pine-tint)' : 'var(--rust-tint)',
            avatarColor: modalType === 'group' ? 'var(--marigold)' :
                modalType === 'project' ? 'var(--pine-dark)' : 'var(--rust)',
            membersCount: 1 + selectedStudents.length,
            lastActivityText: 'Workspace initialized.',
            lastActivityTime: 'Just now',
            unreadCount: 0,
            sharedResources: { filesCount: 0, messagesCount: 0, meetingsCount: 0 },
            members: [CURRENT_USER, ...selectedStudents],
            files: [],
            tasks: [],
            meetings: [],
            timeline: [{ id: `l-init-${Date.now()}`, time: 'Just now', type: 'announcement', text: '📌 Workspace initialized.', user: 'System' }]
        };
        setWorkspaces(prev => [newWorkspace, ...prev]);
        setActiveWorkspaceId(id);
        setModalType(null);
        showToast(`${categoryLabel} created successfully!`);
    };
    const handleOpenAddMemberModal = () => {
        setModalType('add_member');
        setSearchQuery('');
        setSelectedAddStudentIds([]);
    };
    const handleAddMembers = () => {
        if (selectedAddStudentIds.length === 0 || !activeWorkspaceId)
            return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMembers = AVAILABLE_STUDENTS.filter(s => selectedAddStudentIds.includes(s.id));
        const namesStr = newMembers.map(m => m.name).join(', ');
        const logText = `👥 ${namesStr} added to the workspace by You.`;
        const newLog = {
            id: `l-add-${Date.now()}`,
            time: timeStr,
            type: 'announcement',
            text: logText,
            user: 'System'
        };
        setWorkspaces(prev => prev.map(w => {
            if (w.id === activeWorkspaceId) {
                return {
                    ...w,
                    membersCount: w.membersCount + newMembers.length,
                    members: [...w.members, ...newMembers],
                    timeline: [...w.timeline, newLog]
                };
            }
            return w;
        }));
        setModalType(null);
        showToast(`${newMembers.length} member(s) added successfully!`);
    };
    const handleDownloadFile = (filename) => {
        showToast(`Download started: ${filename}`);
    };
    const handleDownloadResource = (resName) => {
        showToast(`Opening resource: ${resName}`);
    };
    const handleJoinMeeting = (meet) => {
        setActiveMeetingModal(meet);
    };
    const executeJoinMeeting = () => {
        if (activeMeetingModal) {
            showToast(`Meeting link opened: ${activeMeetingModal.title}`);
            setActiveMeetingModal(null);
        }
    };
    const getTabsForCategory = (category) => {
        switch (category) {
            case 'direct':
                return [
                    { id: 'discussion', label: 'Discussion' },
                    { id: 'files', label: 'Shared Files' },
                    { id: 'resources', label: 'Shared Resources' }
                ];
            case 'research':
                return [
                    { id: 'discussion', label: 'Discussion' },
                    { id: 'files', label: 'Research/Papers' },
                    { id: 'tasks', label: 'Tasks' },
                    { id: 'meetings', label: 'Meetings' }
                ];
            case 'group':
            case 'project':
            default:
                return [
                    { id: 'discussion', label: 'Discussion' },
                    { id: 'files', label: 'Files' },
                    { id: 'tasks', label: 'Tasks' },
                    { id: 'meetings', label: 'Meetings' }
                ];
        }
    };
    const directList = workspaces.filter(w => w.category === 'direct');
    const groupList = workspaces.filter(w => w.category === 'group');
    const projectList = workspaces.filter(w => w.category === 'project');
    const researchList = workspaces.filter(w => w.category === 'research');
    const getTasksCompletedStats = (w) => {
        const completed = w.tasks.filter(t => t.completed).length;
        const total = w.tasks.length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percent };
    };
    return (<AppLayout>
      <div className={`msg-container ${activeWorkspaceId ? 'has-active-chat' : ''}`}>
        
        {/* Left Panel: Collaboration list organized by Categories */}
        <aside className="msg-list-panel">
          <div className="workspace-list-header">
            <h2 className="panel-title-primary">Collaborations</h2>
          </div>
          
          <div className="conversation-scroll-area">
            {/* Category: DIRECT MESSAGES */}
            {directList.length > 0 && (<div className="category-section">
                <h3 className="category-header-title">📩 DIRECT MESSAGES</h3>
                {directList.map(item => (<WorkspaceCard key={item.id} item={item} activeId={activeWorkspaceId} onSelect={setActiveWorkspaceId}/>))}
              </div>)}

            {/* Category: STUDY GROUPS */}
            {groupList.length > 0 && (<div className="category-section">
                <h3 className="category-header-title">📚 STUDY GROUPS</h3>
                {groupList.map(item => (<WorkspaceCard key={item.id} item={item} activeId={activeWorkspaceId} onSelect={setActiveWorkspaceId}/>))}
              </div>)}

            {/* Category: PROJECT TEAMS */}
            {projectList.length > 0 && (<div className="category-section">
                <h3 className="category-header-title">🚀 PROJECT TEAMS</h3>
                {projectList.map(item => (<WorkspaceCard key={item.id} item={item} activeId={activeWorkspaceId} onSelect={setActiveWorkspaceId}/>))}
              </div>)}

            {/* Category: RESEARCH DISCUSSIONS */}
            {researchList.length > 0 && (<div className="category-section">
                <h3 className="category-header-title">🔬 RESEARCH DISCUSSIONS</h3>
                {researchList.map(item => (<WorkspaceCard key={item.id} item={item} activeId={activeWorkspaceId} onSelect={setActiveWorkspaceId}/>))}
              </div>)}
          </div>

          {/* Floating Action Button (FAB) Menu - Placed INSIDE msg-list-panel context */}
          <div className={`collaboration-fab-container ${fabOpen ? 'open' : ''}`}>
            {fabOpen && (<div className="fab-options-menu">
                <button className="fab-menu-option" onClick={() => handleOpenCreateModal('direct')}>
                  <span>💬</span> Direct Message
                </button>
                <button className="fab-menu-option" onClick={() => handleOpenCreateModal('group')}>
                  <span>📚</span> Study Group
                </button>
                <button className="fab-menu-option" onClick={() => handleOpenCreateModal('project')}>
                  <span>🚀</span> Project Team
                </button>
                <button className="fab-menu-option" onClick={() => handleOpenCreateModal('research')}>
                  <span>🔬</span> Research Discussion
                </button>
              </div>)}
            <button className="collaboration-fab-btn" onClick={() => setFabOpen(!fabOpen)} aria-label="New Collaboration Menu">
              {fabOpen ? '✕' : '+ New'}
            </button>
          </div>
        </aside>

        {/* Center Panel: Collaboration Workspace */}
        <section className="msg-chat-panel">
          {activeWorkspace ? (<>
              {/* Workspace Header */}
              <header className="chat-header">
                <button className="chat-back-btn" onClick={() => setActiveWorkspaceId(null)} aria-label="Back to Collaborations">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <div className="header-info">
                  <div className="header-name-row">
                    <span className="workspace-ico-header">{activeWorkspace.icon}</span>
                    <h2 className="header-user-name text-wrap-protect">{activeWorkspace.name}</h2>
                  </div>
                  <div className="header-meta">
                    {activeWorkspace.membersCount} members • {activeWorkspace.files.length} resources • {activeWorkspace.meetings.length === 0 ? 'No upcoming meetings' :
                activeWorkspace.meetings.length === 1 ? '1 upcoming meeting' :
                    `${activeWorkspace.meetings.length} upcoming meetings`}
                  </div>
                </div>
              </header>

              {/* Workspace Navigation Tabs */}
              <nav className="workspace-tabs-nav">
                {getTabsForCategory(activeWorkspace.category).map(tab => (<button key={tab.id} className={`tab-nav-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    {tab.label}
                  </button>))}
              </nav>

              {/* Workspace Content Tabs Panel (SINGLE SCROLL CONTAINER) */}
              <div className="chat-messages-area workspace-tab-content">
                
                {/* 1. DISCUSSION TAB: Activity Timeline feed */}
                {activeTab === 'discussion' && (<div className="discussion-tab-pane">
                    <div className="activity-timeline-feed">
                      {activeWorkspace.timeline.map((log) => (<div key={log.id} className="timeline-entry-row">
                          <div className="timeline-time-badge">{log.time}</div>
                          <div className={`timeline-entry-card type-${log.type}`}>
                            <div className="entry-card-header">
                              <span className="entry-user">{log.user}</span>
                              <span style={{ fontSize: '10px', fontWeight: '600', opacity: 0.8 }}>
                                {log.type === 'announcement' ? '📌 Announcement' :
                        log.type === 'file' ? '📎 File shared' :
                            log.type === 'meeting' ? '📅 Meeting' :
                                log.type === 'task' ? '☑ Task completed' : '💬 Post'}
                              </span>
                            </div>
                            <div className="entry-card-body text-wrap-protect">
                              {log.text}
                            </div>
                          </div>
                        </div>))}
                      <div ref={timelineEndRef}/>
                    </div>
                  </div>)}

                {/* 2. FILES TAB */}
                {activeTab === 'files' && (<div className="files-tab-pane">
                    <h3 className="tab-pane-title">
                      {activeWorkspace.category === 'research' ? 'Research Papers & Publications' : 'Academic Resources'}
                    </h3>
                    {activeWorkspace.files.length === 0 ? (<p className="no-items-text">No resources shared yet.</p>) : (<div className="files-list-grid">
                        {activeWorkspace.files.map((file, idx) => (<div key={idx} className="file-resource-card">
                            <span className="file-icon-box">📄</span>
                            <div className="file-resource-info">
                              <div className="file-resource-name text-wrap-protect">{file.name}</div>
                              <div className="file-resource-size">{file.size}</div>
                            </div>
                            <Button className="file-download-btn outline" onClick={() => handleDownloadFile(file.name)}>
                              Download
                            </Button>
                          </div>))}
                      </div>)}
                  </div>)}

                {/* 3. TASKS TAB */}
                {activeTab === 'tasks' && (<div className="tasks-tab-pane">
                    <h3 className="tab-pane-title">Workspace Checklist</h3>
                    {activeWorkspace.tasks.length === 0 ? (<p className="no-items-text">No tasks created yet.</p>) : (<div className="tasks-checklist-list">
                        {activeWorkspace.tasks.map((task) => (<label key={task.id} className="task-checkbox-label">
                            <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id)} className="task-checkbox-inp"/>
                            <span className={`task-checkbox-text text-wrap-protect ${task.completed ? 'completed' : ''}`}>
                              {task.text}
                            </span>
                          </label>))}
                      </div>)}
                  </div>)}

                {/* 4. MEETINGS TAB */}
                {activeTab === 'meetings' && (<div className="meetings-tab-pane">
                    <h3 className="tab-pane-title">Upcoming Meetings</h3>
                    {activeWorkspace.meetings.length === 0 ? (<p className="no-items-text">No upcoming meetings scheduled.</p>) : (<div className="meetings-schedule-list">
                        {activeWorkspace.meetings.map((meet, idx) => (<div key={idx} className="meeting-schedule-card">
                            <div className="meeting-date-badge">
                              <span className="calendar-ico">📅</span>
                              <span className="date-txt text-wrap-protect">{meet.time}</span>
                            </div>
                            <div className="meeting-card-details">
                              <div className="meeting-title text-wrap-protect">{meet.title}</div>
                              <div className="meeting-location text-wrap-protect">Location: <strong>{meet.link}</strong></div>
                            </div>
                            <Button className="meeting-join-btn primary" onClick={() => handleJoinMeeting(meet)}>
                              Join Meeting
                            </Button>
                          </div>))}
                      </div>)}
                  </div>)}

                {/* 5. RESOURCES TAB (Specific to DM) */}
                {activeTab === 'resources' && (<div className="files-tab-pane">
                    <h3 className="tab-pane-title">Shared Resources</h3>
                    {!activeWorkspace.resources || activeWorkspace.resources.length === 0 ? (<p className="no-items-text">No shared resources yet.</p>) : (<div className="files-list-grid">
                        {activeWorkspace.resources.map((res, idx) => (<div key={idx} className="file-resource-card">
                            <span className="file-icon-box">🔗</span>
                            <div className="file-resource-info">
                              <div className="file-resource-name text-wrap-protect">{res.name}</div>
                              <div className="file-resource-size">{res.category}</div>
                            </div>
                            <Button className="file-download-btn outline" onClick={() => handleDownloadResource(res.name)}>
                              Open
                            </Button>
                          </div>))}
                      </div>)}
                  </div>)}

              </div>

              {/* Discussion Composer (outside scroll content area, staying at bottom of workspace panel) */}
              {activeTab === 'discussion' && (<div className="chat-composer workspace-update-composer">
                  <div className="update-type-select-row">
                    <span className="select-label">Post type:</span>
                    <select className="post-type-selector" value={postType} onChange={(e) => setPostType(e.target.value)}>
                      <option value="update">💬 Comment / Post</option>
                      <option value="announcement">📌 Announcement</option>
                      <option value="file">📎 File Link</option>
                      <option value="meeting">📅 Meeting Notice</option>
                    </select>
                  </div>
                  <div className="composer-row">
                    <input type="text" placeholder={postType === 'announcement' ? "Add announcement text..." :
                    postType === 'file' ? "Enter filename to share (e.g. SQL_Notes.pdf)..." :
                        postType === 'meeting' ? "Enter meeting topic or title..." :
                            "Share an update with the workspace..."} value={updateText} onChange={(e) => setUpdateText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePostUpdate()} className="composer-input update-box-input"/>
                    <Button className="composer-send-btn post-update-btn" onClick={handlePostUpdate}>
                      Post
                    </Button>
                  </div>
                </div>)}
            </>) : (<div className="chat-empty-state">
              <div className="empty-state-ico" style={{ fontSize: '40px' }}>🎓</div>
              <p className="empty-state-text" style={{ marginBottom: '24px', fontSize: '15px' }}>Select a collaboration workspace to get started.</p>
              
              <div className="empty-state-hints" style={{ maxWidth: '480px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left', width: '100%' }}>
                <div className="hint-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '700' }}>📩 Direct Messages</span>
                  <span style={{ color: 'var(--ink-soft)', fontSize: '11px' }}>1-on-1 academic chat & resource sharing.</span>
                </div>
                <div className="hint-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '700' }}>📚 Study Groups</span>
                  <span style={{ color: 'var(--ink-soft)', fontSize: '11px' }}>Collaborative learning & revision sessions.</span>
                </div>
                <div className="hint-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '700' }}>🚀 Project Teams</span>
                  <span style={{ color: 'var(--ink-soft)', fontSize: '11px' }}>Shared checklists, project files, and tasks.</span>
                </div>
                <div className="hint-card" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '8px', padding: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontWeight: '700' }}>🔬 Research Discussions</span>
                  <span style={{ color: 'var(--ink-soft)', fontSize: '11px' }}>Paper analysis and scientific notes tracking.</span>
                </div>
              </div>
            </div>)}
        </section>

        {/* Right Panel: Shared Context */}
        <aside className="msg-info-panel">
          {activeWorkspace ? (<div className="info-panel-content">
              {/* Header title */}
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--line)', marginBottom: '4px' }}>
                <h4 className="info-section-title" style={{ fontSize: '11px', color: 'var(--ink)', fontWeight: '700' }}>SHARED CONTEXT</h4>
              </div>

              {/* Deadline */}
              <div className="info-section">
                <h5 className="info-section-title">Deadline</h5>
                <div className="deadline-alert-card">
                  <span className="warning-ico">⚠️</span>
                  <div className="deadline-info text-wrap-protect">
                    <div className="deadline-title">{activeWorkspace.deadlineText || 'No pending deadlines'}</div>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div className="info-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 className="info-section-title" style={{ margin: 0 }}>
                    {activeWorkspace.category === 'direct' ? 'MEMBERS' :
                activeWorkspace.category === 'research' ? 'PARTICIPANTS' : 'TEAM MEMBERS'}
                  </h5>
                  {activeWorkspace.category !== 'direct' && (<button onClick={handleOpenAddMemberModal} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--pine)',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: 0
                }}>
                      ➕ Add
                    </button>)}
                </div>
                <ul className="info-group-list">
                  {activeWorkspace.members.map((member, idx) => (<li key={idx} className="info-group-item text-wrap-protect" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px', padding: '4px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: member.status === 'online' ? 'var(--pine)' : 'var(--ink-faint)'
                }}/>
                        <span className="group-name" style={{ fontWeight: '600', fontSize: '13px' }}>{member.name}</span>
                      </div>
                      <div style={{ fontSize: '10.5px', color: 'var(--ink-soft)', paddingLeft: '16px' }}>
                        {member.department} • Semester {member.semester}
                      </div>
                    </li>))}
                </ul>
              </div>

              {/* Resources */}
              <div className="info-section">
                <h5 className="info-section-title">Resources</h5>
                <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--ink-soft)' }}>
                  📄 {activeWorkspace.files.length} {activeWorkspace.files.length === 1 ? 'file' : 'files'}
                </div>
              </div>

              {/* Tasks */}
              {activeWorkspace.category !== 'direct' && (<div className="info-section">
                  <h5 className="info-section-title">Tasks</h5>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--ink-soft)' }}>
                    ☑️ {getTasksCompletedStats(activeWorkspace).completed} / {getTasksCompletedStats(activeWorkspace).total} completed
                  </div>
                </div>)}

              {/* Meetings */}
              {activeWorkspace.category !== 'direct' && (<div className="info-section">
                  <h5 className="info-section-title">Meetings</h5>
                  <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--ink-soft)' }}>
                    📅 {activeWorkspace.meetings.length} {activeWorkspace.meetings.length === 1 ? 'meeting' : 'meetings'} this week
                  </div>
                </div>)}

              {/* Workspace Progress */}
              {activeWorkspace.category !== 'direct' && (<div className="info-section">
                  <h5 className="info-section-title">Workspace Progress</h5>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.02em', color: 'var(--ink)', fontWeight: '700' }}>
                    {getBlockProgressBar(getTasksCompletedStats(activeWorkspace).percent)} {getTasksCompletedStats(activeWorkspace).percent}%
                  </div>
                  <div className="progress-bar-wrap" style={{ marginTop: '8px' }}>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${getTasksCompletedStats(activeWorkspace).percent}%` }}/>
                    </div>
                  </div>
                </div>)}
            </div>) : (<div className="info-empty-state">
              <p>No workspace details loaded.</p>
            </div>)}
        </aside>

      </div>

      {/* 1. START A DIRECT MESSAGE MODAL */}
      {modalType === 'direct' && (<div className="collab-modal-overlay">
          <div className="collab-modal">
            <h3 className="collab-modal-title">Start a Direct Message</h3>
            
            <div className="collab-modal-field">
              <label className="collab-modal-label" htmlFor="dm-search">Search connections</label>
              <input id="dm-search" type="text" className="collab-modal-input" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>

            <div className="collab-modal-field">
              <label className="collab-modal-label">Select Connection</label>
              <div className="collab-modal-student-list">
                {AVAILABLE_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(student => (<div key={student.id} className="student-select-row" onClick={() => setSelectedStudentId(student.id)}>
                      <input type="radio" name="dm-student" checked={selectedStudentId === student.id} onChange={() => setSelectedStudentId(student.id)} style={{ accentColor: 'var(--pine)', cursor: 'pointer' }}/>
                      <div className="student-avatar-mini">
                        {student.initials}
                      </div>
                      <div className="student-details text-wrap-protect">
                        <span className="student-select-name">{student.name}</span>
                        <span className="student-select-sub">{student.department} • Semester {student.semester}</span>
                      </div>
                      <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: student.status === 'online' ? 'var(--pine)' : 'var(--ink-faint)',
                    flexShrink: 0
                }}/>
                    </div>))}
              </div>
            </div>

            <div className="collab-modal-actions">
              <Button className="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button className="primary" onClick={handleCreateDM} disabled={!selectedStudentId}>
                Start Conversation
              </Button>
            </div>
          </div>
        </div>)}

      {/* 2, 3, 4. STUDY GROUP / PROJECT TEAM / RESEARCH DISCUSSION MODAL */}
      {(modalType === 'group' || modalType === 'project' || modalType === 'research') && (<div className="collab-modal-overlay">
          <div className="collab-modal">
            <h3 className="collab-modal-title">
              {modalType === 'group' ? 'Create Study Group' :
                modalType === 'project' ? 'Create Project Team' : 'Create Research Discussion'}
            </h3>
            
            <div className="collab-modal-field">
              <label className="collab-modal-label" htmlFor="collab-name">
                {modalType === 'group' ? 'Group Name' :
                modalType === 'project' ? 'Project Name' : 'Research Topic'}
              </label>
              <input id="collab-name" type="text" className="collab-modal-input" placeholder={modalType === 'group' ? "e.g. DBMS Study Circle" : modalType === 'project' ? "e.g. Campus Navigator App" : "e.g. AI in Education"} value={newCollabName} onChange={(e) => setNewCollabName(e.target.value)}/>
            </div>

            <div className="collab-modal-field">
              <label className="collab-modal-label" htmlFor="collab-desc">Description</label>
              <textarea id="collab-desc" className="collab-modal-textarea" placeholder="Enter description (optional)..." value={newCollabDesc} onChange={(e) => setNewCollabDesc(e.target.value)}/>
            </div>

            <div className="collab-modal-field">
              <label className="collab-modal-label" htmlFor="member-search">Add Members</label>
              <input id="member-search" type="text" className="collab-modal-input" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>

            <div className="collab-modal-field">
              <label className="collab-modal-label">Connections Checklist</label>
              <div className="collab-modal-student-list">
                {AVAILABLE_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(student => (<label key={student.id} className="student-select-row" style={{ cursor: 'pointer' }}>
                      <input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => {
                    if (selectedStudentIds.includes(student.id)) {
                        setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
                    }
                    else {
                        setSelectedStudentIds(prev => [...prev, student.id]);
                    }
                }} style={{ accentColor: 'var(--pine)', cursor: 'pointer' }}/>
                      <div className="student-avatar-mini">
                        {student.initials}
                      </div>
                      <div className="student-details text-wrap-protect">
                        <span className="student-select-name">{student.name}</span>
                        <span className="student-select-sub">{student.department} • Semester {student.semester}</span>
                      </div>
                      <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: student.status === 'online' ? 'var(--pine)' : 'var(--ink-faint)',
                    flexShrink: 0
                }}/>
                    </label>))}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: '600' }}>
              {modalType === 'group' ? `Selected Members: ${selectedStudentIds.length}` :
                modalType === 'project' ? `Selected: ${selectedStudentIds.length} members` : `Selected: ${selectedStudentIds.length} participants`}
            </div>

            <div className="collab-modal-actions">
              <Button className="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button className="primary" onClick={handleCreateGroupProjectResearch} disabled={!newCollabName.trim()}>
                {modalType === 'group' ? 'Create Group' :
                modalType === 'project' ? 'Create Team' : 'Create Discussion'}
              </Button>
            </div>
          </div>
        </div>)}

      {/* 5. ADD MEMBERS AFTER CREATION MODAL */}
      {modalType === 'add_member' && activeWorkspace && (<div className="collab-modal-overlay">
          <div className="collab-modal">
            <h3 className="collab-modal-title">
              {activeWorkspace.category === 'research' ? 'Add Participants' : 'Add Members'}
            </h3>
            
            <div className="collab-modal-field">
              <label className="collab-modal-label" htmlFor="add-member-search">Search students</label>
              <input id="add-member-search" type="text" className="collab-modal-input" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
            </div>

            <div className="collab-modal-field">
              <label className="collab-modal-label">Connections</label>
              <div className="collab-modal-student-list">
                {AVAILABLE_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(student => {
                const isAlreadyMember = activeWorkspace.members.some(m => m.id === student.id);
                return (<label key={student.id} className="student-select-row" style={{
                        cursor: isAlreadyMember ? 'not-allowed' : 'pointer',
                        opacity: isAlreadyMember ? 0.6 : 1
                    }}>
                        <input type="checkbox" checked={isAlreadyMember || selectedAddStudentIds.includes(student.id)} disabled={isAlreadyMember} onChange={() => {
                        if (isAlreadyMember)
                            return;
                        if (selectedAddStudentIds.includes(student.id)) {
                            setSelectedAddStudentIds(prev => prev.filter(id => id !== student.id));
                        }
                        else {
                            setSelectedAddStudentIds(prev => [...prev, student.id]);
                        }
                    }} style={{ accentColor: 'var(--pine)', cursor: isAlreadyMember ? 'not-allowed' : 'pointer' }}/>
                        <div className="student-avatar-mini">
                          {student.initials}
                        </div>
                        <div className="student-details text-wrap-protect">
                          <span className="student-select-name">{student.name}</span>
                          <span className="student-select-sub">
                            {student.department} • Semester {student.semester}
                            {isAlreadyMember && ' (Already Member)'}
                          </span>
                        </div>
                        <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: student.status === 'online' ? 'var(--pine)' : 'var(--ink-faint)',
                        flexShrink: 0
                    }}/>
                      </label>);
            })}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--ink-soft)', fontWeight: '600' }}>
              Selected: {selectedAddStudentIds.length} new
            </div>

            <div className="collab-modal-actions">
              <Button className="outline" onClick={handleCloseModal}>Cancel</Button>
              <Button className="primary" onClick={handleAddMembers} disabled={selectedAddStudentIds.length === 0}>
                Add Selected
              </Button>
            </div>
          </div>
        </div>)}

      {/* MOCK MEETING DETAILS MODAL */}
      {activeMeetingModal && (<div className="collab-modal-overlay">
          <div className="collab-modal" style={{ maxWidth: '400px' }}>
            <h3 className="collab-modal-title">Academic Meeting</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div><strong>Topic:</strong> <span className="text-wrap-protect">{activeMeetingModal.title}</span></div>
              <div><strong>Time:</strong> <span className="text-wrap-protect">{activeMeetingModal.time}</span></div>
              <div><strong>Location / Platform:</strong> <span className="text-wrap-protect">{activeMeetingModal.link}</span></div>
            </div>

            <div className="collab-modal-actions" style={{ marginTop: '12px' }}>
              <Button className="outline" onClick={() => setActiveMeetingModal(null)}>Cancel</Button>
              <Button className="primary" onClick={executeJoinMeeting}>Join</Button>
            </div>
          </div>
        </div>)}

      {/* DYNAMIC TOAST ALERTS */}
      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}

    </AppLayout>);
};
const WorkspaceCard = ({ item, activeId, onSelect }) => {
    const isActive = item.id === activeId;
    return (<div className={`conversation-card ${isActive ? 'active' : ''}`} onClick={() => onSelect(item.id)}>
      <div className="card-avatar-wrap">
        <div className="card-avatar" style={{ backgroundColor: item.avatarBg, color: item.avatarColor }}>
          {item.icon}
        </div>
      </div>
      <div className="card-info">
        <div className="card-top-row">
          <span className="card-user-name text-wrap-protect">{item.name}</span>
          <span className="card-time">{item.lastActivityTime}</span>
        </div>
        <div className="card-bottom-row">
          <span className="card-msg-preview text-wrap-protect">{item.lastActivityText}</span>
          {item.unreadCount > 0 && (<span className="card-unread-badge">{item.unreadCount}</span>)}
        </div>
        <div className="card-sub-info-row">
          <span className="card-members-count">👥 {item.membersCount} members</span>
          <span className="card-cat-pill">{item.categoryLabel}</span>
        </div>
      </div>
    </div>);
};
export default CollaborationWorkspace;
