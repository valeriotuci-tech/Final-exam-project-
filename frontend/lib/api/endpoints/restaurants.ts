import { apiClient, apiRequest } from "../client";

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  location?: string;
  cuisineType?: string;
  imageUrl?: string;
  createdAt?: string;
}

export const restaurantsApi = {
  list() {
    return apiRequest<Restaurant[]>(() => apiClient.get("/api/restaurants"));
  },
  getById(id: string) {
    return apiRequest<Restaurant>(() => apiClient.get(`/api/restaurants/${id}`));
  },
  create(data: Partial<Restaurant>) {
    return apiRequest<Restaurant>(() => apiClient.post("/api/restaurants", data));
  },
  update(id: string, data: Partial<Restaurant>) {
    return apiRequest<Restaurant>(() => apiClient.put(`/api/restaurants/${id}`, data));
  },
  remove(id: string) {
    return apiRequest<{ success: boolean }>(() => apiClient.delete(`/api/restaurants/${id}`));
  }
};
