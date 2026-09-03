import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Aviso legal", robots: { index: false, follow: false } };
export default function Page() { return <LegalPage title="Aviso legal" sections={["Identidad", "Condiciones de uso", "Responsabilidad", "Propiedad intelectual"]} />; }
