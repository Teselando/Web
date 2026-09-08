import Link from "next/link";
import { CookiePreferencesButton } from "@/components/cookie-preferences-button";
import { Footer } from "@/components/footer";
import {
  legalConfig,
  legalTechnologyInventory,
  type LegalParagraph,
  type LegalSection,
} from "@/content/legal";
import styles from "./legal-page.module.css";

type LegalPageProps = {
  title: string;
  intro?: string;
  route: "/legal/aviso-legal/" | "/legal/privacidad/" | "/legal/cookies/";
  sections: readonly LegalSection[];
  identity?: "owner" | "controller";
  showTechnologyInventory?: boolean;
  showPreferencesControl?: boolean;
};

const legalLinks = [
  { href: "/legal/aviso-legal/", label: "Aviso legal" },
  { href: "/legal/privacidad/", label: "Privacidad" },
  { href: "/legal/cookies/", label: "Cookies" },
] as const;

function LegalParagraphText({ paragraph }: { paragraph: LegalParagraph }) {
  if (typeof paragraph === "string") return <>{paragraph}</>;
  return <>{paragraph.parts.map((part, index) => typeof part === "string" ? part : <Link href={part.href} key={`${part.href}-${index}`} target={part.href.startsWith("http") ? "_blank" : undefined} rel={part.href.startsWith("http") ? "noopener noreferrer" : undefined}>{part.label}</Link>)}</>;
}

function IdentityDetails({ kind }: { kind: "owner" | "controller" }) {
  const company = legalConfig.company;
  const fields = kind === "owner"
    ? [
        company.legalName && ["Titular", company.legalName, undefined],
        company.taxId && ["NIF/CIF", company.taxId, undefined],
        company.address && ["Domicilio", company.address, undefined],
        ["Correo electrónico", company.email, company.emailHref],
        ["Teléfono", company.phoneDisplay, company.phoneHref],
      ]
    : [
        company.legalName && ["Responsable", company.legalName, undefined],
        company.taxId && ["NIF/CIF", company.taxId, undefined],
        company.address && ["Domicilio", company.address, undefined],
        ["Correo de privacidad", company.privacyEmail, company.privacyEmailHref],
        ["Teléfono", company.phoneDisplay, company.phoneHref],
      ];
  const verified = fields.filter(Boolean) as [string, string, string | undefined][];
  return <dl className={styles.identityList}>{verified.map(([label, value, href]) => <div key={label}><dt>{label}</dt><dd>{href ? <a href={href}>{value}</a> : value}</dd></div>)}</dl>;
}

export function LegalPage({ title, intro, route, sections, identity, showTechnologyInventory = false, showPreferencesControl = false }: LegalPageProps) {
  return (
    <>
      <main id="contenido" className={styles.page}>
        <header className={styles.hero}>
          <p className="eyebrow">Información legal</p>
          <h1>{title}</h1>
          {intro && <p className={styles.intro}>{intro}</p>}
          <p className={styles.updated}>Última actualización: <time dateTime={legalConfig.lastUpdatedIso}>{legalConfig.lastUpdatedLabel}</time></p>
        </header>
        <nav className={styles.legalNav} aria-label="Páginas legales">
          {legalLinks.map((link) => <Link href={link.href} key={link.href} aria-current={route === link.href ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className={styles.readingLayout}>
          <aside className={styles.toc} aria-label={`Contenido de ${title}`}>
            <p>En esta página</p>
            <ol>{sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>
          </aside>
          <article className={styles.article}>
            {sections.map((section, index) => (
              <section className={styles.section} id={section.id} key={section.id}>
                <div className={styles.sectionIndex}>{String(index + 1).padStart(2, "0")}</div>
                <div className={styles.sectionBody}>
                  <h2>{section.title}</h2>
                  {identity && index === 0 && <IdentityDetails kind={identity} />}
                  {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><LegalParagraphText paragraph={paragraph} /></p>)}
                  {section.subsections?.map((subsection) => <div className={styles.subsection} id={subsection.id} key={subsection.id}><h3>{subsection.title}</h3>{subsection.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}><LegalParagraphText paragraph={paragraph} /></p>)}</div>)}
                  {showTechnologyInventory && section.id === "que-utiliza" && (
                    <div className={styles.tableWrap} tabIndex={0} aria-label="Inventario de tecnologías utilizadas">
                      <table>
                        <caption>Inventario actual</caption>
                        <thead><tr><th scope="col">Tecnología</th><th scope="col">Responsable o proveedor</th><th scope="col">Finalidad</th><th scope="col">Duración</th></tr></thead>
                        <tbody>{legalTechnologyInventory.map((item) => <tr key={item.technology}><th scope="row">{item.technology}</th><td>{item.provider}</td><td>{item.purpose}</td><td>{item.duration}</td></tr>)}</tbody>
                      </table>
                    </div>
                  )}
                  {showPreferencesControl && section.id === "cambiar" && <CookiePreferencesButton className={styles.preferenceButton} />}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
