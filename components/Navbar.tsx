"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import BookingLink from "@/components/BookingLink";

// Tracks clicks on the live "Free AI Snapshot" link (see components/BookingLink.tsx).
const trackSnapshot = (href: string, location: string) => {
  if (href === "/assessment") track("cta_click", { location, label: "Free AI Snapshot" });
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-paper/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-ink tracking-tight">Sacramento</span>
            <span className="text-xl font-bold text-accent tracking-tight">AI</span>
            <span className="text-xl font-bold text-ink tracking-tight">Agency</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: "/#how-it-works", label: "How It Works" },
              { href: "/#framework", label: "Our Framework" },
              { href: "/assessment", label: "Free AI Snapshot" },
              { href: "/pricing", label: "Pricing" },
              { href: "/#about", label: "About" },
              { href: "/#faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-ink transition-colors"
                onClick={() => trackSnapshot(link.href, "nav")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <BookingLink
              location="nav"
              label="Book a Call"
              className="btn-primary text-sm py-2 px-4"
            >
              Book a Call
            </BookingLink>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-muted hover:text-ink transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-border bg-paper">
            <nav className="flex flex-col gap-1 mt-2">
              {[
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/#framework", label: "Our Framework" },
                { href: "/assessment", label: "Free AI Snapshot" },
              { href: "/pricing", label: "Pricing" },
              { href: "/#about", label: "About" },
                { href: "/#faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted hover:text-ink py-2 px-2 rounded-lg hover:bg-ink/5 transition-colors"
                  onClick={() => {
                    trackSnapshot(link.href, "nav-mobile");
                    setMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border">
                <BookingLink
                  location="nav-mobile"
                  label="Book a Call"
                  className="btn-primary text-sm text-center"
                >
                  Book a Call
                </BookingLink>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
