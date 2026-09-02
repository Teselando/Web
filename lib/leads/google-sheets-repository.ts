import { createSign } from "node:crypto";

import { getGoogleSheetsConfig, type GoogleSheetsConfig } from "@/lib/leads/config";
import { LeadError } from "@/lib/leads/errors";
import type { LeadRepository } from "@/lib/leads/repository";
import type { CommercialOutcome, LeadContext } from "@/types/content";
import type { CreateLeadCommand, DiagnosticFields, LeadRecord, LeadUpdateCommand } from "@/types/leads";

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const sheetsBaseUrl = "https://sheets.googleapis.com/v4/spreadsheets";

// These are header names, not positional references. The adapter resolves them
// from the private sheet on each operation so future columns can be added safely.
const sheetColumns = {
  bachCourse: "bach_course",
  callPreference: "call_preference",
  convertedAt: "converted_at",
  createdAt: "created_at",
  degree: "degree",
  diagnosticStatus: "diagnostic_status",
  examTiming: "exam_timing",
  firstClassAt: "first_class_at",
  id: "lead_id",
  idempotencyKey: "idempotency_key",
  landingPath: "landing_path",
  leadStatus: "lead_status",
  lossReason: "loss_reason",
  needType: "need_type",
  otherNeedText: "other_need_text",
  otherStudies: "other_studies",
  pauRegion: "pau_region",
  phone: "phone",
  sourcePage: "source_page",
  studyType: "study_type",
  subjects: "subjects",
  university: "university",
  universityCourse: "university_course",
  updatedAt: "updated_at",
  utmCampaign: "utm_campaign",
  utmContent: "utm_content",
  utmMedium: "utm_medium",
  utmSource: "utm_source",
} as const;

type SheetColumnKey = keyof typeof sheetColumns;
type SheetValuesResponse = { values?: string[][] };

function base64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function encodeSheetRange(sheetName: string, range = ""): string {
  return encodeURIComponent(`${sheetName}${range ? `!${range}` : ""}`);
}

