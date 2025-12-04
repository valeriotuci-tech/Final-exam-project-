"use client";

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? "https://r11-production.up.railway.app" 
    : "http://localhost:4000");
const isDev = process.env.NODE_ENV !== "production";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];

function enqueueRefresh(cb: () => void) {
  refreshQueue.push(cb);
}

function flushRefreshQueue() {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
}

apiClient.interceptors.request.use((config) => {
  if (isDev) {
    // Lightweight logging in dev
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log("[API] Response", response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (isDev) {
      console.error("[API] Error", error?.response?.status, originalRequest?.url);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await apiClient.post("/api/auth/refresh");
          isRefreshing = false;
          flushRefreshQueue();
        } catch (refreshError) {
          isRefreshing = false;
          // Let callers handle final auth failure (e.g. logout)
          throw refreshError;
        }
      }

      // Queue this request until refresh completes
      await new Promise<void>((resolve) => enqueueRefresh(resolve));
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export async function apiRequest<T>(
  fn: () => Promise<{ data: T }>
): Promise<T> {
  try {
    const res = await fn();
    return res.data;
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || "Unexpected API error";
    throw new Error(message);
  }
}
