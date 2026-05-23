import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight">Capps</span>
              <span className="text-2xl font-bold text-accent tracking-tight">AI</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              AI consulting for Sacramento businesses. We find where AI saves you time
              and money — then we prove it with ROI numbers.
            </p>
            <p className="mt-4 text-xs font-mono text-white/40 tracking-wider">
              SACRAMENTO, CA
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-white/40 mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/pricing#tier-1", label: "AI Business Assessment" },
                { href: "/pricing#tier-2", label: "Tool Setup & Quick Wins" },
                { href: "/pricing#tier-3", label: "Automation & Redesign" },
                { href: "/pricing#tier-4", label: "Fractional Chief AI Officer" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs tracking-widest uppercase text-white/40 mb-4">
              Get Started
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://calendly.com/tylercapps/intro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Book a Free Intro Call
                </a>
              </li>
              <li>
                <Link href="/assessment" className="text-sm text-white/60 hover:text-white transition-colors">
                  Take the Assessment
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-white/60 hover:text-white transition-colors">
                  View Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 font-mono">
            © {new Date().getFullYear()} Tyler Capps / Capps AI. All rights reserved.
          </p>
          <p className="text-xs text-white/30 font-mono">
            BUILT TO HELP SACRAMENTO WIN WITH AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
