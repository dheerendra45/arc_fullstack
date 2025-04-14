// src/services/AuthService.js
import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

export default {
  verifyToken: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  logout: () => {
    return Promise.resolve();
  }
};