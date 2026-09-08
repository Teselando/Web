import Image from "next/image";
import Link from "next/link";
import { sitePath } from "@/lib/site-path";

const criteria = [
  { title: "Dominio de la materia", description: "Conocimiento y especialización suficientes para esa asignatura y nivel.", image: "/images/teselando/criterion-mastery.webp" },
  { title: "Capacidad para enseñar", description: "Valoramos cómo explica, comunica y se adapta al alumno.", image: "/images/teselando/criterion-teaching.webp" },
  { title: "Encaje con tu contexto", description: "Curso, universidad o comunidad autónoma, asignatura, examen y situación concreta.", image: "/images/teselando/criterion-context.webp" },
  { title: "Calidad que se mantiene", description: "Superar el proceso de selección no basta: también importa mantener una buena experiencia y calidad con el tiempo.", image: "/images/teselando/criterion-continuity.webp" },
] as const;

export function SelectionShowcase() {
  return <section className="section selection-section" id="encaje" data-reveal>
    <header className="selection-heading"><p className="eyebrow">Selección y encaje</p><h2>Nuestro criterio de encaje</h2></header>
    <div className="selection-composition">
      <div className="selection-fit" aria-hidden="true">
        {criteria.map((criterion, index) => <div className={`fit-piece fit-piece-${String.fromCharCode(97 + index)}`} key={criterion.title}><Image src={sitePath(criterion.image)} alt="" fill sizes="(max-width: 760px) 44vw, 18vw" /><span>{["Materia", "Enseñanza", "Contexto", "Seguimiento"][index]}</span></div>)}
        <div className="fit-center"><i /><strong>ENCAJE</strong></div>
      </div>
      <ol>{criteria.map((criterion, index) => <li key={criterion.title}><span aria-hidden="true">0{index + 1}</span><div><h3>{criterion.title}</h3><p>{criterion.description}</p></div></li>)}</ol>
    </div>
    <Link className="text-link selection-link" href="/como-funciona/">Ver cómo funciona <span aria-hidden="true">→</span></Link>
  </section>;
}
