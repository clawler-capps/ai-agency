"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border bg-primary/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">Capps AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#how-it-works"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/assessment"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Assessment
            </Link>
            <Link
              href="/#faq"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/assessment" className="btn-secondary text-sm py-2 px-4">
              Take Assessment
            </Link>
            <a
              href="https://calendly.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2 px-4"
            >
              Book a Call
            </a>
          </div>

          <button
            className="md:hidden text-gray-300 hover:text-white"
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
          <div className="md:hidden pb-4 pt-2 border-t border-surface-border">
            <nav className="flex flex-col gap-3 mt-3">
              <Link href="/#how-it-works" className="text-gray-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>How It Works</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>Pricing</Link>
              <Link href="/assessment" className="text-gray-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>Assessment</Link>
              <Link href="/#faq" className="text-gray-300 hover:text-white py-1" onClick={() => setMenuOpen(false)}>FAQ</Link>
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/assessment" className="btn-secondary text-sm text-center" onClick={() => setMenuOpen(false)}>Take Assessment</Link>
                <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm text-center">Book a Call</a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
