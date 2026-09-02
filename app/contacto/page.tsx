import { SecondaryPage } from "@/components/site/SecondaryPage";
import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/contacto/" }, title: "Contacto" };
export default function ContactoPage() { return <SecondaryPage sectionCount={4} title="Contacto" />; }
