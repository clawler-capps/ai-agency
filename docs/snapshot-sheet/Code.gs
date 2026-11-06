// AI Snapshot Responses: receiver for sacramentoaiagency.com.
// Deployed as a web app (Execute as: me, Access: anyone). Every request must
// carry the shared secret, which lives only in Script Properties and in the
// site's server env (SNAPSHOT_SHEET_SECRET). No names or emails are stored.

const LEADS_HEADERS = ["timestamp","test","industry","company_size","revenue_band","role",
  "q1_answer","q2_answer","q3_answer","q4_answer","q5_answer","q6_answer","q7_answer","q8_answer","q9_answer",
  "bottleneck","followup_choice","followup_text","hours_per_week","cost_basis","hourly_value","score","tier",
  "score_data","score_process","score_team","score_leadership","score_vertical",
  "est_value_low","est_value_high","top_opportunity","consent","source"];
const STEPS_HEADERS = ["timestamp","session_id","step_index","step_id","answer","device","test"];
const QUESTIONS = [{"id":1,"q":"First, which best describes your business?","opts":["Professional services (consulting, legal, accounting)","Healthcare","Construction and trades","ADU and home building","Real estate","Engineering","Technology and software","Insurance and financial services","Manufacturing, logistics, or agriculture","Retail, e-commerce, or franchise","Other"]},{"id":2,"q":"How big is your team today?","opts":["Just me","2–10 people","11–50 people","50+ people"]},{"id":3,"q":"Where does your customer information actually live?","opts":["Mostly in my head, sticky notes, or scattered emails","Spreadsheets and inboxes","A CRM, but the team uses it inconsistently","A central CRM the whole team keeps current"]},{"id":4,"q":"When you need a key number (revenue, jobs in progress, leads this month), how do you get it?","opts":["I estimate it. There's no real source of truth","Someone compiles it manually in a spreadsheet","I check a few tools and add it up myself","It's in a live dashboard I can pull up anytime"]},{"id":5,"q":"Are your most repeated workflows (intake, onboarding, reporting) documented?","opts":["Not at all. They live in people's heads","A few are written down somewhere","Most have SOPs, but they're outdated","Yes. SOPs are current and the team follows them"]},{"id":6,"q":"How many hours per week does your team spend on repetitive, manual tasks?","opts":["30+ hours. It's a real problem","15–30 hours","5–15 hours","Under 5 hours. We're pretty automated"]},{"id":7,"q":"When you've introduced new tools in the past, how did it go?","opts":["Honestly, we still use the old way","A few people picked it up, most didn't","Adoption took time, but we got there","The team is curious and adopts new tools quickly"]},{"id":8,"q":"Where is AI on your priority list for this quarter?","opts":["Not on the radar. I'm still in 'what is this' mode","Exploring, but no time or budget set aside","I've allocated some budget and want the right project","Top-3 priority. I'm actively investing"]},{"id":9,"q":"Do you have a specific workflow in mind that you'd want to automate first?","opts":["Not really. I'm looking for guidance on where to start","A general sense, but no specific list","A few specific things in mind","Yes, a clear list of tasks ready to automate"]}];
const STEP_LABELS = [["start","Started the Snapshot"]]
  .concat(QUESTIONS.map(function (q) { return ["q" + q.id, "Q" + q.id + ". " + q.q]; }))
  .concat([["bottleneck","Biggest time drain"],["followup","Follow-up question"],["numbers","Your numbers (report built)"],["unlocked","Unlocked full snapshot"]]);

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Stops a visitor's free text from running as a formula.
function cell(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "number" || typeof v === "boolean") return v;
  var s = String(v).slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doGet() {
  return json({ ok: true });
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: "bad json" }); }
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty("SECRET");
  // One-time setup: the first "init" call stores the secret. After that it can't change.
  if (!secret) {
    if (body.type === "init" && typeof body.secret === "string" && body.secret.length >= 32) {
      props.setProperty("SECRET", body.secret);
      return json({ ok: true, init: true });
    }
    return json({ ok: false, error: "not initialized" });
  }
  if (body.secret !== secret) return json({ ok: false, error: "unauthorized" });
  if (body.type === "init") return json({ ok: true, init: false });

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return json({ ok: false, error: "busy" });
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var r = body.row || {};
    var now = new Date();
    if (body.type === "lead") {
      ss.getSheetByName("Leads").appendRow(LEADS_HEADERS.map(function (h) {
        if (h === "timestamp") return now;
        if (h === "test" || h === "consent") return r[h] === true;
        return cell(r[h]);
      }));
    } else if (body.type === "step") {
      ss.getSheetByName("Steps").appendRow([now, cell(r.session_id), Number(r.step_index) || 0,
        cell(r.step_id), cell(r.answer), cell(r.device), r.test === true]);
    } else {
      return json({ ok: false, error: "unknown type" });
    }
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Run once from the editor: folders, tabs, headers, Summary formulas, charts.
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename("AI Snapshot Responses");

  // My Drive / Sacramento AI Agency / Snapshot Data
  var root = DriveApp.getRootFolder();
  var it = root.getFoldersByName("Sacramento AI Agency");
  var agency = it.hasNext() ? it.next() : root.createFolder("Sacramento AI Agency");
  var it2 = agency.getFoldersByName("Snapshot Data");
  var data = it2.hasNext() ? it2.next() : agency.createFolder("Snapshot Data");
  DriveApp.getFileById(ss.getId()).moveTo(data);

  function tab(name, i) {
    var sh = ss.getSheetByName(name);
    if (!sh) {
      var first = ss.getSheets()[0];
      if (i === 0 && first.getLastRow() === 0 && first.getName() !== "Leads") { first.setName(name); sh = first; }
      else sh = ss.insertSheet(name, i);
    }
    return sh;
  }
  var leads = tab("Leads", 0), steps = tab("Steps", 1), sum = tab("Summary", 2);

  leads.getRange(1, 1, 1, LEADS_HEADERS.length).setValues([LEADS_HEADERS]).setFontWeight("bold").setBackground("#eeeeee");
  leads.setFrozenRows(1);
  leads.getRange("A2:A").setNumberFormat("yyyy-mm-dd hh:mm:ss");
  steps.getRange(1, 1, 1, STEPS_HEADERS.length).setValues([STEPS_HEADERS]).setFontWeight("bold").setBackground("#eeeeee");
  steps.setFrozenRows(1);
  steps.getRange("A2:A").setNumberFormat("yyyy-mm-dd hh:mm:ss");

  sum.clear();
  sum.getCharts().forEach(function (c) { sum.removeChart(c); });
  sum.getRange("A1").setValue("AI Snapshot: answer statistics").setFontSize(14).setFontWeight("bold");
  sum.getRange("A2").setValue("Include test rows?");
  sum.getRange("B2").insertCheckboxes().setValue(false);
  sum.getRange("A3").setValue("Test rows (test = TRUE) are left out unless the box is ticked. Leads = completed (unlocked) snapshots. Steps = every visitor, counted once per session.");
  sum.getRange("A5").setValue("Completed snapshots");
  sum.getRange("B5").setFormula("=COUNTIFS(Leads!$B$2:$B,FALSE)+IF($B$2,COUNTIFS(Leads!$B$2:$B,TRUE),0)");
  sum.getRange("A6").setValue("Visitors who started");
  sum.getRange("B6").setFormula('=COUNTUNIQUE(IFERROR(FILTER(Steps!$B$2:$B,Steps!$D$2:$D="start",(Steps!$G$2:$G=FALSE)+$B$2)))');

  var row = 8;
  sum.getRange(row, 1, 1, 5).setValues([["Funnel (from Steps)", "Step", "Sessions reached", "% of starts", "Drop-off from previous step"]]).setFontWeight("bold").setBackground("#eeeeee");
  var funnelStart = row + 1;
  STEP_LABELS.forEach(function (s, i) {
    var r = funnelStart + i;
    sum.getRange(r, 1, 1, 2).setValues([[i, s[1]]]);
    sum.getRange(r, 3).setFormula('=COUNTUNIQUE(IFERROR(FILTER(Steps!$B$2:$B,Steps!$D$2:$D="' + s[0] + '",(Steps!$G$2:$G=FALSE)+$B$2)))');
    sum.getRange(r, 4).setFormula("=IFERROR(C" + r + "/$C$" + funnelStart + ",0)");
    sum.getRange(r, 5).setFormula(i === 0 ? '=""' : "=IFERROR(1-C" + r + "/C" + (r - 1) + ",0)");
  });
  var funnelEnd = funnelStart + STEP_LABELS.length - 1;
  sum.getRange(funnelStart, 4, STEP_LABELS.length, 2).setNumberFormat("0%");

  // Answer spread per question: completed snapshots (Leads) and all visitors (Steps).
  row = funnelEnd + 3;
  var tierBlock = null;
  var blocks = QUESTIONS.map(function (q) {
    return { title: "Q" + q.id + ". " + q.q, col: "$" + String.fromCharCode(70 + q.id), stepId: "q" + q.id, opts: q.opts };
  });
  blocks.push({ title: "Tier", col: "$W", stepId: null, opts: ["AI-Curious", "AI-Ready", "AI-Leading"] });
  blocks.forEach(function (b) {
    sum.getRange(row, 1, 1, 5).setValues([[b.title, "Completed (Leads)", "% of completed", "All visitors (Steps)", "% of visitors"]]).setFontWeight("bold").setBackground("#eeeeee");
    var first = row + 1, last = row + b.opts.length;
    b.opts.forEach(function (o, i) {
      var r = first + i;
      sum.getRange(r, 1).setValue(o);
      var col = "Leads!" + b.col + "$2:" + b.col;
      sum.getRange(r, 2).setFormula("=COUNTIFS(" + col + ",$A" + r + ",Leads!$B$2:$B,FALSE)+IF($B$2,COUNTIFS(" + col + ",$A" + r + ",Leads!$B$2:$B,TRUE),0)");
      sum.getRange(r, 3).setFormula("=IFERROR(B" + r + "/SUM(B$" + first + ":B$" + last + "),0)");
      if (b.stepId) {
        sum.getRange(r, 4).setFormula('=COUNTUNIQUE(IFERROR(FILTER(Steps!$B$2:$B,Steps!$D$2:$D="' + b.stepId + '",Steps!$E$2:$E=$A' + r + ",(Steps!$G$2:$G=FALSE)+$B$2)))");
        sum.getRange(r, 5).setFormula("=IFERROR(D" + r + "/SUM(D$" + first + ":D$" + last + "),0)");
      }
    });
    sum.getRange(first, 3, b.opts.length, 1).setNumberFormat("0%");
    sum.getRange(first, 5, b.opts.length, 1).setNumberFormat("0%");
    if (b.title === "Tier") tierBlock = [first, last];
    row = last + 2;
  });
  sum.setColumnWidth(1, 420); sum.setColumnWidth(2, 260);
  sum.setColumnWidths(3, 3, 150);
  sum.setFrozenRows(2);

  sum.insertChart(sum.newChart().asBarChart()
    .addRange(sum.getRange(funnelStart, 2, STEP_LABELS.length, 2))
    .setOption("title", "Snapshot funnel: sessions reaching each step")
    .setOption("legend", { position: "none" })
    .setPosition(8, 7, 0, 0).setOption("width", 640).setOption("height", 420).build());
  sum.insertChart(sum.newChart().asColumnChart()
    .addRange(sum.getRange(tierBlock[0], 1, tierBlock[1] - tierBlock[0] + 1, 2))
    .setOption("title", "Completed snapshots by tier")
    .setOption("legend", { position: "none" })
    .setPosition(31, 7, 0, 0).setOption("width", 640).setOption("height", 320).build());

  ss.setActiveSheet(sum);
  return ss.getUrl();
}
