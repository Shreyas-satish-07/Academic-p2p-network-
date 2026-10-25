import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/useAuth';
import { ROUTES } from '../../../constants/routes';

/**
 * ProtectedRoute component
 * Route guard that ensures only authenticated users can access child views.
 * If authentication state is still hydrating, displays a clean loading state.
 * If not authenticated, redirects to /login and saves current location in route state.
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--paper, #f8fafc)',
          color: 'var(--ink, #1e293b)',
          gap: '12px',
          fontFamily: 'inherit',
        }}
        role="status"
        aria-live="polite"
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(47, 93, 80, 0.2)',
            borderTopColor: 'var(--pine, #2f5d50)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
          aria-hidden="true"
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink-soft)' }}>
          Verifying session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

/**
 * PublicRoute component
 * Redirects already logged-in users away from auth pages (Login, Register) straight to Dashboard.
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
