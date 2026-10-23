import { ROUTES } from './routes';
export const NAVIGATION_GROUPS = [
    {
        label: 'Overview',
        items: [
            { label: 'Dashboard', route: ROUTES.DASHBOARD, iconName: 'Dashboard' },
            { label: 'Profile', route: ROUTES.PROFILE, iconName: 'Profile' },
        ],
    },
    {
        label: 'Connect',
        items: [
            { label: 'Peer Match', route: ROUTES.PEER_MATCH, iconName: 'PeerMatch', badge: '12 new' },
            { label: 'Study Groups', route: ROUTES.STUDY_GROUPS, iconName: 'StudyGroups' },
            { label: 'Messages', route: ROUTES.MESSAGES, iconName: 'Messages' },
        ],
    },
    {
        label: 'Build & learn',
        items: [
            { label: 'Resources', route: ROUTES.RESOURCES, iconName: 'Resources' },
            { label: 'Projects', route: ROUTES.PROJECTS, iconName: 'Projects' },
            { label: 'Discussions', route: ROUTES.DISCUSSIONS, iconName: 'Discussions' },
        ],
    },
];
