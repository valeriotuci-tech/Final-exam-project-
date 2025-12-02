import { apiClient, apiRequest } from "../client";
import type { AuthUser } from "./auth";

export const usersApi = {
  me() {
    return apiRequest<AuthUser>(() => apiClient.get("/api/users/me"));
  },
  updateMe(data: Partial<AuthUser>) {
    return apiRequest<AuthUser>(() => apiClient.put("/api/users/me", data));
  }
};
