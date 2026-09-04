import Link from "next/link";
import { LeadCapture } from "@/components/lead-capture";

const steps = ["Nos dejas tu teléfono", "Entendemos lo que necesitas", "Seleccionamos al profesor", "Empiezan las clases"];

export function Hero() {
  return <section className="hero" data-hero id="inicio"><div className="hero-water" aria-hidden="true"><video autoPlay loop muted playsInline preload="auto" poster="/images/hero-underwater.webp"><source src="/video/water-reflection-loop.mp4" type="video/mp4" /></video></div><div className="hero-content"><p className="eyebrow">ACADEMIA ONLINE · CIENCIAS Y MATEMÁTICAS</p><h1>Creemos en ti</h1><p className="hero-lead">No necesitas cien profesores. Necesitas uno que encaje.</p><LeadCapture /></div><a href="#prueba" className="scroll-cue" aria-label="Seguir explorando"><span /></a></section>;
}

export function ImmediateProof() {
  return <section className="section proof-section grid-bg" id="prueba" data-reveal><div className="section-index">02</div><div className="section-heading"><p className="eyebrow">UNA ACADEMIA, NO UN CATÁLOGO</p><h2>Profesores seleccionados para lo que necesitas.</h2></div><div className="proof-path" aria-label="Entendemos, seleccionamos y acompañamos"><span>Entendemos</span><span>Seleccionamos</span><span>Acompañamos</span></div></section>;
}

export function HowItWorks() {
  return <section className="section process-section" id="proceso" data-reveal><div className="section-heading"><p className="eyebrow">PASO A PASO</p><h2>Así funciona</h2></div><ol className="process-list">{steps.map((step, index) => <li key={step}><span className="step-number">0{index + 1}</span><span className="angle-tile" aria-hidden="true" /><strong>{step}</strong></li>)}</ol><Link className="button" href="#contacto">Buscar profesor</Link></section>;
}

export function Fit() {
  return <section className="section fit-section" id="encaje" data-reveal><div className="fit-copy"><p className="eyebrow">SELECCIÓN Y ENCAJE</p><h2>No buscamos cualquier profe. Buscamos el que encaje con tu caso.</h2><div className="fit-criteria"><span>Nivel</span><span>Objetivo</span><span>Ritmo</span><span>Disponibilidad</span></div><Link className="text-link light-link" href="/como-funciona/">Ver cómo funciona</Link></div><div className="fit-visual" aria-hidden="true"><i /><i /><i /><i /><div className="fit-core" /></div></section>;
}

export function Professors() {
  return <section className="section professors-section" id="profesores" data-reveal><div className="section-heading"><p className="eyebrow">PERSONAS QUE ENSEÑAN</p><h2>Profesores reales</h2></div><div className="teaching-table" aria-hidden="true"><div className="seat seat-a" /><div className="worksheet"><span /><span /><span /><span /></div><div className="seat seat-b" /></div><div className="subject-index"><span>Ciencias</span><span>Matemáticas</span><span>Bachillerato</span><span>Universidad</span></div></section>;
}

export function SocialProof() {
  return <section className="section evidence-section grid-bg" id="evidencia" data-reveal><div className="section-heading"><p className="eyebrow">PRUEBA ANTES QUE PROMESA</p><h2>Razones para creer</h2></div><div className="evidence-line"><span>Selección</span><span>Experiencia relevante</span><span>Especialización</span><span>Presentación cuidada</span></div></section>;
}

export function Protection() {
  return <section className="section protection-section" id="proteccion" data-reveal><div className="protection-copy"><p className="eyebrow">LA ACADEMIA SIGUE PRESENTE</p><h2>Si algo no encaja, seguimos contigo</h2></div><div className="continuity-line" aria-hidden="true"><span /><span className="swap" /><span /></div><div className="mechanism-index"><span>Cambio de profesor</span><span>Traslado de contexto</span><span>Soporte</span><span>Continuidad</span></div></section>;
}

export function Pricing() {
  return <section className="section pricing-section grid-bg" id="precio" data-reveal><div className="price-display"><p>Desde</p><h2>20 <span>€/h</span></h2></div><div className="price-details"><div><span>Precio</span><span>depende del contexto</span></div><div><span>Antes de empezar</span><span>conoces el importe exacto</span></div><div><span>Pago</span><span>clase a clase</span></div><Link className="button" href="/precios/">Ver precio y condiciones</Link></div></section>;
}

export function FinalCta() {
  return <section className="section final-cta" id="contacto" data-reveal><div className="final-shape" aria-hidden="true" /><div><p className="eyebrow">EMPECEMOS POR TU CASO</p><h2>Creemos en ti</h2><LeadCapture tone="blue" /></div></section>;
}
