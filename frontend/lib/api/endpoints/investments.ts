import { apiClient, apiRequest } from "../client";

export interface Investment {
  id: string;
  userId: string;
  campaignId: string;
  amount: number;
  rewardTier?: string;
  status: string;
  createdAt: string;
}

export const investmentsApi = {
  create(data: { campaignId: string; amount: number; rewardTier?: string }) {
    return apiRequest<Investment>(() => apiClient.post("/api/investments", data));
  },
  mine() {
    return apiRequest<Investment[]>(() => apiClient.get("/api/investments/me"));
  }
};
