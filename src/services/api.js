// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Service methods
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  requestOTP: (email) => api.post('/auth/request-otp', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
};

export const riceService = {
  getAll: (filters) => api.get('/rice', { params: filters }),
  getById: (id) => api.get(`/rice/${id}`),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (riceId, quantity) => api.post('/cart', { riceId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
};

export const orderService = {
  create: (items) => api.post('/orders', { items }),
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
};

export const contactService = {
  submit: (data) => api.post('/contact', data),
};

export const aiHelpService = {
  query: (query) => api.post('/ai-help', { query }),
};

export default api;
