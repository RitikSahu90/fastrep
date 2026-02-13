import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hyperlocal-backend-8mjq.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Helper: Safely gets the ID for Provider/Booking requests
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || null;
  } catch (e) { return null; }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/users/login', credentials),
  register: (userData) => api.post('/api/users', userData),
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  },
};

export const userAPI = {
  getProfile: () => api.get(`/api/users/${getUserId()}`),
  getAllUsers: () => api.get('/api/users'),
};

export const providerAPI = {
  getAllProviders: () => api.get('/api/providers'),
  // FIX: This transforms your form data into the User Object Hibernate expects
  createProvider: (data) => api.post('/api/providers', {
    ...data,
    user: { id: getUserId() } 
  }),
};

export const bookingAPI = {
  createBooking: (data) => api.post('/api/bookings', {
    ...data,
    user: { id: getUserId() }
  }),
  getAllBookings: () => api.get('/api/bookings'),
};

export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getSummary: () => api.get('/api/dashboard/summary'),
};

export default api;
