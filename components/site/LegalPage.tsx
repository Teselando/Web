import { PageContainer } from "@/components/ui/PageContainer";
import type { ReactNode } from "react";
export function LegalPage({ children, title }: { children: ReactNode; title: string }) { return <article className="legal-page"><PageContainer className="legal-page__inner"><h1>{title}</h1>{children}</PageContainer></article>; }
export function LegalSection({ children, title }: { children: ReactNode; title: string }) { return <section><h2>{title}</h2>{children}</section>; }
