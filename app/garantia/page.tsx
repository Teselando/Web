import type { Metadata } from "next";
import { DetailPage } from "@/components/page-shell";

export const metadata: Metadata = { title: "Garantía", alternates: { canonical: "/garantia/" } };
export default function Page() { return <DetailPage eyebrow="GARANTÍA TESELANDO" title="Para que puedas empezar con tranquilidad" intro="Si surge una incidencia, Teselando sigue detrás para ayudarte a resolverla." heroImage="/images/teselando/band-tutor.webp" heroImageAlt="Profesor de Teselando durante una clase online" sections={[
  { eyebrow: "CAMBIO", title: "Cambiar de profesor es gratuito", body: "Si el encaje no funciona, buscamos una alternativa sin cobrarte por la gestión." },
  { eyebrow: "CONTINUIDAD", title: "Tu contexto se queda contigo", body: "Trasladamos la información útil para evitar que tengas que empezar de cero." },
  { eyebrow: "IMPREVISTOS", title: "Nos adaptamos a lo que ocurra", body: "Te ayudamos cuando una clase no puede celebrarse o surge una incidencia." },
  { eyebrow: "ACOMPAÑAMIENTO", title: "La academia sigue presente", body: "Tu profesor lleva las clases; Teselando mantiene el soporte durante el proceso." },
]} />; }
