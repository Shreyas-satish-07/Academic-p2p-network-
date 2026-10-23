/**
 * Mock data for the Cohort Dashboard.
 * Structured to cleanly map to future Express + MongoDB REST API responses:
 * GET /api/dashboard
 * GET /api/dashboard/stats
 * GET /api/dashboard/deadlines
 * GET /api/dashboard/peer-matches
 * GET /api/dashboard/learning-progress
 * GET /api/dashboard/activity
 * GET /api/dashboard/recommended-groups
 */

export const INITIAL_USER_PROFILE = {
  name: 'Shreyas',
  greeting: 'Welcome back, Shreyas',
  subtitle: 'Your learning network is active and ready.',
  profileCompletion: 75,
  avatarInitials: 'SR',
  college: 'BMS College of Engineering',
  department: 'Computer Science & Engineering',
  semester: '6th Semester',
};

export const INITIAL_STATS = [
  {
    id: 'connections',
    label: 'Connections',
    value: '24',
    trend: '+3 this week',
    isPositive: true,
    icon: 'Users',
    ariaLabel: '24 academic peer connections, 3 new this week',
  },
  {
    id: 'study-groups',
    label: 'Study Groups',
    value: '8',
    trend: '2 sessions today',
    isPositive: true,
    icon: 'UsersRound',
    ariaLabel: '8 study groups, 2 sessions scheduled today',
  },
  {
    id: 'resources-shared',
    label: 'Resources Shared',
    value: '14',
    trend: '128 total downloads',
    isPositive: true,
    icon: 'FileUp',
    ariaLabel: '14 resources shared, 128 total peer downloads',
  },
  {
    id: 'active-projects',
    label: 'Active Projects',
    value: '5',
    trend: '1 review upcoming',
    isPositive: true,
    icon: 'FolderKanban',
    ariaLabel: '5 active projects, 1 milestone review upcoming',
  },
];

export const QUICK_ACTIONS = [
  {
    id: 'share-resource',
    title: 'Share a Resource',
    description: 'Upload notes, assignments, or references for your cohort',
    to: '/resources',
    icon: 'FileUp',
    badgeText: 'Upload',
  },
  {
    id: 'find-peers',
    title: 'Find Study Partners',
    description: 'Discover peers with matching skills, courses, and schedules',
    to: '/peers',
    icon: 'UserSearch',
    badgeText: 'Match',
  },
  {
    id: 'create-project',
    title: 'Create a Project',
    description: 'Assemble a team for hackathons, labs, or capstone ideas',
    to: '/projects',
    icon: 'FolderPlus',
    badgeText: 'Build',
  },
  {
    id: 'start-discussion',
    title: 'Start a Discussion',
    description: 'Pose academic questions and brainstorm concepts with peers',
    to: '/discussions',
    icon: 'MessageSquarePlus',
    badgeText: 'Ask',
  },
];

export const AI_ASSISTANT_PREVIEW = {
  badge: 'Academic Copilot',
  heading: 'AI Study Assistant',
  summary: 'I found 3 peer matches and 2 deadlines that need your attention.',
  promptChips: [
    'Find a React study partner',
    'Show DBMS resources',
    'Plan my DSA revision',
  ],
  status: 'Ready to assist',
};

export const UPCOMING_DEADLINES = [
  {
    id: 'dl-1',
    title: 'DBMS Assignment',
    course: 'Database Management Systems',
    dueDate: 'Aug 18',
    timeRemaining: '3 days left',
    urgency: 'high', // high = red/amber
    type: 'Assignment',
  },
  {
    id: 'dl-2',
    title: 'CodeIO Hackathon',
    course: 'Campus Innovation Cell',
    dueDate: 'Aug 21',
    timeRemaining: '6 days left',
    urgency: 'medium', // medium = amber/pine
    type: 'Competition',
  },
  {
    id: 'dl-3',
    title: 'Mini Project Review',
    course: 'Software Engineering Lab',
    dueDate: 'Aug 25',
    timeRemaining: '10 days left',
    urgency: 'normal',
    type: 'Milestone',
  },
  {
    id: 'dl-4',
    title: 'OS Lab Submission',
    course: 'Operating Systems',
    dueDate: 'Aug 28',
    timeRemaining: '13 days left',
    urgency: 'normal',
    type: 'Lab Report',
  },
];

export const TOP_PEER_MATCHES = [
  {
    id: 'peer-ananya',
    name: 'Ananya Rao',
    matchScore: 95,
    skills: ['React', 'Node.js', 'MongoDB'],
    avatarInitials: 'AR',
    department: 'CSE',
    year: '3rd Year',
    status: 'idle',
  },
  {
    id: 'peer-rahul',
    name: 'Rahul Sharma',
    matchScore: 90,
    skills: ['Python', 'TensorFlow'],
    avatarInitials: 'RS',
    department: 'AI & DS',
    year: '3rd Year',
  },
  {
    id: 'peer-priya',
    name: 'Priya Nair',
    matchScore: 87,
    skills: ['Java', 'Spring Boot'],
    avatarInitials: 'PN',
    department: 'ISE',
    year: '4th Year',
  },
];

export const LEARNING_PROGRESS = [
  {
    id: 'lp-dsa',
    subject: 'Data Structures',
    progress: 80,
    color: 'pine',
    completedModules: '16 / 20 topics',
  },
  {
    id: 'lp-dbms',
    subject: 'DBMS',
    progress: 65,
    color: 'slate',
    completedModules: '13 / 20 topics',
  },
  {
    id: 'lp-os',
    subject: 'Operating Systems',
    progress: 50,
    color: 'marigold',
    completedModules: '10 / 20 topics',
  },
  {
    id: 'lp-ml',
    subject: 'Machine Learning',
    progress: 35,
    color: 'rust',
    completedModules: '7 / 20 topics',
  },
];

export const RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    message: 'You joined Gradient Descent study group',
    timeAgo: '20 min ago',
    type: 'group',
    icon: 'UsersRound',
    highlight: 'Gradient Descent',
  },
  {
    id: 'act-2',
    message: 'Rahul Sharma accepted your connection request',
    timeAgo: '1 hour ago',
    type: 'connection',
    icon: 'UserCheck',
    highlight: 'Rahul Sharma',
  },
  {
    id: 'act-3',
    message: 'DBMS Notes.pdf was uploaded to Resources',
    timeAgo: '3 hours ago',
    type: 'resource',
    icon: 'FileText',
    highlight: 'DBMS Notes.pdf',
  },
  {
    id: 'act-4',
    message: "Task 'API documentation' was completed in Academic Peer Network",
    timeAgo: 'Yesterday',
    type: 'project',
    icon: 'CheckCircle2',
    highlight: 'API documentation',
  },
];

export const RECOMMENDED_STUDY_GROUPS = [
  {
    id: 'grp-1',
    name: 'Gradient Descent',
    domain: 'Machine Learning',
    memberCount: 18,
    schedule: 'Meets Tue & Thu, 6 PM',
    tag: 'Active',
  },
  {
    id: 'grp-2',
    name: 'OS Internals Circle',
    domain: 'Operating Systems',
    memberCount: 9,
    schedule: 'Meets Saturdays, 4 PM',
    tag: 'Lab Prep',
  },
  {
    id: 'grp-3',
    name: 'Placement Prep 2027',
    domain: 'Career Preparation',
    memberCount: 41,
    schedule: 'Daily Problem Solving',
    tag: 'Trending',
  },
];
