import axios from 'axios';

/**
 * Axios API client instance for Cohort frontend.
 * Preconfigured with baseURL and request/response interceptors.
 * In production or development with Express backend, set VITE_API_BASE_URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token when authentication is configured
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cohort_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Uniform error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // E.g., redirect to login on 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - session may have expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
