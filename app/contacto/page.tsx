import type { Metadata } from "next";
import { DetailPage } from "@/components/page-shell";

export const metadata: Metadata = { title: "Contacto", alternates: { canonical: "/contacto/" } };
export default function Page() { return <DetailPage eyebrow="CONTACTO" title="Cuéntanos qué necesitas" intro="Déjanos tu teléfono y continuaremos por WhatsApp." sections={[
  { eyebrow: "MOTIVOS", title: "Buscar profesor", items: ["Bachillerato", "PAU", "Universidad", "Otros estudios"] },
  { eyebrow: "QUÉ OCURRE DESPUÉS", title: "Entendemos tu caso antes de recomendar" },
  { eyebrow: "EXPECTATIVAS", title: "Contacto humano, sin promesas artificiales" },
]} />; }
