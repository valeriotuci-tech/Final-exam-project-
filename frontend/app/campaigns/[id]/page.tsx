"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "../../../lib/api/client";
import { useAuth } from "../../../contexts/AuthContext";

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
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);

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

  const handleInvest = async (amount: number) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setInvesting(true);
    setError("");
    setInvestSuccess(false);

    try {
      await apiClient.post("/api/investments", {
        campaignId: params.id,
        amount: amount,
      });

      setInvestSuccess(true);
      
      // Refresh campaign data to show updated progress
      const response = await apiClient.get(`/api/campaigns/${params.id}`);
      setCampaign(response.data.data);

      // Show success message
      setTimeout(() => {
        setInvestSuccess(false);
      }, 5000);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create investment");
    } finally {
      setInvesting(false);
    }
  };

  const handleCustomInvest = () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount < 10000) {
      setError("Minimum investment is ₩10,000");
      return;
    }
    handleInvest(amount);
    setCustomAmount("");
  };

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
          className="text-sm text-amber-500 hover:text-amber-500"
        >
          ← Back to campaigns
        </button>
      </div>
    );
  }

  const progress = (campaign.investmentSummary.totalInvested / campaign.campaign.target_amount) * 100;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-slate-400 hover:text-slate-50"
      >
        ← Back to Campaigns
      </button>

      {/* Success Message */}
      {investSuccess && (
        <div className="rounded-lg bg-green-500/10 p-4 text-sm text-green-400 ring-1 ring-green-500/40">
          ✅ Investment successful! Check "Your Investments" to see your contribution.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400 ring-1 ring-red-500/40">
          {error}
        </div>
      )}

      {/* Campaign Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{campaign.campaign.title}</h1>
            <p className="mt-2 text-sm text-slate-400">
              by <span className="text-amber-500">{campaign.restaurant.name}</span> • {campaign.restaurant.cuisine_type} • {campaign.restaurant.location}
            </p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500 ring-1 ring-amber-500/40">
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
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-lg bg-slate-800/50 p-4">
              <div className="text-xs text-slate-400">Total Invested</div>
              <div className="mt-1 text-2xl font-bold text-amber-500">
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
              <span className="font-medium text-amber-500">{campaign.investmentSummary.backerCount}</span>
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
            <span className="text-amber-500">{campaign.restaurant.name}</span>
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
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500 ring-1 ring-amber-500/40">
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

      {/* Investment Tiers */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-xl font-semibold">Investment Options</h2>
        <p className="mb-4 text-sm text-slate-400">
          Choose an amount to invest in this campaign. Each tier helps fund specific milestones.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Tier 1 - Small Investment */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4 hover:border-amber-500/50 transition-colors">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Starter</h3>
              <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-amber-500/40">
                Popular
              </span>
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-amber-500">₩50,000</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Support initial operations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Backer recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Campaign updates</span>
              </li>
            </ul>
            <button 
              onClick={() => handleInvest(50000)}
              disabled={investing}
              className="mt-4 w-full rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 ring-1 ring-amber-500/40 hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {investing ? "Processing..." : "Invest ₩50,000"}
            </button>
          </div>

          {/* Tier 2 - Medium Investment */}
          <div className="rounded-lg border-2 border-amber-500/50 bg-slate-900/60 p-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
              RECOMMENDED
            </div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Supporter</h3>
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-amber-500">₩100,000</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>All Starter benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Help fund milestone goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Priority campaign updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Special thank you mention</span>
              </li>
            </ul>
            <button 
              onClick={() => handleInvest(100000)}
              disabled={investing}
              className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {investing ? "Processing..." : "Invest ₩100,000"}
            </button>
          </div>

          {/* Tier 3 - Large Investment */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-4 hover:border-amber-500/50 transition-colors">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Champion</h3>
              <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-amber-500/40">
                Premium
              </span>
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-amber-500">₩500,000</span>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>All Supporter benefits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Major milestone contributor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Exclusive backer perks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>Direct restaurant contact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">✓</span>
                <span>VIP recognition</span>
              </li>
            </ul>
            <button 
              onClick={() => handleInvest(500000)}
              disabled={investing}
              className="mt-4 w-full rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 ring-1 ring-amber-500/40 hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {investing ? "Processing..." : "Invest ₩500,000"}
            </button>
          </div>
        </div>

        {/* Custom Amount */}
        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-900/40 p-4">
          <h3 className="mb-2 font-semibold">Custom Amount</h3>
          <p className="mb-3 text-sm text-slate-400">
            Want to invest a different amount? Enter your custom investment below.
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Enter amount in ₩"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                min="10000"
                step="10000"
              />
            </div>
            <button 
              onClick={handleCustomInvest}
              disabled={investing || !customAmount}
              className="rounded-lg bg-amber-500/10 px-6 py-2 text-sm font-medium text-amber-500 ring-1 ring-amber-500/40 hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {investing ? "Processing..." : "Invest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
