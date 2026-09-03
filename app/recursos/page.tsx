import type { Metadata } from "next";
import { DetailPage } from "@/components/page-shell";

export const metadata: Metadata = { title: "Recursos", alternates: { canonical: "/recursos/" } };
export default function Page() { return <DetailPage eyebrow="RECURSOS" title="Materiales para estudiar con más claridad" intro="Una biblioteca académica para Bachillerato, PAU y Universidad." cta={false} sections={[
  { eyebrow: "BACHILLERATO", title: "Ciencias y matemáticas" },
  { eyebrow: "PAU", title: "Preparación por contexto académico" },
  { eyebrow: "UNIVERSIDAD", title: "Primeros cursos cuantitativos" },
]} />; }
