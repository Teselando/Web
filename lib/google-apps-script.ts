const endpoint = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL?.trim();

type ScriptSuccess = {
  ok: true;
  leadId?: string;
};

type ScriptFailure = {
  ok: false;
  error?: string;
};

export class LeadServiceError extends Error {
  constructor(message = "lead_service_unavailable") {
    super(message);
    this.name = "LeadServiceError";
  }
}
export async function sendLeadAction(payload: Record<string, unknown>): Promise<ScriptSuccess> {
  if (!endpoint || !endpoint.startsWith("https://script.google.com/macros/s/")) {
    throw new LeadServiceError("lead_service_unconfigured");
  }

  const controller = new AbortController();
  // Apps Script web apps can take noticeably longer on the first request after
  // being idle. Keep a finite timeout, but leave enough room for that cold start
  // so the browser does not cancel a valid Sheet write halfway through.
  const timeout = window.setTimeout(() => controller.abort(), 45_000);

  try {
    // text/plain keeps this a CORS-simple request. Apps Script then performs all
    // validation and Sheet access without exposing Google credentials to clients.
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      keepalive: true,
      signal: controller.signal,
    });
    if (!response.ok) throw new LeadServiceError();

    const result = (await response.json()) as ScriptSuccess | ScriptFailure;
    if (!result.ok) throw new LeadServiceError(result.error);
    return result;
  } catch (error) {
    if (error instanceof LeadServiceError) throw error;
    throw new LeadServiceError();
  } finally {
    window.clearTimeout(timeout);
  }
}
