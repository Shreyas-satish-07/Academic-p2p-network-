/**
 * TEMPORARY DEVELOPMENT / DEMO AUTHENTICATION STORAGE
 * 
 * IMPORTANT NOTICE:
 * Client-side browser storage (localStorage / sessionStorage) is used here strictly
 * as a simulated session mechanism for frontend development and offline prototyping.
 * It is NOT claimed to be secure for production use.
 * Passwords are NEVER persisted to browser storage.
 * 
 * Remember-me specification (simulated):
 * - If rememberMe === true: save to localStorage (session survives browser restart).
 * - If rememberMe === false: save to sessionStorage (session ends when browser session/tab closes).
 * - Sessions are cleaned between storages to prevent state collision.
 * 
 * Future Production Backend Architecture:
 * - Express API authentication endpoints with CSRF protection
 * - MongoDB user collection with Mongoose schemas
 * - bcrypt password hashing (salt rounds >= 12)
 * - JWT delivered in secure, HTTP-only, SameSite cookies with server-controlled expiration
 */

export const getStoredSession = () => {
  // 1. Check localStorage first (persistent session when "Remember me" was checked)
  try {
    const localToken = localStorage.getItem('cohort_token');
    const localUserStr = localStorage.getItem('cohort_user');

    if (localToken && localUserStr) {
      const parsedUser = JSON.parse(localUserStr);
      return { token: localToken, user: parsedUser };
    }
  } catch (err) {
    console.warn('Invalid user JSON found in localStorage; safely purging session.', err);
    localStorage.removeItem('cohort_token');
    localStorage.removeItem('cohort_user');
  }

  // 2. If nothing valid in localStorage, check sessionStorage (session-scoped when "Remember me" was unchecked)
  try {
    const sessionToken = sessionStorage.getItem('cohort_token');
    const sessionUserStr = sessionStorage.getItem('cohort_user');

    if (sessionToken && sessionUserStr) {
      const parsedUser = JSON.parse(sessionUserStr);
      return { token: sessionToken, user: parsedUser };
    }
  } catch (err) {
    console.warn('Invalid user JSON found in sessionStorage; safely purging session.', err);
    sessionStorage.removeItem('cohort_token');
    sessionStorage.removeItem('cohort_user');
  }

  return { token: null, user: null };
};

export const saveSession = (token, user, rememberMe = true) => {
  const userStr = JSON.stringify(user);

  if (rememberMe) {
    // Persist in localStorage across browser restarts
    localStorage.setItem('cohort_token', token);
    localStorage.setItem('cohort_user', userStr);

    // Clean sessionStorage to ensure session is never duplicated
    sessionStorage.removeItem('cohort_token');
    sessionStorage.removeItem('cohort_user');
  } else {
    // Keep in sessionStorage only for current browser session (ends when browser/tab closes)
    sessionStorage.setItem('cohort_token', token);
    sessionStorage.setItem('cohort_user', userStr);

    // Clean localStorage
    localStorage.removeItem('cohort_token');
    localStorage.removeItem('cohort_user');
  }
};

export const clearSession = () => {
  localStorage.removeItem('cohort_token');
  localStorage.removeItem('cohort_user');
  sessionStorage.removeItem('cohort_token');
  sessionStorage.removeItem('cohort_user');
};
