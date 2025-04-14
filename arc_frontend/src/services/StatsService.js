import api from './api';

const StatsService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');

      // Add debug logging
      console.log('StatsService response:', response);

      // Ensure we return the data property from the response
      return {
        data: response.data.data || response.data // Handle both nested and direct responses
      };
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  }
};

export default StatsService;