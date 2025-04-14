// Updated UserService.js
import api from './api';

const UserService = {
  setAuthHeader: (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Get all users with pagination support
   * @param {Object} params - Pagination and filtering parameters
   * @param {number} params.page - Current page number (default: 1)
   * @param {number} params.limit - Items per page (default: 10)
   * @param {string} params.role - Filter by role (optional)
   * @param {string} params.search - Search term (optional)
   * @returns {Promise} Resolves with paginated user data
   */
  getAllUsers: async (params = {}) => {
    try {
      // Default pagination values
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        ...params
      };

      // Remove undefined parameters
      Object.keys(queryParams).forEach(key =>
        queryParams[key] === undefined && delete queryParams[key]
      );

      console.log('Fetching users with params:', queryParams);

      const response = await api.get('admin/users', {
        params: queryParams
      });

      // Log the raw response for debugging
      console.log('API response:', response.data);

      // Validate response structure
      if (!response.data) {
        throw new Error('Invalid response data structure');
      }

      // Get the actual data structure based on your backend response
      // Your backend seems to return { users: [...], meta: {...} }
      const users = response.data.users || [];
      const meta = response.data.meta || {
        total: 0,
        page: queryParams.page,
        limit: queryParams.limit,
        totalPages: 0
      };

      // Ensure required pagination fields exist with default fallbacks
      return {
        users,
        meta: {
          total: meta.total || 0,
          page: meta.page || queryParams.page,
          limit: meta.limit || queryParams.limit,
          totalPages: meta.totalPages || 1
        }
      };
    } catch (error) {
      console.error('Error fetching users:', {
        error,
        params,
        time: new Date().toISOString()
      });

      const errorMessage = error.response?.data?.message ||
                         error.message ||
                         'Failed to fetch users';

      throw new Error(errorMessage);
    }
  },

  // Rest of the code remains the same
  softDeleteUser: async (userId) => {
    try {
      // More comprehensive validation
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid user ID format');
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await api.delete(`admin/users/${userId}`);

      if (!response.data) {
        throw new Error('Invalid server response');
      }

      return response.data;
    } catch (error) {
      console.error('Delete user error:', {
        error,
        userId,
        time: new Date().toISOString()
      });

      const errorMessage = error.response?.data?.message ||
                         error.message ||
                         'Failed to delete user';

      throw new Error(errorMessage);
    }
  },

  getUserStats: async () => {
    try {
      const response = await api.get('admin/users/stats');

      // Validate response structure
      if (!response.data) {
        throw new Error('Invalid stats data received');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user stats');
    }
  }
};

export default UserService;