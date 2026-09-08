/**
 * Teselando lead receiver for a Google Apps Script web-app deployment.
 *
 * Run setupTeselando() once, then deploy this project as a web app:
 * - Execute as: Me
 * - Who has access: Anyone
 */

var SHEET_NAME = "Leads";
var SPREADSHEET_PROPERTY = "TESELANDO_SPREADSHEET_ID";
var HEADERS = [
  "leadId",
  "createdAt",
  "updatedAt",
  "idempotencyKey",
  "phone",
  "sourcePage",
  "studyType",
  "course",
  "university",
  "degree",
  "studies",
  "subjects",
  "needType",
  "examTiming",
  "pauRegion",
  "otherNeed",
  "callPreference",
  "diagnosticComplete"
];

function setupTeselando() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) spreadsheet = SpreadsheetApp.create("Teselando — Leads");

  PropertiesService.getScriptProperties().setProperty(
    SPREADSHEET_PROPERTY,
    spreadsheet.getId()
  );
  ensureSheet_(spreadsheet);

  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl()
  };
}

function doGet() {
  return json_({ ok: true, service: "teselando-leads" });
}

function doPost(event) {
  try {
    var payload = parsePayload_(event);
    if (payload.action === "createLead") return createLead_(payload);
    if (payload.action === "updateDiagnostic") return updateDiagnostic_(payload);
    return json_({ ok: false, error: "invalid_action" });
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return json_({ ok: false, error: "request_failed" });
  }
}

function createLead_(payload) {
  if (String(payload.website || "").trim()) {
    return json_({ ok: false, error: "invalid_request" });
  }

  var phone = normalizePhone_(payload.phone);
  var idempotencyKey = clean_(payload.idempotencyKey, 100);
  var sourcePage = clean_(payload.sourcePage || "/", 160);
  if (!phone || !idempotencyKey) {
    return json_({ ok: false, error: "invalid_lead" });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var existing = findExact_(sheet, 4, idempotencyKey);
    if (existing) {
      return json_({ ok: true, leadId: String(existing.getCell(1, 1).getValue()) });
    }

    var now = new Date().toISOString();
    var leadId = Utilities.getUuid();
    sheet.appendRow([
      leadId, now, now, idempotencyKey, phone, sourcePage,
      "", "", "", "", "", "", "", "", "", "", false, false
    ]);
    return json_({ ok: true, leadId: leadId });
  } finally {
    lock.releaseLock();
  }
}

function updateDiagnostic_(payload) {
  var leadId = clean_(payload.leadId, 80);
  if (!leadId) return json_({ ok: false, error: "invalid_lead" });

  var studyTypes = ["Bachillerato", "Universidad", "Otros estudios"];
  var needTypes = [
    "PAU / Selectividad",
    "Preparar un examen",
    "Seguimiento durante el curso",
    "Otra situación"
  ];
  var studyType = clean_(payload.studyType, 40);
  var needType = clean_(payload.needType, 60);
  var subjects = Array.isArray(payload.subjects)
    ? payload.subjects.map(function (item) { return clean_(item, 100); }).filter(Boolean).slice(0, 4)
    : [];

  if (studyTypes.indexOf(studyType) === -1 || needTypes.indexOf(needType) === -1 || !subjects.length) {
    return json_({ ok: false, error: "invalid_diagnostic" });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    var row = findExact_(sheet, 1, leadId);
    if (!row) return json_({ ok: false, error: "lead_not_found" });

    var rowNumber = row.getRow();
    var values = [
      studyType,
      clean_(payload.course, 20),
      clean_(payload.university, 120),
      clean_(payload.degree, 120),
      clean_(payload.studies, 160),
      subjects.join(" | "),
      needType,
      clean_(payload.examTiming, 40),
      clean_(payload.pauRegion, 80),
      clean_(payload.otherNeed, 240),
      payload.callPreference === true,
      true
    ];
    sheet.getRange(rowNumber, 3).setValue(new Date().toISOString());
    sheet.getRange(rowNumber, 7, 1, values.length).setValues([values]);
    return json_({ ok: true, leadId: leadId });
  } finally {
    lock.releaseLock();
  }
}

function parsePayload_(event) {
  var raw = event && event.postData && event.postData.contents;
  if (!raw) throw new Error("missing_payload");
  return JSON.parse(raw);
}

function getSheet_() {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_PROPERTY);
  if (!spreadsheetId) throw new Error("Run setupTeselando() before deploying the web app.");
  return ensureSheet_(SpreadsheetApp.openById(spreadsheetId));
}

function ensureSheet_(spreadsheet) {
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  var currentHeaders = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (currentHeaders.join("|") !== HEADERS.join("|")) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function findExact_(sheet, column, value) {
  if (sheet.getLastRow() < 2) return null;
  return sheet
    .getRange(2, column, sheet.getLastRow() - 1, 1)
    .createTextFinder(value)
    .matchEntireCell(true)
    .findNext();
}

function normalizePhone_(value) {
  var phone = String(value || "").replace(/[^\d+() .-]/g, "").trim();
  var digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 18 ? phone.slice(0, 32) : "";
}

function clean_(value, maximumLength) {
  return String(value == null ? "" : value).trim().slice(0, maximumLength);
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
