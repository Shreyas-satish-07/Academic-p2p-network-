import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, AlertCircle } from 'lucide-react';
import AuthLayout from '../features/auth/components/AuthLayout';
import PasswordInput from '../features/auth/components/PasswordInput';
import PasswordStrength from '../features/auth/components/PasswordStrength';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../constants/routes';

/**
 * ResetPassword Page
 * Allows setting a new secure password with live strength verification
 * and redirects back to Login on success.
 * 
 * NOTE: Password reset retains frontend-only informational behavior for now;
 * real backend endpoint (POST /api/auth/reset-password) will be connected in a later phase.
 */
export const ResetPassword = () => {
  const navigate = useNavigate();
  const { showAuthToast } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};

    if (!password) {
      errs.password = 'New password is required.';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);

    showAuthToast('Password reset successfully! Please sign in with your new password.');
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <AuthLayout>
      <header className="auth-header">
        <h1 className="auth-header-title">Set new password</h1>
        <p className="auth-header-subtitle">
          Choose a strong password to secure your Cohort projects, notes, and direct messages.
        </p>
      </header>

      {formError && (
        <div className="auth-alert-banner error" role="alert">
          <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* New Password */}
        <div className="auth-form-group">
          <label htmlFor="reset-new-password" className="auth-form-label">
            New Password *
          </label>
          <PasswordInput
            id="reset-new-password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={Boolean(errors.password)}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={password} />
          {errors.password && <span className="auth-form-error">{errors.password}</span>}
        </div>

        {/* Confirm New Password */}
        <div className="auth-form-group">
          <label htmlFor="reset-confirm-password" className="auth-form-label">
            Confirm New Password *
          </label>
          <PasswordInput
            id="reset-confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }
            }}
            error={Boolean(errors.confirmPassword)}
            placeholder="Repeat new password"
            autoComplete="new-password"
            required
          />
          {errors.confirmPassword && (
            <span className="auth-form-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Updating password...' : 'Reset password'}
        >
          <KeyRound size={16} aria-hidden="true" />
          <span>{isSubmitting ? 'Updating password...' : 'Reset Password'}</span>
        </button>
      </form>

      <p className="auth-footer-prompt">
        <Link
          to={ROUTES.LOGIN}
          className="auth-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to sign in</span>
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
