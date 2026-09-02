import type { Metadata } from "next";
import { SecondaryPage } from "@/components/site/SecondaryPage";
export const metadata: Metadata = { robots: { follow: false, index: false } };
export default function RecursosPage() { return <SecondaryPage sectionCount={1} title="Recursos" />; }
