import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/tasks';

export const api = {
  getTasks: async (filters = {}) => {
    // Clean up empty filters
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params[key] = filters[key];
      }
    });

    const response = await axios.get(API_BASE_URL, { params });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await axios.post(API_BASE_URL, taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  },
};

export default api;
