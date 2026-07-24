import Link from "next/link";
import { BOOKING_URL } from "@/lib/booking";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight">Sacramento</span>
              <span className="text-2xl font-bold text-accent tracking-tight">AI</span>
              <span className="text-2xl font-bold text-white tracking-tight">Agency</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              AI consulting for Sacramento and beyond. We coach people to AI fluency and
              build governed systems — measured in hours actually reclaimed.
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
                { href: "/pricing#assess", label: "AI Leverage Assessment" },
                { href: "/pricing#enable", label: "AI Fluency Coaching" },
                { href: "/pricing#build-day", label: "AI Build Day" },
                { href: "/pricing#lead", label: "Embedded AI Partner" },
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
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Book a Free Intro Call
                </a>
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
            © {new Date().getFullYear()} Tyler Capps / Sacramento AI Agency. All rights reserved.
          </p>
          <p className="text-xs text-white/30 font-mono">
            BUILT TO HELP SACRAMENTO WIN WITH AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
