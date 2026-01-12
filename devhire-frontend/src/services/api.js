import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
api.interceptors.request.use(
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
// Add interceptors if needed later
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);