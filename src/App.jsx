import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PeerMatch from './pages/PeerMatch';
import StudyGroups from './pages/StudyGroups';
import CollaborationWorkspace from './pages/CollaborationWorkspace';
import Resources from './pages/Resources';
import Projects from './pages/Projects';
import Discussions from './pages/Discussions';
import { ROUTES } from './constants/routes';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.HOME} element={<DashboardPage />} />
        <Route path="/old-dashboard" element={<Dashboard />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.PEER_MATCH} element={<PeerMatch />} />
        <Route path={ROUTES.PEERS} element={<PeerMatch />} />
        <Route path={ROUTES.STUDY_GROUPS} element={<StudyGroups />} />
        <Route path={ROUTES.MESSAGES} element={<CollaborationWorkspace />} />
        <Route path={ROUTES.RESOURCES} element={<Resources />} />
        <Route path={ROUTES.PROJECTS} element={<Projects />} />
        <Route path={ROUTES.DISCUSSIONS} element={<Discussions />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
