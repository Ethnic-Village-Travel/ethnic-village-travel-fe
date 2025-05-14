import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { API_ROOT, TIMEOUT } from './config';

const instance = axios.create({
  baseURL: API_ROOT,
  timeout: TIMEOUT,
  headers: {},
});

export function setDefaultHeaders(headers: Record<string, string>): void {
  Object.keys(headers).forEach(key => {
    instance.defaults.headers.common[key] = headers[key];
  });
}

// Request interceptor
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
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
    // Handle unauthorized access
    if (error?.response?.status === 401) {
      // Implement your authentication failure logic here
      // Example:
      // deleteCookie("auth_access_token");
      // router.push("/login");
    }

    return Promise.reject(error);
  },
);

export default instance;
