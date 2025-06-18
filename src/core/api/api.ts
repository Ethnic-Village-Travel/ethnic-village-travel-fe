import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { API_ROOT, TIMEOUT } from './config';

const instance = axios.create({
  baseURL: API_ROOT + '/api',
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export function setDefaultHeaders(headers: Record<string, string>): void {
  Object.keys(headers).forEach(key => {
    instance.defaults.headers.common[key] = headers[key];
  });
}

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore.getState();
    if (authStore.accessToken) {
      config.headers.Authorization = `${authStore.tokenType} ${authStore.accessToken}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (!error.response) {
      // Network error
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        error: 'NETWORK_ERROR',
        statusCode: 0,
      });
    }

    // Handle unauthorized access
    if (error.response.status === 401) {
      const authStore = useAuthStore.getState();
      authStore.logout();
    }

    return Promise.reject(error.response.data);
  },
);

export default instance;
