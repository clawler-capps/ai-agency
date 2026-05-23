import Link from "next/link";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ServiceTiers from "@/components/ServiceTiers";

// ── Problem data ──────────────────────────────────────────────────────────────
const problems = [
  {
    icon: "📋",
    title: "Manual Reporting",
    description:
      "Copy-pasting from 4 different systems into a spreadsheet every Monday morning. 2–3 hours gone before the week even starts.",
    fix: "Automated dashboard that pulls every source in real time.",
  },
  {
    icon: "🚨",
    title: "Missed Leads",
    description:
      "A new lead comes in at 9pm and nobody responds until the next morning. Top performers respond in under 2 minutes.",
    fix: "Speed-to-lead AI agent — responds in seconds, 24/7.",
  },
  {
    icon: "🌀",
    title: "Meeting Chaos",
    description:
      "Hours of meetings with no record of what was decided or who owns what. Action items die in someone's inbox.",
    fix: "Fathom auto-transcribes, summarizes, and assigns action items.",
  },
];

// ── Industries ─────────────────────────────────────────────────────────────────
const industries = [
  {
    name: "Construction & Trades",
    description:
      "Still estimating by hand? Losing track of job status across crews? Buried in emails that should be systems?",
    icon: "🏗️",
  },
  {
    name: "Real Estate Brokerages",
    description:
      "Leads slipping through the cracks, CRM nobody actually uses, marketing reports you compile yourself every month?",
    icon: "🏘️",
  },
  {
    name: "Professional Services",
    description:
      "Law firms, CPAs, insurance agencies — drowning in repetitive document work, intake forms, and manual billing?",
    icon: "⚖️",
  },
  {
    name: "Healthcare Practices",
    description:
      "Admin overhead eating your margin across locations? Scheduling gaps and patient communication still done by hand?",
    icon: "🏥",
  },
  {
    name: "Agriculture & Ranching",
    description:
      "Running a serious operation with almost no tech infrastructure? There's more leverage here than most consultants realize.",
    icon: "🌾",
  },
  {
    name: "Franchise Groups",
    description:
      "Scaling across locations but every unit runs differently? Inconsistent processes are the hidden tax on growth.",
    icon: "🔗",
  },
  {
    name: "Manufacturing",
    description:
      "Legacy systems, manual inventory tracking, zero visibility into operations in real time?",
    icon: "⚙️",
  },
];

// ── Testimonials ───────────────────────────────────────────────────────────────
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

// ── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Do I need to be tech-savvy?",
    a: "No. The interview is a conversation about how your business works, not a technical audit.",
  },
  {
    q: "How long does it take?",
    a: "The interview is 20–30 min. Your report is delivered in 24–48 hours. The follow-up call is 30 min.",
  },
  {
    q: "What kinds of businesses do you work with?",
    a: "We work with owner-operated and mid-market businesses in the Sacramento region — construction, real estate, professional services, healthcare, agriculture, manufacturing, and franchises. If your team is doing repetitive manual work and you feel like you're leaving time and money on the table, you're a good fit.",
  },
  {
    q: "What if I don't implement anything after the assessment?",
    a: "The report is yours regardless. Most clients find at least one quick win they can do themselves the same week — often free.",
  },
  {
    q: "Is the $1,000 refundable?",
    a: "If you don't find at least $1,000 in monthly value in the recommendations, we'll talk. The goal is a clear ROI, not just taking your money.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Problem */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-3">
              The Problem
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-balance max-w-2xl">
              Your business runs on repetition — and it&apos;s costing more than you think
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-white/20 transition-colors">
                <div className="text-3xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-bold mb-3">{p.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{p.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs font-mono text-accent">THE FIX →</p>
                  <p className="text-sm text-white/80 mt-1">{p.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <ServiceTiers />

      {/* Who We Serve */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="eyebrow mb-3">Who We Help</p>
            <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Does this sound like your business?
            </h2>
            <p className="mt-4 text-lg text-muted max-w-2xl leading-relaxed">
              We work with growing businesses across the Sacramento region that are running
              on manual processes — and know there has to be a better way.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <div key={i} className="card-hover p-6 group">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">{ind.icon}</span>
                  <div>
                    <h3 className="font-bold text-ink mb-2">{ind.name}</h3>
                    <p className="text-sm text-muted leading-relaxed">{ind.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-4">Free · 5 minutes</p>
          <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight mb-5 text-balance">
            Find out exactly where AI can save your business time and money
          </h2>
          <p className="text-lg text-muted mb-10 leading-relaxed">
            Take our free 5-minute assessment. No tech knowledge needed. Get an instant snapshot
            of your biggest automation opportunities — with ballpark ROI numbers.
          </p>
          <Link href="/assessment" className="btn-primary text-base px-10 py-4 inline-flex">
            Take the Free Assessment →
          </Link>
          <p className="mt-4 text-xs text-muted font-mono">FREE · NO ACCOUNT REQUIRED · RESULTS IN SECONDS</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">Client Results</p>
            <h2 className="text-4xl font-black text-ink tracking-tight">What clients say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-hover p-7">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-accent text-sm">★</span>
                  ))}
                </div>
                <p className="text-ink/80 text-sm leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-accent/light border border-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{t.name}</div>
                    <div className="text-xs text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-padding bg-paper section-divider">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-ink tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="font-bold text-ink mb-2">{faq.q}</h3>
                <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-ink text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-white/40 mb-6">
            Sacramento, CA
          </p>
          <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-6 text-balance">
            Ready to find your first{" "}
            <span className="text-accent">AI quick win?</span>
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
            Book a free 15-minute intro call. No pitch, no pressure — just a conversation
            about where AI can make the biggest difference in your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://calendly.com/tylercapps/intro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-10 py-4 w-full sm:w-auto"
            >
              Book a Free Intro Call
            </a>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-colors w-full sm:w-auto text-base">
              View Pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
