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
      const result = await authClient.token();
      const token = result && typeof result === "object" && "token" in result
        ? (result as { token: string }).token
        : typeof result === "string"
          ? result
          : null;

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
