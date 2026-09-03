import Link from "next/link";
import { Footer } from "./footer";
import { LeadCapture } from "./lead-capture";

export type DetailSection = { eyebrow: string; title: string; body?: string; items?: string[] };

export function DetailPage({ eyebrow, title, intro, sections, cta = true }: { eyebrow: string; title: string; intro: string; sections: DetailSection[]; cta?: boolean }) {
  return <><main id="contenido" className="detail-page"><header className="detail-hero grid-bg"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>{cta && <Link className="button" href="/#contacto">Buscar profesor</Link>}</header><div className="detail-sections">{sections.map((section, index) => <section key={section.title} className="detail-section" data-reveal><div className="section-index">{String(index + 1).padStart(2, "0")}</div><div><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}</h2>{section.body && <p>{section.body}</p>}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div></section>)}</div>{cta && <section className="detail-final"><h2>Creemos en ti</h2><LeadCapture /></section>}</main><Footer /></>;
}
