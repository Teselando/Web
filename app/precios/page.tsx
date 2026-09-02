import { SecondaryPage } from "@/components/site/SecondaryPage";
import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/precios/" }, title: "Precios" };
export default function PreciosPage() { return <SecondaryPage sectionCount={8} title="Precios" />; }
