import type { Metadata } from "next";
import Link from "next/link";
import PricingCard from "@/components/PricingCard";

export const metadata: Metadata = {
  title: "Pricing — Capps AI",
  description:
    "AI Business Assessment for $1,000 — plus follow-on services to implement what we find.",
};

const upsells = [
  {
    name: "Quick-Win Tool Setup",
    price: "$500–$1,500",
    description:
      "Install and configure the exact tools recommended in your assessment report. Done-for-you setup so you get results without the learning curve.",
    icon: "⚡",
  },
  {
    name: "CRM Setup (Go HighLevel)",
    price: "$3,000–$5,000",
    description:
      "Full CRM implementation with pipelines, automations, and follow-up sequences — or white-labeled as a monthly SaaS product for your agency clients.",
    icon: "🏗️",
  },
  {
    name: "Process Optimization",
    price: "$2,000–$5,000",
    description:
      "Before you automate a broken process, we redesign it. Map, simplify, then automate — so your automation actually works the way it should.",
    icon: "🔄",
  },
  {
    name: "Speed-to-Lead AI Agent",
    price: "$1,500–$3,000",
    description:
      "Auto-respond to new leads within seconds, 24/7 — via Make.com or Zapier. Never lose a lead to a slow response again.",
    icon: "🤖",
  },
  {
    name: "Knowledge System / Custom GPT",
    price: "$500–$2,000",
    description:
      "Train a GPT on your business data — your products, policies, FAQs — to handle 95% of repetitive customer questions automatically.",
    icon: "🧠",
  },
  {
    name: "Brand Voice & Social Media AI",
    price: "$1,000–$2,500",
    description:
      "AI-generated content that actually sounds like your business — not generic ChatGPT. Content calendars, captions, and email drafts at scale.",
    icon: "✍️",
  },
  {
    name: "Analytics Automation",
    price: "$500–$1,500",
    description:
      "Auto-pull Google Analytics, Meta Ads, and Google Ads into one clean dashboard. Stop spending 3 hours a month pulling numbers.",
    icon: "📊",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-padding bg-primary-dark text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-wide mb-4">
            Transparent Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Simple, ROI-Focused Pricing
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Every engagement starts with the Assessment. We don&apos;t recommend
            follow-on work until we know it&apos;ll pay for itself.
          </p>
        </div>
      </section>

      {/* Core offer */}
      <section className="section-padding bg-primary">
        <div className="max-w-2xl mx-auto">
          <PricingCard showCheckoutButton={true} />
          <p className="text-center text-sm text-gray-500 mt-6">
            The Assessment is the foundation. Everything below is optional — and only
            recommended after we know the ROI.
          </p>
        </div>
      </section>

      {/* Upsells */}
      <section className="section-padding bg-primary-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Comes Next
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              After your assessment, you&apos;ll have a prioritized roadmap. These are
              the implementation services we offer — all scoped to what your
              assessment actually recommends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upsells.map((item, i) => (
              <div
                key={i}
                className="card-surface p-6 hover:border-accent/40 transition-colors group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-xl shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white leading-snug">{item.name}</h3>
                    <span className="text-teal text-sm font-semibold">{item.price}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 card-surface p-8 border-teal/30 text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-3">Not sure what you need?</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Start with the free intro call. We&apos;ll listen to your business, ask a few
              questions, and tell you honestly whether the Assessment makes sense right now.
            </p>
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-8 py-3"
            >
              Book a Free Intro Call
            </a>
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="section-padding bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Have questions?</h2>
          <p className="text-gray-400 mb-6">
            Check out the FAQ on the home page, or just book a free intro call —
            no sales pitch, just answers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#faq" className="btn-secondary px-6 py-3">
              Read the FAQ
            </Link>
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-3"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
