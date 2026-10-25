import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, KeyRound } from 'lucide-react';
import AuthLayout from '../features/auth/components/AuthLayout';
import PasswordInput from '../features/auth/components/PasswordInput';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../constants/routes';

/**
 * Login Page
 * Split-screen login interface with email/password validation, demo account auto-fill,
 * remember me toggle, and accessible error handling.
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  // Destination after login (e.g. if redirected by ProtectedRoute)
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setFormError(result.error || 'Invalid email or password.');
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('shreyas@example.com');
    setPassword('password123');
    setErrors({});
    setFormError('');
  };

  return (
    <AuthLayout>
      <header className="auth-header">
        <h1 className="auth-header-title">Welcome back</h1>
        <p className="auth-header-subtitle">
          Sign in to your Cohort account to access your study groups, teams, and discussions.
        </p>
      </header>

      {formError && (
        <div className="auth-alert-banner error" role="alert">
          <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Email Field */}
        <div className="auth-form-group">
          <label htmlFor="login-email" className="auth-form-label">
            University / Personal Email *
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            className={`auth-form-input ${errors.email ? 'error' : ''}`}
            placeholder="shreyas@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
          {errors.email && (
            <span id="login-email-error" className="auth-form-error" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="auth-form-group">
          <div className="auth-form-label">
            <label htmlFor="login-password">Password *</label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="auth-link" style={{ fontSize: '11.5px' }}>
              Forgot password?
            </Link>
          </div>

          <PasswordInput
            id="login-password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={Boolean(errors.password)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            aria-describedby={errors.password ? 'login-password-error' : undefined}
          />
          {errors.password && (
            <span id="login-password-error" className="auth-form-error" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        {/* Remember Me */}
        <div className="auth-options-row">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--pine, #2f5d50)' }}
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Signing in...' : 'Sign in to Cohort'}
        >
          <LogIn size={16} aria-hidden="true" />
          <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>

      {/* Demo Account Box */}
      <div className="auth-demo-card" aria-label="Demo login credentials">
        <div className="auth-demo-header">
          <span className="auth-demo-tag">
            <KeyRound size={12} aria-hidden="true" />
            Quick Demo Account
          </span>
          <button
            type="button"
            className="auth-demo-fill-btn"
            onClick={handleFillDemo}
            aria-label="Auto-fill demo credentials"
          >
            Auto-fill
          </button>
        </div>
        <div className="auth-demo-credentials">
          <span>Email: <strong>shreyas@example.com</strong></span>
          <span>Password: <strong>password123</strong></span>
        </div>
      </div>

      {/* Footer Switcher */}
      <p className="auth-footer-prompt">
        New to Cohort?{' '}
        <Link to={ROUTES.REGISTER} className="auth-link">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
