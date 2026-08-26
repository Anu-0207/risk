import api from './api.js';

export const scanService = {
  async analyzeRisk(input) {
    const response = await api.post('/api/analyze-risk', { input });
    return response.data;
  },

  async getScans() {
    const response = await api.get('/api/scans');
    return response.data.scans || [];
  },

  async getScanById(id) {
    const response = await api.get(`/api/scans/${id}`);
    return response.data.scan;
  },

  async deleteScan(id) {
    const response = await api.delete(`/api/scans/${id}`);
    return response.data;
  },

  async updateRecommendation(scanId, recId, resolved) {
    const response = await api.patch(`/api/scans/${scanId}/recommendations/${recId}`, { resolved });
    return response.data.scan;
  },

  async updateThreatStatus(scanId, threatId, status) {
    const response = await api.patch(`/api/scans/${scanId}/threats/${threatId}`, { status });
    return response.data.scan;
  },
};

export default scanService;
