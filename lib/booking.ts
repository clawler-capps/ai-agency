// Single source of truth for every "book a call" CTA on the site.
//
// Set NEXT_PUBLIC_BOOKING_URL on Vercel to your scheduler link. A GoHighLevel
// calendar link, a Cal.com link, or a Calendly link all work.
// NEXT_PUBLIC_BOOKING_EMBED_URL is optional and defaults to the same link; it
// feeds the embedded scheduler on the assessment results page.
// Both values are read at build time, so redeploy after changing them.
//
// With no variable set, CTAs open a pre-filled email to Tyler.
const MAILTO_FALLBACK =
  "mailto:tyler@sacramentoaiagency.com?subject=Intro%20call%20request%20%E2%80%94%20Sacramento%20AI%20Agency&body=Hi%20Tyler%2C%0A%0AI%27d%20like%20to%20book%20an%20intro%20call.%20Here%20are%20a%20few%20times%20that%20work%20for%20me%3A%0A%0A";

const configuredUrl = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();

export const BOOKING_URL: string = configuredUrl || MAILTO_FALLBACK;

export const BOOKING_EMBED_URL: string | null = configuredUrl
  ? process.env.NEXT_PUBLIC_BOOKING_EMBED_URL?.trim() || configuredUrl
  : null;
