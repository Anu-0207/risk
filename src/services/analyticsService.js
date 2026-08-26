import api from './api.js';

export const analyticsService = {
  async getAnalytics() {
    const response = await api.get('/api/analytics');
    return response.data;
  },
};

export default analyticsService;
