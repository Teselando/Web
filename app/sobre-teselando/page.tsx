import type { Metadata } from "next";
import { SecondaryNotice } from "@/components/secondary-notice";

export const metadata: Metadata = { title: "Sobre Teselando", alternates: { canonical: "/sobre-teselando/" } };
export default function Page() {
  return <SecondaryNotice eyebrow="SOBRE TESELANDO" topic="quiénes somos y cómo acompañamos a nuestros alumnos" />;
}
