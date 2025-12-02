"use client";

import { useQuery } from "@tanstack/react-query";
import { campaignsApi, type Campaign, type CampaignFilters } from "../api/endpoints/campaigns";

export function useCampaign(id: string) {
  return useQuery<Campaign>({
    queryKey: ["campaign", id],
    queryFn: () => campaignsApi.getById(id),
    enabled: !!id
  });
}

export function useCampaigns(filters?: CampaignFilters) {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns", filters],
    queryFn: () => campaignsApi.list(filters)
  });
}
