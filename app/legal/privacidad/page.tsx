import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Privacidad", robots: { index: false, follow: false } };
export default function Page() { return <LegalPage title="Privacidad" sections={["Responsable", "Finalidades", "Conservación", "Derechos"]} />; }
