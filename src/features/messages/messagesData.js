/**
 * Mock data for the Messages & Collaboration Workspace feature in Cohort.
 * Structured for future Express, MongoDB, JWT authentication, and Socket.IO integration.
 * 
 * Future MongoDB Models Architecture:
 * 
 * 1. Conversation Schema:
 *    - type: String (enum: ['direct', 'study-group', 'project'], required: true)
 *    - name: String (required for group/project; derived for direct)
 *    - initials: String
 *    - avatarColor: String
 *    - avatarBg: String
 *    - members: [{
 *        userId: { type: ObjectId, ref: 'User', required: true },
 *        role: { type: String, enum: ['Owner', 'Member', 'Mentor'], default: 'Member' },
 *        joinedAt: { type: Date, default: Date.now },
 *        lastReadAt: { type: Date }
 *      }]
 *    - memberCount: Number (default: 2)
 *    - projectId: { type: ObjectId, ref: 'Project' }
 *    - groupId: { type: ObjectId, ref: 'StudyGroup' }
 *    - lastMessage: String
 *    - lastMessageAt: Date
 *    - isArchived: Boolean (default: false)
 *    - createdAt: Date (default: Date.now)
 * 
 * 2. Message Schema:
 *    - conversationId: { type: ObjectId, ref: 'Conversation', required: true, index: true }
 *    - senderId: { type: ObjectId, ref: 'User', required: true }
 *    - senderName: String (denormalized for rapid feed rendering)
 *    - senderInitials: String
 *    - content: String (required for text type)
 *    - type: String (enum: ['text', 'file', 'system'], default: 'text')
 *    - attachment: {
 *        fileName: String,
 *        fileSize: String,
 *        fileType: String,
 *        fileUrl: String,
 *        cloudinaryId: String
 *      }
 *    - readBy: [{ type: ObjectId, ref: 'User' }]
 *    - createdAt: Date (default: Date.now, index: true)
 * 
 * 3. FileAttachment Schema:
 *    - conversationId: { type: ObjectId, ref: 'Conversation', required: true }
 *    - uploadedBy: { type: ObjectId, ref: 'User', required: true }
 *    - uploaderName: String
 *    - fileName: String (required)
 *    - fileType: String (pdf, docx, pptx, etc.)
 *    - fileSize: String
 *    - fileUrl: String
 *    - downloadsCount: Number (default: 0)
 *    - createdAt: Date (default: Date.now)
 * 
 * 4. WorkspaceActivity Schema:
 *    - conversationId: { type: ObjectId, ref: 'Conversation', required: true }
 *    - actorId: { type: ObjectId, ref: 'User', required: true }
 *    - text: String (required)
 *    - type: String (enum: ['file', 'task', 'member', 'meeting'], default: 'task')
 *    - createdAt: Date (default: Date.now)
 * 
 * Future Express Endpoints:
 * GET    /api/conversations                    - Fetch user's conversation list with unread counts
 * GET    /api/conversations/:id/messages       - Fetch paginated message history for a conversation
 * POST   /api/conversations                    - Create direct message or collaboration workspace
 * POST   /api/conversations/:id/messages       - Post message (broadcast via Socket.IO)
 * POST   /api/conversations/:id/members        - Add member to project/study-group workspace
 * GET    /api/conversations/:id/files          - Fetch all shared files for workspace
 * POST   /api/conversations/:id/files          - Upload file attachment (Cloudinary upload pipeline)
 * 
 * Future Socket.IO Events:
 * - connection                - Authenticate socket connection with JWT
 * - join_conversation         - Join socket room for active conversation: socket.join(convId)
 * - leave_conversation        - Leave socket room when switching active conversation
 * - send_message              - Client sends payload: { convId, content, type, attachment }
 * - receive_message           - Server emits to room convId on new persisted message
 * - typing_start              - Broadcast user typing status to convId room
 * - typing_stop               - Clear user typing status in convId room
 * - message_read              - Update read receipts and clear unread badge
 */

