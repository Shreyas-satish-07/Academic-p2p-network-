import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * PasswordInput component
 * Reusable password input with toggleable visibility button and accessible ARIA attributes.
 */
export const PasswordInput = ({
  id = 'password',
  name = 'password',
  value,
  onChange,
  placeholder = '••••••••',
  error = false,
  autoComplete = 'current-password',
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-password-wrap">
      <input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`auth-form-input ${error ? 'error' : ''}`}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        {...props}
      />

      <button
        type="button"
        className="auth-password-toggle-btn"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        tabIndex={0}
      >
        {showPassword ? (
          <EyeOff size={16} aria-hidden="true" />
        ) : (
          <Eye size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
