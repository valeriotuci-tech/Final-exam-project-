"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { investmentsApi, type Investment } from "../api/endpoints/investments";

export function useInvestment() {
  const queryClient = useQueryClient();

  const investmentsQuery = useQuery<Investment[]>({
    queryKey: ["investments", "me"],
    queryFn: () => investmentsApi.mine()
  });

  const createMutation = useMutation({
    mutationFn: (data: { campaignId: string; amount: number; rewardTier?: string }) =>
      investmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", "me"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    }
  });

  return {
    investments: investmentsQuery.data ?? [],
    investmentsLoading: investmentsQuery.isLoading,
    createInvestment: createMutation.mutateAsync,
    creatingInvestment: createMutation.isLoading
  };
}
