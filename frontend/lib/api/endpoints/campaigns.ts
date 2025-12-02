import { apiClient, apiRequest } from "../client";

export interface Campaign {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  cuisineType?: string;
  location?: string;
}

export interface CampaignFilters {
  cuisine?: string;
  location?: string;
  status?: string;
}

export const campaignsApi = {
  list(filters?: CampaignFilters) {
    return apiRequest<Campaign[]>(() =>
      apiClient.get("/api/campaigns", {
        params: filters
      })
    );
  },
  getById(id: string) {
    return apiRequest<Campaign>(() => apiClient.get(`/api/campaigns/${id}`));
  },
  create(data: Partial<Campaign>) {
    return apiRequest<Campaign>(() => apiClient.post("/api/campaigns", data));
  },
  update(id: string, data: Partial<Campaign>) {
    return apiRequest<Campaign>(() => apiClient.put(`/api/campaigns/${id}`, data));
  },
  remove(id: string) {
    return apiRequest<{ success: boolean }>(() => apiClient.delete(`/api/campaigns/${id}`));
  }
};
