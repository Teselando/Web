import type { Metadata } from "next";
import { DetailPage } from "@/components/page-shell";

export const metadata: Metadata = { title: "Precios", alternates: { canonical: "/precios/" } };
export default function Page() { return <DetailPage eyebrow="PRECIO Y CONDICIONES" title="Desde 20 €/h" intro="El precio depende del contexto. Conoces el importe exacto antes de empezar." sections={[
  { eyebrow: "CÓMO FUNCIONA", title: "El precio varía según el caso", items: ["Asignatura", "Nivel", "Objetivo", "Disponibilidad"] },
  { eyebrow: "ANTES DE EMPEZAR", title: "Conoces el importe exacto" },
  { eyebrow: "PAGO", title: "Clase a clase" },
  { eyebrow: "FLEXIBILIDAD", title: "Sin compromiso innecesario" },
  { eyebrow: "INCLUIDO", title: "Selección, gestión y soporte" },
  { eyebrow: "PROTECCIÓN", title: "Cambio y continuidad si algo no encaja" },
]} />; }
