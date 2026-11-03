"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const TRACKED_HOSTS = ["sacramentoaiagency.com", "www.sacramentoaiagency.com"];

// GoHighLevel external tracking, live domain only. Checks the hostname rather than
// VERCEL_ENV because production deployments are also reachable at *.vercel.app URLs.
export default function GhlTracking() {
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    setTracked(TRACKED_HOSTS.includes(window.location.hostname));
  }, []);

  if (!tracked) return null;

  return (
    <Script
      src="https://link.msgsndr.com/js/external-tracking.js"
      data-tracking-id="tk_286596f627e147ceb9d959e7ca082629"
      strategy="afterInteractive"
    />
  );
}
