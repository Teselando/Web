import type { LeadContext } from "@/types/content";
import { LeadError } from "@/lib/leads/errors";
import { bachCourses, callPreferences, examTimings, needTypes, studyTypes, universityCourses, type CallPreference, type DiagnosticFields, type DiagnosticStatus, type DiagnosticUpdate, type LeadUpdateCommand, type StudyType } from "@/types/leads";

const contextKeys = ["landingPath", "sourcePage", "utmCampaign", "utmContent", "utmMedium", "utmSource"] as const;
const diagnosticKeys = ["studyType", "bachCourse", "university", "degree", "universityCourse", "otherStudies", "subjects", "needType", "examTiming", "pauRegion", "otherNeedText"] as const;
const maxTextLength = 500;
const maxSubjectLength = 120;
const maxSubjects = 6;

type UnknownRecord = Record<string, unknown>;

function fail(message = "La información enviada no es válida."): never {
  throw new LeadError("VALIDATION_ERROR", message);
}

function asRecord(value: unknown): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail();
  return value as UnknownRecord;
}

function allowOnly(record: UnknownRecord, keys: readonly string[]) {
  if (Object.keys(record).some((key) => !keys.includes(key))) fail();
}

function normalizedText(value: unknown, maxLength = maxTextLength): string {
  if (typeof value !== "string") fail();
  const text = value.trim().replace(/\s+/g, " ");
  if (!text || text.length > maxLength) fail();
  return text;
}

function optionalText(value: unknown, maxLength?: number): string | undefined {
  return value === undefined ? undefined : normalizedText(value, maxLength);
}

function nullableText(value: unknown, maxLength?: number): string | null | undefined {
  return value === undefined ? undefined : value === null ? null : normalizedText(value, maxLength);
}

function enumValue<T extends readonly string[]>(value: unknown, values: T): T[number] {
  if (typeof value !== "string" || !values.includes(value)) fail();
  return value as T[number];
}

function optionalEnum<T extends readonly string[]>(value: unknown, values: T): T[number] | undefined {
  return value === undefined ? undefined : enumValue(value, values);
}

function nullableEnum<T extends readonly string[]>(value: unknown, values: T): T[number] | null | undefined {
  return value === undefined ? undefined : value === null ? null : enumValue(value, values);
}

export function normalizePhone(value: unknown): string {
  if (typeof value !== "string" || value.length > 64) fail("Introduce un número válido.");
  const compact = value.trim().replace(/[\s().-]/g, "");
  const normalized = compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
  if (!/^\+?\d{7,15}$/.test(normalized)) fail("Introduce un número válido.");
  return normalized;
}

export function parseLeadContext(value: unknown): LeadContext | undefined {
  if (value === undefined) return undefined;
  const context = asRecord(value);
  allowOnly(context, contextKeys);
  const parsed: LeadContext = {};
  for (const key of contextKeys) {
    const text = optionalText(context[key], 160);
    if (text) parsed[key] = text;
  }
  return Object.keys(parsed).length ? parsed : undefined;
}

export function parseCreateLeadPayload(value: unknown): { honeypot?: string; phone: string; sourceContext?: LeadContext } {
  const payload = asRecord(value);
  allowOnly(payload, ["context", "phone", "website"]);
  const honeypot = payload.website === undefined ? undefined : normalizedText(payload.website, 200);
  return { honeypot, phone: normalizePhone(payload.phone), sourceContext: parseLeadContext(payload.context) };
}

export function parseDiagnosticUpdate(value: unknown): DiagnosticUpdate {
  const data = asRecord(value);
  allowOnly(data, diagnosticKeys);
  const parsed: DiagnosticUpdate = {
    studyType: optionalEnum(data.studyType, studyTypes),
    bachCourse: nullableEnum(data.bachCourse, bachCourses),
    university: nullableText(data.university),
    degree: nullableText(data.degree),
    universityCourse: nullableEnum(data.universityCourse, universityCourses),
    otherStudies: nullableText(data.otherStudies),
    needType: optionalEnum(data.needType, needTypes),
    examTiming: nullableEnum(data.examTiming, examTimings),
    pauRegion: nullableText(data.pauRegion, 120),
    otherNeedText: nullableText(data.otherNeedText),
  };

  if (data.subjects !== undefined) {
    if (!Array.isArray(data.subjects) || !data.subjects.length || data.subjects.length > maxSubjects) fail();
    const subjects = data.subjects.map((subject) => normalizedText(subject, maxSubjectLength));
    if (new Set(subjects.map((subject) => subject.toLocaleLowerCase("es"))).size !== subjects.length) fail();
    parsed.subjects = subjects;
  }

  return Object.fromEntries(Object.entries(parsed).filter(([, field]) => field !== undefined)) as DiagnosticUpdate;
}

