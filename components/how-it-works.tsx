import Link from "next/link";
import styles from "./how-it-works.module.css";

const steps = [
  { title: "Déjanos tu número", description: "Empieza solo con tu teléfono. Nosotros te contactamos para continuar." },
  { title: "Cuéntanos qué necesitas", description: "Nos dices qué estudias, la asignatura y tu situación. Si hace falta, puedes enviarnos apuntes, ejercicios o exámenes para entender mejor tu caso." },
  { title: "Te presentamos hasta 3 profesores", description: "Buscamos los que mejor encajen y te mostramos un máximo de tres perfiles con la información necesaria y el motivo de cada recomendación. Tú eliges." },
  { title: "Empieza las clases", description: "Coordinamos contigo la primera clase. Después, puedes organizar directamente con tu profesor cuándo dar las siguientes." },
] as const;

type GlyphName = "studies" | "subject" | "situation" | "notes" | "calendar" | "shield";

function Glyph({ name }: { name: GlyphName }) {
  if (name === "studies") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m5 18 19-9 19 9-19 9L5 18Z" /><path d="M13 23v10c7 5 15 5 22 0V23M41 20v11" /></svg>;
  if (name === "subject") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 7h19l6 6v28H13z" /><path d="M32 7v7h7M19 21h13M19 27h13M19 33h9" /><path d="M9 12v31h24" /></svg>;
  if (name === "situation") return <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="15" r="8" /><path d="M9 42c1-11 6-16 15-16s14 5 15 16" /></svg>;
  if (name === "notes") return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m19 34 13-18c5-7 14 0 9 7L25 43C15 53 3 39 11 29l14-18c4-5 11 0 7 5L18 35" /></svg>;
  if (name === "calendar") return <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="32" rx="3" /><path d="M15 5v10M33 5v10M7 20h34M14 27h6M25 27h8M14 34h7" /></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 15 6v11c0 11-6 18-15 22C15 40 9 33 9 22V11l15-6Z" /><path d="m18 24 4 4 8-9" /></svg>;
}

function PhonePreview() {
  return <div className={styles.phonePreview} aria-label="Ejemplo de introducción del teléfono">
    <strong>+34</strong><span aria-hidden="true">⌄</span><p>Tu número de teléfono</p><b aria-hidden="true">✓</b>
  </div>;
}

function NeedsPreview() {
  const notes = [
    ["studies", "Estudios"],
    ["subject", "Asignatura"],
    ["situation", "Situación"],
    ["notes", "Apuntes"],
  ] as const;
  return <div className={styles.needsPreview} aria-hidden="true">
    {notes.map(([icon, label]) => <div key={label}><Glyph name={icon} /><span>{label}</span></div>)}
  </div>;
}

function ProfessorPreview() {
  return <div className={styles.professorPreview} aria-hidden="true">
    <i className={styles.sparkA} /><i className={styles.sparkB} /><i className={styles.sparkC} />
    {[0, 1, 2].map((index) => <div className={index === 1 ? styles.featuredProfessor : ""} key={index}>
      <span className={styles.avatar}><i /></span><i className={styles.profileLine} /><i className={styles.profileLine} /><small>Por qué encaja</small>
    </div>)}
  </div>;
}

function ClassPreview() {
  return <div className={styles.classPreview} aria-hidden="true">
    <div className={styles.peopleRow}>
      <div><span className={`${styles.person} ${styles.student}`}><i /></span><strong>Alumno</strong></div>
      <b>↔</b>
      <div><span className={`${styles.person} ${styles.teacher}`}><i /></span><strong>Profesor</strong></div>
    </div>
    <div className={styles.firstClass}><Glyph name="calendar" /><div><strong>Primera clase</strong><i /><i /></div></div>
  </div>;
}

const previews = [<PhonePreview key="phone" />, <NeedsPreview key="needs" />, <ProfessorPreview key="professors" />, <ClassPreview key="class" />] as const;

export function HowItWorksSection() {
  return <section className={styles.section} id="proceso" data-reveal>
    <div className={styles.topFold} aria-hidden="true"><i /><i /><i /></div>
    <div className={styles.bottomFold} aria-hidden="true"><i /><i /></div>
    <div className={styles.inner}>
      <header className={styles.heading}>
        <p>Paso a paso</p>
        <h2><span>Así</span> funciona</h2>
      </header>
      <div className={styles.journey}>
        <svg className={styles.route} viewBox="0 0 1200 1250" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 75 L250 15 L615 190 L520 265 L505 455 L55 640 L510 785 L615 905 L985 965 L1200 1125" />
        </svg>
        {steps.map((step, index) => <article className={`${styles.step} ${styles[`step${index + 1}`]}`} key={step.title}>
          <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div className={styles.copy}><h3>{step.title}</h3><p>{step.description}</p></div>
          {previews[index]}
        </article>)}
        <Link className={styles.support} href="#contacto"><Glyph name="shield" /><span>Si surge cualquier duda o incidencia, puedes acudir a Teselando.</span></Link>
      </div>
    </div>
  </section>;
}
