import styles from "./selection-showcase.module.css";

const criteria = [
  {
    title: "Dominio de la materia",
    description: "Conocimiento y especialización suficientes para esa asignatura y nivel.",
    icon: "book",
  },
  {
    title: "Capacidad para enseñar",
    description: "Valoramos cómo explica, comunica y se adapta al alumno.",
    icon: "chart",
  },
  {
    title: "Encaje con tu contexto",
    description: "Curso, universidad o comunidad autónoma, asignatura, examen y situación concreta.",
    icon: "document",
  },
  {
    title: "Calidad que se mantiene",
    description: "Superar el proceso de selección no basta: también importa mantener una buena experiencia y calidad con el tiempo.",
    icon: "heart",
  },
] as const;

const mobilePuzzlePaths = [
  "M80 0H920L1000 34V241L920 275H610C610 330 390 330 390 275H80L0 241V34Z",
  "M80 0H390C390 55 610 55 610 0H920L1000 34V241L920 275H610C610 330 390 330 390 275H80L0 241V34Z",
  "M80 0H390C390 55 610 55 610 0H920L1000 34V241L920 275H610C610 330 390 330 390 275H80L0 241V34Z",
  "M80 0H390C390 55 610 55 610 0H920L1000 34V241L920 275H80L0 241V34Z",
] as const;

function CriterionIcon({ name }: { name: (typeof criteria)[number]["icon"] }) {
  if (name === "book") {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 12c9-2 17 1 24 7v36c-7-6-15-9-24-7V12Zm48 0c-9-2-17 1-24 7v36c7-6 15-9 24-7V12Z" /><path d="M8 48c9-1 17 2 24 7 7-5 15-8 24-7" /></svg>;
  }

  if (name === "chart") {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 54h11V38H8v16Zm18 0h11V27H26v27Zm18 0h11V14H44v40Z" /></svg>;
  }

  if (name === "document") {
    return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 7h25l12 12v38H14V7Z" /><path d="M39 7v12h12M23 31h19M23 40h19M23 49h13" /></svg>;
  }

  return <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 55 11 34C-1 22 14 6 25 17l7 7 7-7c11-11 26 5 14 17L32 55Z" /></svg>;
}

export function SelectionShowcase() {
  return <section className={`section ${styles.section}`} id="encaje" data-reveal>
    <div className={styles.topFold} aria-hidden="true"><i /><i /><i /><i /></div>

    <header className={styles.heading}>
      <p className={styles.eyebrow}>Selección y encaje</p>
      <h2>Nuestro criterio <span>de encaje</span></h2>
    </header>

    <ol className={styles.puzzle}>
      {criteria.map((criterion, index) => <li className={styles.card} key={criterion.title}>
        <svg className={styles.mobileShape} viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden="true">
          <path d={mobilePuzzlePaths[index]} />
        </svg>
        <div className={styles.surface}>
          <span className={styles.number} aria-hidden="true">0{index + 1}</span>
          <CriterionIcon name={criterion.icon} />
          <h3>{criterion.title}</h3>
          <p>{criterion.description}</p>
        </div>
        <i className={styles.connector} aria-hidden="true" />
        <i className={styles.connectorSecondary} aria-hidden="true" />
      </li>)}
    </ol>

    <div className={styles.bottomFolds} aria-hidden="true"><i /><i /><i /><i /></div>
  </section>;
}