export const CURRENT_USER = {
  id: 'user-current',
  name: 'Shreyas Rao',
  initials: 'SR',
  department: 'Computer Science',
  semester: '6th Semester',
  role: 'Member',
  status: 'online',
  avatarColor: '#ffffff',
  avatarBg: 'var(--pine, #2f5d50)',
};

export const AVAILABLE_PEERS = [
  {
    id: 'peer-rhea',
    name: 'Rhea Kulkarni',
    initials: 'RK',
    department: 'Electronics',
    semester: '6th Semester',
    role: 'Member',
    status: 'online',
    avatarColor: 'var(--pine-dark, #24483e)',
    avatarBg: 'var(--pine-tint, rgba(47, 93, 80, 0.12))',
    skills: ['DSA', 'Embedded Systems', 'C++'],
  },
  {
    id: 'peer-ananya',
    name: 'Ananya Rao',
    initials: 'AR',
    department: 'Computer Science',
    semester: '6th Semester',
    role: 'Mentor',
    status: 'online',
    avatarColor: 'var(--marigold, #d97706)',
    avatarBg: 'rgba(217, 119, 6, 0.14)',
    skills: ['React', 'Node.js', 'MongoDB', 'System Design'],
  },
  {
    id: 'peer-rahul',
    name: 'Rahul Sharma',
    initials: 'RS',
    department: 'AI & Data Science',
    semester: '6th Semester',
    role: 'Member',
    status: 'online',
    avatarColor: 'var(--pine, #2f5d50)',
    avatarBg: 'rgba(47, 93, 80, 0.14)',
    skills: ['Python', 'PyTorch', 'Data Science'],
  },
  {
    id: 'peer-priya',
    name: 'Priya Nair',
    initials: 'PN',
    department: 'Information Science',
    semester: '6th Semester',
    role: 'Member',
    status: 'away',
    avatarColor: '#2563eb',
    avatarBg: 'rgba(37, 99, 235, 0.12)',
    skills: ['Java', 'Spring Boot', 'Cloud Architecture'],
  },
  {
    id: 'peer-siddharth',
    name: 'Siddharth Roy',
    initials: 'SRy',
    department: 'Information Science',
    semester: '6th Semester',
    role: 'Member',
    status: 'offline',
    avatarColor: '#7c3aed',
    avatarBg: 'rgba(124, 58, 237, 0.12)',
    skills: ['Algorithms', 'Competitive Programming', 'Graph Theory'],
  },
  {
    id: 'peer-vikram',
    name: 'Vikram Mehta',
    initials: 'VM',
    department: 'Computer Science',
    semester: '6th Semester',
    role: 'Member',
    status: 'online',
    avatarColor: '#059669',
    avatarBg: 'rgba(5, 150, 105, 0.12)',
    skills: ['Computer Networks', 'Docker', 'Kubernetes'],
  },
  {
    id: 'peer-aditi',
    name: 'Aditi Kulkarni',
    initials: 'AK',
    department: 'AI & Data Science',
    semester: '6th Semester',
    role: 'Member',
    status: 'offline',
    avatarColor: '#db2777',
    avatarBg: 'rgba(219, 39, 119, 0.12)',
    skills: ['Machine Learning', 'NLP', 'Model Evaluation'],
  },
  {
    id: 'peer-nikhil',
    name: 'Nikhil Verma',
    initials: 'NV',
    department: 'Electronics',
    semester: '6th Semester',
    role: 'Member',
    status: 'online',
    avatarColor: '#ea580c',
    avatarBg: 'rgba(234, 88, 12, 0.12)',
    skills: ['Computer Vision', 'OpenCV', 'IoT'],
  },
];

