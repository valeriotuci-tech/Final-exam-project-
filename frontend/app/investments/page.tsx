"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/api/client";
import { useAuth } from "../../contexts/AuthContext";

interface Investment {
  id: string;
  amount: string;
  status: string;
  created_at: string;
  campaign_id: string;
  campaign_title: string;
  campaign_description: string;
  campaign_status: string;
  restaurant_name: string;
  cuisine_type: string;
  location: string;
}

export default function InvestmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchInvestments = async () => {
      try {
        const response = await apiClient.get("/api/campaigns/my-investments");
        setInvestments(response.data.data || []);
      } catch (err: any) {
        console.error("Investment fetch error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Failed to load investments";
        setError(`${errorMsg}. The backend is updating, please wait 1-2 minutes and refresh.`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-400">Loading your investments...</div>
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

  const totalInvested = investments.reduce(
    (sum, inv) => sum + parseFloat(inv.amount),
    0
  );

  const completedInvestments = investments.filter(
    (inv) => inv.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Investments</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track all your investments in one place
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="text-sm text-slate-400">Total Invested</div>
          <div className="mt-2 text-3xl font-bold text-amber-500">
            ₩{totalInvested.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="text-sm text-slate-400">Total Investments</div>
          <div className="mt-2 text-3xl font-bold">{investments.length}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="text-sm text-slate-400">Completed</div>
          <div className="mt-2 text-3xl font-bold text-green-500">
            {completedInvestments}
          </div>
        </div>
      </div>

      {/* Investments List */}
      {investments.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-sm text-slate-400">
            You haven't made any investments yet
          </p>
          <button
            onClick={() => router.push("/campaigns")}
            className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            Browse Campaigns
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">
                      {investment.campaign_title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                        investment.status === "completed"
                          ? "bg-green-500/10 text-green-300 ring-green-500/40"
                          : investment.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-300 ring-yellow-500/40"
                          : "bg-slate-500/10 text-slate-300 ring-slate-500/40"
                      }`}
                    >
                      {investment.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-amber-500 font-medium">
                      {investment.restaurant_name}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                      {investment.cuisine_type}
                    </span>
                    {investment.location && (
                      <>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{investment.location}</span>
                      </>
                    )}
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                    {investment.campaign_description}
                  </p>

                  <div className="mt-4 flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-500">Investment Amount: </span>
                      <span className="font-semibold text-amber-500">
                        ₩{parseFloat(investment.amount).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Date: </span>
                      <span className="text-slate-300">
                        {new Date(investment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/campaigns/${investment.campaign_id}`)}
                  className="ml-4 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 ring-1 ring-amber-500/40 hover:bg-amber-500/20 transition-colors"
                >
                  View Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
