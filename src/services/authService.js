import api from './api.js';
import { setToken, setUser, removeAuth } from '../utils/auth.js';

export const authService = {
  async register(data) {
    const response = await api.post('/api/auth/register', data);
    if (response.data.token && response.data.user) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },

  async login(data) {
    const response = await api.post('/api/auth/login', data);
    if (response.data.token && response.data.user) {
      setToken(response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      // Clean up locally regardless
    } finally {
      removeAuth();
    }
  },

  async getProfile() {
    const response = await api.get('/api/profile');
    if (response.data.user) {
      setUser(response.data.user);
    }
    return response.data.user;
  },

  async updateProfile(data) {
    const response = await api.put('/api/profile', data);
    if (response.data.user) {
      setUser(response.data.user);
    }
    return response.data.user;
  },

  async updatePassword(data) {
    const response = await api.put('/api/profile/password', data);
    return response.data;
  },
};

export default authService;
