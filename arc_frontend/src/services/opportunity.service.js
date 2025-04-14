import api from './api';

const OpportunityService = {
  getAllOpportunities: async (status = '', page = 1, limit = 10) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page);
      params.append('limit', limit);

      const response = await api.get(`admin/opportunities?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateOpportunityStatus: async (opportunityId, status) => {
    try {
      const response = await api.patch(`admin/opportunity/${opportunityId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Additional methods could be added here
  getOpportunityStats: async () => {
    try {
      const response = await api.get('admin/opportunities/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default OpportunityService;