import axios, { AxiosInstance } from "axios";
import { authClient } from "./auth-client";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  withCredentials: true,
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(async (config) => {
  const { data, error } = await authClient.token();

  if (data) {
    config.headers.Authorization = `Bearer ${data.token}`;
  }
  if (error) {
    console.error("Failed to get auth token:", error);
  }

  // Let Axios set multipart boundary automatically for FormData.
  // Only force JSON for plain object payloads.
  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
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
