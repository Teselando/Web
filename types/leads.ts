import type { CommercialOutcome, LeadContext } from "@/types/content";

export const studyTypes = ["bachillerato", "university", "other"] as const;
export const bachCourses = ["first", "second"] as const;
export const universityCourses = ["first", "second", "third", "fourth", "fifth_or_more"] as const;
export const needTypes = ["pau", "exam", "ongoing", "other"] as const;
export const examTimings = ["this_week", "one_to_two_weeks", "more_than_two_weeks"] as const;
export const callPreferences = ["whatsapp", "call"] as const;
export const diagnosticStatuses = ["not_started", "in_progress", "completed"] as const;

export type StudyType = (typeof studyTypes)[number];
export type BachCourse = (typeof bachCourses)[number];
export type UniversityCourse = (typeof universityCourses)[number];
export type NeedType = (typeof needTypes)[number];
export type ExamTiming = (typeof examTimings)[number];
export type CallPreference = (typeof callPreferences)[number];
export type DiagnosticStatus = (typeof diagnosticStatuses)[number];

export type DiagnosticFields = {
  studyType?: StudyType;
  bachCourse?: BachCourse;
  university?: string;
  degree?: string;
  universityCourse?: UniversityCourse;
  otherStudies?: string;
  subjects?: string[];
  needType?: NeedType;
  examTiming?: ExamTiming;
  pauRegion?: string;
  otherNeedText?: string;
};

export type LeadRecord = DiagnosticFields & CommercialOutcome & {
  callPreference?: CallPreference;
  createdAt: string;
  diagnosticStatus: DiagnosticStatus;
  id: string;
  idempotencyKey: string;
  phone: string;
  sourceContext?: LeadContext;
  updatedAt: string;
};

export type CreateLeadCommand = {
  id: string;
  idempotencyKey: string;
  phone: string;
  sourceContext?: LeadContext;
};

export type ClearableDiagnosticField = "bachCourse" | "university" | "degree" | "universityCourse" | "otherStudies" | "examTiming" | "pauRegion" | "otherNeedText";
export type DiagnosticUpdate = Omit<Partial<DiagnosticFields>, ClearableDiagnosticField> & {
  [Field in ClearableDiagnosticField]?: DiagnosticFields[Field] | null;
};

export type LeadUpdateCommand = {
  callPreference?: CallPreference;
  diagnostic?: DiagnosticUpdate;
  diagnosticStatus?: DiagnosticStatus;
};
