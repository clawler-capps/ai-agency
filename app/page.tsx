import Link from "next/link";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PricingCard from "@/components/PricingCard";

const faqs = [
  {
    q: "Do I need to be tech-savvy?",
    a: "No. The interview is a conversation, not a technical audit. I do the analysis; you just answer questions about how your business works.",
  },
  {
    q: "How long does it take?",
    a: "The interview is 20–30 minutes. Your report is delivered within 24–48 hours. The follow-up call is another 30 minutes.",
  },
  {
    q: "What kinds of businesses do you work with?",
    a: "Any small business with repetitive processes — real estate, mortgage, wedding venues, e-commerce, contractors, professional services.",
  },
  {
    q: "What if I don't implement anything after the assessment?",
    a: "The report is yours regardless. Most clients find at least one \"quick win\" they can implement the same week — often for free.",
  },
  {
    q: "Is the $1,000 refundable?",
    a: "If you don't find at least $1,000 of monthly value in the recommendations, we'll talk. The goal is to show you a clear ROI, not take your money.",
  },
];

const testimonials = [
  {
    quote:
      "The assessment found 3 automations that saved us 15 hours a week. We covered the cost of the report in the first month.",
    name: "Sarah M.",
    role: "Owner, Coastal Realty Group",
    initials: "SM",
  },
  {
    quote:
      "I had no idea where to start with AI. Tyler mapped out exactly what to do first — and the ROI numbers made it a no-brainer.",
    name: "James R.",
    role: "Founder, Ridgeline Contractors",
    initials: "JR",
  },
  {
    quote:
      "We were spending 20 hours a month on manual reporting. The dashboard automation Tyler recommended cut that to under 2.",
    name: "Priya K.",
    role: "VP Ops, TechBridge Consulting",
    initials: "PK",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Problem section */}
      <section className="section-padding bg-primary-dark">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-wide mb-4">
                The Problem
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Your business runs on repetition — and it&apos;s costing you more than you think
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Manual follow-ups that go out 6 hours late. Reports that take 3 hours to compile.
                The same 10 customer questions answered 50 times a month. Leads that fall through
                the cracks because no one responded fast enough.
              </p>
              <p className="text-gray-400 leading-relaxed">
                You know AI could help — but every article says something different, every tool
                has a different promise, and you don&apos;t have time to figure out where to start.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { stat: "47%", label: "of SMB owners say repetitive tasks are their #1 time drain" },
                { stat: "6hrs", label: "average response time to new leads — vs. 2 mins for top performers" },
                { stat: "$18k", label: "average annual value of time lost to manual reporting per employee" },
                { stat: "83%", label: "of small businesses say they don't know which AI tool to start with" },
              ].map((item, i) => (
                <div key={i} className="card-surface p-5">
                  <div className="text-3xl font-black gradient-text mb-2">{item.stat}</div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Assessment CTA */}
      <section className="section-padding bg-primary-dark">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card-surface p-10 lg:p-14 border-teal/30 hover:border-teal/50 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-teal/15 text-3xl flex items-center justify-center mx-auto mb-6">🎯</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Find out exactly where AI can save your business time and money
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Take our free 5-minute assessment. No tech knowledge needed. Get an instant snapshot
              of your biggest automation opportunities.
            </p>
            <Link href="/assessment" className="btn-primary text-base px-10 py-4 inline-flex">
              Take the Free 5-Minute Assessment →
            </Link>
            <p className="mt-4 text-sm text-gray-500">Free · No account required · Results in seconds</p>
          </div>
        </div>
      </section>

      {/* Core offer */}
      <section className="section-padding bg-primary">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The AI Business Assessment</h2>
            <p className="text-gray-400 text-lg">
              One engagement. One clear deliverable. ROI you can calculate before you implement anything.
            </p>
          </div>
          <PricingCard showCheckoutButton={true} />
        </div>
      </section>

      {/* Social proof */}
      <section className="section-padding bg-primary-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold uppercase tracking-wide mb-4">
              Early Client Results
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">What clients say</h2>
            <p className="text-gray-500 text-sm mt-2 italic">Placeholder testimonials — to be replaced with real client quotes before launch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-surface p-6 hover:border-accent/30 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-teal text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding bg-primary">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card-surface p-6 hover:border-accent/30 transition-colors">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-b from-primary-dark to-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to find your first{" "}
            <span className="gradient-text">AI quick win?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Book a free 15-minute intro call. No pitch, no pressure — just a
            conversation about where AI can make the biggest difference in your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-10 py-4 w-full sm:w-auto"
            >
              Book a Free Intro Call
            </a>
            <Link
              href="/pricing"
              className="btn-secondary text-base px-10 py-4 w-full sm:w-auto"
            >
              View Pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
