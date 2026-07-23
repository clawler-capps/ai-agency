// Single source of truth for every "book a call" CTA on the site.
//
// STOPGAP (2026-07-24): the old Calendly link (calendly.com/tylercapps/intro)
// returns a 404 — no scheduler account exists yet. Until one is live, CTAs
// open a pre-filled email instead, which works with zero setup.
//
// When the scheduler is ready (recommended: Cal.com with both the agency
// Google calendar and the Integral Analytics Outlook calendar connected):
//   1. Set BOOKING_URL to the event link, e.g. "https://cal.com/tylercapps/intro"
//   2. Set BOOKING_EMBED_URL to the same link — the embedded scheduler on the
//      assessment results page is hidden while this is null.
export const BOOKING_URL =
  "mailto:tyler@sacramentoaiagency.com?subject=Intro%20call%20request%20%E2%80%94%20Sacramento%20AI%20Agency&body=Hi%20Tyler%2C%0A%0AI%27d%20like%20to%20book%20an%20intro%20call.%20Here%20are%20a%20few%20times%20that%20work%20for%20me%3A%0A%0A";

export const BOOKING_EMBED_URL: string | null = null;
