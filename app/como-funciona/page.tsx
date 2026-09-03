import type { Metadata } from "next";
import { DetailPage } from "@/components/page-shell";

export const metadata: Metadata = { title: "Cómo funciona", alternates: { canonical: "/como-funciona/" } };
export default function Page() { return <DetailPage eyebrow="CÓMO FUNCIONA" title="Del primer contacto a las clases" intro="Teselando entiende tu necesidad, selecciona al profesor y sigue presente." sections={[
  { eyebrow: "EL RECORRIDO", title: "Nos dejas tu teléfono", items: ["Contacto", "Necesidad", "Selección", "Clases"] },
  { eyebrow: "SELECCIÓN", title: "Buscamos el encaje", items: ["Asignatura", "Nivel", "Objetivo", "Disponibilidad"] },
  { eyebrow: "DESPUÉS DE EMPEZAR", title: "La academia sigue presente", items: ["Gestión", "Pagos", "Soporte", "Continuidad"] },
  { eyebrow: "SI NO ENCAJA", title: "Cambio de profesor", items: ["Traslado de contexto", "Soporte", "Continuidad"] },
  { eyebrow: "ANTES DE DECIDIR", title: "Pocas decisiones, condiciones claras", items: ["Proceso", "Precio", "Protección"] },
]} />; }
