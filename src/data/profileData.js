export const PROFILE_DATA = {
    name: 'Shreyas Rao',
    department: 'Computer Science',
    semester: 'Semester 1',
    college: 'BMS College of Engineering',
    cgpa: 8.7,
    biography: 'First-year CSE student who spends more time debugging side projects than sleeping. Learning in public, one broken build at a time.',
    careerGoals: 'Land a software engineering internship by third semester and eventually build a product students at BMS actually rely on.',
    researchInterests: 'Applied machine learning, recommendation systems, and human-computer interaction in education.',
    academicInterests: 'Data structures, distributed systems, and anything that turns messy data into something usable.',
    skills: ['Python', 'Java', 'React', 'MongoDB', 'Machine Learning', 'Data Analysis', 'Node.js', 'SQL'],
};
export const PROJECTS = [
    {
        id: '1',
        title: 'Academic Peer-to-Peer Network',
        description: 'A decentralized academic peer-to-peer network for sharing resources, discussions, and study session synchronization without a central server.',
        technologies: ['TypeScript', 'WebRTC', 'React', 'Tailwind CSS'],
        status: 'In progress',
        featured: true,
        repositoryUrl: '#',
    },
    {
        id: '2',
        title: 'Campus Navigator App',
        description: 'An indoor wayfinding app to help first-years navigate the BMS campus block by block.',
        technologies: ['React Native', 'Firebase'],
        status: 'Live',
        repositoryUrl: '#',
    },
    {
        id: '3',
        title: 'Regional Sentiment Analyzer',
        description: 'Sentiment classification model for short-form text in regional Indian languages.',
        technologies: ['Python', 'PyTorch'],
        status: 'In progress',
        repositoryUrl: '#',
    },
    {
        id: '4',
        title: 'Resume Skill Matcher',
        description: 'Compares a resume against a job description and highlights missing keywords.',
        technologies: ['Python', 'Flask'],
        status: 'In progress',
        repositoryUrl: '#',
    },
];
export const CERTIFICATIONS = [
    {
        id: '1',
        title: 'Machine Learning Specialization',
        organization: 'Coursera · Stanford Online',
        date: 'Jun 2026',
    },
    {
        id: '2',
        title: 'Full-Stack Web Development',
        organization: 'Meta · Coursera',
        date: 'Mar 2026',
    },
    {
        id: '3',
        title: 'Google Data Analytics',
        organization: 'Google · Coursera',
        date: 'Dec 2025',
    },
];
export const RESOURCES = [
    {
        id: '1',
        fileName: 'DBMS Notes.pdf',
        fileType: 'PDF',
        uploadDate: 'Aug 12',
        downloadCount: 34,
    },
    {
        id: '2',
        fileName: 'OS Cheat Sheet.pdf',
        fileType: 'PDF',
        uploadDate: 'Aug 8',
        downloadCount: 21,
    },
    {
        id: '3',
        fileName: 'DSA Roadmap.ppt',
        fileType: 'PPT',
        uploadDate: 'Jul 29',
        downloadCount: 46,
    },
];
export const ACHIEVEMENTS = [
    {
        id: '1',
        title: 'Runner-up — CodeIO Hackathon',
        description: 'Built a campus resource-sharing tool in 24 hours with a team of 4.',
        date: 'Aug 2026',
        category: 'Runner-up — CodeIO Hackathon 2026',
        isHighlighted: true,
    },
    {
        id: '2',
        title: 'Runner-up — CodeIO Hackathon',
        description: 'Built a campus resource-sharing tool in 24 hours with a team of 4.',
        date: 'Aug 2026',
    },
    {
        id: '3',
        title: 'Speaker — Intro to Machine Learning Workshop',
        description: 'Led a 2-hour peer workshop for 40+ juniors in the CS department.',
        date: 'Jun 2026',
    },
    {
        id: '4',
        title: 'Core member — Coding Club',
        description: 'Organizes weekly DSA practice sessions and onboarding for new members.',
        date: 'Apr 2026 – present',
    },
    {
        id: '5',
        title: 'Top 50 — State-Level Coding Competition',
        description: 'Ranked in the top 50 out of 1,200+ participants in the DSA round.',
        date: 'Feb 2026',
    },
];
export const PEERS = [
    {
        id: '1',
        name: 'Ananya Rao',
        department: 'React · Node.js · MongoDB',
        skills: ['React', 'Node.js', 'MongoDB'],
        matchPercentage: 95,
    },
    {
        id: '2',
        name: 'Rahul Sharma',
        department: 'Python · TensorFlow',
        skills: ['Python', 'TensorFlow'],
        matchPercentage: 90,
    },
    {
        id: '3',
        name: 'Priya Nair',
        department: 'Java · Spring Boot',
        skills: ['Java', 'Spring Boot'],
        matchPercentage: 87,
    },
];
export const PROFILE_COMPLETION = {
    percentage: 75,
    items: [
        { label: 'Profile photo', done: true },
        { label: 'Academic info', done: true },
        { label: 'Skills', done: true },
        { label: 'Resume', done: true },
        { label: 'Certifications', done: false },
        { label: 'Portfolio', done: false },
    ],
};
export const SOCIAL_LINKS = {
    github: '#',
    linkedin: '#',
    portfolio: '#',
    resume: '#',
};
export const ACTIVITIES = [
    {
        id: '1',
        title: 'Uploaded a resource — DBMS Notes.pdf',
        time: 'Today, 9:40 AM',
    },
    {
        id: '2',
        title: 'Joined the study group Gradient Descent',
        time: 'Yesterday, 6:15 PM',
    },
    {
        id: '3',
        title: 'Added a certification — Full-Stack Web Development',
        time: '2 days ago',
    },
    {
        id: '4',
        title: 'Updated the project Campus Navigator App',
        time: '3 days ago',
    },
    {
        id: '5',
        title: 'Connected with Rahul Sharma',
        time: '4 days ago',
    },
];
export const PROFILE_STATS = {
    connections: 24,
    studyGroups: 8,
    projects: 5,
    resources: 14,
};
export const ACADEMIC_BATCH = '2025 – 2029';
