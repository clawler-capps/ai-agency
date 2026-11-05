"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

type Props = {
  location: string;
  label: string;
  className?: string;
  children: React.ReactNode;
  // Defaults to our own /book page (calendar embedded, with Tyler's photo).
  // Pass an internal path (e.g. "/assessment") to track a Snapshot link, or an
  // external URL (e.g. a Stripe Payment Link) to open it in a new tab.
  href?: string;
  onClick?: () => void;
};

// One tracked link for every booking and Snapshot CTA, so server components
// can stay server components. Sends a Vercel Analytics custom event
// ("cta_click"), which only shows in the dashboard on the Pro plan.
export default function BookingLink({ location, label, className, children, href, onClick }: Props) {
  const handleClick = () => {
    track("cta_click", { location, label });
    onClick?.();
  };

  const target = href ?? "/book";
  if (target.startsWith("/")) {
    return (
      <Link href={target} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={target}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
