import { SecondaryPage } from "@/components/site/SecondaryPage";
import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/como-funciona/" }, title: "Cómo funciona" };
export default function ComoFuncionaPage() { return <SecondaryPage sectionCount={7} title="Cómo funciona" />; }
