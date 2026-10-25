import axios from 'axios';

/**
 * Axios API client instance for Cohort
 * Pre-configured with base URL, token authorization interceptor,
 * and 401 unauthorized session cleanup.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization header if cohort_token exists
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('cohort_token') ||
      sessionStorage.getItem('cohort_token');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user from both storage mechanisms
      localStorage.removeItem('cohort_token');
      localStorage.removeItem('cohort_user');
      sessionStorage.removeItem('cohort_token');
      sessionStorage.removeItem('cohort_user');
      // Do not force a hard browser redirect (window.location) inside interceptor;
      // React state and ProtectedRoute handle route navigation gracefully.
    }
    return Promise.reject(error);
  }
);

export default api;
export { api };
