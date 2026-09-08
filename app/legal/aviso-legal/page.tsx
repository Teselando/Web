import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legalNoticeSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal sobre el sitio web de Teselando, su uso y sus contenidos.",
  alternates: { canonical: "/legal/aviso-legal/" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalPage title="Aviso legal" route="/legal/aviso-legal/" sections={legalNoticeSections} identity="owner" />;
}
