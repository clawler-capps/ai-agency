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
      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError("Could not start checkout. Please try again or book a call.");
    } finally {
      setLoading(false);
    }
  }

  const includes = [
    "20–30 min AI-guided business interview",
    "Professional assessment report (via Gamma) in 24–48 hrs",
    "Effort/Impact matrix — every pain point plotted",
    "Quick wins section: low-effort, high-impact actions first",
    "Recommended AI tools & automations, tailored to your business",
    "Financial ROI summary: hours saved × $100/hr − tool costs",
    "30-min follow-up call to walk through findings",
  ];

  return (
    <div className="relative card-surface p-8 lg:p-10 border-accent/40 hover:border-accent/70 transition-all">
      {/* Popular badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="px-4 py-1 rounded-full text-xs font-semibold bg-accent text-white shadow-lg shadow-accent/30">
          Start Here
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">AI Business Assessment</h3>
        <div className="flex items-baseline justify-center gap-1 mt-4">
          <span className="text-5xl font-black gradient-text">$1,000</span>
          <span className="text-gray-400 text-sm">one-time</span>
        </div>
        <p className="text-gray-400 mt-3 text-sm">
          A complete picture of where AI can transform your business — with ROI numbers.
        </p>
      </div>

      <ul className="space-y-3 mb-8">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-teal/15 text-teal flex items-center justify-center text-xs font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {showCheckoutButton && (
        <>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary w-full text-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting to checkout…" : "Get Your Assessment — $1,000"}
          </button>
          {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
          <p className="mt-3 text-xs text-gray-500 text-center">
            Secure payment via Stripe · Report in 24–48 hrs
          </p>
        </>
      )}

      {!showCheckoutButton && (
        <Link href="/pricing" className="btn-primary w-full text-center py-4 text-base block">
          See Full Pricing Details
        </Link>
      )}
    </div>
  );
}
