"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api/client";

interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  cuisine_type: string;
  image_url?: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await apiClient.get("/api/restaurants");
        setRestaurants(response.data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-400">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 ring-1 ring-red-500/40">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Restaurants</h1>
        <p className="mt-1 text-sm text-slate-400">
          Discover restaurants on the platform
        </p>
      </div>

      {restaurants.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-sm text-slate-400">No restaurants found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700"
            >
              <div className="mb-3">
                <h3 className="font-semibold">{restaurant.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-300 ring-1 ring-amber-500/40">
                    {restaurant.cuisine_type}
                  </span>
                  {restaurant.location && (
                    <span className="text-slate-500">{restaurant.location}</span>
                  )}
                </div>
              </div>
              
              <p className="line-clamp-3 text-sm text-slate-400">
                {restaurant.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
