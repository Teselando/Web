import { LeadError } from "@/lib/leads/errors";
import { leadErrorResponse, readJsonBody } from "@/lib/leads/http";
import { LeadService } from "@/lib/leads/service";
import { parseCreateLeadPayload, parseIdempotencyKey } from "@/lib/leads/validation";

export const runtime = "nodejs";

// A distributed rate limiter needs approved infrastructure. Until then, the
// endpoint uses the approved honeypot and idempotency protections only.

export async function POST(request: Request) {
  try {
    const payload = parseCreateLeadPayload(await readJsonBody(request));
    if (payload.honeypot) throw new LeadError("BOT_REJECTED", "No se ha podido procesar la solicitud.");
    const lead = await new LeadService().createLead({ idempotencyKey: parseIdempotencyKey(request.headers.get("idempotency-key")), phone: payload.phone, sourceContext: payload.sourceContext });
    return Response.json({ leadId: lead.id }, { status: 201 });
  } catch (error) {
    return leadErrorResponse(error);
  }
}