export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-rhea-direct',
    type: 'direct',
    name: 'Rhea Kulkarni',
    initials: 'RK',
    avatarColor: 'var(--pine-dark, #24483e)',
    avatarBg: 'var(--pine-tint, rgba(47, 93, 80, 0.14))',
    isOnline: true,
    unreadCount: 2,
    lastMessage: 'Can you push the DSA notes?',
    lastMessageAt: '9 mins ago',
    memberCount: 2,
    members: [
      CURRENT_USER,
      AVAILABLE_PEERS[0], // Rhea Kulkarni
    ],
    messages: [
      {
        id: 'm-rhea-1',
        senderId: 'peer-rhea',
        senderName: 'Rhea Kulkarni',
        senderInitials: 'RK',
        content: 'Hey Shreyas! Did you finish revising the Dijkstra graph problems from yesterday’s session?',
        createdAt: '10:14 AM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-rhea-2',
        senderId: 'user-current',
        senderName: 'Shreyas Rao',
        senderInitials: 'SR',
        content: 'Yes! Implemented the binary min-heap approach with lazy deletion to avoid stale nodes.',
        createdAt: '10:18 AM',
        type: 'text',
        isCurrentUser: true,
      },
      {
        id: 'm-rhea-3',
        senderId: 'peer-rhea',
        senderName: 'Rhea Kulkarni',
        senderInitials: 'RK',
        content: 'Awesome! That matches our discussion in the forum.',
        createdAt: '10:20 AM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-rhea-4',
        senderId: 'peer-rhea',
        senderName: 'Rhea Kulkarni',
        senderInitials: 'RK',
        content: 'Can you push the DSA notes?',
        createdAt: '9 mins ago',
        type: 'text',
        isCurrentUser: false,
      },
    ],
    files: [
      {
        id: 'f-rhea-1',
        name: 'DSA Roadmap.pptx',
        type: 'pptx',
        uploadedBy: 'Rhea Kulkarni',
        uploadedAt: 'Yesterday',
        size: '4.8 MB',
        downloadsCount: 12,
      },
      {
        id: 'f-rhea-2',
        name: 'Dijkstra_Heap_Implementation.cpp',
        type: 'code',
        uploadedBy: 'Shreyas Rao',
        uploadedAt: '2 days ago',
        size: '18 KB',
        downloadsCount: 9,
      },
    ],
    activity: [
      { id: 'act-r1', text: 'Rhea shared DSA Roadmap.pptx', time: 'Yesterday', type: 'file' },
      { id: 'act-r2', text: 'Shreyas pushed graph code snippet', time: '2 days ago', type: 'file' },
    ],
  },
  {
    id: 'team-nimbus',
    type: 'project',
    name: 'Team Nimbus',
    initials: 'TN',
    avatarColor: '#ffffff',
    avatarBg: 'var(--pine, #2f5d50)',
    isOnline: true,
    unreadCount: 1,
    lastMessage: 'Standup at 6 PM?',
    lastMessageAt: '41 mins ago',
    memberCount: 4,
    projectId: 'proj-academic-p2p',
    projectName: 'Academic Peer-to-Peer Network',
    members: [
      { ...CURRENT_USER, role: 'Owner' },
      { ...AVAILABLE_PEERS[1], role: 'Mentor' }, // Ananya
      { ...AVAILABLE_PEERS[2], role: 'Member' }, // Rahul
      { ...AVAILABLE_PEERS[3], role: 'Member' }, // Priya
    ],
    messages: [
      {
        id: 'm-nim-1',
        senderId: 'peer-ananya',
        senderName: 'Ananya Rao',
        senderInitials: 'AR',
        content: 'Team, I just completed the OpenAPI specification and uploaded the contract diagrams.',
        createdAt: '09:30 AM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-nim-2',
        senderId: 'peer-ananya',
        senderName: 'Ananya Rao',
        senderInitials: 'AR',
        content: 'Here is the architecture documentation for review:',
        createdAt: '09:31 AM',
        type: 'file',
        attachment: {
          name: 'API Architecture.pdf',
          size: '3.2 MB',
          type: 'pdf',
        },
        isCurrentUser: false,
      },
      {
        id: 'm-nim-3',
        senderId: 'user-current',
        senderName: 'Shreyas Rao',
        senderInitials: 'SR',
        content: 'Reviewed! The token rotation and socket namespace design look robust.',
        createdAt: '11:05 AM',
        type: 'text',
        isCurrentUser: true,
      },
      {
        id: 'm-nim-4',
        senderId: 'peer-rahul',
        senderName: 'Rahul Sharma',
        senderInitials: 'RS',
        content: 'Standup at 6 PM?',
        createdAt: '41 mins ago',
        type: 'text',
        isCurrentUser: false,
      },
    ],
    files: [
      {
        id: 'f-nim-1',
        name: 'API Architecture.pdf',
        type: 'pdf',
        uploadedBy: 'Ananya Rao',
        uploadedAt: 'Today, 9:31 AM',
        size: '3.2 MB',
        downloadsCount: 18,
      },
      {
        id: 'f-nim-2',
        name: 'Sprint Planning.docx',
        type: 'docx',
        uploadedBy: 'Shreyas Rao',
        uploadedAt: 'Yesterday',
        size: '1.4 MB',
        downloadsCount: 14,
      },
      {
        id: 'f-nim-3',
        name: 'Peer_Match_Algorithm_Specs.pdf',
        type: 'pdf',
        uploadedBy: 'Priya Nair',
        uploadedAt: '3 days ago',
        size: '2.1 MB',
        downloadsCount: 11,
      },
    ],
    activity: [
      { id: 'act-n1', text: 'Ananya uploaded API Architecture.pdf', time: 'Today, 9:31 AM', type: 'file' },
      { id: 'act-n2', text: 'Rahul completed task: Create matching utility', time: 'Today, 11:45 AM', type: 'task' },
      { id: 'act-n3', text: 'Priya joined the workspace', time: 'Yesterday', type: 'member' },
      { id: 'act-n4', text: 'Meeting scheduled for Saturday, 4 PM', time: '2 days ago', type: 'meeting' },
    ],
  },
  {
    id: 'gradient-descent',
    type: 'study-group',
    name: 'Gradient Descent',
    initials: 'GD',
    avatarColor: '#ffffff',
    avatarBg: 'var(--marigold, #d97706)',
    isOnline: true,
    unreadCount: 0,
    lastMessage: 'Today’s session notes are uploaded.',
    lastMessageAt: '2 hours ago',
    memberCount: 18,
    groupId: 'sg-gradient-descent',
    groupName: 'Machine Learning & Neural Nets',
    members: [
      { ...AVAILABLE_PEERS[2], role: 'Owner' }, // Rahul
      { ...CURRENT_USER, role: 'Member' },
      { ...AVAILABLE_PEERS[6], role: 'Member' }, // Aditi
      { ...AVAILABLE_PEERS[1], role: 'Mentor' }, // Ananya
    ],
    messages: [
      {
        id: 'm-gd-1',
        senderId: 'peer-aditi',
        senderName: 'Aditi Kulkarni',
        senderInitials: 'AK',
        content: 'Quick question: when backpropagating through a Leaky ReLU layer, what is the default alpha leak coefficient usually used in PyTorch?',
        createdAt: '1:10 PM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-gd-2',
        senderId: 'user-current',
        senderName: 'Shreyas Rao',
        senderInitials: 'SR',
        content: 'Default `negative_slope` is 0.01 in `torch.nn.LeakyReLU(negative_slope=0.01)`. It keeps small non-zero gradients to avoid dying neuron units.',
        createdAt: '1:24 PM',
        type: 'text',
        isCurrentUser: true,
      },
      {
        id: 'm-gd-3',
        senderId: 'peer-rahul',
        senderName: 'Rahul Sharma',
        senderInitials: 'RS',
        content: 'Today’s session notes are uploaded.',
        createdAt: '2 hours ago',
        type: 'text',
        isCurrentUser: false,
      },
    ],
    files: [
      {
        id: 'f-gd-1',
        name: 'Gradient_Descent_Notes.pdf',
        type: 'pdf',
        uploadedBy: 'Rahul Sharma',
        uploadedAt: 'Today, 2:00 PM',
        size: '5.1 MB',
        downloadsCount: 24,
      },
      {
        id: 'f-gd-2',
        name: 'Backprop_Derivation_Walkthrough.pdf',
        type: 'pdf',
        uploadedBy: 'Aditi Kulkarni',
        uploadedAt: '3 days ago',
        size: '2.8 MB',
        downloadsCount: 19,
      },
    ],
    activity: [
      { id: 'act-g1', text: 'Rahul uploaded Gradient_Descent_Notes.pdf', time: '2 hours ago', type: 'file' },
      { id: 'act-g2', text: 'Aditi posted a discussion question on LeakyReLU', time: '3 hours ago', type: 'task' },
      { id: 'act-g3', text: 'Meeting scheduled: ML Study Session', time: 'Yesterday', type: 'meeting' },
    ],
  },
  {
    id: 'os-internals',
    type: 'study-group',
    name: 'OS Internals Circle',
    initials: 'OS',
    avatarColor: '#ffffff',
    avatarBg: '#475569',
    isOnline: false,
    unreadCount: 0,
    lastMessage: 'Who is joining the Saturday session?',
    lastMessageAt: '4 hours ago',
    memberCount: 9,
    groupId: 'sg-os-internals',
    groupName: 'Operating Systems & Concurrency',
    members: [
      { ...AVAILABLE_PEERS[5], role: 'Owner' }, // Vikram
      { ...CURRENT_USER, role: 'Member' },
      { ...AVAILABLE_PEERS[4], role: 'Member' }, // Siddharth
      { ...AVAILABLE_PEERS[0], role: 'Member' }, // Rhea
    ],
    messages: [
      {
        id: 'm-os-1',
        senderId: 'peer-vikram',
        senderName: 'Vikram Mehta',
        senderInitials: 'VM',
        content: 'We will be covering Banker’s algorithm, memory paging, and deadlock recovery strategies.',
        createdAt: '9:00 AM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-os-2',
        senderId: 'peer-siddharth',
        senderName: 'Siddharth Roy',
        senderInitials: 'SRy',
        content: 'I will prepare the memory translation TLB hit ratio practice problems.',
        createdAt: '10:30 AM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-os-3',
        senderId: 'peer-vikram',
        senderName: 'Vikram Mehta',
        senderInitials: 'VM',
        content: 'Who is joining the Saturday session?',
        createdAt: '4 hours ago',
        type: 'text',
        isCurrentUser: false,
      },
    ],
    files: [
      {
        id: 'f-os-1',
        name: 'OS_Scheduler_CheatSheet.pdf',
        type: 'pdf',
        uploadedBy: 'Vikram Mehta',
        uploadedAt: 'Yesterday',
        size: '1.9 MB',
        downloadsCount: 22,
      },
      {
        id: 'f-os-2',
        name: 'Deadlock_Coffman_Conditions.pdf',
        type: 'pdf',
        uploadedBy: 'Shreyas Rao',
        uploadedAt: '4 days ago',
        size: '1.2 MB',
        downloadsCount: 16,
      },
    ],
    activity: [
      { id: 'act-o1', text: 'Vikram scheduled Saturday OS Session', time: '4 hours ago', type: 'meeting' },
      { id: 'act-o2', text: 'Shreyas added Deadlock_Coffman_Conditions.pdf', time: '4 days ago', type: 'file' },
    ],
  },
  {
    id: 'smart-attendance',
    type: 'project',
    name: 'Smart Attendance System',
    initials: 'SA',
    avatarColor: '#ffffff',
    avatarBg: '#059669',
    isOnline: true,
    unreadCount: 0,
    lastMessage: 'The OpenCV model needs more test images.',
    lastMessageAt: '5 hours ago',
    memberCount: 3,
    projectId: 'proj-smart-attendance',
    projectName: 'Face Recognition Attendance',
    members: [
      { ...AVAILABLE_PEERS[7], role: 'Owner' }, // Nikhil
      { ...CURRENT_USER, role: 'Member' },
      { ...AVAILABLE_PEERS[0], role: 'Member' }, // Rhea
    ],
    messages: [
      {
        id: 'm-sa-1',
        senderId: 'peer-nikhil',
        senderName: 'Nikhil Verma',
        senderInitials: 'NV',
        content: 'Benchmarked the Haar Cascade detector vs MTCNN. MTCNN gives 98% accuracy under uneven classroom lighting.',
        createdAt: '8:45 AM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-sa-2',
        senderId: 'user-current',
        senderName: 'Shreyas Rao',
        senderInitials: 'SR',
        content: 'Great comparison! What is the inference time per classroom frame on CPU?',
        createdAt: '9:12 AM',
        type: 'text',
        isCurrentUser: true,
      },
      {
        id: 'm-sa-3',
        senderId: 'peer-nikhil',
        senderName: 'Nikhil Verma',
        senderInitials: 'NV',
        content: 'The OpenCV model needs more test images.',
        createdAt: '5 hours ago',
        type: 'text',
        isCurrentUser: false,
      },
    ],
    files: [
      {
        id: 'f-sa-1',
        name: 'OpenCV_Haarcascade_Setup.pdf',
        type: 'pdf',
        uploadedBy: 'Nikhil Verma',
        uploadedAt: '2 days ago',
        size: '3.6 MB',
        downloadsCount: 15,
      },
      {
        id: 'f-sa-2',
        name: 'Classroom_Lighting_Benchmark.csv',
        type: 'csv',
        uploadedBy: 'Nikhil Verma',
        uploadedAt: 'Yesterday',
        size: '850 KB',
        downloadsCount: 8,
      },
    ],
    activity: [
      { id: 'act-s1', text: 'Nikhil committed MTCNN benchmark', time: '5 hours ago', type: 'task' },
      { id: 'act-s2', text: 'Shreyas added Redis cache specs', time: 'Yesterday', type: 'file' },
    ],
  },
  {
    id: 'conv-ananya-direct',
    type: 'direct',
    name: 'Ananya Rao',
    initials: 'AR',
    avatarColor: 'var(--marigold, #d97706)',
    avatarBg: 'rgba(217, 119, 6, 0.14)',
    isOnline: true,
    unreadCount: 0,
    lastMessage: 'DBMS normalization notes look comprehensive.',
    lastMessageAt: '1 day ago',
    memberCount: 2,
    members: [
      CURRENT_USER,
      AVAILABLE_PEERS[1], // Ananya Rao
    ],
    messages: [
      {
        id: 'm-an-1',
        senderId: 'user-current',
        senderName: 'Shreyas Rao',
        senderInitials: 'SR',
        content: 'Hi Ananya, I reviewed your answer on the 3NF/BCNF normalization thread in the forum. It was crystal clear!',
        createdAt: 'Yesterday, 3:00 PM',
        type: 'text',
        isCurrentUser: true,
      },
      {
        id: 'm-an-2',
        senderId: 'peer-ananya',
        senderName: 'Ananya Rao',
        senderInitials: 'AR',
        content: 'Thanks Shreyas! Glad it helped. Let me know if you want to collaborate on the indexing formulas.',
        createdAt: 'Yesterday, 3:20 PM',
        type: 'text',
        isCurrentUser: false,
      },
      {
        id: 'm-an-3',
        senderId: 'peer-ananya',
        senderName: 'Ananya Rao',
        senderInitials: 'AR',
        content: 'DBMS normalization notes look comprehensive.',
        createdAt: '1 day ago',
        type: 'text',
        isCurrentUser: false,
      },
    ],
    files: [
      {
        id: 'f-an-1',
        name: 'DBMS Notes.pdf',
        type: 'pdf',
        uploadedBy: 'Ananya Rao',
        uploadedAt: 'Yesterday',
        size: '4.2 MB',
        downloadsCount: 31,
      },
    ],
    activity: [
      { id: 'act-a1', text: 'Ananya shared DBMS Notes.pdf', time: '1 day ago', type: 'file' },
    ],
  },
];

export const CONVERSATION_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'direct', label: 'Direct' },
  { value: 'study-group', label: 'Study Groups' },
  { value: 'project', label: 'Projects' },
  { value: 'unread', label: 'Unread' },
];