export function applyDiagnosticUpdate(current: DiagnosticFields, update: DiagnosticUpdate): DiagnosticFields {
  const next: DiagnosticFields = {
    bachCourse: current.bachCourse, degree: current.degree, examTiming: current.examTiming, needType: current.needType,
    otherNeedText: current.otherNeedText, otherStudies: current.otherStudies, pauRegion: current.pauRegion,
    studyType: current.studyType, subjects: current.subjects, university: current.university, universityCourse: current.universityCourse,
  };
  for (const [key, value] of Object.entries(update)) {
    (next as Record<string, unknown>)[key] = value ?? undefined;
  }

  if (next.studyType !== "bachillerato") next.bachCourse = undefined;
  if (next.studyType !== "university") { next.university = undefined; next.degree = undefined; next.universityCourse = undefined; }
  if (next.studyType !== "other") next.otherStudies = undefined;
  if (!(next.studyType === "bachillerato" && next.bachCourse === "second") && next.needType === "pau") { next.needType = undefined; next.pauRegion = undefined; }
  if (next.needType !== "pau") next.pauRegion = undefined;
  if (next.needType !== "exam") next.examTiming = undefined;
  if (next.needType !== "other") next.otherNeedText = undefined;
  return next;
}

export function parseLeadUpdate(value: unknown): { completeDiagnostic?: boolean; update: LeadUpdateCommand } {
  const payload = asRecord(value);
  allowOnly(payload, ["callPreference", "completeDiagnostic", "diagnostic"]);
  const callPreference = optionalEnum(payload.callPreference, callPreferences) as CallPreference | undefined;
  const completeDiagnostic = payload.completeDiagnostic === undefined ? undefined : payload.completeDiagnostic === true ? true : fail();
  const diagnostic = payload.diagnostic === undefined ? undefined : parseDiagnosticUpdate(payload.diagnostic);
  if (!callPreference && !completeDiagnostic && !diagnostic) fail();
  return { completeDiagnostic, update: { callPreference, diagnostic } };
}

export function validateDiagnosticState(fields: DiagnosticFields, completing = false): void {
  const studyType = fields.studyType as StudyType | undefined;
  if (fields.bachCourse && studyType !== "bachillerato") fail();
  if ((fields.university || fields.degree || fields.universityCourse) && studyType !== "university") fail();
  if (fields.otherStudies && studyType !== "other") fail();
  if (fields.needType === "pau" && !(studyType === "bachillerato" && fields.bachCourse === "second")) fail();
  if (fields.pauRegion && fields.needType !== "pau") fail();
  if (fields.examTiming && fields.needType !== "exam") fail();
  if (fields.otherNeedText && fields.needType !== "other") fail();

  if (!completing) return;
  if (!studyType || !fields.subjects?.length || !fields.needType) fail();
  if (studyType === "bachillerato" && !fields.bachCourse) fail();
  if (studyType === "university" && (!fields.university || !fields.degree || !fields.universityCourse)) fail();
  if (studyType === "other" && !fields.otherStudies) fail();
  if (fields.needType === "pau" && !fields.pauRegion) fail();
  if (fields.needType === "exam" && !fields.examTiming) fail();
  if (fields.needType === "other" && !fields.otherNeedText) fail();
}

export function isOpaqueId(value: string): boolean {
  return /^[a-f0-9]{8}-[a-f0-9]{4}-[4-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value);
}

export function parseIdempotencyKey(value: string | null): string {
  if (!value || !/^[A-Za-z0-9_-]{16,128}$/.test(value)) {
    throw new LeadError("IDEMPOTENCY_KEY_REQUIRED", "No se ha podido procesar la solicitud. Inténtalo de nuevo.");
  }
  return value;
}

export function nextDiagnosticStatus(current: DiagnosticStatus, hasDiagnosticUpdate: boolean): DiagnosticStatus | undefined {
  return current === "not_started" && hasDiagnosticUpdate ? "in_progress" : undefined;
}
