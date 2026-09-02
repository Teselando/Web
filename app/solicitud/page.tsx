import type { Metadata } from "next";
import { LeadRequestFlow } from "@/components/site/LeadRequestFlow";
import { PageContainer } from "@/components/ui/PageContainer";
import { legalLinks } from "@/content/legal";
export const metadata: Metadata = { robots: { follow: false, index: false } };
export default function SolicitudPage() { return <article className="secondary-page"><PageContainer className="secondary-page__inner"><h1>Buscar profesor</h1><LeadRequestFlow privacyPolicyHref={legalLinks.privacyPolicyHref} /></PageContainer></article>; }
