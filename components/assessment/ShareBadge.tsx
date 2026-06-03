"use client";

import { useMemo, useRef, useState } from "react";
import { AssessmentResult, Tier } from "./scoring";

type Props = {
  name: string;
  result: AssessmentResult;
};

const TIER_COLORS: Record<Tier, { from: string; to: string; ink: string; accent: string }> = {
  "AI-Leading":  { from: "#1a6b4e", to: "#0d3a2a", ink: "#ffffff", accent: "#ffd24a" },
  "AI-Ready":    { from: "#2d5dce", to: "#1a3a8a", ink: "#ffffff", accent: "#ffd24a" },
  "AI-Curious":  { from: "#e85d26", to: "#a8390f", ink: "#ffffff", accent: "#ffe9c2" },
};

const TIER_TAGLINE: Record<Tier, string> = {
  "AI-Leading": "AI-Leading Operator",
  "AI-Ready": "AI-Ready Leader",
  "AI-Curious": "AI-Curious Founder",
};

export default function ShareBadge({ name, result }: Props) {
  const { tier, peerPercentile, industry } = result;
  const colors = TIER_COLORS[tier];
  const tagline = TIER_TAGLINE[tier];
  const displayName = name || "Sacramento Operator";

  const defaultPost =
    `I just took the Sacramento AI Agency Opportunity Assessment and came out ${tagline} — Top ${peerPercentile}% of Sacramento-area ${industry.toLowerCase()} businesses.\n\n` +
    `If you run a Sacramento business and want to see where AI fits in yours, the assessment is free and takes 5 minutes 👇`;

  const [shareText, setShareText] = useState(defaultPost);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const svgMarkup = useMemo(
    () => buildBadgeSvg({ tier, peerPercentile, industry, displayName, colors, tagline }),
    [tier, peerPercentile, industry, displayName, colors, tagline]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked — fall back to selecting the textarea
      const ta = document.getElementById("share-text-area") as HTMLTextAreaElement | null;
      ta?.select();
    }
  }

  function handleLinkedIn() {
    // Best-effort: copy text first so the user can paste into the LinkedIn composer.
    void navigator.clipboard?.writeText(shareText).catch(() => {});
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      typeof window !== "undefined" ? window.location.origin + "/assessment" : "https://sacramentoaiagency.com/assessment"
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleDownloadPng() {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2; // retina-ish
      canvas.width = 1200 * scale;
      canvas.height = 630 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, 1200, 630);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) return;
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `capps-ai-${tier.toLowerCase().replace(/[^a-z]+/g, "-")}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
      }, "image/png");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow mb-3">Share your result</p>
      <h3 className="text-xl font-bold text-ink mb-5">Get social proof for your network</h3>

      {/* Live preview */}
      <div className="rounded-2xl overflow-hidden border border-border mb-5 bg-paper">
        <div
          className="w-full"
          style={{ aspectRatio: "1200 / 630" }}
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
        {/* Hidden duplicate with ref, for export — keeps the visible preview simple */}
        <div className="hidden" aria-hidden ref={(node) => {
          if (!node) return;
          node.innerHTML = svgMarkup;
          const svg = node.querySelector("svg");
          if (svg) svgRef.current = svg as SVGSVGElement;
        }} />
      </div>

      <label className="block text-sm font-semibold text-ink mb-1.5">
        Post text — edit before sharing
      </label>
      <textarea
        id="share-text-area"
        value={shareText}
        onChange={(e) => setShareText(e.target.value)}
        rows={5}
        className="w-full px-4 py-3 rounded-xl bg-paper border border-border text-ink placeholder-muted/50 focus:outline-none focus:border-accent transition-colors text-sm leading-relaxed mb-4"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={handleCopy} className="btn-secondary text-sm">
          {copied ? "Copied ✓" : "Copy text"}
        </button>
        <button onClick={handleDownloadPng} className="btn-secondary text-sm">
          Download badge (PNG)
        </button>
        <button onClick={handleLinkedIn} className="btn-primary text-sm">
          Share on LinkedIn →
        </button>
      </div>
      <p className="mt-3 text-xs text-muted font-mono">
        TIP: DOWNLOAD THE BADGE, THEN ATTACH IT TO YOUR LINKEDIN POST FOR MAX REACH.
      </p>
    </div>
  );
}

// ── SVG generator ────────────────────────────────────────────────────────────
function buildBadgeSvg({
  tier,
  peerPercentile,
  industry,
  displayName,
  colors,
  tagline,
}: {
  tier: Tier;
  peerPercentile: number;
  industry: string;
  displayName: string;
  colors: { from: string; to: string; ink: string; accent: string };
  tagline: string;
}): string {
  // 1200x630 is the standard LinkedIn/OG share size.
  const safeName = escapeXml(displayName);
  const safeIndustry = escapeXml(industry);
  const safeTagline = escapeXml(tagline);
  const safeTier = escapeXml(tier);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-label="${safeTagline} — Top ${peerPercentile}% in ${safeIndustry}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${colors.from}" />
      <stop offset="100%" stop-color="${colors.to}" />
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="20%" r="55%">
      <stop offset="0%" stop-color="${colors.accent}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${colors.accent}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#glow)" />

  <!-- Top eyebrow -->
  <text x="80" y="100" font-family="'Space Mono', monospace" font-size="22" letter-spacing="6" fill="${colors.ink}" fill-opacity="0.6">SACRAMENTO AI AGENCY · ASSESSMENT</text>

  <!-- Tier badge pill -->
  <g transform="translate(80, 140)">
    <rect width="${tier.length * 22 + 60}" height="56" rx="28" fill="${colors.ink}" fill-opacity="0.12" stroke="${colors.ink}" stroke-opacity="0.35" stroke-width="2" />
    <circle cx="30" cy="28" r="9" fill="${colors.accent}" />
    <text x="52" y="36" font-family="'DM Sans', system-ui, sans-serif" font-size="22" font-weight="700" fill="${colors.ink}">${safeTier}</text>
  </g>

  <!-- Headline -->
  <text x="80" y="290" font-family="'DM Sans', system-ui, sans-serif" font-size="76" font-weight="900" fill="${colors.ink}" letter-spacing="-2">${safeTagline}</text>

  <!-- Percentile callout -->
  <text x="80" y="400" font-family="'DM Sans', system-ui, sans-serif" font-size="48" font-weight="700" fill="${colors.accent}">TOP ${peerPercentile}%</text>
  <text x="80" y="450" font-family="'DM Sans', system-ui, sans-serif" font-size="26" font-weight="400" fill="${colors.ink}" fill-opacity="0.85">of Sacramento-area ${safeIndustry.toLowerCase()} businesses</text>

  <!-- Footer -->
  <line x1="80" y1="520" x2="1120" y2="520" stroke="${colors.ink}" stroke-opacity="0.25" stroke-width="1" />
  <text x="80" y="565" font-family="'DM Sans', system-ui, sans-serif" font-size="24" font-weight="600" fill="${colors.ink}">${safeName}</text>
  <text x="1120" y="565" text-anchor="end" font-family="'Space Mono', monospace" font-size="20" fill="${colors.ink}" fill-opacity="0.6">sacramentoaiagency.com/assessment</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
