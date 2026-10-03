import type { Metadata } from "next";
import { SecondaryNotice } from "@/components/secondary-notice";

export const metadata: Metadata = { title: "Cómo funciona", alternates: { canonical: "/como-funciona/" } };
export default function Page() {
  return <SecondaryNotice eyebrow="CÓMO FUNCIONA" topic="cómo funciona Teselando" />;
}
