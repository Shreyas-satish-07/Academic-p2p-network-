import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import Profile from './pages/Profile';
import PeerMatch from './pages/PeerMatch';
import StudyGroups from './pages/StudyGroups';
import CollaborationWorkspace from './pages/CollaborationWorkspace';
import Resources from './pages/Resources';
import Projects from './pages/Projects';
import Discussions from './pages/Discussions';

// Authentication Pages & Guards
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ProtectedRoute, PublicRoute } from './features/auth/components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ROUTES } from './constants/routes';

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Authentication Routes (Redirect to /dashboard if logged in) */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

            {/* Protected Product Routes (Require active authentication) */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.HOME}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PEER_MATCH}
            element={
              <ProtectedRoute>
                <PeerMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PEERS}
            element={
              <ProtectedRoute>
                <PeerMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDY_GROUPS}
            element={
              <ProtectedRoute>
                <StudyGroups />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MESSAGES}
            element={
              <ProtectedRoute>
                <CollaborationWorkspace />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.RESOURCES}
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROJECTS}
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DISCUSSIONS}
            element={
              <ProtectedRoute>
                <Discussions />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
