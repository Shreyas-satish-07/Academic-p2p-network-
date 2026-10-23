export const CURRENT_STUDENT = {
    name: 'Shreyas Rao',
    term: 'SEM 1 · CSE',
    college: 'BMS COLLEGE OF ENGINEERING',
    profileCompletion: 75,
    stats: {
        connections: 24,
        studyGroups: 8,
        resourcesShared: 14,
        activeProjects: 5,
    },
    aiFound: {
        peerMatches: 3,
        projectInvitations: 2,
        newResources: 5,
    },
};
export const DEADLINES = [
    {
        id: '1',
        day: '18',
        month: 'Aug',
        title: 'DBMS Assignment',
        subtitle: 'Prof. Rao · Submit as PDF',
        urgentText: '3 days',
    },
    {
        id: '2',
        day: '21',
        month: 'Aug',
        title: 'CodeIO Hackathon',
        subtitle: 'Registrations close today',
        urgentText: '6 days',
    },
    {
        id: '3',
        day: '25',
        month: 'Aug',
        title: 'Mini-Project Review',
        subtitle: 'Team Nimbus · 4 members',
    },
    {
        id: '4',
        day: '28',
        month: 'Aug',
        title: 'OS Lab Submission',
        subtitle: 'Scheduler assignment · Individual',
    },
];
export const MESSAGES = [
    {
        id: '1',
        senderName: 'Rhea Kulkarni',
        avatarInitials: 'RK',
        bgClass: 'var(--marigold-tint)',
        textClass: 'var(--marigold)',
        online: true,
        previewText: 'Can you push the DSA notes?',
        time: '9m',
    },
    {
        id: '2',
        senderName: 'Team Nimbus',
        avatarInitials: 'TN',
        bgClass: 'var(--slate-tint)',
        textClass: 'var(--slate)',
        online: false,
        previewText: 'Aditya: standup at 6?',
        time: '41m',
    },
    {
        id: '3',
        senderName: 'Sanjay M.',
        avatarInitials: 'SM',
        bgClass: 'var(--pine-tint)',
        textClass: 'var(--pine-dark)',
        online: false,
        previewText: 'Thanks for the resume review!',
        time: '2h',
    },
];
export const RECOMMENDED_GROUPS = [
    {
        id: '1',
        name: 'Gradient Descent',
        info: 'ML · 18 members',
        matchPct: 92,
        bgClass: 'var(--pine)',
    },
    {
        id: '2',
        name: 'OS Internals Circle',
        info: 'Systems · 9 members',
        matchPct: 84,
        bgClass: 'var(--slate)',
    },
    {
        id: '3',
        name: 'Placement Prep \'27',
        info: 'Careers · 41 members',
        matchPct: 77,
        bgClass: 'var(--marigold)',
    },
];
export const SUGGESTED_PEERS = [
    {
        id: '1',
        name: 'Ananya Rao',
        initials: 'AR',
        department: 'CSE',
        skills: ['React', 'Node.js', 'MongoDB'],
        matchPct: 95,
        bgClass: 'var(--pine-tint)',
        textClass: 'var(--pine-dark)',
    },
    {
        id: '2',
        name: 'Rahul Sharma',
        initials: 'RS',
        department: 'AIML',
        skills: ['Python', 'TensorFlow'],
        matchPct: 90,
        bgClass: 'var(--marigold-tint)',
        textClass: 'var(--marigold)',
    },
    {
        id: '3',
        name: 'Priya Nair',
        initials: 'PN',
        department: 'CSE',
        skills: ['Java', 'Spring Boot'],
        matchPct: 87,
        bgClass: 'var(--slate-tint)',
        textClass: 'var(--slate)',
    },
];
export const LEARNING_PROGRESS = [
    {
        id: '1',
        title: 'Data Structures',
        statusText: 'Almost there',
        statusBg: 'var(--pine-tint)',
        statusColor: 'var(--pine-dark)',
        percentage: 80,
    },
    {
        id: '2',
        title: 'DBMS',
        statusText: 'In progress',
        statusBg: 'var(--slate-tint)',
        statusColor: 'var(--slate)',
        percentage: 65,
    },
    {
        id: '3',
        title: 'Operating Systems',
        statusText: 'In progress',
        statusBg: 'var(--slate-tint)',
        statusColor: 'var(--slate)',
        percentage: 50,
    },
    {
        id: '4',
        title: 'Machine Learning',
        statusText: 'Just started',
        statusBg: 'var(--marigold-tint)',
        statusColor: 'var(--marigold)',
        percentage: 35,
    },
];
export const ACTIVE_COLLABORATIONS = [
    {
        id: '1',
        title: 'Academic Peer-to-Peer Network',
        progressText: '8 / 10 tasks',
        percentage: 80,
        members: [
            { initials: 'AR', bgClass: 'var(--marigold-tint)', textClass: 'var(--marigold)' },
            { initials: 'RK', bgClass: 'var(--pine-tint)', textClass: 'var(--pine-dark)' },
            { initials: 'SM', bgClass: 'var(--slate-tint)', textClass: 'var(--slate)' },
            { initials: '+1', bgClass: 'var(--rust-tint)', textClass: 'var(--rust)' },
        ],
        workspaceId: 'project-1',
    },
    {
        id: '2',
        title: 'Research: OS Internals Circle',
        progressText: '1 / 3 tasks',
        percentage: 33,
        members: [
            { initials: 'AR', bgClass: 'var(--marigold-tint)', textClass: 'var(--marigold)' },
            { initials: 'RK', bgClass: 'var(--pine-tint)', textClass: 'var(--pine-dark)' },
        ],
        workspaceId: 'os-circle',
    },
];
export const PROJECT_ACTIVITY = [
    {
        id: '1',
        title: 'API documentation uploaded',
        time: 'Today, 9:40 AM',
    },
    {
        id: '2',
        title: 'Task #8 completed',
        time: 'Today, 8:15 AM',
    },
    {
        id: '3',
        title: 'Milestone review scheduled',
        time: 'Yesterday, 6:02 PM',
    },
    {
        id: '4',
        title: 'Repository updated',
        time: 'Yesterday, 3:47 PM',
    },
    {
        id: '5',
        title: 'New comment added',
        time: 'Yesterday, 1:20 PM',
    },
];
