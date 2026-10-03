import Link from "next/link";
import { Footer } from "@/components/footer";
import styles from "./secondary-page.module.css";

type SecondaryNoticeProps = {
  eyebrow: string;
  topic: string;
};

export function SecondaryNotice({ eyebrow, topic }: SecondaryNoticeProps) {
  return (
    <>
      <main id="contenido" className={styles.page}>
        <section className={styles.notice} aria-labelledby="notice-title">
          <div className={styles.noticeContent}>
            <p className="eyebrow">{eyebrow}</p>
            <h1 id="notice-title">Estamos trabajando en ello.</h1>
            <p className={styles.intro}>
              Estamos preparando la información sobre {topic} para que sea clara y realmente útil.
              Si necesitas saber algo antes, escríbenos y te responderemos personalmente.
            </p>
            <div className={styles.actions}>
              <Link className="button" href="/contacto/">Escríbenos</Link>
              <Link className={styles.secondaryAction} href="/">Volver a la página principal</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
