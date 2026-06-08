"use client";

import { useState } from "react";
import Link from "next/link";

interface PricingCardProps {
  showCheckoutButton?: boolean;
}

export default function PricingCard({ showCheckoutButton = true }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      if (!res.ok) throw new Error("checkout failed");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Checkout unavailable — please book a call to get started.");
    } finally {
      setLoading(false);
    }
  }

  const includes = [
    "One-hour interview",
    "Claude-generated assessment report via Gamma",
    "Effort/Impact matrix — all pain points plotted",
    "Quick wins section: low-effort, high-impact first",
    "Ranked, ROI-backed solutions specific to your business",
    "Financial ROI summary: hours saved × $100/hr − tool costs",
    "Personalized roadmap to roll out specific AI fluency",
  ];

  return (
    <div id="tier-1" className="card border-2 border-green-border p-8 lg:p-10">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-light border border-green-border text-green-DEFAULT text-xs font-mono font-bold mb-6">
        Tier 1 · Start Here
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-ink">AI Business Assessment</h3>
          <p className="text-sm text-muted mt-1">One-time engagement</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-ink">$1,000</div>
          <div className="text-xs text-muted font-mono">one-time</div>
        </div>
      </div>

      <p className="text-muted text-sm leading-relaxed mb-6 pb-6 border-b border-border">
        A complete picture of where AI can transform your business — with ROI numbers
        before you spend a dollar on tools.
      </p>

      <ul className="space-y-3 mb-8">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-light border border-green-border text-green-DEFAULT flex items-center justify-center text-xs font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {showCheckoutButton ? (
        <>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 rounded-xl text-base font-semibold bg-green-DEFAULT hover:bg-green-hover text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting to checkout…" : "Get Your Assessment — $1,000"}
          </button>
          {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
          <p className="mt-3 text-xs text-muted text-center font-mono">
            SECURE CHECKOUT VIA STRIPE · REPORT IN 24–48 HRS
          </p>
        </>
      ) : (
        <Link href="/pricing" className="block w-full py-4 rounded-xl text-base font-semibold bg-green-DEFAULT hover:bg-green-hover text-white text-center transition-colors">
          See Full Pricing Details
        </Link>
      )}
    </div>
  );
}
