import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-dark">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          AI Consulting for Small Businesses
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-balance mb-6">
          Know Exactly Where{" "}
          <span className="gradient-text">AI Saves You</span>{" "}
          Time & Money
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing. We interview your business, map every manual process,
          and deliver a report showing your exact ROI before you spend a dollar
          on tools.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
          >
            Book a Free Intro Call
          </a>
          <Link
            href="/assessment"
            className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
          >
            Take the Assessment →
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Free intro call · No obligation · Report delivered in 24–48 hrs
        </p>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-500 text-xs animate-bounce">
            <span>Scroll to learn more</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
