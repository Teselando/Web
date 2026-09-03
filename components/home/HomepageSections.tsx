import { LeadCaptureTrigger } from "@/components/site/LeadCaptureTrigger";
import { HeroWaterSurface } from "@/components/home/HeroWaterSurface";
import { LeadRequestFlow } from "@/components/site/LeadRequestFlow";
import { PageContainer } from "@/components/ui/PageContainer";
import { isCapabilityAvailable } from "@/content/capabilities";
import { legalLinks } from "@/content/legal";
import type { ReactNode } from "react";

function Section({ children, className, id }: { children: ReactNode; className?: string; id: string }) {
  return <section className={["homepage-section", className].filter(Boolean).join(" ")} id={id}>{children}</section>;
}

function PendingEvidence({ label }: { label: string }) {
  return <div aria-hidden="true" className="evidence-placeholder" data-evidence={label} />;
}

function HeroGeometry() {
  return <div className="homepage-hero__geometry"><span className="homepage-hero__underlight" /><span className="homepage-hero__object homepage-hero__object--cube" /><span className="homepage-hero__object homepage-hero__object--l-block" /><span className="homepage-hero__object homepage-hero__object--stair" /><span className="homepage-hero__object homepage-hero__object--polycube" /></div>;
}

export function HeroSection() {
  return (
    <Section className="homepage-hero" id="hero">
      <HeroWaterSurface />
      <PageContainer className="homepage-hero__inner">
        <div className="homepage-hero__copy">
          <p className="homepage-hero__kicker">Apoyo académico, sin buscar a ciegas</p>
          <h1>Creemos en ti</h1>
          <LeadRequestFlow privacyPolicyHref={legalLinks.privacyPolicyHref} />
        </div>
        <div aria-hidden="true" className="homepage-hero__art">
          <HeroGeometry />
          <span className="homepage-hero__annotation">asignatura · nivel · situación</span>
        </div>
      </PageContainer>
    </Section>
  );
}

export function ImmediateProofSection() {
  return <Section id="prueba-inmediata"><PageContainer className="proof-section"><div><p className="section-label">Una búsqueda acompañada</p><h2>No te dejamos buscando entre cientos de perfiles.</h2></div><p className="prose-measure">Partimos de lo que necesitas ahora: la asignatura, tu nivel y la situación en la que estás. Así la búsqueda no empieza con un catálogo, sino con criterio.</p><div aria-hidden="true" className="proof-flow"><span>Necesidad</span><i>→</i><span>Criterio Teselando</span><i>→</i><span>Profesor que encaje</span></div></PageContainer></Section>;
}

export function HowItWorksSection() {
  const steps = [
    ["Cuéntanos qué necesitas", "Empezamos por entender tu asignatura, nivel y momento."],
    ["Ponemos contexto", "Continuamos la conversación por WhatsApp para preparar la solicitud."],
    ["Buscamos un profesor adecuado", "Teselando propone un encaje según el contexto recogido."],
    ["Empiezan las clases", "Conoces la propuesta, el precio y las condiciones antes de empezar."],
  ];
  return <Section className="homepage-section--ice" id="como-funciona"><PageContainer><div className="section-heading"><p className="section-label">El proceso</p><h2>Entender primero. Proponer después.</h2></div><ol className="process-list">{steps.map(([title, text], index) => <li key={title}><span aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></PageContainer></Section>;
}

export function SelectionSection() {
  return <Section className="selection-section" id="seleccion"><PageContainer className="selection-section__inner"><div><p className="section-label">Selección y encaje</p><h2>Un profesor no está en Teselando porque sí.</h2></div><div className="selection-section__statement"><p>La elección considera la asignatura, el nivel y la situación concreta. Teselando asume el trabajo de orientar esa búsqueda para reducir el riesgo de empezar con un mal encaje.</p><span aria-hidden="true" className="selection-section__line" /></div></PageContainer></Section>;
}

export function ProfessorsSection() {
  return <Section id="profesores"><PageContainer><div className="section-heading"><p className="section-label">Profesores reales</p><h2>Las personas importan tanto como el criterio.</h2></div>{isCapabilityAvailable("professorEvidence") && isCapabilityAvailable("realPhotography") ? <div className="evidence-ready" /> : <PendingEvidence label="Profesores reales" />}</PageContainer></Section>;
}

export function SocialProofSection() {
  return <Section className="homepage-section--ice" id="prueba-social"><PageContainer><div className="section-heading"><p className="section-label">Experiencias</p><h2>La prueba social se mostrará con su contexto real.</h2></div>{isCapabilityAvailable("trustpilot") ? <div className="evidence-ready" /> : <PendingEvidence label="Prueba social" />}</PageContainer></Section>;
}

export function ProtectionSection() {
  return <Section id="proteccion"><PageContainer className="protection-section"><div><p className="section-label">Protección</p><h2>Si algo no encaja, no vuelves a empezar desde cero.</h2><p className="prose-measure">Teselando mantiene el contexto de la solicitud para que no tengas que gestionar la búsqueda por tu cuenta.</p></div>{isCapabilityAvailable("guarantees") ? <div className="evidence-ready" /> : <PendingEvidence label="Condiciones de protección" />}</PageContainer></Section>;
}

export function PriceSection() {
  return <Section className="price-section" id="precio"><PageContainer className="price-section__inner"><div><p className="section-label">Precio y condiciones</p><h2>Desde 20 €/h</h2></div><div className="price-section__details"><p>El precio depende del contexto de la solicitud. Conocerás el importe exacto antes de empezar a decidir.</p><p>El pago es clase a clase.</p><LeadCaptureTrigger label="Buscar profesor" targetId="captacion-telefono" /></div></PageContainer></Section>;
}

export function FinalCtaSection() {
  return <Section className="final-cta" id="solicitud"><PageContainer className="final-cta__inner"><div><p className="section-label">Dar el primer paso</p><h2>Cuéntanos qué necesitas.</h2><p className="prose-measure">Deja tu teléfono y prepararemos la solicitud contigo.</p></div><LeadRequestFlow id="captacion-final" privacyPolicyHref={legalLinks.privacyPolicyHref} /></PageContainer></Section>;
}
