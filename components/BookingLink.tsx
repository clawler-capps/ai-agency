"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { BOOKING_URL } from "@/lib/booking";

type Props = {
  location: string;
  label: string;
  className?: string;
  children: React.ReactNode;
  // Defaults to the booking link. Pass an internal path (e.g. "/assessment")
  // to track a Snapshot link instead.
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

  if (href && href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href ?? BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
