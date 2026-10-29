import { io } from 'socket.io-client';

let socketInstance = null;

/**
 * Get socket server host URL from environment or default to backend host
 */
const getSocketServerUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

/**
 * Connect to Socket.io server with JWT authentication
 * @param {string} token - Student's Bearer JWT
 * @returns {Socket} - Active Socket.io client instance
 */
export const connectSocket = (token) => {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  // Disconnect any stale or disconnected instance
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  const socketUrl = getSocketServerUrl();

  socketInstance = io(socketUrl, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  socketInstance.on('connect', () => {
    // Socket connected
  });

  socketInstance.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  socketInstance.on('disconnect', () => {
    // Socket disconnected
  });

  return socketInstance;
};

/**
 * Retrieve the current socket client instance
 * @returns {Socket|null}
 */
export const getSocket = () => {
  return socketInstance;
};

/**
 * Disconnect socket and cleanup session
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default {
  connectSocket,
  getSocket,
  disconnectSocket,
};
