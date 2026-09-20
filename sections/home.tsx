import Image from "next/image";
import Link from "next/link";
import { HeroMotion } from "@/components/hero-motion";
import { LeadCapture } from "@/components/lead-capture";
import { SelectionShowcase } from "@/components/selection-showcase";
import { TeselandoInside } from "@/components/teselando-inside";
import { TrustpilotProof } from "@/components/trustpilot-proof";
import { WhatWeDo } from "@/components/what-we-do";
import { sitePath } from "@/lib/site-path";
import type { CSSProperties } from "react";
import heroStyles from "./hero.module.css";

const steps = [
  { title: "Déjanos tu número", description: "Empieza solo con tu teléfono. Nosotros te contactamos para continuar." },
  { title: "Cuéntanos qué necesitas", description: "Nos dices qué estudias, la asignatura y tu situación. Si hace falta, puedes enviarnos apuntes, ejercicios o exámenes para entender mejor tu caso." },
  { title: "Te presentamos hasta 3 profesores", description: "Buscamos los que mejor encajen y te mostramos un máximo de tres perfiles con la información necesaria y el motivo de cada recomendación. Tú eliges." },
  { title: "Empieza las clases", description: "Coordinamos contigo la primera clase. Después, puedes organizar directamente con tu profesor cuándo dar las siguientes." },
] as const;

export function Hero() {
  return <section className={heroStyles.hero} data-hero id="inicio">
    <HeroMotion />
    <div className={heroStyles.texture} aria-hidden="true" />

    <div className={heroStyles.copy}>
      <p className={heroStyles.eyebrow}>Clases particulares online</p>
      <h1 className={heroStyles.title}><span>Creemos</span><span className={heroStyles.titleSecond}>en ti<span className={heroStyles.underline} aria-hidden="true"><i /><i /></span></span></h1>
      <p className={heroStyles.lead}>No necesitas cien profesores.<br />Necesitas uno que encaje.</p>
      <LeadCapture countrySelector showLabel helperText="" phonePlaceholder="612 345 678" privacyLabel="Política de privacidad" />
    </div>

    <div className={heroStyles.collage} aria-hidden="true">
      <div className={heroStyles.photoFrame}>
        <figure className={heroStyles.photo}>
          <Image src={sitePath("/images/teselando/hero-student-v2.webp")} alt="" fill preload sizes="(max-width: 760px) 100vw, 58vw" />
        </figure>
      </div>
      <i className={heroStyles.skyFold} />
      <i className={heroStyles.topBlock} />
      <i className={heroStyles.stripedSun} />
      <div className={heroStyles.noteOverlay}><p>Mismas metas.<br />Mejor acompañamiento.</p><i /></div>
    </div>

    <div className={heroStyles.foreground} aria-hidden="true">
      <i className={heroStyles.leftPlane} />
      <i className={heroStyles.centerPlane} />
      <i className={heroStyles.paperPlane} />
    </div>
    <a className={heroStyles.scrollCue} href="#prueba" aria-label="Seguir a la siguiente sección"><span aria-hidden="true" /></a>
  </section>;
}

export function ImmediateProof() { return <WhatWeDo />; }

export function HowItWorks() {
  return <section className="section process-section" id="proceso" data-reveal>
    <header className="process-heading"><h2>Así funciona</h2></header>
    <ol className="process-list">{steps.map((step, index) => <li key={step.title}><span className="step-number" aria-hidden="true"><i>0{index + 1}</i></span><div className="process-step-copy"><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
    <div className="process-close"><p>Si surge cualquier duda o incidencia, puedes acudir a Teselando.</p><Link className="text-link" href="#contacto">Buscar profesor <span aria-hidden="true">↗</span></Link></div>
  </section>;
}

export function Selection() { return <SelectionShowcase />; }
export function Inside() { return <TeselandoInside />; }

export function SocialProof() {
  return <section className="section evidence-section" id="evidencia" data-reveal><header className="evidence-heading"><h2>Razones para creer</h2></header><TrustpilotProof /><p className="evidence-line">Selección <span /> Experiencia relevante <span /> Especialización <span /> Presentación cuidada</p></section>;
}

export function Protection() {
  return <section className="section protection-section" id="proteccion" data-reveal>
    <div className="protection-landscape" aria-hidden="true">
      <i className="protection-sun" />
      <i className="protection-mountain" />
      <i className="protection-sea" />
      <i className="protection-shore" />
      <i className="protection-foreground" />
    </div>
    <div className="protection-copy">
      <p className="eyebrow">Protección</p>
      <h2>Teselando siempre estará para ti.</h2>
      <p>Tu profesor lleva las clases. Teselando sigue detrás para ayudarte cuando lo necesites.</p>
      <Link className="text-link" href="/garantia/">Conoce nuestra garantía <span aria-hidden="true">→</span></Link>
    </div>
  </section>;
}

export function Pricing() {
  const pricingStyle = { "--pricing-bg": `url("${sitePath("/images/teselando/band-study.webp")}")` } as CSSProperties;
  return <section className="section pricing-section" id="precio" data-reveal style={pricingStyle}><div className="price-heading"><p className="eyebrow">Precios</p><h2>Clases desde</h2></div><div className="price-construction"><p className="price-display"><strong>20</strong><span>€/h.</span></p></div><div className="price-body"><p>El precio puede variar según tu nivel, asignatura y la especialización que necesites. Antes de decidir, sabrás cuánto cuesta tu clase.</p><ul><li>Pago clase a clase</li><li>Precio claro antes de empezar</li></ul><Link className="text-link" href="/precios/">Conoce nuestros precios <span aria-hidden="true">→</span></Link></div></section>;
}

export function FinalCta() {
  return <section className="section final-cta" id="contacto" data-reveal><div className="final-planes" aria-hidden="true"><i /><i /><i /><i /></div><div className="final-content"><p className="eyebrow">Empecemos por tu caso</p><h2>Creemos en ti</h2><LeadCapture tone="blue" /></div></section>;
}