function columnLetter(index: number): string {
  let result = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function jsonArray(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function valueAt(row: string[], headers: Map<string, number>, key: SheetColumnKey): string | undefined {
  const index = headers.get(sheetColumns[key]);
  return index === undefined ? undefined : row[index] || undefined;
}

function toLeadRecord(row: string[], headers: Map<string, number>): LeadRecord | null {
  const id = valueAt(row, headers, "id");
  const phone = valueAt(row, headers, "phone");
  const idempotencyKey = valueAt(row, headers, "idempotencyKey");
  const createdAt = valueAt(row, headers, "createdAt");
  const updatedAt = valueAt(row, headers, "updatedAt");
  const diagnosticStatus = valueAt(row, headers, "diagnosticStatus");
  if (!id || !phone || !idempotencyKey || !createdAt || !updatedAt || !diagnosticStatus) return null;

  const sourceContext: LeadContext = {
    landingPath: valueAt(row, headers, "landingPath"), sourcePage: valueAt(row, headers, "sourcePage"),
    utmCampaign: valueAt(row, headers, "utmCampaign"), utmContent: valueAt(row, headers, "utmContent"),
    utmMedium: valueAt(row, headers, "utmMedium"), utmSource: valueAt(row, headers, "utmSource"),
  };
  const diagnostic: DiagnosticFields = {
    bachCourse: valueAt(row, headers, "bachCourse") as DiagnosticFields["bachCourse"], degree: valueAt(row, headers, "degree"),
    examTiming: valueAt(row, headers, "examTiming") as DiagnosticFields["examTiming"], needType: valueAt(row, headers, "needType") as DiagnosticFields["needType"],
    otherNeedText: valueAt(row, headers, "otherNeedText"), otherStudies: valueAt(row, headers, "otherStudies"), pauRegion: valueAt(row, headers, "pauRegion"),
    studyType: valueAt(row, headers, "studyType") as DiagnosticFields["studyType"], subjects: jsonArray(valueAt(row, headers, "subjects")),
    university: valueAt(row, headers, "university"), universityCourse: valueAt(row, headers, "universityCourse") as DiagnosticFields["universityCourse"],
  };
  const commercial: CommercialOutcome = { convertedAt: valueAt(row, headers, "convertedAt"), firstClassAt: valueAt(row, headers, "firstClassAt"), leadStatus: valueAt(row, headers, "leadStatus") as CommercialOutcome["leadStatus"], lossReason: valueAt(row, headers, "lossReason") };
  return { ...diagnostic, ...commercial, callPreference: valueAt(row, headers, "callPreference") as LeadRecord["callPreference"], createdAt, diagnosticStatus: diagnosticStatus as LeadRecord["diagnosticStatus"], id, idempotencyKey, phone, sourceContext: Object.values(sourceContext).some(Boolean) ? sourceContext : undefined, updatedAt };
}

function toCellValues(record: Partial<LeadRecord>): Partial<Record<SheetColumnKey, string>> {
  const context = record.sourceContext;
  return {
    bachCourse: record.bachCourse, callPreference: record.callPreference, convertedAt: record.convertedAt, createdAt: record.createdAt,
    degree: record.degree, diagnosticStatus: record.diagnosticStatus, examTiming: record.examTiming, firstClassAt: record.firstClassAt,
    id: record.id, idempotencyKey: record.idempotencyKey, landingPath: context?.landingPath, leadStatus: record.leadStatus,
    lossReason: record.lossReason, needType: record.needType, otherNeedText: record.otherNeedText, otherStudies: record.otherStudies,
    pauRegion: record.pauRegion, phone: record.phone, sourcePage: context?.sourcePage, studyType: record.studyType,
    subjects: record.subjects ? JSON.stringify(record.subjects) : undefined, university: record.university,
    universityCourse: record.universityCourse, updatedAt: record.updatedAt, utmCampaign: context?.utmCampaign,
    utmContent: context?.utmContent, utmMedium: context?.utmMedium, utmSource: context?.utmSource,
  };
}

export class GoogleSheetsLeadRepository implements LeadRepository {
  constructor(private readonly config: GoogleSheetsConfig = getGoogleSheetsConfig()) {}

  async createLead(command: CreateLeadCommand): Promise<LeadRecord> {
    const sheet = await this.readSheet();
    const now = new Date().toISOString();
    const record: LeadRecord = { createdAt: now, diagnosticStatus: "not_started", id: command.id, idempotencyKey: command.idempotencyKey, phone: command.phone, sourceContext: command.sourceContext, updatedAt: now };
    const values = toCellValues(record);
    const row = sheet.headers.map((header) => {
      const key = this.keyForHeader(header);
      return key ? values[key] ?? "" : "";
    });
    await this.request(`/values/${encodeSheetRange(this.config.sheetName)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, { method: "POST", body: JSON.stringify({ values: [row] }) });
    return record;
  }

  async findById(id: string): Promise<LeadRecord | null> {
    const sheet = await this.readSheet();
    return this.findRecord(sheet, (record) => record.id === id);
  }

  async findByIdempotencyKey(idempotencyKey: string): Promise<LeadRecord | null> {
    const sheet = await this.readSheet();
    return this.findRecord(sheet, (record) => record.idempotencyKey === idempotencyKey);
  }

  async updateLead(id: string, update: LeadUpdateCommand): Promise<LeadRecord | null> {
    const sheet = await this.readSheet();
    const found = this.findRecordWithRow(sheet, (record) => record.id === id);
    if (!found) return null;
    const diagnostic = update.diagnostic ? Object.fromEntries(Object.entries(update.diagnostic).map(([key, value]) => [key, value ?? undefined])) as DiagnosticFields : undefined;
    const updated: LeadRecord = { ...found.record, ...diagnostic, callPreference: update.callPreference ?? found.record.callPreference, diagnosticStatus: update.diagnosticStatus ?? found.record.diagnosticStatus, updatedAt: new Date().toISOString() };
    await this.updateRow(sheet, found.rowIndex, toCellValues(updated));
    return updated;
  }

  async updateCommercialOutcome(id: string, outcome: Partial<CommercialOutcome>): Promise<LeadRecord | null> {
    const sheet = await this.readSheet();
    const found = this.findRecordWithRow(sheet, (record) => record.id === id);
    if (!found) return null;
    const updated = { ...found.record, ...outcome, updatedAt: new Date().toISOString() };
    await this.updateRow(sheet, found.rowIndex, toCellValues(updated));
    return updated;
  }

  private keyForHeader(header: string): SheetColumnKey | undefined {
    return (Object.keys(sheetColumns) as SheetColumnKey[]).find((key) => sheetColumns[key] === header);
  }

  private async readSheet(): Promise<{ headers: string[]; rows: string[][] }> {
    const response = await this.request<SheetValuesResponse>(`/values/${encodeSheetRange(this.config.sheetName)}?majorDimension=ROWS`);
    const [headers, ...rows] = response.values ?? [];
    if (!headers) throw new LeadError("CONFIGURATION_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    for (const key of ["id", "idempotencyKey", "createdAt", "updatedAt", "phone", "diagnosticStatus"] as SheetColumnKey[]) {
      if (!headers.includes(sheetColumns[key])) throw new LeadError("CONFIGURATION_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    }
    return { headers, rows };
  }

  private findRecord(sheet: { headers: string[]; rows: string[][] }, predicate: (record: LeadRecord) => boolean): LeadRecord | null {
    return this.findRecordWithRow(sheet, predicate)?.record ?? null;
  }

  private findRecordWithRow(sheet: { headers: string[]; rows: string[][] }, predicate: (record: LeadRecord) => boolean): { record: LeadRecord; rowIndex: number } | null {
    const headerMap = new Map(sheet.headers.map((header, index) => [header, index]));
    for (const [index, row] of sheet.rows.entries()) {
      const record = toLeadRecord(row, headerMap);
      if (record && predicate(record)) return { record, rowIndex: index + 2 };
    }
    return null;
  }

  private async updateRow(sheet: { headers: string[] }, rowIndex: number, values: Partial<Record<SheetColumnKey, string>>): Promise<void> {
    const data = (Object.keys(values) as SheetColumnKey[]).flatMap((key) => {
      const value = values[key];
      const column = sheet.headers.indexOf(sheetColumns[key]);
      return column === -1 ? [] : [{ range: `${this.config.sheetName}!${columnLetter(column)}${rowIndex}`, values: [[value ?? ""]] }];
    });
    if (!data.length) return;
    await this.request(`/values:batchUpdate`, { method: "POST", body: JSON.stringify({ data, valueInputOption: "RAW" }) });
  }

  private async request<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${sheetsBaseUrl}/${encodeURIComponent(this.config.spreadsheetId)}${path}`, { ...init, headers: { Authorization: `Bearer ${await this.accessToken()}`, "Content-Type": "application/json", ...init?.headers }, cache: "no-store" });
    } catch {
      throw new LeadError("PERSISTENCE_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    }
    if (!response.ok) throw new LeadError("PERSISTENCE_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    return response.status === 204 ? undefined as T : response.json() as Promise<T>;
  }

  private async accessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const claim = base64Url(JSON.stringify({ aud: googleTokenUrl, exp: now + 3600, iat: now, iss: this.config.serviceAccountEmail, scope: "https://www.googleapis.com/auth/spreadsheets" }));
    const unsignedToken = `${header}.${claim}`;
    const signer = createSign("RSA-SHA256");
    signer.update(unsignedToken);
    signer.end();
    const assertion = `${unsignedToken}.${signer.sign(this.config.privateKey, "base64url")}`;
    let response: Response;
    try {
      response = await fetch(googleTokenUrl, { body: new URLSearchParams({ assertion, grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer" }), method: "POST", cache: "no-store" });
    } catch {
      throw new LeadError("PERSISTENCE_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    }
    if (!response.ok) throw new LeadError("PERSISTENCE_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    const result = await response.json() as { access_token?: unknown };
    if (typeof result.access_token !== "string") throw new LeadError("PERSISTENCE_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    return result.access_token;
  }
}
