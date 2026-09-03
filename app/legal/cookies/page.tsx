import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = { title: "Cookies", robots: { index: false, follow: false } };
export default function Page() { return <LegalPage title="Cookies" sections={["Cookies necesarias", "Cookies analíticas", "Preferencias"]} />; }
