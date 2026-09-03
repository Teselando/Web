import { z } from "zod";
import { getLeadRepository } from "@/lib/leads";

const schema = z.object({
  leadId: z.string().uuid(), studyType: z.enum(["Bachillerato", "Universidad", "Otros estudios"]),
  course: z.string().max(20).optional(), university: z.string().max(120).optional(), degree: z.string().max(120).optional(), studies: z.string().max(160).optional(),
  subjects: z.array(z.string().trim().min(1).max(100)).min(1).max(4), needType: z.enum(["PAU / Selectividad", "Preparar un examen", "Seguimiento durante el curso", "Otra situación"]),
  examTiming: z.string().max(40).optional(), pauRegion: z.string().max(80).optional(), otherNeed: z.string().max(240).optional(), callPreference: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ ok: false }, { status: 400 });
    const { leadId, ...diagnostic } = parsed.data;
    await getLeadRepository().updateDiagnostic(leadId, { ...diagnostic, complete: true });
    return Response.json({ ok: true }, { headers: { "cache-control": "no-store" } });
  } catch { return Response.json({ ok: false }, { status: 503 }); }
}
