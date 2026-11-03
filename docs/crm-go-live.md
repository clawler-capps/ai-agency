# CRM go-live checklist

How the site sends leads to GoHighLevel (GHL). No n8n and no GHL API token: the site's own Vercel API routes post to a GHL Inbound Webhook, and Resend sends the system emails.

## What the code does now

- `/assessment` (AI Opportunity Snapshot): `/api/capture-email` re-scores the answers on the server, posts the lead to `LEAD_WEBHOOK_URL`, emails the visitor an instant confirmation, and notifies `TYLER_NOTIFICATION_EMAIL`. If the webhook post fails, the visitor sees an error and can retry.
- `/questionnaire` and `/contact` also post to `LEAD_WEBHOOK_URL`, best effort.
- Webhook posts only happen when `FUNNEL_ENABLED=true`. Set it on Vercel Production only, so Preview deploys never create contacts.
- Logs hold status only (`[leads]`, `[capture-email]`), never names, emails, or answers. Tyler's notification email has the details.
- Emails come from `RESEND_FROM_EMAIL` with Reply-To `RESEND_REPLY_TO`. The footer shows `MAILING_ADDRESS` when set.
- Book a Call buttons use `NEXT_PUBLIC_BOOKING_URL`. If it is empty, they open an email. It is inlined at build time, so redeploy after changing it.

## Assessment webhook payload

Every field is flat so it maps directly in the GHL workflow:

| Field | Example |
|---|---|
| `source` | `website-assessment` |
| `submittedAt` | ISO timestamp |
| `name`, `first_name`, `email`, `company` | |
| `company_size` | `Solo`, `2–10`, `11–50`, `50+` |
| `industry` | `Construction & Trades` |
| `website` | optional, may be empty |
| `score` | 0–100 |
| `tier` | `AI-Curious`, `AI-Ready`, `AI-Leading` |
| `score_data`, `score_process`, `score_team`, `score_leadership`, `score_vertical` | 0–100 per pillar |
| `q1_answer` … `q9_answer` | the chosen option's text |
| `answers_summary` | every question and answer, as text |
| `consent` | `true` only if the visitor ticked the tips checkbox |
| `test` | `true` for test addresses |
| `tags` | comma-separated, e.g. `assessment-submitted,assessment-ai-ready,marketing-consent,test-lead` |

## GoHighLevel hookup

1. Workflow "Website leads" uses the Inbound Webhook trigger. Its URL is `LEAD_WEBHOOK_URL`.
2. Submit one test, then map the fields above in the trigger.
3. Add actions: create or update contact, add the tags from `tags`, and only add nurture when `consent` is `true`.
4. Publish the workflow.

## Test

- Submit `/assessment` with a test address. Confirm the confirmation email, Tyler's notification, and (on Production) the GHL contact.
- If a lead is missing, search the Vercel logs for `[capture-email]` and `[leads]`.
