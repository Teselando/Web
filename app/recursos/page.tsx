import type { Metadata } from "next";
import { SecondaryNotice } from "@/components/secondary-notice";

export const metadata: Metadata = { title: "Recursos", alternates: { canonical: "/recursos/" } };
export default function Page() {
  return <SecondaryNotice eyebrow="RECURSOS" topic="nuestros materiales y recursos académicos" />;
}
