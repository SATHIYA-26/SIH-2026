import axios from 'axios';

// Base Axios instance configured for future FastAPI endpoints
export const apiClient = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Gateway note: Running with local resilient mock fallback.', error.message);
    return Promise.reject(error);
  }
);
