import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { cookieSections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Información sobre las cookies y tecnologías similares de Teselando y cómo gestionar tus preferencias.",
  alternates: { canonical: "/legal/cookies/" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LegalPage title="Cookies" intro="Esta política explica qué cookies y tecnologías similares utiliza Teselando, para qué sirven y cómo puedes decidir cuáles aceptas." route="/legal/cookies/" sections={cookieSections} showTechnologyInventory showPreferencesControl />;
}
