/**
 * Mock data for the Discussions feature in Cohort.
 * Structured for future Express + MongoDB API integration.
 * 
 * Future MongoDB Models Architecture:
 * 
 * 1. Discussion Schema:
 *    - title: String (required, trim, indexed)
 *    - body: String (required)
 *    - author: { type: ObjectId, ref: 'User', required: true }
 *    - authorName: String
 *    - authorInitials: String
 *    - authorDepartment: String
 *    - subject: String (required, indexed)
 *    - tags: [String]
 *    - voteCount: Number (default: 0)
 *    - upvoters: [{ type: ObjectId, ref: 'User' }] // Prevents duplicate upvotes
 *    - answerCount: Number (default: 0)
 *    - viewCount: Number (default: 0)
 *    - isSolved: Boolean (default: false)
 *    - acceptedAnswerId: { type: ObjectId, ref: 'Answer' }
 *    - linkedProjectId: { type: ObjectId, ref: 'Project' }
 *    - linkedResourceId: { type: ObjectId, ref: 'Resource' }
 *    - createdAt: Date (default: Date.now)
 * 
 * 2. Answer Schema (embedded or separate collection):
 *    - discussionId: { type: ObjectId, ref: 'Discussion', required: true }
 *    - author: { type: ObjectId, ref: 'User', required: true }
 *    - authorName: String
 *    - authorInitials: String
 *    - body: String (required)
 *    - voteCount: Number (default: 0)
 *    - upvoters: [{ type: ObjectId, ref: 'User' }]
 *    - isAccepted: Boolean (default: false)
 *    - createdAt: Date (default: Date.now)
 * 
 * Future Express Endpoints:
 * GET    /api/discussions                     - Fetch paginated discussions with search, filter, and sort
 * GET    /api/discussions/:id                 - Get full discussion with populated answers
 * POST   /api/discussions                     - Create new discussion question
 * PATCH  /api/discussions/:id/upvote          - Toggle upvote for discussion
 * POST   /api/discussions/:id/answers         - Submit an answer
 * PATCH  /api/discussions/:id/answers/:answerId/upvote - Upvote an answer
 * PATCH  /api/discussions/:id/answers/:answerId/accept - Mark an answer as accepted
 */

