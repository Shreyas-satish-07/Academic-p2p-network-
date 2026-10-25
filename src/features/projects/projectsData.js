/**
 * Mock data for the Projects Collaboration Hub in Cohort.
 * 
 * Future MongoDB Models Architecture:
 * 
 * 1. Project Schema:
 *    - title: String (required, trim, indexed)
 *    - description: String (required)
 *    - category: String (enum: ['Web Development', 'AI/ML', 'Mobile App', 'Research', 'IoT', 'Robotics', 'Other'])
 *    - technologies: [String]
 *    - owner: { type: ObjectId, ref: 'User', required: true }
 *    - ownerInitials: String
 *    - members: [{
 *        user: { type: ObjectId, ref: 'User' },
 *        name: String,
 *        initials: String,
 *        role: String,
 *        joinedAt: Date
 *      }]
 *    - maxMembers: Number (default: 5)
 *    - requiredSkills: [String]
 *    - status: String (enum: ['planning', 'active', 'completed'], default: 'planning')
 *    - recruitmentStatus: String (enum: ['open', 'joined', 'request-sent', 'closed'], default: 'open')
 *    - progress: Number (min: 0, max: 100, default: 0)
 *    - deadline: Date
 *    - createdAt: Date (default: Date.now)
 *    - tags: [String]
 * 
 * 2. Task Schema (embedded or referenced):
 *    - project: { type: ObjectId, ref: 'Project', required: true }
 *    - title: String (required)
 *    - assigneeInitials: String
 *    - priority: String (enum: ['low', 'medium', 'high'], default: 'medium')
 *    - dueDate: Date
 *    - status: String (enum: ['todo', 'in-progress', 'completed'], default: 'todo')
 * 
 * 3. ProjectActivity Schema:
 *    - project: { type: ObjectId, ref: 'Project' }
 *    - user: String
 *    - action: String
 *    - time: String / Date
 * 
 * Future Express Endpoints:
 * GET    /api/projects                  - List projects with search, filter, and sort query params
 * GET    /api/projects/:id              - Get project details including tasks and team
 * POST   /api/projects                  - Create a new project (authenticated user becomes owner)
 * PATCH  /api/projects/:id              - Update project details
 * POST   /api/projects/:id/join         - Submit a request to join a project
 * PATCH  /api/projects/:id/tasks/:taskId - Update status or assignment of a project task
 * GET    /api/projects/:id/activity     - Fetch recent activity timeline
 */

