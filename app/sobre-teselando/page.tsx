import { SecondaryPage } from "@/components/site/SecondaryPage";
import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/sobre-teselando/" }, title: "Sobre Teselando" };
export default function SobreTeselandoPage() { return <SecondaryPage sectionCount={6} title="Sobre Teselando" />; }
