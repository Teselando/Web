import type { Metadata } from "next";
import { DetailPage } from "@/components/page-shell";

export const metadata: Metadata = { title: "Sobre Teselando", alternates: { canonical: "/sobre-teselando/" } };
export default function Page() { return <DetailPage eyebrow="SOBRE TESELANDO" title="Una academia online de clases particulares gestionadas" intro="Teselando absorbe complejidad para que el estudiante pueda centrarse en aprender." sections={[
  { eyebrow: "QUÉ ES", title: "Una academia, no un marketplace" },
  { eyebrow: "POR QUÉ EXISTE", title: "Menos prueba y error" },
  { eyebrow: "PRINCIPIOS", title: "Calma, criterio y acompañamiento" },
  { eyebrow: "RESPONSABILIDAD", title: "Protegemos lo que podemos controlar" },
  { eyebrow: "PERSONAS", title: "Profesores previamente seleccionados" },
  { eyebrow: "REALIDAD", title: "Demostrar antes que presumir" },
]} />; }
