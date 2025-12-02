"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { restaurantsApi, type Restaurant } from "../api/endpoints/restaurants";

export function useRestaurant(id: string) {
  return useQuery<Restaurant>({
    queryKey: ["restaurant", id],
    queryFn: () => restaurantsApi.getById(id),
    enabled: !!id
  });
}

export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: () => restaurantsApi.list()
  });
}

export function useRestaurantMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Restaurant>) => restaurantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    }
  });

  return {
    createRestaurant: createMutation.mutateAsync,
    creatingRestaurant: createMutation.isLoading
  };
}
