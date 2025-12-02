import { apiClient, apiRequest } from "../client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export const authApi = {
  login(data: { email: string; password: string }) {
    return apiRequest<AuthResponse>(() => apiClient.post("/api/auth/login", data));
  },
  register(data: { name: string; email: string; password: string }) {
    return apiRequest<AuthResponse>(() => apiClient.post("/api/auth/register", data));
  },
  logout() {
    return apiRequest<{}>(() => apiClient.post("/api/auth/logout"));
  },
  refresh() {
    return apiRequest<AuthResponse>(() => apiClient.post("/api/auth/refresh"));
  }
};
