"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "../../../lib/api/client";

interface Milestone {
  milestone_id: number;
  campaign_id: number;
  milestone_name: string;
  description: string;
  target_amount_krw: number;
  status?: string;
}

interface CampaignDetail {
  campaign: {
    id: string;
    title: string;
    description: string;
    target_amount: number;
    current_amount: number;
    status: string;
    start_date: string;
    end_date: string;
    restaurant_id: string;
  };
  restaurant: {
    name: string;
    cuisine_type: string;
    location: string;
    description: string;
  };
  milestones: Milestone[];
  investmentSummary: {
    totalInvested: number;
    backerCount: number;
  };
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const response = await apiClient.get(`/api/campaigns/${params.id}`);
        setCampaign(response.data.data);
      } catch (err: any) {
        setError(err.message || "Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCampaignDetail();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-400">Loading campaign details...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 ring-1 ring-red-500/40">
          {error || "Campaign not found"}
        </div>
        <button
          onClick={() => router.push("/campaigns")}
          className="text-sm text-emerald-400 hover:text-emerald-300"
        >
          ← Back to campaigns
        </button>
      </div>
    );
  }

  const progress = (campaign.investmentSummary.totalInvested / campaign.campaign.target_amount) * 100;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/campaigns")}
        className="text-sm text-emerald-400 hover:text-emerald-300"
      >
        ← Back to campaigns
      </button>

      {/* Campaign Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{campaign.campaign.title}</h1>
            <p className="mt-2 text-sm text-slate-400">
              by <span className="text-emerald-400">{campaign.restaurant.name}</span> • {campaign.restaurant.cuisine_type} • {campaign.restaurant.location}
            </p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/40">
            {campaign.campaign.status}
          </span>
        </div>

        <p className="text-slate-300">{campaign.campaign.description}</p>
      </div>

      {/* Funding Progress */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-xl font-semibold">Funding Progress</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          
          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg bg-slate-800/50 p-4">
              <div className="text-xs text-slate-400">Total Invested</div>
              <div className="mt-1 text-2xl font-bold text-emerald-400">
                ₩{campaign.investmentSummary.totalInvested.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-4">
              <div className="text-xs text-slate-400">Target Amount</div>
              <div className="mt-1 text-2xl font-bold">
                ₩{campaign.campaign.target_amount.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-sm">
            <div>
              <span className="text-slate-400">Backers: </span>
              <span className="font-medium text-emerald-400">{campaign.investmentSummary.backerCount}</span>
            </div>
            <div>
              <span className="text-slate-400">Campaign Period: </span>
              <span className="font-medium">
                {new Date(campaign.campaign.start_date).toLocaleDateString()} - {new Date(campaign.campaign.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-xl font-semibold">About the Restaurant</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Name:</span>
            <span className="text-emerald-400">{campaign.restaurant.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Cuisine:</span>
            <span>{campaign.restaurant.cuisine_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Location:</span>
            <span>{campaign.restaurant.location}</span>
          </div>
          {campaign.restaurant.description && (
            <div className="mt-4 text-sm text-slate-300">
              {campaign.restaurant.description}
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      {campaign.milestones.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-4 text-xl font-semibold">Campaign Milestones</h2>
          <div className="space-y-3">
            {campaign.milestones.map((milestone) => (
              <div
                key={milestone.milestone_id}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{milestone.milestone_name}</h3>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                        Milestone
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{milestone.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Target: ₩{milestone.target_amount_krw.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
