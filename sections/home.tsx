import Image from "next/image";
import Link from "next/link";
import { HeroMotion } from "@/components/hero-motion";
import { HowItWorksSection } from "@/components/how-it-works";
import { LeadCapture } from "@/components/lead-capture";
import { SelectionShowcase } from "@/components/selection-showcase";
import { TeselandoInside } from "@/components/teselando-inside";
import { TrustpilotProof } from "@/components/trustpilot-proof";
import { WhatWeDo } from "@/components/what-we-do";
import { sitePath } from "@/lib/site-path";
import heroStyles from "./hero.module.css";

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

export function HowItWorks() { return <HowItWorksSection />; }

export function Selection() { return <SelectionShowcase />; }
export function Inside() { return <TeselandoInside />; }

export function SocialProof() {
  return <section className="section evidence-section" id="evidencia" data-reveal><header className="evidence-heading"><h2>Esto opinan nuestros alumnos</h2></header><TrustpilotProof /></section>;
}

export function Protection() {
  return <section className="section protection-section" id="proteccion" data-reveal>
    <div className="protection-photo" aria-hidden="true">
      <Image src={sitePath("/images/teselando/protection-beach-hq.png")} alt="" fill sizes="100vw" quality={90} />
      <i className="protection-photo-grade" />
    </div>
    <div className="protection-copy">
      <p className="eyebrow">Protección</p>
      <h2>Teselando siempre<br />estará para ti.</h2>
      <p>Tu profesor lleva las clases. Teselando sigue detrás para ayudarte cuando lo necesites.</p>
      <Link className="protection-cta" href="/garantia/">Conoce nuestra garantía <span aria-hidden="true">→</span></Link>
    </div>
  </section>;
}

export function Pricing() {
  return <section className="section pricing-section" id="precio" data-reveal>
    <div className="pricing-world" aria-hidden="true">
      <div className="pricing-window" />
      <i className="pricing-light pricing-light-a" />
      <i className="pricing-light pricing-light-b" />
      <i className="pricing-platform pricing-platform-back" />
      <i className="pricing-platform pricing-platform-front" />
      <div className="pricing-number">
        <span className="pricing-digit pricing-digit-two" data-digit="2">2</span>
        <span className="pricing-digit pricing-digit-zero" data-digit="0">0</span>
      </div>
      <div className="pricing-rate">€/h.</div>
      <div className="pricing-books">
        <i /><i /><i />
      </div>
      <div className="pricing-plant">
        <i /><i /><i /><i />
      </div>
    </div>
    <div className="pricing-copy">
      <p className="eyebrow">Precios</p>
      <h2><span>Clases desde</span><span><strong>20 €/h.</strong></span></h2>
      <p className="pricing-description">Un precio claro y sin sorpresas, para que puedas concentrarte en lo importante.</p>
      <ul className="pricing-benefits">
        <li>
          <span className="pricing-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><ellipse cx="16" cy="9" rx="8" ry="3.5" /><path d="M8 9v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V9M8 14v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5v-5M8 19v4c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5v-4" /></svg></span>
          <span><strong>Pago clase a clase.</strong><small>Sin permanencias ni compromisos a largo plazo.</small></span>
        </li>
        <li>
          <span className="pricing-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M8 4.5h11l5 5V27H8z" /><path d="M19 4.5V10h5M12 15h8M12 19h8M12 23h6" /></svg></span>
          <span><strong>Precio claro antes de empezar.</strong><small>Sabes cuánto cuesta desde la propuesta, sin sorpresas.</small></span>
        </li>
        <li>
          <span className="pricing-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="10" r="5" /><path d="M6.5 27v-3.5c0-4.5 4.2-7.5 9.5-7.5s9.5 3 9.5 7.5V27" /></svg></span>
          <span><strong>El profesor adecuado, para tu caso concreto.</strong><small>El precio se ajusta al nivel, la asignatura y tus necesidades.</small></span>
        </li>
      </ul>
    </div>
  </section>;
}

export function FinalCta() {
  return <section className="section final-cta" id="contacto" data-reveal><div className="final-planes" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><div className="final-content"><p className="eyebrow">Empecemos por tu caso</p><h2>Creemos en ti</h2><LeadCapture tone="blue" countrySelector /></div></section>;
}
