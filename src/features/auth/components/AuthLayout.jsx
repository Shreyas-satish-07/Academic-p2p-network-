import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import AuthBrandPanel from './AuthBrandPanel';
import { useAuth } from '../../../context/useAuth';
import '../auth.css';

/**
 * AuthLayout component
 * Provides a split-screen desktop layout with brand showcase on the left
 * and centered form card on the right, collapsing cleanly on mobile viewports.
 */
export const AuthLayout = ({ children }) => {
  const { toastMessage } = useAuth();

  return (
    <div className="auth-page-wrapper">
      <div className="auth-split-container">
        {/* Left: Brand Showcase Panel */}
        <AuthBrandPanel />

        {/* Right: Authentication Form Panel */}
        <main className="auth-form-panel">
          <div className="auth-card">
            {children}
          </div>
        </main>
      </div>

      {/* Global Auth Toast */}
      {toastMessage && (
        <div className="auth-toast-notification" role="status" aria-live="polite">
          <CheckCircle2 size={16} className="text-pine flex-shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
