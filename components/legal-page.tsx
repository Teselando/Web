import { Footer } from "./footer";

export function LegalPage({ title, sections }: { title: string; sections: string[] }) {
  return <><main id="contenido" className="detail-page legal-page"><header className="detail-hero grid-bg"><p className="eyebrow">INFORMACIÓN LEGAL</p><h1>{title}</h1></header><div className="detail-sections">{sections.map((section, index) => <section className="detail-section" key={section}><div className="section-index">{String(index + 1).padStart(2, "0")}</div><div><h2>{section}</h2></div></section>)}</div></main><Footer /></>;
}
