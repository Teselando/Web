import Image from "next/image";
import Link from "next/link";
import { sitePath } from "@/lib/site-path";
import { Footer } from "./footer";
import { LeadCapture } from "./lead-capture";
import { PageReveals } from "./page-reveals";

export type DetailSection = { eyebrow: string; title: string; body?: string; items?: string[] };

export function DetailPage({ eyebrow, title, intro, sections, cta = true, heroImage, heroImageAlt = "" }: { eyebrow: string; title: string; intro: string; sections: DetailSection[]; cta?: boolean; heroImage?: string; heroImageAlt?: string }) {
  return <><PageReveals /><main id="contenido" className="detail-page"><header className={`detail-hero grid-bg${heroImage ? " has-visual" : ""}`}><div className="detail-hero-copy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p>{cta && <Link className="button" href="/#contacto">Buscar profesor</Link>}</div>{heroImage && <figure className="detail-hero-visual"><Image src={sitePath(heroImage)} alt={heroImageAlt} fill sizes="(max-width: 760px) 100vw, 55vw" priority /></figure>}</header><div className="detail-sections">{sections.map((section, index) => <section key={section.title} className="detail-section" data-reveal><div className="section-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div><div><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}</h2>{section.body && <p>{section.body}</p>}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div></section>)}</div>{cta && <section className="detail-final"><h2>Creemos en ti</h2><LeadCapture /></section>}</main><Footer /></>;
}
