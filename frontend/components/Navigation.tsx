"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="mb-8 border-b border-slate-800 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="TastyFund Logo" 
              width={48} 
              height={48}
              className="rounded-full"
            />
            <span className="text-2xl font-semibold tracking-tight text-amber-500">
              TastyFund
            </span>
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/campaigns" className="text-slate-400 hover:text-slate-50">
              Campaigns
            </Link>
            <Link href="/restaurants" className="text-slate-400 hover:text-slate-50">
              Restaurants
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-slate-400 hover:text-slate-50"
              >
                Dashboard
              </Link>
              <span className="text-sm text-slate-500">|</span>
              <span className="text-sm text-slate-400">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-amber-500"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-slate-700 px-4 py-1.5 text-sm font-medium hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
