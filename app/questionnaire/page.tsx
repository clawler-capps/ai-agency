import type { Metadata } from "next";
import PreCallForm from "@/components/PreCallForm";

export const metadata: Metadata = {
  title: "Pre-Call Questionnaire — Sacramento AI Agency",
  description:
    "A few quick questions to help us make the most of our call together.",
  // Hidden, share-only page — keep it out of search engines.
  robots: { index: false, follow: false },
};

export default function PreCallPage() {
  return (
    <div className="min-h-screen bg-paper bg-hero-texture">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Minimal header — no navigation links */}
        <header className="text-center mb-10">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-ink tracking-tight">Sacramento</span>
            <span className="text-xl font-bold text-accent tracking-tight">AI</span>
            <span className="text-xl font-bold text-ink tracking-tight">Agency</span>
          </div>
          <p className="eyebrow mb-4">Before we talk</p>
          <h1 className="text-3xl sm:text-4xl font-black text-ink tracking-tight mb-4">
            Pre-Call Questionnaire
          </h1>
          <p className="text-lg text-muted max-w-lg mx-auto leading-relaxed">
            Help us make the most of our time together. This takes about 5 minutes.
          </p>
        </header>

        <PreCallForm />
      </div>
    </div>
  );
}