export const INITIAL_DISCUSSIONS = [
  {
    id: 'disc-dbms-norm',
    title: 'How does normalization reduce redundancy in DBMS?',
    body: 'I am preparing for our Database Systems midterms and trying to clearly articulate how moving from 1NF through 2NF and 3NF/BCNF formally eliminates data anomalies (insertion, update, and deletion anomalies) without losing functional dependencies. Could someone explain with an intuitive real-world table example?',
    author: 'Aarav Patel',
    authorInitials: 'AP',
    authorDepartment: 'Computer Science',
    subject: 'DBMS',
    tags: ['Normalization', 'SQL', 'Database Design'],
    createdAt: '2 hours ago',
    voteCount: 58,
    answerCount: 2,
    viewCount: 342,
    isSolved: true,
    acceptedAnswerId: 'ans-norm-1',
    linkedProjectId: null,
    linkedResourceId: 'res-dbms-notes',
    answers: [
      {
        id: 'ans-norm-1',
        author: 'Ananya Rao',
        authorInitials: 'AR',
        authorDepartment: 'Computer Science',
        body: 'Normalization works by decomposing complex, multi-themed relation tables into smaller, well-structured relations where each fact is stated exactly once.\n\nFor example, suppose we store `(StudentID, StudentName, CourseID, CourseInstructor)` in one table:\n1. Insertion Anomaly: You cannot record a new course until a student enrolls.\n2. Deletion Anomaly: If the only student in a course drops out, you lose the course and instructor records.\n3. Update Anomaly: If the instructor changes, you must update multiple rows.\n\nBy splitting this into `Students(StudentID, StudentName)`, `Courses(CourseID, CourseInstructor)`, and `Enrollments(StudentID, CourseID)`, every functional dependency `X -> Y` is rooted in a candidate key. This guarantees lossless join decomposition and preserves dependencies.',
        createdAt: '1 hour ago',
        voteCount: 34,
        isAccepted: true,
      },
      {
        id: 'ans-norm-2',
        author: 'Rahul Sharma',
        authorInitials: 'RS',
        authorDepartment: 'AI & Data Science',
        body: 'Great answer above! One practical tip: in OLTP systems (like web apps), we normalize up to 3NF/BCNF to ensure transaction consistency. In OLAP / analytics data warehouses, we intentionally denormalize into Star/Snowflake schemas to speed up analytical aggregations by reducing expensive SQL joins.',
        createdAt: '45 mins ago',
        voteCount: 12,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-dijkstra-queue',
    title: 'What is the best approach for implementing Dijkstra efficiently?',
    body: 'In competitive programming and technical interviews, should we use a standard binary min-heap (`std::priority_queue` or Python `heapq`), or is an Indexed Priority Queue / Fibonacci Heap ever expected? How do we handle duplicate graph nodes when relaxing edge weights?',
    author: 'Siddharth Roy',
    authorInitials: 'SR',
    authorDepartment: 'Information Science',
    subject: 'Data Structures and Algorithms',
    tags: ['Graphs', 'Dijkstra', 'Priority Queue'],
    createdAt: '4 hours ago',
    voteCount: 47,
    answerCount: 1,
    viewCount: 285,
    isSolved: false,
    acceptedAnswerId: null,
    linkedProjectId: null,
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-dijkstra-1',
        author: 'Shreyas Rao',
        authorInitials: 'SR',
        authorDepartment: 'Computer Science',
        body: 'For almost all coding interviews and CP contests, the standard Binary Min-Heap (like Python `heapq` or C++ `priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>>`) is the optimal choice. It gives O((V + E) log V) time complexity and O(V + E) space.\n\nTo handle duplicates cleanly without an indexed heap:\nWhen you pop `(dist, u)` from the queue, immediately check `if (dist > d[u]) continue;`. This simple "lazy deletion" guard skips stale paths in O(1) and prevents unnecessary neighbor relaxations.',
        createdAt: '2 hours ago',
        voteCount: 26,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-mern-structure',
    title: 'How should we structure a MERN project for a college team?',
    body: 'Our student team is collaborating on the Academic Peer-to-Peer Network project. What is the recommended repository and directory layout for separating client and server code, managing shared ESLint/Prettier configs, and setting up Docker Compose for local development?',
    author: 'Priya Nair',
    authorInitials: 'PN',
    authorDepartment: 'Information Science',
    subject: 'Web Development',
    tags: ['MERN', 'React', 'Node.js', 'Git'],
    createdAt: '1 day ago',
    voteCount: 39,
    answerCount: 2,
    viewCount: 410,
    isSolved: true,
    acceptedAnswerId: 'ans-mern-1',
    linkedProjectId: 'proj-academic-p2p',
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-mern-1',
        author: 'Shreyas Rao',
        authorInitials: 'SR',
        authorDepartment: 'Computer Science',
        body: 'We found the Monorepo structure with npm/yarn workspaces to be the cleanest approach for team velocity:\n\n```\nacademic-p2p-network/\n  client/          # React + Vite, Tailwind/Vanilla CSS, Lucide\n    src/\n      features/    # Feature-first modularization\n      components/\n  server/          # Node + Express, MongoDB Mongoose\n    controllers/\n    models/\n    routes/\n    middleware/\n  docker-compose.yml\n  package.json     # Workspace root scripts\n```\n\nThis keeps API contracts synchronized in PR reviews while allowing frontend and backend pairs to deploy independently.',
        createdAt: '18 hours ago',
        voteCount: 29,
        isAccepted: true,
      },
      {
        id: 'ans-mern-2',
        author: 'Vikram Mehta',
        authorInitials: 'VM',
        authorDepartment: 'Computer Science',
        body: 'Also make sure to configure a root `.env.example` file and write strict schema validation middleware using Zod or Joi on incoming Express requests before they hit your Mongoose controllers.',
        createdAt: '14 hours ago',
        voteCount: 11,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-os-deadlocks',
    title: 'How can I understand deadlocks in Operating Systems?',
    body: 'I get confused between deadlock prevention, avoidance (Banker’s algorithm), and detection/recovery. Could someone provide a memorable mental model for the Coffman conditions and how modern OS kernels handle them in practice?',
    author: 'Kavya Deshmukh',
    authorInitials: 'KD',
    authorDepartment: 'Computer Science',
    subject: 'Operating Systems',
    tags: ['Deadlocks', 'Scheduling', 'Processes'],
    createdAt: '1 day ago',
    voteCount: 33,
    answerCount: 1,
    viewCount: 215,
    isSolved: false,
    acceptedAnswerId: null,
    linkedProjectId: null,
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-os-1',
        author: 'Rohan Joshi',
        authorInitials: 'RJ',
        authorDepartment: 'Computer Science',
        body: 'Remember the mnemonic **"Hold & Wait, Mutual Exclusion, No Preemption, Circular Wait"**. All four MUST hold simultaneously for a deadlock to occur:\n\n1. Mutual Exclusion: A resource can only be held by one process at a time (like a printer).\n2. Hold & Wait: A process holds a resource while requesting another.\n3. No Preemption: Resources cannot be forcibly taken away.\n4. Circular Wait: Process A waits for B, and B waits for A.\n\nIn real systems like Linux, full deadlock avoidance (Banker\'s algorithm) is rarely used because predicting exact future resource needs at runtime is impossible. Instead, Linux relies on strict lock ordering (breaking Circular Wait) and Ostrich algorithm (ignoring rare deadlocks) for non-critical resources.',
        createdAt: '16 hours ago',
        voteCount: 21,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-ml-overfitting',
    title: 'What are the most effective ways to combat overfitting in small tabular datasets?',
    body: 'When training gradient boosting models (XGBoost/LightGBM) on datasets with fewer than 1,000 samples, what regularization parameters (L1/L2, max_depth, subsample) and validation strategies prevent optimistic cross-validation leakage?',
    author: 'Aditi Kulkarni',
    authorInitials: 'AK',
    authorDepartment: 'AI & Data Science',
    subject: 'Machine Learning',
    tags: ['Machine Learning', 'XGBoost', 'Overfitting', 'Data Science'],
    createdAt: '2 days ago',
    voteCount: 28,
    answerCount: 2,
    viewCount: 198,
    isSolved: true,
    acceptedAnswerId: 'ans-ml-1',
    linkedProjectId: 'proj-regional-sentiment',
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-ml-1',
        author: 'Rahul Sharma',
        authorInitials: 'RS',
        authorDepartment: 'AI & Data Science',
        body: 'For N < 1000 tabular datasets:\n1. Use Repeated Stratified K-Fold (e.g., 5 folds, 5 repeats) rather than a single train/test split.\n2. Constrain tree depth: set `max_depth = 3` or `max_depth = 4` to prevent deep co-adapted leaves.\n3. Add feature subsampling (`colsample_bytree = 0.7`) and row subsampling (`subsample = 0.8`).\n4. Increase `reg_alpha` (L1) to enforce feature sparsity.\n5. Benchmark against a regularized Ridge or ElasticNet baseline—often linear models outperform complex ensembles on small data!',
        createdAt: '1 day ago',
        voteCount: 22,
        isAccepted: true,
      },
      {
        id: 'ans-ml-2',
        author: 'Nikhil Verma',
        authorInitials: 'NV',
        authorDepartment: 'Electronics',
        body: 'Also make sure all scaling, imputing, and encoding are wrapped strictly inside a `Pipeline` inside the fold loop. Fitting encoders before splitting is the #1 silent cause of data leakage.',
        createdAt: '1 day ago',
        voteCount: 9,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-system-design-cache',
    title: 'Cache-Aside vs Read-Through vs Write-Through caching patterns',
    body: 'We are designing the caching layer for our high-throughput attendance verification system. When should we prefer Cache-Aside (Lazy Loading) with Redis over Write-Through or Write-Back caching?',
    author: 'Nikhil Verma',
    authorInitials: 'NV',
    authorDepartment: 'Electronics & Communication',
    subject: 'System Design',
    tags: ['System Design', 'Redis', 'Caching', 'Architecture'],
    createdAt: '3 days ago',
    voteCount: 24,
    answerCount: 1,
    viewCount: 182,
    isSolved: false,
    acceptedAnswerId: null,
    linkedProjectId: 'proj-smart-attendance',
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-cache-1',
        author: 'Shreyas Rao',
        authorInitials: 'SR',
        authorDepartment: 'Computer Science',
        body: 'Here is the quick architectural decision matrix:\n- **Cache-Aside (Lazy Loading)**: Application queries Redis first. On cache miss, fetches from DB and writes to Redis. Best for read-heavy workloads with unpredictable queries. Node crash won\'t crash DB.\n- **Write-Through**: Application writes to cache, and cache synchronously writes to DB. High write latency, but zero stale data.\n- **Write-Back (Write-Behind)**: Writes directly to cache; cache asynchronously flushes in batches to DB. Blazing fast writes, but risk of data loss if Redis crashes before disk sync.\n\nFor student attendance, Cache-Aside with a reasonable TTL (e.g., 10 minutes) and explicit eviction on record update is standard and fault-tolerant.',
        createdAt: '2 days ago',
        voteCount: 18,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-react-rendering',
    title: 'When should we actually use React.memo, useMemo, and useCallback?',
    body: 'I see many beginners wrapping every single function in `useCallback` and every primitive computation in `useMemo`. What are the actual performance thresholds and profiling metrics that justify memoization overhead in React 19?',
    author: 'Tanvi Shah',
    authorInitials: 'TS',
    authorDepartment: 'Computer Science',
    subject: 'Web Development',
    tags: ['React', 'Frontend', 'Performance', 'Hooks'],
    createdAt: '3 days ago',
    voteCount: 31,
    answerCount: 1,
    viewCount: 240,
    isSolved: true,
    acceptedAnswerId: 'ans-react-1',
    linkedProjectId: null,
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-react-1',
        author: 'Ananya Rao',
        authorInitials: 'AR',
        authorDepartment: 'Computer Science',
        body: 'Remember that memoization has a cost: creating closures, memory allocations, and dependency array shallow comparisons every render.\n\nOnly use them in these 3 verified scenarios:\n1. `useCallback`: When passing a callback function as a prop to a child component wrapped in `React.memo` (otherwise child re-renders anyway).\n2. `useMemo`: When doing computationally expensive work (like filtering or sorting 5,000+ items) or when the resulting object/array is in the dependency array of a `useEffect`.\n3. `React.memo`: When a component renders frequently with the exact same props and contains a heavy virtual DOM subtree.\n\nAlways verify with the React DevTools Profiler before and after!',
        createdAt: '2 days ago',
        voteCount: 25,
        isAccepted: true,
      },
    ],
  },
  {
    id: 'disc-tcp-vs-udp',
    title: 'Why do online multiplayer games use UDP instead of TCP?',
    body: 'If TCP guarantees ordered and reliable packet transmission, why do low-latency game engines and voice VoIP channels prefer UDP where packets can be lost?',
    author: 'Dev Sharma',
    authorInitials: 'DS',
    authorDepartment: 'Information Science',
    subject: 'Computer Networks',
    tags: ['Computer Networks', 'TCP', 'UDP', 'Protocols'],
    createdAt: '4 days ago',
    voteCount: 22,
    answerCount: 1,
    viewCount: 175,
    isSolved: false,
    acceptedAnswerId: null,
    linkedProjectId: null,
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-tcp-1',
        author: 'Vikram Mehta',
        authorInitials: 'VM',
        authorDepartment: 'Computer Science',
        body: 'The primary reason is **Head-of-Line (HoL) Blocking** in TCP.\n\nIf packet #2 is dropped in TCP, the receiver’s OS buffer stops delivering packets #3, #4, and #5 to your game engine until packet #2 is retransmitted and acknowledged. In a fast-paced game (like an FPS), player position at frame 60 is already obsolete—you do not care about where the player was 200ms ago; you only care about the latest coordinates! UDP delivers new packets immediately without waiting on retransmissions.',
        createdAt: '3 days ago',
        voteCount: 19,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-placement-dsa-roadmap',
    title: 'Optimal DSA preparation timeline for upcoming campus placements 2027',
    body: 'For 6th semester students targeting Tier-1 software engineering interviews: how should we divide our remaining 4 months between LeetCode problem patterns (Sliding Window, Two Pointers, Trees, DP) and Core CS subjects (OS, DBMS, CN)?',
    author: 'Pooja Hegde',
    authorInitials: 'PH',
    authorDepartment: 'Computer Science',
    subject: 'Placement Prep',
    tags: ['Placement Preparation', 'DSA', 'Interview', 'Career'],
    createdAt: '5 days ago',
    voteCount: 45,
    answerCount: 2,
    viewCount: 520,
    isSolved: true,
    acceptedAnswerId: 'ans-placement-1',
    linkedProjectId: null,
    linkedResourceId: 'res-dbms-notes',
    answers: [
      {
        id: 'ans-placement-1',
        author: 'Shreyas Rao',
        authorInitials: 'SR',
        authorDepartment: 'Computer Science',
        body: 'Here is the tried-and-tested 16-week strategy:\n- Weeks 1–6: Pattern mastery (Arrays, Two Pointers, Sliding Window, Binary Search, Linked Lists, Trees/BSTs). Aim for 100 Medium problems focused on patterns, not random questions.\n- Weeks 7–10: Graphs (BFS/DFS, Topological Sort, Dijkstra) and fundamental DP (Knapsack, LCS, Grid paths).\n- Weeks 11–13: Core CS theory: DBMS queries and transactions, OS threads and concurrency, Computer Networks routing and OSI layers.\n- Weeks 14–16: Timed mock contests on LeetCode/Codeforces and project resume defense prep.',
        createdAt: '4 days ago',
        voteCount: 38,
        isAccepted: true,
      },
      {
        id: 'ans-placement-2',
        author: 'Ananya Rao',
        authorInitials: 'AR',
        authorDepartment: 'Computer Science',
        body: 'Do not ignore behavioral questions! Prepare 3 solid project stories using the STAR method (Situation, Task, Action, Result) from your Cohort collaborative projects.',
        createdAt: '3 days ago',
        voteCount: 15,
        isAccepted: false,
      },
    ],
  },
  {
    id: 'disc-git-rebasing',
    title: 'Git Merge vs Git Rebase: Best practices for feature branches',
    body: 'When pulling updates from the team `main` branch into your feature branch, when should you `git merge main` vs `git rebase main`? How can we avoid messy merge conflict loops?',
    author: 'Arjun Das',
    authorInitials: 'AD',
    authorDepartment: 'Electronics',
    subject: 'Git and GitHub',
    tags: ['Git and GitHub', 'Version Control', 'DevOps'],
    createdAt: '6 days ago',
    voteCount: 19,
    answerCount: 1,
    viewCount: 160,
    isSolved: false,
    acceptedAnswerId: null,
    linkedProjectId: 'proj-solar-tracker',
    linkedResourceId: null,
    answers: [
      {
        id: 'ans-git-1',
        author: 'Priya Nair',
        authorInitials: 'PN',
        authorDepartment: 'Information Science',
        body: 'The golden rule: **Never rebase public commits that other teammates have branched off of**.\n\n- On your private local feature branch: Use `git fetch origin && git rebase origin/main`. This rewinds your commits, replays latest `main`, and reapplies your work on top, creating a clean linear commit graph without redundant "Merge branch" clutter.\n- When merging your completed feature branch into `main`: Use GitHub PR Squash-and-Merge or regular merge commit to preserve the feature integration timestamp.',
        createdAt: '5 days ago',
        voteCount: 16,
        isAccepted: false,
      },
    ],
  },
];

export const SUBJECT_OPTIONS = [
  'All Subjects',
  'DBMS',
  'Data Structures and Algorithms',
  'Web Development',
  'Operating Systems',
  'Machine Learning',
  'System Design',
  'Computer Networks',
  'Placement Prep',
  'Git and GitHub',
];

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Questions' },
  { value: 'solved', label: 'Solved Questions' },
  { value: 'unsolved', label: 'Unsolved Questions' },
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'upvoted', label: 'Most Upvoted' },
  { value: 'answered', label: 'Most Answered' },
  { value: 'viewed', label: 'Most Viewed' },
];

export const TRENDING_TOPICS = [
  { name: 'DBMS', count: 28, query: 'DBMS' },
  { name: 'DSA', count: 42, query: 'Data Structures and Algorithms' },
  { name: 'React', count: 35, query: 'React' },
  { name: 'Machine Learning', count: 19, query: 'Machine Learning' },
  { name: 'Operating Systems', count: 22, query: 'Operating Systems' },
  { name: 'System Design', count: 16, query: 'System Design' },
  { name: 'Placement Preparation', count: 31, query: 'Placement Prep' },
  { name: 'Git and GitHub', count: 14, query: 'Git and GitHub' },
];
