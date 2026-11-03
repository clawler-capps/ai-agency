# Connect the Site to Go High Level

How the site talks to Go High Level (GHL) today, and the steps to connect the
free assessment at `/assessment`. GHL menu names change often, so treat them as
approximate.

---

## What's already connected

| Piece | Where | Runs on | Notes |
| --- | --- | --- | --- |
| Tracking script | `components/GhlTracking.tsx` | `sacramentoaiagency.com` and `www.` only | Skips previews, `*.vercel.app` URLs and localhost |
| AI chat widget | `components/ChatWidget.tsx` (homepage, via `components/Hero.tsx`) | Every deployment | Widget ID `6ae6c63d03d93fc52138845d` |

**Who answers the chat is set in GHL, not in the code.** The agent must be active,
have Live Chat enabled, and be in **Auto-Pilot**. In any other mode, visitors get
"Looks like no one is available."

To track another domain, add it to `TRACKED_HOSTS` in `components/GhlTracking.tsx`.

---

## Not connected yet: the free assessment

The quiz works, but it isn't linked anywhere on the site and **it loses every
lead**. `app/api/capture-email/route.ts` only writes submissions to the server log.

### Recommended setup

Keep the quiz on the site, and send each submission to a GHL workflow from the
server. The scoring stays in one place, and GHL handles contacts and follow-up.

```
/assessment -> /api/capture-email -> GHL inbound webhook -> workflow -> contact + tag + email
```

### Step 1: Fix the quiz before linking to it

These are problems whether or not GHL is connected:

1. **Remove the made-up ranking.** "Top X% of Sacramento-area businesses" comes
   from a formula, not real data (`computePeerPercentile` in
   `components/assessment/scoring.ts`). Also remove the "benchmarking against
   Sacramento-area peers" line in `components/assessment/AssessmentForm.tsx`.
2. **Separate the two assessments.** The "Free AI Opportunity Assessment" sits
   alongside the paid $997 AI Leverage Assessment. Pick a clearly different name
   for the free one, such as "AI readiness quiz".
3. **Match the other copy.** The results offer a 20-minute call and the site offers
   15. `app/assessment/page.tsx` says 7 questions, and there are 9.
4. **Add a consent checkbox** if the workflow will send marketing follow-ups.

### Step 2: Create the workflow in GHL

1. Go to **Automation > Workflows > Create Workflow**.
2. Add the **Inbound Webhook** trigger and copy its URL. Check that your plan
   includes this trigger; it may be billed as a premium feature.
3. Send one test submission so GHL can see the fields (see Step 4).
4. Add a **Create/Update Contact** action. Map name, email and company.
5. Add tags by tier: `assessment-ai-curious`, `assessment-ai-ready`,
   `assessment-ai-leading`.
6. Add the roadmap email. The results page already promises it to AI-Curious
   visitors, "usually within 10 minutes", so this step must be live before launch.
7. Optionally, notify yourself and send AI-Ready and AI-Leading contacts a booking
   link. Then **publish** the workflow.

### Step 3: Add the webhook URL to Vercel

In Vercel, go to **Settings > Environment Variables** and add this for
**Production only**, so previews can't create real contacts:

| Name | Value |
| --- | --- |
| `GHL_ASSESSMENT_WEBHOOK_URL` | the URL from Step 2 |

Treat the URL like a password: anyone who has it can create contacts. Add it to
your local `.env.local` only when testing. Never put it in client-side code.

### Step 4: Send submissions from the API route

Ask Claude to "connect the assessment to the GHL webhook". The change goes in
`app/api/capture-email/route.ts`, replacing the commented-out Resend example:

```ts
const webhookUrl = process.env.GHL_ASSESSMENT_WEBHOOK_URL;
if (webhookUrl) {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, company, tier, totalPct, industry, pillars, answers }),
  });
  if (!res.ok) console.error("[capture-email] GHL webhook failed:", res.status);
}
```

The form shows results even if this call fails, so check the logs and GHL contacts
when testing. Also remove the `console.log` of the full lead once this works, so
personal details stop going to the server logs.

### Step 5: Test, then relink

1. Submit the quiz once for each tier, using an email address you control.
2. Confirm the contact, the tag and the email in GHL, then delete the test contacts.
3. Add a link back to the site. The July 23 commit `8b6fac9` removed them so the
   site had one call to action, so decide where a second one fits.

---

## Quick reference

| Piece | Location |
| --- | --- |
| Tracking script and allowed domains | `components/GhlTracking.tsx` |
| Chat widget and button | `components/ChatWidget.tsx` |
| Quiz questions | `components/assessment/questions.ts` |
| Scoring and tiers | `components/assessment/scoring.ts` |
| Quiz screens | `components/assessment/AssessmentForm.tsx` |
| Lead submission | `app/api/capture-email/route.ts` |
| Production secrets | Vercel > Settings > Environment Variables |
