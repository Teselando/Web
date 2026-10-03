import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { contactDetails } from "@/lib/content";
import styles from "@/components/secondary-page.module.css";

export const metadata: Metadata = { title: "Contacto", alternates: { canonical: "/contacto/" } };
export default function Page() {
  return (
    <>
      <main id="contenido" className={styles.page}>
        <header className={styles.contactHero}>
          <p className="eyebrow">Contacto</p>
          <h1>Hablemos.</h1>
          <p className={styles.intro}>Cuéntanos qué necesitas y te responderemos personalmente.</p>
        </header>
        <section className={styles.contactContent} aria-labelledby="contact-title">
          <h2 id="contact-title">Estamos al otro lado.</h2>
          <p className={styles.contactCopy}>
            Puedes escribirnos o llamarnos. Revisaremos tu caso con calma para ayudarte a encontrar el siguiente paso.
          </p>
          <div className={styles.contactMethods}>
            <a className={styles.contactMethod} href={contactDetails.emailHref}>
              <span>Correo electrónico</span>
              <strong>{contactDetails.email}</strong>
            </a>
            <a className={styles.contactMethod} href={contactDetails.phoneHref}>
              <span>Teléfono</span>
              <strong>{contactDetails.phoneDisplay}</strong>
            </a>
          </div>
          <Link className={styles.homeAction} href="/">Volver a la página principal</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