export const INITIAL_PROJECTS = [
  {
    id: 'proj-academic-p2p',
    title: 'Academic Peer-to-Peer Network',
    description:
      'A decentralized academic collaboration platform enabling students to discover peers, form agile study groups, share verified course notes, and coordinate multi-disciplinary student projects.',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.IO'],
    owner: 'Shreyas Rao',
    ownerInitials: 'SR',
    members: [
      { id: 'm-1', name: 'Shreyas Rao', initials: 'SR', role: 'Project Lead / Full-Stack', avatarBg: 'var(--pine)' },
      { id: 'm-2', name: 'Ananya Rao', initials: 'AR', role: 'Frontend Engineer', avatarBg: '#2D6A4F' },
      { id: 'm-3', name: 'Rahul Sharma', initials: 'RS', role: 'Backend & Socket.IO', avatarBg: '#1B4332' },
      { id: 'm-4', name: 'Priya Nair', initials: 'PN', role: 'UI/UX & Product Design', avatarBg: '#40916C' },
    ],
    maxMembers: 5,
    requiredSkills: ['React', 'Node.js', 'MongoDB'],
    status: 'active',
    recruitmentStatus: 'open',
    progress: 80,
    deadline: 'Aug 30, 2026',
    createdAt: '2026-06-15T10:00:00.000Z',
    tasks: [
      {
        id: 'task-101',
        title: 'Design dashboard wireframes & theme tokens',
        assigneeInitials: 'PN',
        priority: 'high',
        dueDate: 'Jul 10',
        status: 'completed',
      },
      {
        id: 'task-102',
        title: 'Build authentication API with JWT & refresh tokens',
        assigneeInitials: 'RS',
        priority: 'high',
        dueDate: 'Jul 22',
        status: 'completed',
      },
      {
        id: 'task-103',
        title: 'Create peer matching algorithm & compatibility scoring',
        assigneeInitials: 'SR',
        priority: 'high',
        dueDate: 'Aug 14',
        status: 'in-progress',
      },
      {
        id: 'task-104',
        title: 'Integrate Socket.IO chat & presence channels',
        assigneeInitials: 'RS',
        priority: 'medium',
        dueDate: 'Aug 24',
        status: 'todo',
      },
      {
        id: 'task-105',
        title: 'Deploy application on cloud staging & configure CI/CD',
        assigneeInitials: 'AR',
        priority: 'medium',
        dueDate: 'Aug 30',
        status: 'todo',
      },
    ],
    activity: [
      { id: 'act-1', user: 'Shreyas Rao', action: 'Created project milestone for Peer Matching v1.2', time: '2 hours ago' },
      { id: 'act-2', user: 'Rahul Sharma', action: 'Completed task "Build authentication API"', time: '1 day ago' },
      { id: 'act-3', user: 'Ananya Rao', action: 'Pushed responsive navbar and sidebar updates', time: '3 days ago' },
      { id: 'act-4', user: 'Priya Nair', action: 'Uploaded high-fidelity Figma components', time: '5 days ago' },
    ],
    tags: ['FullStack', 'MERN', 'Decentralized', 'RealTime', 'Education'],
  },
  {
    id: 'proj-campus-nav',
    title: 'Campus Navigator App',
    description:
      'Interactive cross-platform mobile mapping system for college campuses. Features indoor floor plans, step-by-step navigation between lecture halls, and live campus event markers.',
    category: 'Mobile App',
    technologies: ['React Native', 'Firebase', 'Maps API'],
    owner: 'Vikram Mehta',
    ownerInitials: 'VM',
    members: [
      { id: 'm-201', name: 'Vikram Mehta', initials: 'VM', role: 'Mobile Lead', avatarBg: '#1E3D59' },
      { id: 'm-202', name: 'Tanvi Shah', initials: 'TS', role: 'GIS & Maps Engineer', avatarBg: '#17B978' },
      { id: 'm-203', name: 'Aarav Patel', initials: 'AP', role: 'Firebase & Cloud Functions', avatarBg: '#F38181' },
      { id: 'm-204', name: 'Kavya Deshmukh', initials: 'KD', role: 'Mobile UI Designer', avatarBg: '#4B77BE' },
    ],
    maxMembers: 4,
    requiredSkills: ['React Native', 'Firebase', 'Maps API'],
    status: 'completed',
    recruitmentStatus: 'closed',
    progress: 100,
    deadline: 'Jun 20, 2026',
    createdAt: '2026-03-01T08:30:00.000Z',
    tasks: [
      {
        id: 'task-201',
        title: 'Campus boundary polygons and vector coordinate mapping',
        assigneeInitials: 'TS',
        priority: 'high',
        dueDate: 'Apr 10',
        status: 'completed',
      },
      {
        id: 'task-202',
        title: 'Real-time GPS routing with Dijkstra indoor pathfinding',
        assigneeInitials: 'VM',
        priority: 'high',
        dueDate: 'May 05',
        status: 'completed',
      },
      {
        id: 'task-203',
        title: 'App Store and Google Play testing release builds',
        assigneeInitials: 'AP',
        priority: 'medium',
        dueDate: 'Jun 20',
        status: 'completed',
      },
    ],
    activity: [
      { id: 'act-201', user: 'Vikram Mehta', action: 'Tagged release v1.0.0 and closed recruitment', time: '3 weeks ago' },
      { id: 'act-202', user: 'Tanvi Shah', action: 'Finished 3D building render overlays', time: '1 month ago' },
    ],
    tags: ['Mobile', 'Navigation', 'CampusLife', 'React Native'],
  },
  {
    id: 'proj-regional-sentiment',
    title: 'Regional Sentiment Analyzer',
    description:
      'Natural Language Processing pipeline that aggregates multi-lingual community feedback, regional dialect forums, and student surveys to uncover public sentiment trends with fine-grained emotion classification.',
    category: 'AI/ML',
    technologies: ['Python', 'TensorFlow', 'NLP'],
    owner: 'Aditi Kulkarni',
    ownerInitials: 'AK',
    members: [
      { id: 'm-301', name: 'Aditi Kulkarni', initials: 'AK', role: 'NLP Research Lead', avatarBg: '#5A189A' },
      { id: 'm-302', name: 'Rohan Joshi', initials: 'RJ', role: 'Data Pipeline Engineer', avatarBg: '#3C096C' },
    ],
    maxMembers: 4,
    requiredSkills: ['Python', 'Machine Learning'],
    status: 'active',
    recruitmentStatus: 'open',
    progress: 55,
    deadline: 'Sep 15, 2026',
    createdAt: '2026-05-10T12:00:00.000Z',
    tasks: [
      {
        id: 'task-301',
        title: 'Scrape and clean regional language news & forum dataset',
        assigneeInitials: 'RJ',
        priority: 'high',
        dueDate: 'Jun 30',
        status: 'completed',
      },
      {
        id: 'task-302',
        title: 'Fine-tune BERT multilingual transformer embeddings',
        assigneeInitials: 'AK',
        priority: 'high',
        dueDate: 'Aug 10',
        status: 'in-progress',
      },
      {
        id: 'task-303',
        title: 'Build REST inference service with FastAPI & Docker',
        assigneeInitials: 'AK',
        priority: 'medium',
        dueDate: 'Sep 05',
        status: 'todo',
      },
      {
        id: 'task-304',
        title: 'Construct interactive Streamlit dashboard for visualization',
        assigneeInitials: 'RJ',
        priority: 'low',
        dueDate: 'Sep 15',
        status: 'todo',
      },
    ],
    activity: [
      { id: 'act-301', user: 'Aditi Kulkarni', action: 'Benchmarked transformer model accuracy to 88.4%', time: '4 hours ago' },
      { id: 'act-302', user: 'Rohan Joshi', action: 'Tokenized 50,000 Indic speech-to-text transcripts', time: '2 days ago' },
    ],
    tags: ['AI/ML', 'NLP', 'TensorFlow', 'DataScience', 'Python'],
  },
  {
    id: 'proj-smart-attendance',
    title: 'Smart Attendance System',
    description:
      'Edge IoT facial-recognition attendance device with Arduino controller and camera module. Automatically recognizes enrolled students entering lecture halls and syncs timestamps to university records.',
    category: 'IoT',
    technologies: ['Python', 'OpenCV', 'Arduino'],
    owner: 'Nikhil Verma',
    ownerInitials: 'NV',
    members: [
      { id: 'm-401', name: 'Nikhil Verma', initials: 'NV', role: 'Hardware & Embedded', avatarBg: '#D97706' },
      { id: 'm-402', name: 'Siddharth Roy', initials: 'SR', role: 'Computer Vision Dev', avatarBg: '#B45309' },
    ],
    maxMembers: 4,
    requiredSkills: ['Python', 'OpenCV', 'Arduino'],
    status: 'active',
    recruitmentStatus: 'open',
    progress: 35,
    deadline: 'Oct 01, 2026',
    createdAt: '2026-06-01T15:20:00.000Z',
    tasks: [
      {
        id: 'task-401',
        title: 'Circuit breadboard prototype with ESP32-CAM and servo latch',
        assigneeInitials: 'NV',
        priority: 'high',
        dueDate: 'Jul 15',
        status: 'completed',
      },
      {
        id: 'task-402',
        title: 'Haar-cascade and FaceNet facial feature vector alignment',
        assigneeInitials: 'SR',
        priority: 'high',
        dueDate: 'Aug 25',
        status: 'in-progress',
      },
      {
        id: 'task-403',
        title: 'Attendance logging database API and RFID fallback',
        assigneeInitials: 'NV',
        priority: 'medium',
        dueDate: 'Sep 18',
        status: 'todo',
      },
    ],
    activity: [
      { id: 'act-401', user: 'Nikhil Verma', action: 'Assembled 3D-printed enclosure for camera mount', time: '5 hours ago' },
      { id: 'act-402', user: 'Siddharth Roy', action: 'Trained model on 200 student portrait samples', time: '4 days ago' },
    ],
    tags: ['IoT', 'OpenCV', 'Embedded', 'Hardware', 'Python'],
  },
  {
    id: 'proj-credential-ledger',
    title: 'Decentralized Academic Credential Ledger',
    description:
      'Tamper-proof smart contract platform on Ethereum L2 for issuing, verifying, and sharing university degree certificates, transcripts, and extracurricular badges without central authority reliance.',
    category: 'Research',
    technologies: ['Solidity', 'React', 'Ethers.js', 'IPFS'],
    owner: 'Farhan Ali',
    ownerInitials: 'FA',
    members: [
      { id: 'm-501', name: 'Farhan Ali', initials: 'FA', role: 'Smart Contract Dev', avatarBg: '#2563EB' },
    ],
    maxMembers: 3,
    requiredSkills: ['Solidity', 'React', 'Ethers.js'],
    status: 'planning',
    recruitmentStatus: 'open',
    progress: 20,
    deadline: 'Nov 15, 2026',
    createdAt: '2026-06-18T09:15:00.000Z',
    tasks: [
      {
        id: 'task-501',
        title: 'Draft ERC-721 Soulbound Token specification for non-transferable diplomas',
        assigneeInitials: 'FA',
        priority: 'high',
        dueDate: 'Jul 30',
        status: 'completed',
      },
      {
        id: 'task-502',
        title: 'Write unit tests on Hardhat for credential revocation and gas optimization',
        assigneeInitials: 'FA',
        priority: 'medium',
        dueDate: 'Aug 28',
        status: 'todo',
      },
      {
        id: 'task-503',
        title: 'Build verification portal with QR code scanner in React',
        assigneeInitials: 'FA',
        priority: 'medium',
        dueDate: 'Oct 10',
        status: 'todo',
      },
    ],
    activity: [
      { id: 'act-501', user: 'Farhan Ali', action: 'Published research draft on Soulbound credentials', time: '1 day ago' },
    ],
    tags: ['Blockchain', 'Web3', 'Solidity', 'SmartContracts', 'Research'],
  },
  {
    id: 'proj-code-reviewer-ai',
    title: 'Automated Code Review Bot',
    description:
      'Autonomous PR analysis bot powered by LLMs that catches syntax anomalies, security vulnerabilities, edge-case regressions, and stylistic discrepancies with explanatory PR comments.',
    category: 'AI/ML',
    technologies: ['Python', 'FastAPI', 'OpenAI API', 'GitHub Actions'],
    owner: 'Neha Swaminathan',
    ownerInitials: 'NS',
    members: [
      { id: 'm-601', name: 'Neha Swaminathan', initials: 'NS', role: 'AI Applications Lead', avatarBg: '#059669' },
      { id: 'm-602', name: 'Dev Sharma', initials: 'DS', role: 'DevOps & GitHub Apps', avatarBg: '#047857' },
      { id: 'm-603', name: 'Ananya Rao', initials: 'AR', role: 'Frontend Integrations', avatarBg: '#2D6A4F' },
    ],
    maxMembers: 4,
    requiredSkills: ['Python', 'Machine Learning', 'FastAPI'],
    status: 'active',
    recruitmentStatus: 'open',
    progress: 65,
    deadline: 'Aug 18, 2026',
    createdAt: '2026-05-02T14:00:00.000Z',
    tasks: [
      {
        id: 'task-601',
        title: 'GitHub App webhook listener and token permission flow',
        assigneeInitials: 'DS',
        priority: 'high',
        dueDate: 'Jun 10',
        status: 'completed',
      },
      {
        id: 'task-602',
        title: 'AST differential parser for Python, JS, and Go files',
        assigneeInitials: 'NS',
        priority: 'high',
        dueDate: 'Jul 05',
        status: 'completed',
      },
      {
        id: 'task-603',
        title: 'Semantic embeddings retrieval for codebase context injection',
        assigneeInitials: 'NS',
        priority: 'high',
        dueDate: 'Aug 02',
        status: 'in-progress',
      },
      {
        id: 'task-604',
        title: 'Configure automated test suite with synthetic buggy pull requests',
        assigneeInitials: 'DS',
        priority: 'medium',
        dueDate: 'Aug 18',
        status: 'todo',
      },
    ],
    activity: [
      { id: 'act-601', user: 'Neha Swaminathan', action: 'Tested prompt template against 50 OSS vulnerabilities', time: '6 hours ago' },
      { id: 'act-602', user: 'Dev Sharma', action: 'Configured webhook ingress on AWS Lambda', time: '2 days ago' },
    ],
    tags: ['AI/ML', 'DevOps', 'Python', 'LLM', 'GitHub'],
  },
  {
    id: 'proj-wellness-companion',
    title: 'Mental Health & Wellness Companion',
    description:
      'A private, student-centric wellness app providing cognitive reframing prompts, mood tracking analytics, breathing exercises, and anonymous peer support forums for exam stress management.',
    category: 'Mobile App',
    technologies: ['Flutter', 'Dart', 'Firebase'],
    owner: 'Pooja Hegde',
    ownerInitials: 'PH',
    members: [
      { id: 'm-701', name: 'Pooja Hegde', initials: 'PH', role: 'Mobile Developer', avatarBg: '#DB2777' },
      { id: 'm-702', name: 'Shreyas Rao', initials: 'SR', role: 'Backend & Data Security', avatarBg: 'var(--pine)' },
      { id: 'm-703', name: 'Sanya Mirza', initials: 'SM', role: 'Psychology Consultant', avatarBg: '#9D174D' },
    ],
    maxMembers: 3,
    requiredSkills: ['Flutter', 'Dart', 'Firebase'],
    status: 'active',
    recruitmentStatus: 'joined',
    progress: 75,
    deadline: 'Aug 22, 2026',
    createdAt: '2026-04-12T11:00:00.000Z',
    tasks: [
      {
        id: 'task-701',
        title: 'Biometric lock and encrypted SQLite local journal storage',
        assigneeInitials: 'SR',
        priority: 'high',
        dueDate: 'May 20',
        status: 'completed',
      },
      {
        id: 'task-702',
        title: 'Lottie animations for guided 4-7-8 deep breathing sessions',
        assigneeInitials: 'PH',
        priority: 'medium',
        dueDate: 'Jun 15',
        status: 'completed',
      },
      {
        id: 'task-703',
        title: 'Weekly mood calendar and correlating sleep cycle analytics',
        assigneeInitials: 'PH',
        priority: 'medium',
        dueDate: 'Jul 28',
        status: 'completed',
      },
      {
        id: 'task-704',
        title: 'Peer check-in nudge notification engine',
        assigneeInitials: 'SR',
        priority: 'low',
        dueDate: 'Aug 22',
        status: 'in-progress',
      },
    ],
    activity: [
      { id: 'act-701', user: 'Pooja Hegde', action: 'Integrated smooth Lottie animation for meditation module', time: '1 day ago' },
      { id: 'act-702', user: 'Shreyas Rao', action: 'Verified zero-knowledge encryption on student journals', time: '3 days ago' },
    ],
    tags: ['Mobile', 'Flutter', 'Healthcare', 'Wellness', 'Firebase'],
  },
  {
    id: 'proj-solar-tracker',
    title: 'Autonomous Solar Tracker Microgrid',
    description:
      'Dual-axis solar panel tracking rig with LDR photoresistors, stepper motors, and micro-inverter power metrics. Maximizes energy absorption efficiency by dynamically angling towards sunlight.',
    category: 'IoT',
    technologies: ['C++', 'ESP32', 'MQTT', 'Node-RED'],
    owner: 'Arjun Das',
    ownerInitials: 'AD',
    members: [
      { id: 'm-801', name: 'Arjun Das', initials: 'AD', role: 'Embedded Systems', avatarBg: '#D97706' },
      { id: 'm-802', name: 'Meera Nambiar', initials: 'MN', role: 'Power Electronics', avatarBg: '#78350F' },
    ],
    maxMembers: 4,
    requiredSkills: ['C++', 'Arduino', 'IoT'],
    status: 'planning',
    recruitmentStatus: 'open',
    progress: 40,
    deadline: 'Oct 30, 2026',
    createdAt: '2026-06-05T16:00:00.000Z',
    tasks: [
      {
        id: 'task-801',
        title: 'Light sensor comparator circuit calibration and breadboard testing',
        assigneeInitials: 'AD',
        priority: 'high',
        dueDate: 'Jul 10',
        status: 'completed',
      },
      {
        id: 'task-802',
        title: 'PID motor drive code for smooth celestial angle tracking',
        assigneeInitials: 'AD',
        priority: 'high',
        dueDate: 'Aug 15',
        status: 'completed',
      },
      {
        id: 'task-803',
        title: 'MQTT telemetry publisher and Grafana power consumption board',
        assigneeInitials: 'MN',
        priority: 'medium',
        dueDate: 'Sep 20',
        status: 'todo',
      },
      {
        id: 'task-804',
        title: 'Weatherproof chassis design with 3D printed servo mountings',
        assigneeInitials: 'AD',
        priority: 'medium',
        dueDate: 'Oct 30',
        status: 'todo',
      },
    ],
    activity: [
      { id: 'act-801', user: 'Arjun Das', action: 'Calibrated photoresistor sensitivity matrix', time: '2 days ago' },
      { id: 'act-802', user: 'Meera Nambiar', action: 'Ordered dual 12V stepper motors and aluminum extrusions', time: '1 week ago' },
    ],
    tags: ['IoT', 'CleanEnergy', 'Hardware', 'Embedded', 'Sensors'],
  },
];

export const CATEGORY_OPTIONS = [
  'All Categories',
  'Web Development',
  'AI/ML',
  'Mobile App',
  'IoT',
  'Research',
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export const RECRUITMENT_OPTIONS = [
  { value: 'all', label: 'All Recruitment' },
  { value: 'open', label: 'Open to Join' },
  { value: 'joined', label: 'Joined' },
  { value: 'request-sent', label: 'Request Sent' },
];

export const SKILL_OPTIONS = [
  'All Skills',
  'React',
  'Node.js',
  'MongoDB',
  'Python',
  'Machine Learning',
  'React Native',
  'Firebase',
  'OpenCV',
  'Flutter',
  'Solidity',
  'Arduino',
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'progress', label: 'Most Progress' },
  { value: 'openings', label: 'Open Positions' },
];
