import type { Metadata } from "next";
import { SecondaryNotice } from "@/components/secondary-notice";

export const metadata: Metadata = { title: "Garantía", alternates: { canonical: "/garantia/" } };
export default function Page() {
  return <SecondaryNotice eyebrow="GARANTÍA TESELANDO" topic="nuestra garantía y el acompañamiento durante las clases" />;
}
