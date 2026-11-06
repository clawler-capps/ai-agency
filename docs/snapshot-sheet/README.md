# Snapshot statistics sheet

Anonymous answer statistics for the AI Snapshot, kept in Google Sheets so Tyler can see answer spreads and drop-off. GoHighLevel holds contact details; this sheet never gets names or emails.

- **Sheet:** "AI Snapshot Responses" in tyler@sacramentoaiagency.com's My Drive, under `Sacramento AI Agency / Snapshot Data`
  https://docs.google.com/spreadsheets/d/1S-_PinSETH7IggN7Bgen45ob1gj6W1iSY5kVN61eJTE/edit
- **Receiver:** the Apps Script bound to the sheet ("Snapshot Receiver", Extensions → Apps Script). The source is `Code.gs` in this folder. It's deployed as a web app (Execute as: me, Access: anyone), and every request must carry the shared secret.
- **Site env:** `SNAPSHOT_SHEET_URL` (the web app `/exec` URL) and `SNAPSHOT_SHEET_SECRET`. Both are set on Vercel Production and Preview and in `.env.local`. The script stores the secret in Script Properties on the first `init` call and never changes it after that.

## Tabs
- **Leads:** one row per unlocked Snapshot, posted by `/api/capture-email` after the GHL lead post. Emails typed into free-text answers are replaced with "[email removed]".
- **Steps:** one row per completed step per visit (random session id), posted by `/api/snapshot-event`. Multiple-choice steps carry the option text; the other steps carry "answered".
- **Summary:** live formulas for the funnel (sessions reaching each step, drop-off), answer spread per question (completed vs. all visitors), tier counts, and two charts. Test rows are left out unless "Include test rows?" is ticked.

## Which rows get written
- On Production (`FUNNEL_ENABLED=true`), every real visit is written.
- On Preview and locally, only test rows are written:
  - Steps when the page is opened as `/assessment?test=1`
  - Leads when the test email is used
  - Both are marked `test = TRUE`.

## Changing the script
1. Edit it in the Apps Script editor, then run `setup()` to rebuild the Summary. Data rows are kept.
2. To change `doPost`, use Deploy → Manage deployments → edit → New version. This keeps the same URL.
3. Copy the new source back into `Code.gs` here.
