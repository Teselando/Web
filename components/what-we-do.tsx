"use client";

import Image from "next/image";
import { KeyboardEvent, useRef, useState } from "react";
import { sitePath } from "@/lib/site-path";

const items = [
  { title: "El profesor adecuado, para tu caso concreto.", description: "Buscamos según tu asignatura, nivel, universidad o comunidad autónoma, examen y situación. No te dejamos eligiendo entre cien perfiles.", image: "/images/teselando/inside-05.webp", alt: "Grupo de participantes tras una actividad de divulgación matemática." },
  { title: "La calidad empieza antes de la primera clase.", description: "Entrevista, simulacro de clase, experiencia y especialización. Antes de llegar a un alumno, pasan por el criterio de Teselando.", image: "/images/teselando/inside-03.webp", alt: "Ponentes explican un problema de geometría ante el aula." },
  { title: "Teselando, contigo cuando lo necesitas.", description: "Tienes el respaldo de Teselando durante el proceso: soporte si surge un inconveniente, especialistas cuando hacen falta, ayuda entre clases y cambio gestionado si algo no encaja.", image: "/images/teselando/inside-01.webp", alt: "Actividad de divulgación matemática con ponentes y público." },
  { title: "Un ecosistema que sigue contigo.", description: "Comunidad, recursos, continuidad entre asignaturas y un espacio Teselando que irá reuniendo tu experiencia académica.", image: "/images/teselando/inside-07.webp", alt: "Grupo de participantes reunido en un aula universitaria." },
] as const;

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const item = items[active];

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + items.length) % items.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return <section className="section what-section" id="prueba" data-reveal>
    <header className="what-heading"><p className="eyebrow">Qué es Teselando</p><h2>Un profesor que encaja. Una academia que responde.</h2></header>
    <div className="what-showcase">
      <div className="what-visual" aria-live="polite">
        {items.map((candidate, index) => <Image key={candidate.image} className={active === index ? "is-active" : ""} src={sitePath(candidate.image)} alt={active === index ? candidate.alt : ""} fill sizes="(max-width: 760px) 100vw, 55vw" priority={index === 0} />)}
        <div className="what-plane" aria-hidden="true"><i /><i /><i /></div>
        <p><span aria-hidden="true">0{active + 1}</span>{item.title}</p>
      </div>
      <div className="what-tabs" role="tablist" aria-label="Qué hace Teselando">
        {items.map((candidate, index) => <button key={candidate.title} ref={(node) => { buttons.current[index] = node; }} type="button" role="tab" aria-selected={active === index} tabIndex={active === index ? 0 : -1} className={active === index ? "is-active" : ""} onClick={() => setActive(index)} onKeyDown={(event) => move(event, index)}><span>0{index + 1}</span><strong>{candidate.title}</strong><small>{candidate.description}</small></button>)}
      </div>
    </div>
  </section>;
}
