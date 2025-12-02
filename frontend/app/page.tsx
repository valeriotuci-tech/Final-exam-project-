export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
          Welcome to
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-slate-50">
          TastyFund
        </h2>
        <p className="max-w-xl text-sm text-slate-300">
          A crowdfunding platform for chefs, creators, and food lovers. Launch new
          concepts, fund pop-ups, and support the culinary projects you believe in.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-slate-50">For creators</h3>
          <p className="mt-1 text-xs text-slate-300">
            Launch campaigns for your next supper club, product line, or restaurant
            concept.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-slate-50">For backers</h3>
          <p className="mt-1 text-xs text-slate-300">
            Discover curated food projects and support the people behind them.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-slate-50">For communities</h3>
          <p className="mt-1 text-xs text-slate-300">
            Help bring new flavors and experiences to your city, one campaign at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
