import { leadErrorResponse, readJsonBody } from "@/lib/leads/http";
import { LeadService } from "@/lib/leads/service";
import { parseLeadUpdate } from "@/lib/leads/validation";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ leadId: string }> }) {
  try {
    const { leadId } = await context.params;
    const payload = parseLeadUpdate(await readJsonBody(request));
    await new LeadService().updateLead(leadId, payload.update, payload.completeDiagnostic);
    return new Response(null, { status: 204 });
  } catch (error) {
    return leadErrorResponse(error);
  }
}
