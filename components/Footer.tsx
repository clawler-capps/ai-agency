import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-primary-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <span className="text-xl font-bold gradient-text">Capps AI</span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              AI consulting for small businesses. We find where AI saves you time
              and money — then we prove it.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/pricing", label: "Pricing" },
                { href: "/assessment", label: "Assessment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Get Started
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Book a Free Intro Call
                </a>
              </li>
              <li>
                <Link
                  href="/assessment"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Take the Assessment
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  View Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Tyler Capps / Capps AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built to help small businesses win with AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
