export type LeadErrorCode = "BOT_REJECTED" | "CONFIGURATION_ERROR" | "IDEMPOTENCY_KEY_REQUIRED" | "NOT_FOUND" | "PERSISTENCE_ERROR" | "RATE_LIMITED" | "VALIDATION_ERROR";

export class LeadError extends Error {
  constructor(public readonly code: LeadErrorCode, public readonly publicMessage: string) {
    super(code);
  }
}

export function isLeadError(error: unknown): error is LeadError {
  return error instanceof LeadError;
}
