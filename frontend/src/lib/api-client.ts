import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { authClient } from "./auth-client";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get JWT token from better-auth (if available)
      // If no session, token() will return null/undefined, which is fine for public endpoints
      const token = await authClient.token();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // If no token, continue without Authorization header (for public endpoints)
    } catch (error) {
      // No session available - this is OK for public endpoints
      // Continue without token
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could redirect to login
      console.error("Unauthorized - token may be expired");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
