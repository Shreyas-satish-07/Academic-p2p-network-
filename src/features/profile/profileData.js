/**
 * Initial mock data for the Cohort Student Profile.
 * Structured to map directly to MongoDB 'User' and 'Activity' document schemas.
 * 
 * Future API Endpoints:
 * - GET  /api/users/me        -> Fetches student profile
 * - PUT  /api/users/me        -> Updates student profile attributes
 * - POST /api/users/me/avatar -> Uploads custom avatar file
 * - GET  /api/users/me/activity -> Fetches student profile activity stream
 */

export const INITIAL_PROFILE_DATA = {
  id: 'usr_shreyas_01',
  name: 'Shreyas Rao',
  initials: 'SR',
  role: 'Computer Science Student',
  college: 'BMS College of Engineering',
  department: 'Computer Science and Engineering',
  semester: '6th Semester',
  graduationYear: '2026',
  location: 'Bengaluru, India',
  academicFocus: 'MERN Stack · DSA · AI Applications',
  bio: 'I enjoy building full-stack web applications and learning through collaboration. Currently focused on MERN stack, DSA, and practical AI integrations.',
  email: 'shreyas@example.com',
  github: 'https://github.com/shreyasrao',
  githubHandle: 'github.com/shreyasrao',
  linkedin: 'https://linkedin.com/in/shreyasrao',
  linkedinHandle: 'linkedin.com/in/shreyasrao',
  
  // Categorized technical skills for compatibility matching
  skillCategories: {
    frontend: ['React', 'JavaScript', 'HTML', 'CSS'],
    backend: ['Node.js', 'Express.js', 'Python'],
    database: ['MongoDB'],
    tools: ['Git'],
    learning: ['Data Structures and Algorithms'],
  },

  // Flattened skills list for easy search/filter
  skills: [
    'React',
    'JavaScript',
    'Node.js',
    'Express.js',
    'MongoDB',
    'HTML',
    'CSS',
    'Git',
    'Python',
    'Data Structures and Algorithms',
  ],

  interests: [
    'Full Stack Development',
    'Web Development',
    'Machine Learning',
    'Hackathons',
    'Open Source',
    'System Design',
  ],

  availability: {
    status: 'Available for collaboration',
    isAvailable: true,
    weekdays: '6:00 PM – 9:00 PM',
    weekends: '10:00 AM – 5:00 PM',
    preferredTeamSize: 'Small teams, 2–4 members',
    openTo: ['Study groups', 'Hackathons', 'MERN projects'],
  },

  achievements: [
    {
      id: 'ach-1',
      title: '200+ DSA Problems',
      description: 'Solved on LeetCode & CodeStudio across trees, graphs, and DP',
      icon: 'Code2',
      metric: '200+',
      category: 'Problem Solving',
    },
    {
      id: 'ach-2',
      title: '5 Collaborative Projects',
      description: 'Built with peers across college hackathons and lab terms',
      icon: 'Rocket',
      metric: '5',
      category: 'Projects',
    },
    {
      id: 'ach-3',
      title: '14 Learning Resources',
      description: 'Shared lecture notes, cheat sheets, and question banks',
      icon: 'FileUp',
      metric: '14',
      category: 'Resources',
    },
    {
      id: 'ach-4',
      title: '8 Study Groups',
      description: 'Active participant in DSA revision and ML discussion circles',
      icon: 'UsersRound',
      metric: '8',
      category: 'Community',
    },
  ],

  profileCompletion: {
    percentage: 75,
    checklist: [
      { id: 'chk-1', label: 'Basic profile details & bio', completed: true },
      { id: 'chk-2', label: 'College & academic department info', completed: true },
      { id: 'chk-3', label: 'Technical skills & tools cataloged', completed: true },
      { id: 'chk-4', label: 'Collaboration interests specified', completed: true },
      { id: 'chk-5', label: 'Availability hours confirmed', completed: false },
      { id: 'chk-6', label: 'Portfolio link or resume uploaded', completed: false },
    ],
  },
};

export const RECENT_PROFILE_ACTIVITIES = [
  {
    id: 'pact-1',
    message: 'Updated MERN Stack skills',
    timeAgo: 'Today',
    type: 'skill',
    icon: 'Sparkles',
    highlight: 'MERN Stack',
  },
  {
    id: 'pact-2',
    message: 'Joined Gradient Descent study group',
    timeAgo: 'Yesterday',
    type: 'group',
    icon: 'UsersRound',
    highlight: 'Gradient Descent',
  },
  {
    id: 'pact-3',
    message: 'Shared DBMS Notes.pdf with the Community Hub',
    timeAgo: '3 days ago',
    type: 'resource',
    icon: 'FileText',
    highlight: 'DBMS Notes.pdf',
  },
  {
    id: 'pact-4',
    message: "Completed 'API documentation' task in Academic Peer Network",
    timeAgo: '5 days ago',
    type: 'project',
    icon: 'CheckCircle2',
    highlight: 'API documentation',
  },
];
