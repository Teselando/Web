import { PrimaryButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";

type SecondaryPageProps = { sectionCount: number; title: string };

export function SecondaryLeadTrigger() { return <PrimaryButton href="/solicitud/">Buscar profesor</PrimaryButton>; }

export function SecondaryPage({ sectionCount, title }: SecondaryPageProps) { return <article className="secondary-page"><PageContainer className="secondary-page__inner"><header className="secondary-page__intro"><h1>{title}</h1><SecondaryLeadTrigger /></header>{Array.from({ length: sectionCount }, (_, index) => <section className="secondary-page__section" key={index} />)}<footer className="secondary-page__final"><SecondaryLeadTrigger /></footer></PageContainer></article>; }
