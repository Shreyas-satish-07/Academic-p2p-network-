import React, { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './authContextInstance';
import { getStoredSession, saveSession, clearSession } from './authStorage';
import api from '../services/api';
import { disconnectSocket } from '../services/socket';

/**
 * AuthProvider component
 * Provides authentication state, API-driven login, registration,
 * session re-hydration (/api/auth/me), and session termination.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showAuthToast = useCallback((message) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Hydrate session on app mount
  useEffect(() => {
    let isMounted = true;

    const hydrateSession = async () => {
      const { token: savedToken, user: savedUser } = getStoredSession();

      if (!savedToken) {
        if (isMounted) {
          setToken(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        // Verify token with backend /api/auth/me
        const response = await api.get('/auth/me');
        const remoteUser = response.data?.data?.user;

        if (isMounted) {
          const verifiedUser = remoteUser || savedUser;
          setToken(savedToken);
          setUser(verifiedUser);

          // Keep storage cache updated with latest user data from database
          const isPersistent = Boolean(localStorage.getItem('cohort_token'));
          saveSession(savedToken, verifiedUser, isPersistent);
        }
      } catch (err) {
        console.warn('Session verification failed; clearing expired/invalid credentials.', err);
        clearSession();
        disconnectSocket();
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Authenticate student user against Express backend
   */
  const login = async (email, password, rememberMe = true) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const response = await api.post('/auth/login', {
        email: cleanEmail,
        password,
      });

      const { token: authToken, user: authUser } = response.data?.data || {};

      if (!authToken || !authUser) {
        return {
          success: false,
          error: 'Authentication failed. Invalid response structure from server.',
        };
      }

      // Persist to localStorage or sessionStorage based on rememberMe checkbox
      saveSession(authToken, authUser, rememberMe);
      setToken(authToken);
      setUser(authUser);

      showAuthToast(`Welcome back, ${authUser.name}!`);
      return { success: true, user: authUser };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.request
          ? 'Unable to connect to authentication server. Please verify the backend is running.'
          : 'Invalid email or password. Please try again.');

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Register new student user in MongoDB Atlas via Express backend
   */
  const register = async (formData) => {
    try {
      const payload = {
        name: formData.name?.trim(),
        email: formData.email?.trim().toLowerCase(),
        password: formData.password,
        college: formData.college,
        department: formData.department,
        semester: formData.semester,
      };

      const response = await api.post('/auth/register', payload);
      const { token: authToken, user: authUser } = response.data?.data || {};

      if (!authToken || !authUser) {
        return {
          success: false,
          error: 'Registration failed. Invalid response structure from server.',
        };
      }

      // New accounts are persistently saved to localStorage
      saveSession(authToken, authUser, true);
      setToken(authToken);
      setUser(authUser);

      showAuthToast(`Account created! Welcome to Cohort, ${authUser.name}.`);
      return { success: true, user: authUser };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.request
          ? 'Unable to connect to authentication server. Please check your network connection.'
          : 'Failed to create account. Please try again.');

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Terminate student session
   */
  const logout = () => {
    // Attempt backend logout endpoint asynchronously
    api.post('/auth/logout').catch((err) => {
      console.warn('Backend logout notification failed:', err?.message || err);
    });

    // Disconnect active real-time socket connection
    disconnectSocket();

    // Immediately purge client storage and state to prevent UI route bounces
    clearSession();
    setToken(null);
    setUser(null);
    showAuthToast('You have been logged out.');
  };

  /**
   * Update active user profile state and sync with persistent storage
   */
  const updateUser = useCallback((updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData };
      const currentToken =
        token ||
        localStorage.getItem('cohort_token') ||
        sessionStorage.getItem('cohort_token');
      if (currentToken) {
        const isPersistent = Boolean(localStorage.getItem('cohort_token'));
        saveSession(currentToken, merged, isPersistent);
      }
      return merged;
    });
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        showAuthToast,
        toastMessage,
        setUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;