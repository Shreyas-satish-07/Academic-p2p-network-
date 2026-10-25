import React, { useMemo } from 'react';

/**
 * PasswordStrength component
 * Calculates password complexity and renders a 4-tier visual strength indicator (Weak, Fair, Good, Strong).
 */
export const PasswordStrength = ({ password = '' }) => {
  const analysis = useMemo(() => {
    if (!password) {
      return { score: 0, label: '', levelClass: '', hint: 'Password must be at least 8 characters.' };
    }

    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (len >= 8) score += 1;
    if (hasLower && hasUpper) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial && len >= 10) score += 1;

    // Floor at 1 if password has characters but is short
    if (len > 0 && score === 0) score = 1;

    switch (score) {
      case 1:
        return {
          score: 1,
          label: 'Weak',
          levelClass: 'weak',
          hint: 'Use 8+ characters with uppercase and numbers.',
        };
      case 2:
        return {
          score: 2,
          label: 'Fair',
          levelClass: 'fair',
          hint: 'Add numbers and special characters to strengthen.',
        };
      case 3:
        return {
          score: 3,
          label: 'Good',
          levelClass: 'good',
          hint: 'Solid password! Add a special symbol for maximum protection.',
        };
      case 4:
      default:
        return {
          score: 4,
          label: 'Strong',
          levelClass: 'strong',
          hint: 'Excellent password strength.',
        };
    }
  }, [password]);

  if (!password) return null;

  return (
    <div className="auth-strength-container" aria-live="polite">
      <div className="auth-strength-bars" aria-hidden="true">
        {[1, 2, 3, 4].map((barIndex) => {
          const isFilled = barIndex <= analysis.score;
          return (
            <div
              key={barIndex}
              className={`auth-strength-bar ${isFilled ? `filled ${analysis.levelClass}` : ''}`}
            />
          );
        })}
      </div>

      <div className="auth-strength-label-row">
        <span className={`auth-strength-text ${analysis.levelClass}`}>
          Strength: {analysis.label}
        </span>
        <span className="auth-strength-hint">{analysis.hint}</span>
      </div>
    </div>
  );
};

export default PasswordStrength;
