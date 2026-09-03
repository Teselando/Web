export type Lead = {
  id: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  sourcePage: string;
  diagnostic?: Record<string, unknown>;
};

export interface LeadRepository {
  create(input: { phone: string; sourcePage: string; idempotencyKey: string }): Promise<Lead>;
  updateDiagnostic(id: string, diagnostic: Record<string, unknown>): Promise<void>;
}

const globalStore = globalThis as typeof globalThis & { teselandoLeads?: Map<string, Lead>; teselandoKeys?: Map<string, string> };
const leads = globalStore.teselandoLeads ??= new Map<string, Lead>();
const keys = globalStore.teselandoKeys ??= new Map<string, string>();

class MemoryLeadRepository implements LeadRepository {
  async create(input: { phone: string; sourcePage: string; idempotencyKey: string }) {
    const existingId = keys.get(input.idempotencyKey);
    if (existingId) return leads.get(existingId)!;
    const now = new Date().toISOString();
    const lead = { id: crypto.randomUUID(), phone: input.phone, sourcePage: input.sourcePage, createdAt: now, updatedAt: now };
    leads.set(lead.id, lead); keys.set(input.idempotencyKey, lead.id); return lead;
  }
  async updateDiagnostic(id: string, diagnostic: Record<string, unknown>) {
    const lead = leads.get(id); if (!lead) throw new Error("not_found");
    leads.set(id, { ...lead, diagnostic, updatedAt: new Date().toISOString() });
  }
}

class GoogleSheetsLeadRepository implements LeadRepository {
  constructor(private endpoint: string, private secret: string) {}
  private async request(payload: Record<string, unknown>) {
    const response = await fetch(this.endpoint, { method: "POST", headers: { "content-type": "application/json", "x-teselando-secret": this.secret }, body: JSON.stringify(payload), cache: "no-store" });
    if (!response.ok) throw new Error("sheets_unavailable");
    return response.json();
  }
  async create(input: { phone: string; sourcePage: string; idempotencyKey: string }) {
    const id = crypto.randomUUID(); const now = new Date().toISOString();
    await this.request({ action: "create", id, phone: input.phone, sourcePage: input.sourcePage, idempotencyKey: input.idempotencyKey, createdAt: now, updatedAt: now });
    return { id, phone: input.phone, sourcePage: input.sourcePage, createdAt: now, updatedAt: now };
  }
  async updateDiagnostic(id: string, diagnostic: Record<string, unknown>) {
    await this.request({ action: "update", id, diagnostic, updatedAt: new Date().toISOString() });
  }
}

export function getLeadRepository(): LeadRepository {
  const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (endpoint && secret) return new GoogleSheetsLeadRepository(endpoint, secret);
  if (process.env.NODE_ENV !== "production") return new MemoryLeadRepository();
  throw new Error("lead_repository_unconfigured");
}
