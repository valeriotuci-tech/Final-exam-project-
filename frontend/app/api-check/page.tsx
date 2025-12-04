"use client";

import { useEffect, useState } from "react";

export default function ApiCheckPage() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    // Check what API URL is being used
    const checkApiUrl = async () => {
      try {
        // Import the client to see what URL it's using
        const { apiClient } = await import("../../lib/api/client");
        
        const apiUrl = apiClient.defaults.baseURL;
        const hostname = window.location.hostname;
        const isProduction = hostname !== 'localhost';
        
        setInfo({
          currentUrl: window.location.href,
          hostname,
          isProduction,
          apiBaseUrl: apiUrl,
          envVar: process.env.NEXT_PUBLIC_API_URL || "NOT SET",
        });
      } catch (error: any) {
        setInfo({ error: error.message });
      }
    };

    checkApiUrl();
  }, []);

  return (
    <div className="min-h-screen p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Configuration Check</h1>
        <p className="mt-2 text-sm text-slate-400">
          This page shows what API URL the frontend is using
        </p>
      </div>

      {info && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold mb-4">Configuration:</h2>
          <pre className="text-xs overflow-auto bg-slate-950 p-4 rounded whitespace-pre-wrap">
            {JSON.stringify(info, null, 2)}
          </pre>

          {info.apiBaseUrl?.includes('localhost') && info.isProduction && (
            <div className="mt-4 rounded-lg bg-red-500/10 p-4 text-red-400">
              ❌ ERROR: Frontend is using localhost in production!
              <br />
              Expected: https://r11-production.up.railway.app
              <br />
              Actual: {info.apiBaseUrl}
            </div>
          )}

          {info.apiBaseUrl?.includes('railway.app') && (
            <div className="mt-4 rounded-lg bg-amber-500/10 p-4 text-amber-400">
              ✅ CORRECT: Frontend is using Railway backend!
              <br />
              API URL: {info.apiBaseUrl}
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="text-sm space-y-2 list-decimal list-inside">
          <li>Check if "apiBaseUrl" shows the Railway URL</li>
          <li>If it shows localhost, clear your browser cache and refresh</li>
          <li>Try opening in an incognito/private window</li>
          <li>Take a screenshot and send it to me</li>
        </ol>
      </div>
    </div>
  );
}
