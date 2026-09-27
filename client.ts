import axios from 'axios';

// Vite environment variable or proxy fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor for attaching auth tokens if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bv_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Graceful response error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log friendly debug message in development
    if (import.meta.env.DEV) {
      console.warn('[BhoomiVerify API]', error?.message || 'Network error, falling back to local dataset');
    }
    return Promise.reject(error);
  }
);
