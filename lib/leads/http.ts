import { LeadError, isLeadError } from "@/lib/leads/errors";

const statuses = {
  BOT_REJECTED: 400,
  CONFIGURATION_ERROR: 503,
  IDEMPOTENCY_KEY_REQUIRED: 400,
  NOT_FOUND: 404,
  PERSISTENCE_ERROR: 503,
  RATE_LIMITED: 429,
  VALIDATION_ERROR: 400,
} as const;

export function leadErrorResponse(error: unknown): Response {
  const safeError = isLeadError(error) ? error : new LeadError("PERSISTENCE_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
  return Response.json({ error: { code: safeError.code, message: safeError.publicMessage } }, { status: statuses[safeError.code] });
}

export async function readJsonBody(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > 16_384) throw new LeadError("VALIDATION_ERROR", "La información enviada no es válida.");
  try {
    return await request.json();
  } catch {
    throw new LeadError("VALIDATION_ERROR", "La información enviada no es válida.");
  }
}
