"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Welcome back, {user.name}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
        >
          Sign Out
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-slate-400">Your Role</h3>
          <p className="mt-2 text-2xl font-bold capitalize">{user.role}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-slate-400">Email</h3>
          <p className="mt-2 text-sm font-mono">{user.email}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-slate-400">User ID</h3>
          <p className="mt-2 text-xs font-mono text-slate-400">{user.id}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <a
            href="/campaigns"
            className="rounded-lg border border-slate-700 p-4 hover:bg-slate-800"
          >
            <h3 className="font-medium">Browse Campaigns</h3>
            <p className="mt-1 text-xs text-slate-400">
              Explore active crowdfunding campaigns
            </p>
          </a>
          <a
            href="/restaurants"
            className="rounded-lg border border-slate-700 p-4 hover:bg-slate-800"
          >
            <h3 className="font-medium">View Restaurants</h3>
            <p className="mt-1 text-xs text-slate-400">
              Discover restaurants on the platform
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
