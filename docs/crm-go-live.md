# CRM go-live checklist

How the site sends leads to GoHighLevel (GHL). No n8n and no GHL API token: the site's own Vercel API routes post to a GHL Inbound Webhook, and Resend sends the system emails.

## What the code does now

- `/assessment` (AI Opportunity Snapshot): `/api/capture-email` re-scores the answers on the server and posts the lead to `LEAD_WEBHOOK_URL` first. If that post fails, the visitor sees an error and can retry. The results page then shows the dollar estimate, the top opportunity, and a try-it-tonight prompt straight away.
- After responding, the route makes one Claude call (`claude-sonnet-5-5`, `ANTHROPIC_API_KEY`) and emails the visitor one results email (usually about 10 seconds). It retries once; if Claude still fails, a template report built from the same math goes out and Tyler gets an alert. Tyler's notification email is sent too.
- Report results post to `REPORT_WEBHOOK_URL` (a second GHL Inbound Webhook) when it is set.
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
| `role` | `Owner or founder`, `Executive or senior leader`, `Manager or team lead`, `Team member`, `Other` |
| `bottleneck` | where they lose the most time, in their words |
| `hours_per_week` | hours a week on it |
| `hourly_value` | what an hour is worth ($, default 75) |
| `est_value_low`, `est_value_high` | yearly value of fixing it: hours × rate × 50 weeks × 30% / 60% |
| `top_opportunity` | e.g. `Faster lead follow-up and quotes` |
| `score` | 0–100 |
| `tier` | `AI-Curious`, `AI-Ready`, `AI-Leading` |
| `score_data`, `score_process`, `score_team`, `score_leadership`, `score_vertical` | 0–100 per pillar |
| `q1_answer` … `q9_answer` | the chosen option's text |
| `answers_summary` | every question and answer, as text |
| `consent` | `true` only if the visitor ticked the tips checkbox |
| `test` | `true` for test addresses |
| `tags` | comma-separated, e.g. `assessment-submitted,assessment-ai-ready,marketing-consent,test-lead` |

## Report webhook payload (`REPORT_WEBHOOK_URL`)

| Field | Example |
|---|---|
| `source` | `website-assessment-report` |
| `submittedAt` | ISO timestamp |
| `email` | matches the lead |
| `report_status` | `sent` or `failed` |
| `top_opportunity` | e.g. `Automated weekly reporting` |
| `estimated_annual_value` | e.g. `$7,200–$14,400 a year` (text, for display) |
| `est_value_low` | e.g. `7200` (number, for GHL number fields) |
| `est_value_high` | e.g. `14400` (number) |
| `hours_per_week` | number |
| `bottleneck` | text |

## GoHighLevel hookup

1. Workflow "Website leads" uses the Inbound Webhook trigger. Its URL is `LEAD_WEBHOOK_URL`.
2. Submit one test, then map the fields above in the trigger.
3. Add actions: create or update contact, add the tags from `tags`, and only add nurture when `consent` is `true`.
4. Publish the workflow.

## Test

- Submit `/assessment` with a test address. Confirm the confirmation email, Tyler's notification, and (on Production) the GHL contact.
- If a lead is missing, search the Vercel logs for `[capture-email]` and `[leads]`.
