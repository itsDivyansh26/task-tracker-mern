import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://task-tracker-backend-ipdm.onrender.com/api";

export const api = {

  register: async (userData) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      userData
    );
    return response.data;
  },

  login: async (userData) => {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      userData
    );
    return response.data;
  },

  getTasks: async (filters = {}) => {
    const token = localStorage.getItem("token");

    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        params[key] = filters[key];
      }
    });

    const response = await axios.get(`${API_BASE_URL}/tasks`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  createTask: async (taskData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_BASE_URL}/tasks`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  updateTask: async (id, taskData) => {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_BASE_URL}/tasks/${id}`,
      taskData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  deleteTask: async (id) => {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${API_BASE_URL}/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default api;