import { z } from "zod";
import { getLeadRepository } from "@/lib/leads";

const schema = z.object({ phone: z.string().trim().min(7).max(32).refine((value) => value.replace(/\D/g, "").length >= 7), website: z.string().max(0).optional().default(""), sourcePage: z.string().max(120).default("/") });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ message: "Introduce un número válido." }, { status: 400 });
    const idempotencyKey = request.headers.get("idempotency-key")?.slice(0, 100);
    if (!idempotencyKey) return Response.json({ message: "No hemos podido guardar tu teléfono. Inténtalo de nuevo." }, { status: 400 });
    const phone = parsed.data.phone.replace(/[^\d+() .-]/g, "");
    const lead = await getLeadRepository().create({ phone, sourcePage: parsed.data.sourcePage, idempotencyKey });
    return Response.json({ leadId: lead.id }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ message: "No hemos podido guardar tu teléfono. Inténtalo de nuevo." }, { status: 503 });
  }
}
