import Link from "next/link";

const stats = [
  { value: "<$200", label: "startup cost" },
  { value: "4 Tiers", label: "of service" },
  { value: "$15K+", label: "MRR target mo. 6" },
  { value: "30 Days", label: "to first client" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-paper overflow-hidden">
      {/* Subtle texture */}
      <div className="absolute inset-0 bg-hero-texture pointer-events-none" />

      {/* Decorative rule */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border hidden lg:block" style={{ left: "calc(50% - 384px)" }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <p className="eyebrow mb-6">
            Sacramento AI Agency — Tyler Capps
          </p>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-ink leading-[1.05] tracking-tight text-balance mb-6">
            The AI Agency for{" "}
            <span className="text-accent">Sacramento</span>{" "}
            Businesses
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted font-light leading-relaxed max-w-2xl mb-10">
            We help Sacramento businesses save{" "}
            <strong className="text-ink font-semibold">8+ hours a week</strong>{" "}
            with AI — without hiring a developer.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-14">
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-8 py-4"
            >
              Book Your Free Intro Call
            </a>
            <Link href="/assessment" className="btn-secondary text-base px-8 py-4">
              Take the Assessment →
            </Link>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3">
            {stats.map((s) => (
              <div key={s.label} className="stat-pill">
                <span className="stat-pill-value">{s.value}</span>
                <span className="stat-pill-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
