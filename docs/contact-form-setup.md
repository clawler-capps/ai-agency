# Contact Form — Setup & Go-Live Guide

This is your step-by-step to finish wiring the `/contact` page and, when you're
ready, make it public. Everything in the code is already done — the remaining
work is account/DNS/hosting configuration on your side.

---

## What's already built

- **Page:** `app/contact/page.tsx` — warm copy, no phone number, slug is `contact`.
- **Form:** `components/ContactForm.tsx` — fields: **Name**, **Email**, **Company**
  (optional), **How can we help?** (message). Plus two hidden honeypot fields
  (`website`, `fax`) that trap spam bots.
- **API:** `app/api/contact/route.ts` — validates input, drops honeypot hits,
  rate-limits to 5 messages/hour per IP, and emails you via Resend with the
  visitor's address set as reply-to (so you just hit "Reply").
- **Pre-launch guards:** the page is **unlinked** from all nav/footer and carries
  `robots: { index: false, follow: false }`, so it won't show in search results
  or menus. It *is* reachable by direct URL (`/contact`) so your dependent build
  works.

**Your email address never touches the browser** — it lives only in a server
environment variable, so it can't be scraped off the page.

---

## Step 1 — Finish Resend domain verification (DNS)

You verified `sacramentoaiagency.com` in the Resend dashboard, but Resend also
needs DNS records live on the domain before it will *send* from it.

1. In Resend → **Domains** → `sacramentoaiagency.com`, copy the DNS records it
   lists (typically a few **TXT** records for SPF + DKIM, and sometimes a
   **CNAME/MX** for the return-path).
2. Log in to wherever your DNS is managed (your **domain registrar** — e.g.
   GoDaddy, Namecheap, Cloudflare — or your **name server / hosting** provider).
3. Add each record exactly as Resend shows it (host/name, type, value). Leave
   TTL at the default.
4. Save, then return to Resend and click **Verify**. DNS can take anywhere from
   a few minutes to a few hours to propagate. The domain shows **Verified** when
   it's ready.

> Until this is done, sends fail with `403 — domain is not verified`, and the
> form will show visitors a "please try again" error. The message is still
> logged server-side, so nothing is silently lost.

---

## Step 2 — Add environment variables to Vercel (production)

The secrets currently live only in your local `.env.local` (which is gitignored
and never deployed). Production needs its own copy.

In the **Vercel dashboard** → your project → **Settings** → **Environment
Variables**, add these three (Production, and Preview if you use it):

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | your Resend API key (`re_...`) |
| `RESEND_FROM_EMAIL` | `Sacramento AI Agency <contact@sacramentoaiagency.com>` |
| `TYLER_NOTIFICATION_EMAIL` | `tyler@sacramentoaiagency.com` |

Then **redeploy** (Vercel → Deployments → ⋯ → Redeploy) so the new variables
take effect.

---

## Step 3 — Rotate your API key (security)

The key you pasted while setting this up was shared in plaintext, so treat it as
compromised:

1. Resend → **API Keys** → create a **new** key.
2. Update it in **both** places: your local `.env.local` and the Vercel env var
   from Step 2.
3. **Delete/revoke** the old key in Resend.

---

## Step 4 — Test it end-to-end

**Locally** (after Step 1 verifies the domain):

```bash
npm run dev
# then in another terminal:
curl -s -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","company":"Test Co","question":"Testing the form."}'
```

A `{"success":true}` response plus an email in your `tyler@sacramentoaiagency.com`
inbox means it's working. You can also just open `http://localhost:3000/contact`
and submit the form by hand.

**In production:** open `https://sacramentoaiagency.com/contact` and submit a
real test message.

---

## Step 5 — Go live (when you're ready to show it)

Right now the page is intentionally hidden. To make it public, two small code
changes:

1. **Remove the `robots` block** in `app/contact/page.tsx` (delete the
   `robots: { index: false, follow: false },` line) so search engines can index it.
2. **Add navigation links** so people can find it. Suggested spots:
   - `components/Navbar.tsx` — add `{ href: "/contact", label: "Contact" }` to the
     nav link arrays (desktop + mobile).
   - `components/Footer.tsx` — add a "Contact Us" link under the **Get Started**
     list.

Ask Claude to "make the contact page public" and it'll do both.

---

## Optional — add a CAPTCHA (stronger spam defense)

The honeypots + rate limit stop most spam with zero friction. If you later want
to block sophisticated bots too, **Cloudflare Turnstile** is free and usually
invisible to real visitors. It needs a site key + secret key from the Cloudflare
dashboard, then wiring in the form and the API route. Ask Claude to add it when
you're ready.

---

## Quick reference — the moving parts

| Piece | File / Location |
| --- | --- |
| Page | `app/contact/page.tsx` |
| Form UI | `components/ContactForm.tsx` |
| Submit handler / email send | `app/api/contact/route.ts` |
| Local secrets (gitignored) | `.env.local` |
| Production secrets | Vercel → Settings → Environment Variables |
| Email provider | [Resend](https://resend.com) (free tier: 3,000/mo, 100/day) |
