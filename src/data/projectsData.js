import { PROFILE_DATA } from './profileData';
export const CURRENT_USER_MEMBER = {
    id: 'current-user',
    name: PROFILE_DATA.name,
    initials: PROFILE_DATA.name.split(' ').map(n => n[0]).join(''),
    department: 'CSE',
    semester: 'Semester 1'
};
export const CONNECTIONS = [
    { id: 'c1', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: 'Semester 5' },
    { id: 'c2', name: 'Rahul Sharma', initials: 'RS', department: 'AIML', semester: 'Semester 3' },
    { id: 'c3', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: 'Semester 5' },
    { id: 'c4', name: 'Rhea Kulkarni', initials: 'RK', department: 'CSE', semester: 'Semester 2' },
    { id: 'c5', name: 'Sanjay M.', initials: 'SM', department: 'CSE', semester: 'Semester 1' }
];
export const INITIAL_PROJECTS = [
    {
        id: 'p1',
        title: 'Academic Peer-to-Peer Network',
        description: 'A decentralized academic peer-to-peer network for sharing resources, discussions, and study session synchronization without a central server.',
        technologies: ['TypeScript', 'WebRTC', 'React', 'Tailwind CSS'],
        status: 'In progress',
        featured: true,
        repositoryUrl: '#',
        department: 'Computer Science',
        uploader: 'Shreyas Rao',
        membersCount: 3,
        neededSkills: ['WebRTC', 'React', 'Tailwind CSS'],
        recruitmentStatus: 'Joined',
        completedTasks: 8,
        totalTasks: 10,
        deadline: 'Aug 30',
        avatarBg: 'var(--pine-tint)',
        avatarColor: 'var(--pine-dark)',
        members: [
            CURRENT_USER_MEMBER,
            { id: 'c1', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: 'Semester 5' },
            { id: 'c4', name: 'Rhea Kulkarni', initials: 'RK', department: 'CSE', semester: 'Semester 2' }
        ],
        workspaceId: 'project-1',
        tasks: [
            { id: 't1_1', text: 'Design decentralization protocols', completed: true },
            { id: 't1_2', text: 'Setup WebRTC connection layer', completed: true },
            { id: 't1_3', text: 'Implement Local Room signaling server', completed: true },
            { id: 't1_4', text: 'Construct Peer Match components', completed: true },
            { id: 't1_5', text: 'Configure Study Groups dashboard UI', completed: true },
            { id: 't1_6', text: 'Integrate Collaboration Workspace detail tabs', completed: true },
            { id: 't1_7', text: 'Implement Shared Context Sidebar panel', completed: true },
            { id: 't1_8', text: 'Refine scroll responsiveness on mobile', completed: true },
            { id: 't1_9', text: 'Build real file selection for resource uploads', completed: false },
            { id: 't1_10', text: 'Test peer synchronization latency values', completed: false }
        ],
        resources: [
            {
                id: 'r1_1',
                title: 'DBMS Notes.pdf',
                type: 'PDF',
                date: 'Uploaded Aug 12',
                bgClass: 'var(--rust-tint)',
                textClass: 'var(--rust)',
                subject: 'DBMS',
                uploader: 'Ananya Rao',
                downloadCount: 45,
                description: 'Lecture notes covering relational database schemas, SQL queries, and normalization techniques.'
            },
            {
                id: 'r1_2',
                title: 'System Design Fundamentals.pdf',
                type: 'Presentation',
                date: 'Uploaded Jul 28',
                bgClass: 'var(--marigold-tint)',
                textClass: 'var(--marigold)',
                subject: 'System Design',
                uploader: 'Sanjay M.',
                downloadCount: 50,
                description: 'Introductory slides addressing microservices architecture, horizontal scaling, and message queues.'
            }
        ],
        timeline: [
            { id: 'act1_1', time: 'Today', text: 'Shreyas Rao updated task status for Peer Match UI' },
            { id: 'act1_2', time: 'Yesterday', text: 'Ananya Rao uploaded DBMS Notes.pdf' },
            { id: 'act1_3', time: '3 days ago', text: 'Rhea Kulkarni joined the project' },
            { id: 'act1_4', time: '5 days ago', text: 'Project workspace project-1 successfully created' }
        ]
    },
    {
        id: 'p2',
        title: 'Campus Navigator App',
        description: 'An indoor wayfinding app to help first-years navigate the BMS campus block by block.',
        technologies: ['React Native', 'Firebase'],
        status: 'Live',
        repositoryUrl: '#',
        department: 'Computer Science',
        uploader: 'Shreyas Rao',
        membersCount: 2,
        neededSkills: ['React Native', 'Firebase'],
        recruitmentStatus: 'Joined',
        completedTasks: 5,
        totalTasks: 5,
        deadline: 'Completed',
        avatarBg: 'var(--marigold-tint)',
        avatarColor: 'var(--marigold)',
        members: [
            CURRENT_USER_MEMBER,
            { id: 'c5', name: 'Sanjay M.', initials: 'SM', department: 'CSE', semester: 'Semester 1' }
        ],
        tasks: [
            { id: 't2_1', text: 'Map BMS Block-A coordinates', completed: true },
            { id: 't2_2', text: 'Design indoor pathfinding vector graphics', completed: true },
            { id: 't2_3', text: 'Integrate Firebase Firestore auth', completed: true },
            { id: 't2_4', text: 'Configure route navigation algorithms', completed: true },
            { id: 't2_5', text: 'Test map load timings on iOS / Android', completed: true }
        ],
        resources: [
            {
                id: 'r2_1',
                title: 'System Design Fundamentals.pdf',
                type: 'Presentation',
                date: 'Uploaded Jul 28',
                bgClass: 'var(--marigold-tint)',
                textClass: 'var(--marigold)',
                subject: 'System Design',
                uploader: 'Sanjay M.',
                downloadCount: 50,
                description: 'Introductory slides addressing microservices architecture, horizontal scaling, and message queues.'
            }
        ],
        timeline: [
            { id: 'act2_1', time: 'Aug 10', text: 'Sanjay M. completed indoor coordinates review' },
            { id: 'act2_2', time: 'Aug 05', text: 'Shreyas Rao configured Firebase authentication layers' }
        ]
    },
    {
        id: 'p3',
        title: 'Regional Sentiment Analyzer',
        description: 'Sentiment classification model for short-form text in regional Indian languages.',
        technologies: ['Python', 'PyTorch'],
        status: 'In progress',
        repositoryUrl: '#',
        department: 'Data Science',
        uploader: 'Shreyas Rao',
        membersCount: 1,
        neededSkills: ['Python', 'PyTorch', 'NLP'],
        recruitmentStatus: 'Joined',
        completedTasks: 3,
        totalTasks: 6,
        deadline: 'Sep 10',
        avatarBg: 'var(--rust-tint)',
        avatarColor: 'var(--rust)',
        members: [CURRENT_USER_MEMBER],
        tasks: [
            { id: 't3_1', text: 'Scrape Regional Sentiment corpus datasets', completed: true },
            { id: 't3_2', text: 'Run NLP tokenization benchmarks', completed: true },
            { id: 't3_3', text: 'Configure Word2Vec vocab parameters', completed: true },
            { id: 't3_4', text: 'Assemble PyTorch LSTM neural network', completed: false },
            { id: 't3_5', text: 'Execute classifier test operations', completed: false },
            { id: 't3_6', text: 'Optimize accuracy threshold parameters', completed: false }
        ],
        resources: [
            {
                id: 'r3_1',
                title: 'Python Basics Reference.pdf',
                type: 'Cheat Sheet',
                date: 'Uploaded Aug 3',
                bgClass: 'var(--slate-tint)',
                textClass: 'var(--slate)',
                subject: 'Programming',
                uploader: 'Amit Verma',
                downloadCount: 15,
                description: 'Reference sheet detailing Python syntax, standard library modules, and file input/output operations.'
            }
        ],
        timeline: [
            { id: 'act3_1', time: 'Today', text: 'Shreyas Rao completed NLP tokenization metrics' }
        ]
    },
    {
        id: 'p4',
        title: 'Resume Skill Matcher',
        description: 'Compares a resume against a job description and highlights missing keywords.',
        technologies: ['Python', 'Flask'],
        status: 'In progress',
        repositoryUrl: '#',
        department: 'Computer Science',
        uploader: 'Shreyas Rao',
        membersCount: 1,
        neededSkills: ['Python', 'Flask', 'Machine Learning'],
        recruitmentStatus: 'Joined',
        completedTasks: 2,
        totalTasks: 8,
        deadline: 'Sep 15',
        avatarBg: 'var(--slate-tint)',
        avatarColor: 'var(--slate)',
        members: [CURRENT_USER_MEMBER],
        tasks: [
            { id: 't4_1', text: 'Design Flask routes endpoints', completed: true },
            { id: 't4_2', text: 'Implement text extraction from PDF files', completed: true },
            { id: 't4_3', text: 'Setup keyword matching dictionary logic', completed: false },
            { id: 't4_4', text: 'Build TF-IDF comparison functions', completed: false },
            { id: 't4_5', text: 'Construct dashboard result screens', completed: false },
            { id: 't4_6', text: 'Test multi-column layouts compatibility', completed: false },
            { id: 't4_7', text: 'Integrate dynamic uploader feedbacks', completed: false },
            { id: 't4_8', text: 'Refine keyword scoring parameters', completed: false }
        ],
        resources: [
            {
                id: 'r4_1',
                title: 'Software Engineering Project Report.pdf',
                type: 'Tutorial',
                date: 'Uploaded Aug 1',
                bgClass: 'var(--pine-tint)',
                textClass: 'var(--pine-dark)',
                subject: 'Software Engineering',
                uploader: 'Kunal Shah',
                downloadCount: 10,
                description: 'Example project report outlining requirements gathering, UML designs, and testing methodologies.'
            }
        ],
        timeline: [
            { id: 'act4_1', time: 'Yesterday', text: 'Shreyas Rao added text extraction capabilities' }
        ]
    },
    {
        id: 'p5',
        title: 'Autonomous Robotics Navigation',
        description: 'Pathfinding algorithms for mobile robots navigating dynamic indoor laboratory environments using LIDAR sensors.',
        technologies: ['ROS', 'Python', 'C++'],
        status: 'In progress',
        featured: true,
        repositoryUrl: '#',
        department: 'Electrical Engineering',
        uploader: 'Ananya Rao',
        membersCount: 2,
        neededSkills: ['ROS', 'C++', 'LIDAR'],
        recruitmentStatus: 'Open',
        completedTasks: 4,
        totalTasks: 12,
        deadline: 'Sep 25',
        avatarBg: 'var(--pine-tint)',
        avatarColor: 'var(--pine-dark)',
        members: [
            { id: 'c1', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: 'Semester 1' },
            { id: 'c2', name: 'Rahul Sharma', initials: 'RS', department: 'AIML', semester: 'Semester 1' }
        ],
        tasks: [
            { id: 't5_1', text: 'Configure Arduino LiDAR bindings', completed: true },
            { id: 't5_2', text: 'Define ROS node parameters', completed: true },
            { id: 't5_3', text: 'Calculate pathfinding vector math', completed: true },
            { id: 't5_4', text: 'Setup odometry sensor drivers', completed: true },
            { id: 't5_5', text: 'Build gmapping occupancy maps', completed: false },
            { id: 't5_6', text: 'Calibrate speed thresholds', completed: false },
            { id: 't5_7', text: 'Implement obstacle avoidance nodes', completed: false },
            { id: 't5_8', text: 'Configure camera localization feeds', completed: false },
            { id: 't5_9', text: 'Test map drift error ratios', completed: false },
            { id: 't5_10', text: 'Deploy to hardware test rig', completed: false },
            { id: 't5_11', text: 'Fine-tune motor controllers', completed: false },
            { id: 't5_12', text: 'Document ROS setup details', completed: false }
        ],
        resources: [
            {
                id: 'r5_1',
                title: 'Operating Systems Cheatsheet.pdf',
                type: 'PDF',
                date: 'Uploaded Aug 11',
                bgClass: 'var(--rust-tint)',
                textClass: 'var(--rust)',
                subject: 'Operating Systems',
                uploader: 'Rahul Sharma',
                downloadCount: 38,
                description: 'Cheat sheet summarizing CPU scheduling, deadlocks, and memory management algorithms.'
            }
        ],
        timeline: [
            { id: 'act5_1', time: '3 days ago', text: 'Rahul Sharma configured odometry drivers' },
            { id: 'act5_2', time: '5 days ago', text: 'Ananya Rao completed LiDAR hardware test' }
        ]
    },
    {
        id: 'p6',
        title: 'AI for Mental Health Chatbot',
        description: 'A supportive, empathetic conversational chatbot designed to offer resources and mindfulness exercises to students.',
        technologies: ['NLP', 'React', 'FastAPI'],
        status: 'In progress',
        repositoryUrl: '#',
        department: 'Information Technology',
        uploader: 'Rahul Sharma',
        membersCount: 3,
        neededSkills: ['NLP', 'React', 'FastAPI'],
        recruitmentStatus: 'Open',
        completedTasks: 1,
        totalTasks: 8,
        deadline: 'Oct 05',
        avatarBg: 'var(--marigold-tint)',
        avatarColor: 'var(--marigold)',
        members: [
            { id: 'c2', name: 'Rahul Sharma', initials: 'RS', department: 'AIML', semester: 'Semester 1' },
            { id: 'c3', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: 'Semester 2' },
            { id: 'c5', name: 'Sanjay M.', initials: 'SM', department: 'CSE', semester: 'Semester 1' }
        ],
        tasks: [
            { id: 't6_1', text: 'Define conversational dialogue maps', completed: true },
            { id: 't6_2', text: 'Implement nltk tokenizers', completed: false },
            { id: 't6_3', text: 'Design FastAPI router routes', completed: false },
            { id: 't6_4', text: 'Setup Tailwind landing dashboard UI', completed: false },
            { id: 't6_5', text: 'Integrate chatbot chat panel feed', completed: false },
            { id: 't6_6', text: 'Write response intent categories list', completed: false },
            { id: 't6_7', text: 'Configure custom toast dialogs', completed: false },
            { id: 't6_8', text: 'Verify security limits validation', completed: false }
        ],
        resources: [
            {
                id: 'r6_1',
                title: 'Deep Learning Research Paper.pdf',
                type: 'Research Paper',
                date: 'Uploaded Jul 22',
                bgClass: 'var(--pine-tint)',
                textClass: 'var(--pine-dark)',
                subject: 'Machine Learning',
                uploader: 'Ananya Rao',
                downloadCount: 42,
                description: 'Research paper investigating neural network optimizations for real-time video processing.'
            }
        ],
        timeline: [
            { id: 'act6_1', time: 'Last week', text: 'Rahul Sharma mapped chat intents' }
        ]
    },
    {
        id: 'p7',
        title: 'Smart Campus Energy Grid',
        description: 'Real-time power monitoring and grid load balancing solution utilizing campus solar outputs.',
        technologies: ['Arduino', 'IoT', 'Data Visualization'],
        status: 'In progress',
        repositoryUrl: '#',
        department: 'Electrical Engineering',
        uploader: 'Priya Nair',
        membersCount: 1,
        neededSkills: ['Arduino', 'IoT', 'Data Visualization'],
        recruitmentStatus: 'Open',
        completedTasks: 2,
        totalTasks: 5,
        deadline: 'Oct 15',
        avatarBg: 'var(--rust-tint)',
        avatarColor: 'var(--rust)',
        members: [
            { id: 'c3', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: 'Semester 2' }
        ],
        tasks: [
            { id: 't7_1', text: 'Setup Arduino voltage sensors', completed: true },
            { id: 't7_2', text: 'Connect ESP8266 Wi-Fi transceivers', completed: true },
            { id: 't7_3', text: 'Establish HTTP data endpoints', completed: false },
            { id: 't7_4', text: 'Construct dashboard canvas chart', completed: false },
            { id: 't7_5', text: 'Deploy power balancing relay controls', completed: false }
        ],
        resources: [
            {
                id: 'r7_1',
                title: 'System Design Fundamentals.pdf',
                type: 'Presentation',
                date: 'Uploaded Jul 28',
                bgClass: 'var(--marigold-tint)',
                textClass: 'var(--marigold)',
                subject: 'System Design',
                uploader: 'Sanjay M.',
                downloadCount: 50,
                description: 'Introductory slides addressing microservices architecture, horizontal scaling, and message queues.'
            }
        ],
        timeline: [
            { id: 'act7_1', time: '2 weeks ago', text: 'Priya Nair connected ESP8266 nodes' }
        ]
    }
];
