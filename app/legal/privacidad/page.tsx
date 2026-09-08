import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Información sobre cómo Teselando trata los datos personales al usar la web y solicitar sus servicios.",
  alternates: { canonical: "/legal/privacidad/" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalPage title="Privacidad" intro="En Teselando queremos que sepas qué datos utilizamos y para qué. Esta política explica cómo tratamos la información personal cuando utilizas nuestra web, solicitas un profesor, contactas con nosotros o utilizas nuestros servicios." route="/legal/privacidad/" sections={privacySections} identity="controller" />;
}
