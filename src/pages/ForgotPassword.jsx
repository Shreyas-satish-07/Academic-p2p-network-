import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import AuthLayout from '../features/auth/components/AuthLayout';
import { ROUTES } from '../constants/routes';

/**
 * ForgotPassword Page
 * Retains frontend-only informational behavior for now with email validation and success instructions.
 * NOTE: Real backend endpoint (POST /api/auth/forgot-password) will be connected in a later phase.
 */
export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide your university or personal email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email format.');
      return;
    }

    setIsSubmitting(true);
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <header className="auth-header">
        <h1 className="auth-header-title">Forgot your password?</h1>
        <p className="auth-header-subtitle">
          Enter the email associated with your Cohort account and we’ll send you password recovery instructions.
        </p>
      </header>

      {isSubmitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} role="status">
          <div className="auth-alert-banner success">
            <CheckCircle2 size={18} className="flex-shrink-0" aria-hidden="true" />
            <div>
              <strong>Recovery email dispatched!</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                If an account exists for <strong>{email}</strong>, a reset link has been sent with instructions.
              </p>
            </div>
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
            Did not receive an email? Check your university spam or junk folders, or try another registered email address.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {/* Direct convenience link to reset password testing */}
            <Link
              to={ROUTES.RESET_PASSWORD}
              className="auth-submit-btn"
              style={{ textDecoration: 'none' }}
            >
              <span>Proceed to Reset Password</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <button
              type="button"
              className="auth-demo-fill-btn"
              style={{ textAlign: 'center', marginTop: '6px' }}
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Try another email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form-group">
            <label htmlFor="forgot-email" className="auth-form-label">
              Registered Email Address *
            </label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              className={`auth-form-input ${error ? 'error' : ''}`}
              placeholder="e.g. shreyas@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              autoComplete="email"
              required
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'forgot-email-error' : undefined}
            />
            {error && (
              <span id="forgot-email-error" className="auth-form-error" role="alert">
                {error}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
            aria-label={isSubmitting ? 'Sending recovery link...' : 'Send reset link'}
          >
            <Mail size={16} aria-hidden="true" />
            <span>{isSubmitting ? 'Sending link...' : 'Send Reset Link'}</span>
          </button>
        </form>
      )}

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

export default ForgotPassword;
