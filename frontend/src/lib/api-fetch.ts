import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Authenticated fetch wrapper that automatically adds JWT token to requests
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    // Get JWT token from better-auth (if available)
    let token: string | null = null;
    try {
      const result = await authClient.token();
      token = result && typeof result === "object" && "token" in result
        ? (result as { token: string }).token
        : typeof result === "string"
          ? result
          : null;
    } catch {
      // No session available - this is OK for public endpoints
    }
    
    // Merge headers
    const headers = new Headers(options.headers);
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
    
    return response;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Helper function for GET requests
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Helper function for POST requests
 */
export async function apiPost<T>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers);
  
  // Only set Content-Type if not FormData
  if (!(data instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  const response = await authenticatedFetch(url, {
    method: "POST",
    headers,
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }
  
  return response.json();
}

/**
 * Helper function for PUT requests
 */
export async function apiPut<T>(
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers);
  
  if (!(data instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  const response = await authenticatedFetch(url, {
    method: "PUT",
    headers,
    body: data instanceof FormData ? data : JSON.stringify(data),
    ...options,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }
  
  return response.json();
}

/**
 * Helper function for DELETE requests
 */
export async function apiDelete<T>(url: string): Promise<T> {
  const response = await authenticatedFetch(url, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
