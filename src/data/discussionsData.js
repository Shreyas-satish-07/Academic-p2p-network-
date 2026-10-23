import { PROFILE_DATA } from './profileData';
export const CURRENT_USER_MEMBER = {
    id: 'current-user',
    name: PROFILE_DATA.name,
    initials: PROFILE_DATA.name.split(' ').map(n => n[0]).join(''),
    department: 'CSE',
    semester: 'Semester 1',
    avatarBg: 'var(--pine-tint)',
    avatarColor: 'var(--pine-dark)'
};
export const DISCUSSIONS_PEERS = [
    { id: 'c1', name: 'Ananya Rao', initials: 'AR', department: 'CSE', semester: 'Semester 1', avatarBg: 'var(--pine-tint)', avatarColor: 'var(--pine-dark)' },
    { id: 'c2', name: 'Rahul Sharma', initials: 'RS', department: 'AIML', semester: 'Semester 1', avatarBg: 'var(--marigold-tint)', avatarColor: 'var(--marigold)' },
    { id: 'c3', name: 'Priya Nair', initials: 'PN', department: 'CSE', semester: 'Semester 2', avatarBg: 'var(--slate-tint)', avatarColor: 'var(--slate)' },
    { id: 'c4', name: 'Rhea Kulkarni', initials: 'RK', department: 'CSE', semester: 'Semester 2', avatarBg: 'var(--rust-tint)', avatarColor: 'var(--rust)' },
    { id: 'c5', name: 'Sanjay M.', initials: 'SM', department: 'CSE', semester: 'Semester 1', avatarBg: 'var(--marigold-tint)', avatarColor: 'var(--marigold)' },
    { id: 'c6', name: 'Amit Verma', initials: 'AV', department: 'ISE', semester: 'Semester 2', avatarBg: 'var(--slate-tint)', avatarColor: 'var(--slate)' },
    { id: 'c7', name: 'Kunal Shah', initials: 'KS', department: 'CSE', semester: 'Semester 1', avatarBg: 'var(--rust-tint)', avatarColor: 'var(--rust)' }
];
export const INITIAL_DISCUSSIONS = [
    {
        id: 'd1',
        title: 'How does normalization reduce redundancy in DBMS?',
        description: 'I am reading about DBMS normalization forms (1NF, 2NF, 3NF, BCNF) but I am having trouble understanding how splitting tables mathematically reduces storage redundancy and prevents insertion anomalies. Can someone explain with a concrete example?',
        type: 'Question',
        subject: 'DBMS',
        author: DISCUSSIONS_PEERS[0], // Ananya Rao
        tags: ['DBMS', 'SQL', 'Normalization'],
        createdAt: '2h ago',
        replies: 2,
        views: 34,
        trending: true,
        acceptedAnswerId: 'ans_1_1',
        studyGroupId: 'sg-db',
        votes: 58,
        commentsCount: 2,
        category: 'Academics',
        answers: [
            {
                id: 'ans_1_1',
                author: DISCUSSIONS_PEERS[1], // Rahul Sharma
                content: 'Normalization reduces redundancy by dividing large tables into smaller tables and defining relationships between them. For example, if you store StudentName and DepartmentHod in the same table, you duplicate the HOD name for every student in that department. By splitting into a Students table and a Departments table, the HOD name is stored exactly once, eliminating storage redundancy and preventing insertion anomalies.',
                createdAt: '1h ago',
                likes: 12,
                accepted: true
            },
            {
                id: 'ans_1_2',
                author: DISCUSSIONS_PEERS[2], // Priya Nair
                content: 'To add to Rahul\'s point, insertion anomalies occur when you cannot insert a department without having at least one student enrolled. Normalizing to 3NF resolves this cleanly by decoupling student facts from department facts.',
                createdAt: '30m ago',
                likes: 4,
                accepted: false
            }
        ]
    },
    {
        id: 'd2',
        title: 'What is the best approach for implementing Dijkstra efficiently?',
        description: 'I am writing a Dijkstra pathfinding algorithm in C++ for my robotics project. Should I use a standard std::priority_queue with a pair, or is it worth implementing a Fibonacci Heap to optimize the time complexity? What is the practical performance difference?',
        type: 'Question',
        subject: 'DSA',
        author: DISCUSSIONS_PEERS[1], // Rahul Sharma
        tags: ['DSA', 'Dijkstra', 'Algorithms'],
        createdAt: '4h ago',
        replies: 1,
        views: 28,
        trending: true,
        studyGroupId: 'sg-dsa',
        votes: 47,
        commentsCount: 1,
        category: 'Academics',
        answers: [
            {
                id: 'ans_2_1',
                author: DISCUSSIONS_PEERS[0], // Ananya Rao
                content: 'In practice, std::priority_queue (which is a binary heap) is almost always faster than a Fibonacci Heap for graph sizes you encounter on campus. Fibonacci heaps have very high constant factors. For Dijkstra, using a binary heap yields O((V+E) log V) which runs in milliseconds. Fibonacci heap\'s theoretical O(E + V log V) only beats it on extremely dense, gigantic graphs.',
                createdAt: '3h ago',
                likes: 8,
                accepted: false
            }
        ]
    },
    {
        id: 'd3',
        title: 'Difference between process and thread in operating systems?',
        description: 'I understand that a process is a program in execution and a thread is a segment of a process. But what exactly do they share in memory? Does a thread share the stack or register state of its parent process?',
        type: 'Question',
        subject: 'Operating Systems',
        author: DISCUSSIONS_PEERS[2], // Priya Nair
        tags: ['Operating Systems', 'Processes', 'Threads'],
        createdAt: '1d ago',
        replies: 1,
        views: 45,
        votes: 33,
        commentsCount: 1,
        category: 'Academics',
        answers: [
            {
                id: 'ans_3_1',
                author: DISCUSSIONS_PEERS[4], // Sanjay M.
                content: 'Threads share the code section, data section, and OS resources (like open files) of the parent process. However, each thread has its own stack and registers to manage its execution context. They share the heap memory, which is why thread synchronization is crucial when writing concurrent programs.',
                createdAt: '18h ago',
                likes: 6,
                accepted: true
            }
        ]
    },
    {
        id: 'd4',
        title: 'How should React state be structured for a large project?',
        description: 'As our project grows, we are encountering props drilling. Should we use Redux Toolkit, Context API, or just push states to URL params? What are the standard state structures recommended for academic project panels?',
        type: 'Question',
        subject: 'Web Development',
        author: CURRENT_USER_MEMBER, // Shreyas Rao
        tags: ['React', 'JavaScript', 'State Management'],
        createdAt: '2d ago',
        replies: 0,
        views: 19,
        votes: 21,
        commentsCount: 0,
        answers: []
    },
    {
        id: 'd5',
        title: 'Recent approaches to sentiment analysis',
        description: 'I am compiling a literature survey on regional language sentiment analysis. Traditional models struggle with code-mixed text (like Kannada written in Latin script). Are there any pre-trained multilingual transformers (like mBERT or XLM-R) that yield good accuracy out of the box?',
        type: 'Research',
        subject: 'Machine Learning',
        author: DISCUSSIONS_PEERS[5], // Amit Verma
        tags: ['Research', 'NLP', 'Sentiment Analysis'],
        createdAt: '12h ago',
        replies: 1,
        views: 52,
        votes: 41,
        commentsCount: 1,
        category: 'Research',
        answers: [
            {
                id: 'ans_5_1',
                author: CURRENT_USER_MEMBER, // Shreyas Rao
                content: 'In my regional sentiment project, I found that fine-tuning XLM-RoBERTa on a small dataset of code-mixed comments outperforms standard multilingual BERT. It handles spelling variations and vocabulary shifts much better due to its byte-level subword tokenization.',
                createdAt: '8h ago',
                likes: 10,
                accepted: false
            }
        ]
    },
    {
        id: 'd6',
        title: 'Ideas for improving campus navigation systems',
        description: 'We are looking into deploying bluetooth beacons inside classrooms for hyper-local indoor positioning. Does anyone have experience measuring RSSI fluctuations inside university labs with high wireless interference?',
        type: 'Research',
        subject: 'Projects',
        author: DISCUSSIONS_PEERS[4], // Sanjay M.
        tags: ['Research', 'Mobile App', 'Campus'],
        createdAt: '3d ago',
        replies: 0,
        views: 64,
        projectId: 'p2',
        votes: 33,
        commentsCount: 0,
        category: 'Projects',
        answers: []
    },
    {
        id: 'd7',
        title: 'Is graph neural networking useful for recommendation systems?',
        description: 'Analyzing user-item interactions as a bipartite graph sounds promising. Does anyone have benchmarks showing GCNs vs matrix factorization for recommendations on small academic datasets?',
        type: 'Research',
        subject: 'Machine Learning',
        author: DISCUSSIONS_PEERS[6], // Kunal Shah
        tags: ['Research', 'GNN', 'Recommendation'],
        createdAt: '4d ago',
        replies: 0,
        views: 22,
        votes: 18,
        commentsCount: 0,
        category: 'Research',
        answers: []
    },
    {
        id: 'd8',
        title: 'Need suggestions for our campus navigation project',
        description: 'We are mapping the coordinate vectors for BMS campus block-by-block. We need suggestions on how to display paths overlaying multi-floor buildings. Should we use simple canvas SVGs or full interactive Leaflet maps?',
        type: 'Project',
        subject: 'Mobile App',
        author: DISCUSSIONS_PEERS[4], // Sanjay M.
        tags: ['Projects', 'React Native', 'Firebase'],
        createdAt: '1d ago',
        replies: 1,
        views: 31,
        projectId: 'p2',
        votes: 25,
        commentsCount: 1,
        category: 'Projects',
        answers: [
            {
                id: 'ans_8_1',
                author: DISCUSSIONS_PEERS[0], // Ananya Rao
                content: 'For an indoor campus navigator, simple high-quality SVGs with CSS overlays are way lighter and easier to control floor-by-floor than full Leaflet maps, especially since we do not need true GPS coordinates indoors. You can use simple coordinate tags mapped in JSON.',
                createdAt: '12h ago',
                likes: 5,
                accepted: false
            }
        ]
    },
    {
        id: 'd9',
        title: 'Best database structure for a peer-to-peer platform',
        description: 'We are detailing the schema design for local databases to hold shared files, timeline updates, and member registries without a central server. How should we sync local schemas on peer discovery?',
        type: 'Project',
        subject: 'Computer Science',
        author: DISCUSSIONS_PEERS[3], // Rhea Kulkarni
        tags: ['Projects', 'P2P', 'System Design'],
        createdAt: '5h ago',
        replies: 0,
        views: 18,
        projectId: 'p1',
        workspaceId: 'project-1',
        votes: 15,
        commentsCount: 0,
        category: 'Projects',
        answers: []
    }
];
