import axios from 'axios';
import { getToken, removeAuth } from '../utils/auth.js';

// In full-stack Express + Vite setups, the backend and frontend run on the same server/port.
// Using relative URL '' ensures all API calls hit /api routes on the current origin.
const rawBaseURL = import.meta.env.VITE_API_URL || '';
const isLocalhostMisconfig = rawBaseURL.includes('localhost:') || rawBaseURL.includes('127.0.0.1:');
const isRunningRemotely = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// If running in cloud preview or non-localhost, avoid hardcoded localhost:5000 URLs
const baseURL = (isLocalhostMisconfig && isRunningRemotely) ? '' : rawBaseURL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Catch 401 unauthenticated errors and safely clear session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if checking auth or on login/register pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        removeAuth();
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
