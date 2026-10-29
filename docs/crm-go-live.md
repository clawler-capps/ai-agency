# CRM go-live checklist

Steps to connect the site to GoHighLevel (GHL). All of it is Vercel environment variables. No code changes.

## What the code does now

- `/assessment` quiz: the `capture-email` route posts the lead to `LEAD_WEBHOOK_URL` and emails Tyler.
- `/questionnaire`: the `questionnaire` route does the same. `QUESTIONNAIRE_WEBHOOK_URL` still works as a legacy second target.
- `/contact`: the `contact` route keeps its own email and also posts to `LEAD_WEBHOOK_URL`.
- Every post is JSON with `source` (`assessment`, `contact`, or `questionnaire`) and `submittedAt`.
- Webhook and email are best effort. If either fails, the visitor still sees success and the lead is written to the Vercel logs.
- Email needs `RESEND_API_KEY` and `TYLER_NOTIFICATION_EMAIL`. `RESEND_FROM_EMAIL` is optional.
- Book a Call buttons use `NEXT_PUBLIC_BOOKING_URL`. If it is empty, they open an email.
- The chat widget loads only when `NEXT_PUBLIC_CHAT_WIDGET_SRC` is set. It is hidden on `/questionnaire`.

## GoHighLevel hookup

1. In GHL, create a workflow with the Inbound Webhook trigger. Copy its URL.
2. In Vercel, set `LEAD_WEBHOOK_URL` to that URL.
3. Submit one test form, then open the trigger in GHL and map the fields to contact fields:
   - `source`
   - `name`
   - `email`
   - `company`
   - `tier`
   - `totalPct`
   - `question`
4. Add workflow actions: create or update contact, tag by `source`, notify Tyler.
5. In GHL, create a calendar. Copy its permalink into `NEXT_PUBLIC_BOOKING_URL`.
6. Optional: set `NEXT_PUBLIC_BOOKING_EMBED_URL` if the embed link differs from the permalink.
7. In GHL, create the chat widget and copy its install snippet. Put the values in Vercel:
   - `NEXT_PUBLIC_CHAT_WIDGET_SRC` is the loader URL (`https://widgets.leadconnectorhq.com/loader.js`)
   - `NEXT_PUBLIC_CHAT_WIDGET_ID` is `data-widget-id`
   - `NEXT_PUBLIC_CHAT_WIDGET_RESOURCES_URL` is `data-resources-url`
8. Redeploy. `NEXT_PUBLIC_` variables are inlined at build time, so changing them does nothing until a new build.

## GitHub secret

Before merging this branch, add `VERCEL_DEPLOY_HOOK_URL` in the repo under Settings, Secrets and variables, Actions. Use the deploy hook URL from the Vercel project settings (Git, Deploy Hooks). The deploy workflow no longer holds the URL and fails if the secret is empty, so deploys stop until it is added.

## Test

- Submit the `/assessment` quiz, the `/contact` form, and the `/questionnaire` form.
- Confirm each contact appears in GHL with the right `source`.
- Confirm the notification email arrives for the assessment and questionnaire forms, and the existing contact email for `/contact`.
- Click a Book a Call button and confirm it opens the GHL calendar.
- Open the site in a private window and confirm the chat bubble appears. Open `/questionnaire` and confirm it does not.
- If a lead is missing, search the Vercel logs for `[leads]`.
