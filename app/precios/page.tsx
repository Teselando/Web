import type { Metadata } from "next";
import { SecondaryNotice } from "@/components/secondary-notice";

export const metadata: Metadata = { title: "Precios", alternates: { canonical: "/precios/" } };
export default function Page() {
  return <SecondaryNotice eyebrow="PRECIOS" topic="nuestros precios y condiciones" />;
}
