import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { LeadCapture } from "@/components/lead-capture";
import { PageReveals } from "@/components/page-reveals";
import { contactDetails } from "@/lib/content";

export const metadata: Metadata = { title: "Contacto", alternates: { canonical: "/contacto/" } };
export default function Page() { return <><PageReveals /><main id="contenido" className="detail-page contact-page"><header className="detail-hero grid-bg"><p className="eyebrow">CONTACTO</p><h1>Cuéntanos qué necesitas</h1><p>Déjanos tu teléfono y continuaremos por WhatsApp.</p><div className="contact-lead"><LeadCapture countrySelector /></div></header><div className="detail-sections"><section className="detail-section contact-options" data-reveal><div className="section-index">01</div><div><p className="eyebrow">CONTACTO DIRECTO</p><h2>Hablemos.</h2><div className="contact-direct"><a href={contactDetails.phoneHref}><small>Teléfono</small><strong>{contactDetails.phoneDisplay}</strong><span aria-hidden="true">↗</span></a><a href={contactDetails.emailHref}><small>Email</small><strong>{contactDetails.email}</strong><span aria-hidden="true">↗</span></a></div></div></section><section className="detail-section" data-reveal><div className="section-index">02</div><div><p className="eyebrow">QUÉ OCURRE DESPUÉS</p><h2>Entendemos tu caso antes de recomendar</h2><p>Contacto humano, sin promesas artificiales.</p></div></section></div></main><Footer /></>; }
