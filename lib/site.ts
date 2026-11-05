// Founder and business facts shown across the site, in one place.
// A `null` value hides that item on the live site. Nothing unconfirmed is shown.

export const FOUNDER = {
  name: "Tyler Capps",
  // From Tyler's resume: MBA, MIT Sloan + SM Mechanical Engineering, MIT (LGO fellow, 2017).
  credentials: "MIT MBA and MS",
  // Tyler's own words in his Aug 2026 client pitch: "economic modeling in the energy
  // industry for, like, the last 10 years" (PG&E 2016 → Guidehouse → Integral Analytics).
  energyYears: "10",
  city: "Sacramento, CA",
  email: "tyler@sacramentoaiagency.com",
  // TODO(tyler): business phone to publish. Hidden on /contact while null.
  phone: null as string | null,
  // Not shown on the site for now (Tyler's call, Nov 5). Set a URL to add it back.
  linkedinUrl: null as string | null,
  // 1200×1200 square and 960×1186 portrait, cropped from Tyler's photo (Nov 5).
  headshot: "/tyler-headshot.jpg",
  headshotPortrait: "/tyler-headshot-portrait.jpg",
};

// TODO(tyler): Stripe Payment Link for the $997 AI Leverage Assessment (or a
// deposit). Set NEXT_PUBLIC_ASSESSMENT_CHECKOUT_URL on Vercel, e.g.
// https://buy.stripe.com/… It's read at build time, so redeploy after setting it.
// Until it's set, "Book the Assessment" goes to /book?for=assessment.
const checkout = process.env.NEXT_PUBLIC_ASSESSMENT_CHECKOUT_URL?.trim();
export const ASSESSMENT_CHECKOUT_URL: string = checkout || "/book?for=assessment";
export const ASSESSMENT_CHECKOUT_LIVE = Boolean(checkout);

// The one Build Day description used everywhere (homepage, Pricing, FAQ).
export const BUILD_DAY_FORMAT = "two in-person half-days";

// Proven results from the current energy-company engagement. Source:
// AI-OS/agency/clients/2_Active/Certarus/leverage-scoreboard.html (+ .md), last
// updated Aug 21, 2026. Only client-confirmed rows count here:
//   - Board-deck skill: 0.75 hrs/wk, $3,600/yr (proven live 7/16, ~12 hrs → ~3 hrs per deck)
//   - Dictation for the strategy lead: 2 hrs/wk, $9,600/yr (validated with him 7/17)
// The dashboard's 4.75 hrs/wk / $22,800 headline also counts a second dictation
// row booked on Tyler's judgement (daily use not confirmed), so it's left out.
// TODO(tyler): update when more builds are validated.
export const PROOF = {
  label: "North American energy company · 2 people coached",
  hoursPerWeek: "2.75",
  dollarsPerYear: "$13,200",
  asOf: "August 21, 2026",
};
