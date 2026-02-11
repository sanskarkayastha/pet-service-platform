import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { authClient } from "./auth-client";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(async (config) => {
  const {data,error} = await authClient.token();

  if (data) {
    config.headers.Authorization = `Bearer ${data.token}`;
  }
  if(error){
    console.error("Failed to get auth token:", error);
  }

  return config;
});

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
