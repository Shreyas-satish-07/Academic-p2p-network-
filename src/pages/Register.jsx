import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import AuthLayout from '../features/auth/components/AuthLayout';
import PasswordInput from '../features/auth/components/PasswordInput';
import PasswordStrength from '../features/auth/components/PasswordStrength';
import { useAuth } from '../context/useAuth';
import {
  COLLEGE_OPTIONS,
  DEPARTMENT_OPTIONS,
  SEMESTER_OPTIONS,
} from '../features/auth/authData';
import { ROUTES } from '../constants/routes';

/**
 * Register Page
 * Multi-field registration form capturing student academic details,
 * real-time password strength meter, and validation.
 */
export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: COLLEGE_OPTIONS[0],
    department: DEPARTMENT_OPTIONS[0],
    semester: '6th Semester',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email format.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.college) {
      errs.college = 'Please choose your college or university.';
    }

    if (!formData.department) {
      errs.department = 'Please choose your department / branch.';
    }

    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the student code of conduct.';
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
      const result = await register(formData);
      if (result.success) {
        // Redirect to profile so student can customize their bio and skills
        navigate(ROUTES.PROFILE, { replace: true });
      } else {
        setFormError(result.error || 'Failed to create account. Please try again.');
      }
    } catch {
      setFormError('An unexpected network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <header className="auth-header">
        <h1 className="auth-header-title">Create student account</h1>
        <p className="auth-header-subtitle">
          Join your college cohort to discover project teammates and study circles.
        </p>
      </header>

      {formError && (
        <div className="auth-alert-banner error" role="alert">
          <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {/* Full Name */}
        <div className="auth-form-group">
          <label htmlFor="reg-name" className="auth-form-label">
            Full Name *
          </label>
          <input
            id="reg-name"
            name="name"
            type="text"
            className={`auth-form-input ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="auth-form-error">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="auth-form-group">
          <label htmlFor="reg-email" className="auth-form-label">
            College / Personal Email *
          </label>
          <input
            id="reg-email"
            name="email"
            type="email"
            className={`auth-form-input ${errors.email ? 'error' : ''}`}
            placeholder="rahul.sharma@example.edu"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="auth-form-error">{errors.email}</span>}
        </div>

        {/* Password & Strength */}
        <div className="auth-form-group">
          <label htmlFor="reg-password" className="auth-form-label">
            Password (minimum 8 characters) *
          </label>
          <PasswordInput
            id="reg-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            placeholder="Create a strong password"
            autoComplete="new-password"
            required
          />
          <PasswordStrength password={formData.password} />
          {errors.password && <span className="auth-form-error">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className="auth-form-group">
          <label htmlFor="reg-confirm-password" className="auth-form-label">
            Confirm Password *
          </label>
          <PasswordInput
            id="reg-confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            placeholder="Repeat password"
            autoComplete="new-password"
            required
          />
          {errors.confirmPassword && (
            <span className="auth-form-error">{errors.confirmPassword}</span>
          )}
        </div>

        {/* College & Department */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          <div className="auth-form-group">
            <label htmlFor="reg-college" className="auth-form-label">
              College / University *
            </label>
            <select
              id="reg-college"
              name="college"
              className="auth-form-select"
              value={formData.college}
              onChange={handleChange}
            >
              {COLLEGE_OPTIONS.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="auth-form-group">
              <label htmlFor="reg-dept" className="auth-form-label">
                Department *
              </label>
              <select
                id="reg-dept"
                name="department"
                className="auth-form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-form-group">
              <label htmlFor="reg-sem" className="auth-form-label">
                Current Semester *
              </label>
              <select
                id="reg-sem"
                name="semester"
                className="auth-form-select"
                value={formData.semester}
                onChange={handleChange}
              >
                {SEMESTER_OPTIONS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="auth-form-group">
          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              style={{ accentColor: 'var(--pine, #2f5d50)' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--ink)' }}>
              I agree to the Cohort academic collaboration terms and student code of conduct.
            </span>
          </label>
          {errors.agreeTerms && (
            <span className="auth-form-error">{errors.agreeTerms}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Creating account...' : 'Create student account'}
        >
          <UserPlus size={16} aria-hidden="true" />
          <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
        </button>
      </form>

      <p className="auth-footer-prompt">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="auth-link">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
