"use client";

import { QueryClient } from "@tanstack/react-query";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? "https://r11-production.up.railway.app" 
    : "http://localhost:4000");

export const queryClient = new QueryClient();

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return (await res.json()) as T;
}

// Auth
export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken?: string;
    refreshToken?: string;
  };
}

export const api = {
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  register: (data: { email: string; password: string; name: string }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  logout: () =>
    request<{}>("/api/auth/logout", {
      method: "POST"
    }),
  refresh: () => request<AuthResponse>("/api/auth/refresh", { method: "POST" }),

  // Campaigns
  getCampaigns: () => request<any[]>("/api/campaigns"),
  getCampaignById: (id: string) => request<any>(`/api/campaigns/${id}`),
  createCampaign: (data: any) =>
    request<any>("/api/campaigns", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  // Investments
  createInvestment: (data: any) =>
    request<any>("/api/investments", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  getMyInvestments: () => request<any[]>("/api/investments/me"),

  // Restaurants
  createRestaurant: (data: any) =>
    request<any>("/api/restaurants", {
      method: "POST",
      body: JSON.stringify(data)
    })
};
