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
    name: "Construction / Trades / ADU",
    revenue: "$5M–$100M",
    description: "Zero automation, manual estimates, email chaos, no project visibility.",
    icon: "🏗️",
  },
  {
    name: "Real Estate Brokerages",
    revenue: "$5M–$50M",
    description: "Lead follow-up gaps, CRM disaster, manual marketing reports.",
    icon: "🏘️",
  },
  {
    name: "Professional Services",
    revenue: "$5M–$30M",
    description: "Law, CPA, insurance — repetitive document review, intake, billing.",
    icon: "⚖️",
  },
  {
    name: "Healthcare Practices",
    revenue: "$10M–$50M",
    description: "Multi-location admin overhead, scheduling, patient communication.",
    icon: "🏥",
  },
  {
    name: "Agriculture / Ranching",
    revenue: "$5M–$100M",
    description: "Near-zero tech adoption. Unique Sacramento access to Central Valley.",
    icon: "🌾",
  },
  {
    name: "Franchise Groups",
    revenue: "$10M–$100M",
    description: "Multi-unit scaling with inconsistent processes across locations.",
    icon: "🔗",
  },
  {
    name: "Manufacturing",
    revenue: "$10M–$75M",
    description: "Legacy systems, manual inventory tracking, no AI adoption.",
    icon: "⚙️",
  },
];

// ── Frameworks ────────────────────────────────────────────────────────────────
const aoaSteps = [
  {
    letter: "A",
    name: "Audit",
    color: "text-green-DEFAULT bg-green-light border-green-border",
    detail:
      "20–30 min interview. Feed transcript to Claude. Generate the Gamma report with ROI numbers.",
  },
  {
    letter: "O",
    name: "Optimize",
    color: "text-blue-DEFAULT bg-blue-light border-blue-border",
    detail:
      "Fix the broken process before automating it. If a task takes 15 steps but should take 7, automating the current mess just speeds up the inefficiency.",
  },
  {
    letter: "A",
    name: "Automate",
    color: "text-accent bg-accent/light border-accent/30",
    detail:
      "Build the automation, document the process, template everything. The second build is dramatically faster.",
  },
];

const steSteps = [
  {
    letter: "S",
    name: "Strategy",
    color: "text-green-DEFAULT bg-green-light border-green-border",
    detail:
      'Speak to fear. "Are you using AI right now?" Almost always: "We use ChatGPT for emails." That\'s the opening.',
  },
  {
    letter: "T",
    name: "Transformation",
    color: "text-blue-DEFAULT bg-blue-light border-blue-border",
    detail:
      '"Who are you about to hire?" Show them how AI does that for $25/month instead of $8K/month.',
  },
  {
    letter: "E",
    name: "Education",
    color: "text-accent bg-accent/light border-accent/30",
    detail:
      '"What if every employee was 20% more productive?" On a $20M business, that\'s $4M in value. Your $10K/month fee is a rounding error.',
  },
];

// ── Principles ────────────────────────────────────────────────────────────────
const principles = [
  {
    title: "Don't become a dev shop",
    body: "You're selling a system you install and manage — not custom software. The moment you position as a builder, you're signing up for endless maintenance.",
  },
  {
    title: "Teach them to fish",
    body: "Your best clients should be vibe-coding their own solutions with your guidance. Coach, don't labor. It's harder to fire a coach who empowered the team.",
  },
  {
    title: "Fix before you automate",
    body: "Automating a broken process just speeds up the inefficiency. Redesign first, then automate. Always.",
  },
  {
    title: "Price signals value",
    body: "At $200, clients don't engage. At $1,000, they treat it like real business advice. Move to full price fast.",
  },
  {
    title: "Pivot fast",
    body: "Your first idea will probably be wrong. Listen to what sells and follow the money.",
  },
  {
    title: "System-based pricing > hourly",
    body: "Once dashboards and automations are embedded in operations, removing you means removing infrastructure.",
  },
];

// ── Testimonials (placeholder) ─────────────────────────────────────────────────
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
    a: "Any Sacramento-area business doing $5M–$50M in revenue that's running on manual processes — construction, real estate, professional services, healthcare, agriculture, franchises.",
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
            <p className="eyebrow mb-3">Target Market</p>
            <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Who We Serve
            </h2>
            <div className="mt-6 p-5 rounded-xl bg-accent/light border border-accent/30 max-w-2xl">
              <p className="text-sm text-ink leading-relaxed">
                <strong>Sacramento advantage:</strong> a metro of 2.4M with a massive concentration
                of mid-market businesses big enough to afford strategic AI help — but not big enough
                to have internal tech leadership.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <div key={i} className="card-hover p-6 group">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">{ind.icon}</span>
                  <div>
                    <h3 className="font-bold text-ink">{ind.name}</h3>
                    <span className="text-xs font-mono text-muted">{ind.revenue} REVENUE</span>
                    <p className="mt-2 text-sm text-muted leading-relaxed">{ind.description}</p>
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

      {/* Frameworks */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="eyebrow mb-3">Our Approach</p>
            <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Two Frameworks That Drive Results
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* AOA */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center">
                  <span className="text-white font-mono font-bold text-sm">AOA</span>
                </div>
                <div>
                  <h3 className="font-bold text-ink">Audit → Optimize → Automate</h3>
                  <p className="text-xs text-muted font-mono">THE SERVICE FRAMEWORK</p>
                </div>
              </div>
              <div className="space-y-3">
                {aoaSteps.map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-paper">
                    <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-sm ${s.color}`}>
                      {s.letter}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm mb-0.5">{s.name}</p>
                      <p className="text-xs text-muted leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STE */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                  <span className="text-white font-mono font-bold text-sm">STE</span>
                </div>
                <div>
                  <h3 className="font-bold text-ink">Strategy → Transformation → Education</h3>
                  <p className="text-xs text-muted font-mono">THE SALES FRAMEWORK</p>
                </div>
              </div>
              <div className="space-y-3">
                {steSteps.map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-border bg-paper">
                    <div className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-sm ${s.color}`}>
                      {s.letter}
                    </div>
                    <div>
                      <p className="font-semibold text-ink text-sm mb-0.5">{s.name}</p>
                      <p className="text-xs text-muted leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section className="section-padding bg-paper section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="eyebrow mb-3">How We Operate</p>
            <h2 className="text-4xl sm:text-5xl font-black text-ink tracking-tight">
              Operating Principles
            </h2>
            <p className="mt-4 text-lg text-muted">Six rules we never break.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {principles.map((p, i) => (
              <div key={i} className="card-hover p-6">
                <div className="text-xs font-mono text-muted mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-bold text-ink mb-2">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="section-padding bg-cream section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="eyebrow mb-3">Early Client Results</p>
            <h2 className="text-4xl font-black text-ink tracking-tight">What clients say</h2>
            <p className="mt-2 text-sm text-muted font-mono italic">
              Placeholder testimonials — to be replaced before launch.
            </p>
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
              href="https://calendly.com"
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
