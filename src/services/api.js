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

/**
 * Study Groups API client methods
 */
export const studyGroupApi = {
  getGroups: (params) => api.get('/study-groups', { params }),
  getGroupById: (id) => api.get(`/study-groups/${id}`),
  createGroup: (data) => api.post('/study-groups', data),
  updateGroup: (id, data) => api.patch(`/study-groups/${id}`, data),
  deleteGroup: (id) => api.delete(`/study-groups/${id}`),
  joinGroup: (id) => api.post(`/study-groups/${id}/join`),
  leaveGroup: (id) => api.post(`/study-groups/${id}/leave`),
};

/**
 * Learning Resources API client methods
 */
export const resourceApi = {
  getResources: (params) => api.get('/resources', { params }),
  getResourceById: (id) => api.get(`/resources/${id}`),
  createResource: (data) => api.post('/resources', data),
  updateResource: (id, data) => api.patch(`/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),
  likeResource: (id) => api.post(`/resources/${id}/like`),
  saveResource: (id) => api.post(`/resources/${id}/save`),
  viewResource: (id) => api.post(`/resources/${id}/view`),
};

/**
 * Discussions API client methods
 */
export const discussionApi = {
  getDiscussions: (params) => api.get('/discussions', { params }),
  getDiscussionById: (id) => api.get(`/discussions/${id}`),
  createDiscussion: (data) => api.post('/discussions', data),
  updateDiscussion: (id, data) => api.patch(`/discussions/${id}`, data),
  deleteDiscussion: (id) => api.delete(`/discussions/${id}`),
  voteDiscussion: (id) => api.post(`/discussions/${id}/vote`),
  viewDiscussion: (id) => api.post(`/discussions/${id}/view`),
  addAnswer: (id, data) => api.post(`/discussions/${id}/answers`, data),
  updateAnswer: (id, answerId, data) => api.patch(`/discussions/${id}/answers/${answerId}`, data),
  deleteAnswer: (id, answerId) => api.delete(`/discussions/${id}/answers/${answerId}`),
  voteAnswer: (id, answerId) => api.post(`/discussions/${id}/answers/${answerId}/vote`),
  acceptAnswer: (id, answerId) => api.post(`/discussions/${id}/answers/${answerId}/accept`),
};

/**
 * User & Peer Discovery API client methods
 */
export const userApi = {
  getUsers: (params) => api.get('/users', { params }),
  getMe: () => api.get('/users/me'),
  getUserById: (id) => api.get(`/users/${id}`),
};

/**
 * Direct & Collaboration Messaging API client methods
 */
export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  createDirectConversation: (recipientId) =>
    api.post('/messages/conversations/direct', { recipientId }),
  getConversationById: (conversationId) =>
    api.get(`/messages/conversations/${conversationId}`),
  getMessages: (conversationId, params) =>
    api.get(`/messages/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, content) =>
    api.post(`/messages/conversations/${conversationId}/messages`, { content }),
  markAsRead: (conversationId) =>
    api.post(`/messages/conversations/${conversationId}/read`),
};

