// Founder and business facts shown across the site, in one place.
// Every `null` below is a TODO Tyler fills in. Until then the site shows a
// clearly marked placeholder (see components/Todo.tsx) instead of a guess.

export const FOUNDER = {
  name: "Tyler Capps",
  // From Tyler's resume: MBA, MIT Sloan + SM Mechanical Engineering, MIT (LGO, 2017).
  credentials: "MIT MBA and MS",
  // TODO(tyler): confirm years in the energy industry (PG&E 2016 → Guidehouse →
  // Integral Analytics reads as about 10; the Aug 18 Certarus bio said "10 years energy").
  energyYears: "10",
  energyYearsConfirmed: false,
  city: "Sacramento, CA",
  email: "tyler@sacramentoaiagency.com",
  // TODO(tyler): business phone number to publish (e.g. "(916) 555-0100").
  phone: null as string | null,
  // TODO(tyler): LinkedIn profile URL (e.g. "https://www.linkedin.com/in/…").
  linkedinUrl: null as string | null,
  // TODO(tyler): add public/tyler-headshot.jpg (hi-res original preferred; at
  // least 800×800), then set this to "/tyler-headshot.jpg".
  headshot: null as string | null,
};

// TODO(tyler): Stripe Payment Link for the $997 AI Leverage Assessment (or a
// deposit). Set NEXT_PUBLIC_ASSESSMENT_CHECKOUT_URL on Vercel, e.g.
// https://buy.stripe.com/… — read at build time, so redeploy after setting it.
// Until it's set, "Book the Assessment" goes to /book?for=assessment.
const checkout = process.env.NEXT_PUBLIC_ASSESSMENT_CHECKOUT_URL?.trim();
export const ASSESSMENT_CHECKOUT_URL: string = checkout || "/book?for=assessment";
export const ASSESSMENT_CHECKOUT_LIVE = Boolean(checkout);

// The one Build Day description used everywhere (homepage, Pricing, FAQ).
// TODO(tyler): confirm "two in-person half-days" (the homepage used to say "one afternoon").
export const BUILD_DAY_FORMAT = "two in-person half-days";
