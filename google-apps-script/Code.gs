/**
 * Teselando lead receiver for a Google Apps Script web-app deployment.
 *
 * Run setupTeselando() once, then deploy this project as a web app:
 * - Execute as: Me
 * - Who has access: Anyone
 */

var SHEET_NAME = "Leads";
var SPREADSHEET_PROPERTY = "TESELANDO_SPREADSHEET_ID";
var NOTIFICATION_EMAIL_PROPERTY = "TESELANDO_NOTIFICATION_EMAIL";
var DEFAULT_NOTIFICATION_EMAIL = "ceo@teselando.es";
var CONTACT_NOTIFICATION_COLUMN = 19;
var DIAGNOSTIC_NOTIFICATION_COLUMN = 20;
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
  "diagnosticComplete",
  "contactEmailSentAt",
  "diagnosticEmailSentAt"
];

function setupTeselando(notificationEmail) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) spreadsheet = SpreadsheetApp.create("Teselando — Leads");

  var properties = PropertiesService.getScriptProperties();
  properties.setProperty(
    SPREADSHEET_PROPERTY,
    spreadsheet.getId()
  );
  properties.setProperty(
    NOTIFICATION_EMAIL_PROPERTY,
    validateEmail_(notificationEmail || properties.getProperty(NOTIFICATION_EMAIL_PROPERTY) || DEFAULT_NOTIFICATION_EMAIL)
  );
  ensureSheet_(spreadsheet);

  return {
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    notificationEmail: properties.getProperty(NOTIFICATION_EMAIL_PROPERTY)
  };
}

function setNotificationEmail(email) {
  var validatedEmail = validateEmail_(email);
  PropertiesService.getScriptProperties().setProperty(NOTIFICATION_EMAIL_PROPERTY, validatedEmail);
  return { notificationEmail: validatedEmail };
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
      sendLeadNotification_(sheet, existing.getRow(), "contact");
      return json_({ ok: true, leadId: String(existing.getCell(1, 1).getValue()) });
    }

    var now = new Date().toISOString();
    var leadId = clean_(payload.leadId, 80) || Utilities.getUuid();
    if (!/^[A-Za-z0-9-]{16,80}$/.test(leadId)) {
      return json_({ ok: false, error: "invalid_lead" });
    }
    sheet.appendRow([
      leadId, now, now, idempotencyKey, phone, sourcePage,
      "", "", "", "", "", "", "", "", "", "", false, false, "", ""
    ]);
    sendLeadNotification_(sheet, sheet.getLastRow(), "contact");
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
    sendLeadNotification_(sheet, rowNumber, "diagnostic");
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

function sendLeadNotification_(sheet, rowNumber, notificationType) {
  var sentColumn = notificationType === "contact"
    ? CONTACT_NOTIFICATION_COLUMN
    : DIAGNOSTIC_NOTIFICATION_COLUMN;
  var sentCell = sheet.getRange(rowNumber, sentColumn);
  if (sentCell.getValue()) return;

  var row = sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0];
  var isContact = notificationType === "contact";
  var subject = isContact
    ? "Nuevo teléfono recibido en Teselando"
    : "Nuevos datos de solicitud en Teselando";
  var fields = isContact
    ? [
        ["Teléfono", row[4]],
        ["Página de origen", row[5]],
        ["Fecha", row[1]],
        ["Identificador", row[0]]
      ]
    : [
        ["Teléfono", row[4]],
        ["Tipo de estudios", row[6]],
        ["Curso", row[7]],
        ["Universidad", row[8]],
        ["Carrera", row[9]],
        ["Otros estudios", row[10]],
        ["Asignaturas", row[11]],
        ["Necesidad", row[12]],
        ["Fecha del examen", row[13]],
        ["Comunidad PAU", row[14]],
        ["Otra situación", row[15]],
        ["Prefiere llamada", row[16] === true ? "Sí" : "No"],
        ["Página de origen", row[5]],
        ["Actualizado", row[2]],
        ["Identificador", row[0]]
      ];
  var visibleFields = fields.filter(function (field) {
    return String(field[1] || "").trim();
  });
  var plainBody = visibleFields.map(function (field) {
    return field[0] + ": " + field[1];
  }).join("\n");
  var htmlBody = "<h2>" + escapeHtml_(subject) + "</h2><table style=\"border-collapse:collapse\">" +
    visibleFields.map(function (field) {
      return "<tr><th style=\"padding:8px 18px 8px 0;text-align:left;vertical-align:top\">" +
        escapeHtml_(field[0]) +
        "</th><td style=\"padding:8px 0;white-space:pre-wrap\">" +
        escapeHtml_(field[1]) +
        "</td></tr>";
    }).join("") +
    "</table>";

  MailApp.sendEmail({
    to: getNotificationEmail_(),
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: "Teselando"
  });
  sentCell.setValue(new Date().toISOString());
}

function getNotificationEmail_() {
  var configuredEmail = PropertiesService.getScriptProperties().getProperty(NOTIFICATION_EMAIL_PROPERTY);
  return validateEmail_(configuredEmail || DEFAULT_NOTIFICATION_EMAIL);
}

function validateEmail_(value) {
  var email = clean_(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("invalid_notification_email");
  }
  return email;
}

function escapeHtml_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean_(value, maximumLength) {
  return String(value == null ? "" : value).trim().slice(0, maximumLength);
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
