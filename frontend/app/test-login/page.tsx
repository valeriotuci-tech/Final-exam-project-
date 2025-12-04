"use client";

import { useState } from "react";

export default function TestLoginPage() {
  const [email, setEmail] = useState("admin@tastyfund.com");
  const [password, setPassword] = useState("password123");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      setResult({ step: "Calling API...", apiUrl });

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      setResult({
        status: response.status,
        statusText: response.statusText,
        headers: {
          cors: response.headers.get("access-control-allow-origin"),
          contentType: response.headers.get("content-type"),
        },
        data,
        apiUrl,
      });
    } catch (error: any) {
      setResult({
        error: error.message,
        errorType: error.name,
        apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Login Test Page</h1>
        <p className="mt-2 text-sm text-slate-400">
          This page tests the login API directly
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm"
          />
        </div>

        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Login"}
        </button>
      </div>

      {result && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold mb-4">Result:</h2>
          <pre className="text-xs overflow-auto bg-slate-950 p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>

          {result.data?.success && (
            <div className="mt-4 rounded-lg bg-amber-500/10 p-4 text-amber-400">
              ✅ Login Successful! Token received.
            </div>
          )}

          {result.error && (
            <div className="mt-4 rounded-lg bg-red-500/10 p-4 text-red-400">
              ❌ Error: {result.error}
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm">
        <h3 className="font-semibold mb-2">Environment Info:</h3>
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL || "NOT SET (will use localhost:4000)"}</p>
      </div>
    </div>
  );
}
