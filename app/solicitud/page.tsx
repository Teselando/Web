import type { Metadata } from "next";
import { Diagnostic } from "@/components/diagnostic";
export const metadata: Metadata = { title: "Solicitud", robots: { index: false, follow: false } };
export default function Page() { return <main id="contenido" className="diagnostic-page"><Diagnostic /></main>; }
