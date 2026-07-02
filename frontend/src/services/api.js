import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const client = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to inject JWT from localStorage
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const api = {
  // Auth Services
  login: async (credentials) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await client.post('/auth/register', userData);
    return response.data;
  },

  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },

  // Task Services
  getTasks: async (filters = {}) => {
    // Clean up empty filters
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params[key] = filters[key];
      }
    });

    const response = await client.get('/tasks', { params });
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await client.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await client.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await client.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
