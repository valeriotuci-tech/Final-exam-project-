"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/api/client";

interface Campaign {
  id: string;
  title: string;
  description: string;
  target_amount: string;
  current_amount: string;
  status: string;
  start_date: string;
  end_date: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await apiClient.get("/api/campaigns");
        setCampaigns(response.data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-400">Loading campaigns...</div>
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
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <p className="mt-1 text-sm text-slate-400">
          Browse active crowdfunding campaigns
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-sm text-slate-400">No campaigns found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => {
            const progress = (parseFloat(campaign.current_amount) / parseFloat(campaign.target_amount)) * 100;
            
            return (
              <div
                key={campaign.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold">{campaign.title}</h3>
                  <span className="rounded-full bg-amber-600/10 px-2 py-0.5 text-xs font-medium text-amber-600 ring-1 ring-amber-500/40">
                    {campaign.status}
                  </span>
                </div>
                
                <p className="mb-4 line-clamp-2 text-sm text-slate-400">
                  {campaign.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-amber-600"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>${parseFloat(campaign.current_amount).toLocaleString()} raised</span>
                    <span>of ${parseFloat(campaign.target_amount).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/campaigns/${campaign.id}`)}
                  className="mt-4 w-full rounded-lg bg-amber-600/10 px-4 py-2 text-sm font-medium text-amber-600 ring-1 ring-amber-500/40 hover:bg-amber-600/20 transition-colors"
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-amber-500/20 bg-amber-600/5 p-4 text-sm">
        <p className="text-amber-600">
          ✅ Loaded {campaigns.length} campaigns from Railway PostgreSQL database
        </p>
      </div>
    </div>
  );
}
