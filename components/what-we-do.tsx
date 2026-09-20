"use client";

import Image from "next/image";
import { KeyboardEvent, useRef, useState } from "react";
import { sitePath } from "@/lib/site-path";
import styles from "./what-we-do.module.css";

type NoteIcon = "book" | "bars" | "cap" | "file" | "person" | "chat" | "class" | "star" | "people" | "headset" | "swap" | "box";
type Photo = { src: string; alt: string; className: string };
type Note = { label: string; icon: NoteIcon; color: "blue" | "yellow" | "pink" | "mint"; className: string };
type Item = { title: string; description: string; photos: ReadonlyArray<Photo>; notes: ReadonlyArray<Note>; aside?: string };

const items: ReadonlyArray<Item> = [
  {
    title: "El profesor adecuado, para tu caso concreto.",
    description: "Buscamos según tu asignatura, nivel, universidad o comunidad autónoma, examen y situación. No te dejamos eligiendo entre cien perfiles.",
    photos: [{ src: "/images/teselando/what-section/fit-tv.webp", alt: "Profesor de ciencias explicando su trabajo en una entrevista.", className: "fitMain" }],
    notes: [
      { label: "Asignatura", icon: "book", color: "blue", className: "noteA" },
      { label: "Nivel", icon: "bars", color: "yellow", className: "noteB" },
      { label: "Universidad / CCAA", icon: "cap", color: "pink", className: "noteC" },
      { label: "Examen", icon: "file", color: "mint", className: "noteD" },
      { label: "Situación", icon: "person", color: "blue", className: "noteE" },
    ],
    aside: "Aprender también es compartir.",
  },
  {
    title: "La calidad empieza antes de la primera clase.",
    description: "Entrevista, simulacro de clase, experiencia y especialización. Antes de llegar a un alumno, pasan por el criterio de Teselando.",
    photos: [
      { src: "/images/teselando/what-section/quality-interview.webp", alt: "Profesional explicando un proceso durante una entrevista.", className: "qualityA" },
      { src: "/images/teselando/what-section/quality-class.webp", alt: "Profesor acompañando a una alumna en clase.", className: "qualityB" },
      { src: "/images/teselando/what-section/quality-experience.webp", alt: "Profesora con experiencia en un aula.", className: "qualityC" },
      { src: "/images/teselando/what-section/quality-specialist.webp", alt: "Profesora especializada con material de clase.", className: "qualityD" },
    ],
    notes: [
      { label: "Entrevista", icon: "chat", color: "pink", className: "noteA" },
      { label: "Simulacro de clase", icon: "class", color: "yellow", className: "noteB" },
      { label: "Experiencia", icon: "star", color: "blue", className: "noteC" },
      { label: "Especialización", icon: "cap", color: "mint", className: "noteD" },
    ],
    aside: "Mejores profesores, mejores historias.",
  },
  {
    title: "Teselando, contigo cuando lo necesitas.",
    description: "Tienes el respaldo de Teselando durante el proceso: soporte si surge un inconveniente, especialistas cuando hacen falta, ayuda entre clases y cambio gestionado si algo no encaja.",
    photos: [{ src: "/images/teselando/what-section/support.webp", alt: "Personas revisando juntas material de estudio.", className: "supportMain" }],
    notes: [
      { label: "Soporte si surge un inconveniente", icon: "headset", color: "blue", className: "noteA" },
      { label: "Especialistas cuando hacen falta", icon: "people", color: "yellow", className: "noteB" },
      { label: "Cambio gestionado", icon: "swap", color: "pink", className: "noteC" },
      { label: "Ayuda entre clases", icon: "chat", color: "mint", className: "noteD" },
    ],
  },
  {
    title: "Un ecosistema que sigue contigo.",
    description: "Comunidad, recursos, continuidad entre asignaturas y un espacio Teselando que irá reuniendo tu experiencia académica.",
    photos: [
      { src: "/images/teselando/what-section/ecosystem-community.webp", alt: "Profesora sonriente delante de una pizarra.", className: "ecosystemA" },
      { src: "/images/teselando/what-section/ecosystem-student.webp", alt: "Estudiante universitario de la comunidad Teselando.", className: "ecosystemB" },
      { src: "/images/teselando/what-section/ecosystem-resources.webp", alt: "Profesora compartiendo recursos en una pizarra.", className: "ecosystemC" },
    ],
    notes: [
      { label: "Comunidad", icon: "people", color: "pink", className: "noteA" },
      { label: "Recursos", icon: "file", color: "blue", className: "noteB" },
      { label: "Continuidad entre asignaturas", icon: "cap", color: "mint", className: "noteC" },
      { label: "Espacio Teselando", icon: "box", color: "yellow", className: "noteD" },
    ],
    aside: "Aprender también es compartir.",
  },
];

function Icon({ name }: { name: NoteIcon }) {
  const props = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "book") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M5 7c4-1 7 .2 11 3v16c-4-2.8-7-4-11-3V7Zm22 0c-4-1-7 .2-11 3v16c4-2.8 7-4 11-3V7Z" /></svg>;
  if (name === "bars") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M6 26V18h4v8H6Zm8 0V12h4v14h-4Zm8 0V5h4v21h-4Z" /></svg>;
  if (name === "cap") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="m3 12 13-6 13 6-13 6-13-6Zm6 4v7c4 3 10 3 14 0v-7m5-2v8" /></svg>;
  if (name === "file") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M8 4h11l5 5v19H8V4Zm11 0v6h6M12 15h8m-8 5h8m-8 5h5" /></svg>;
  if (name === "person") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle {...props} cx="16" cy="9" r="5" /><path {...props} d="M7 28c0-6 3-10 9-10s9 4 9 10H7Z" /></svg>;
  if (name === "chat") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M5 6h22v15H15l-7 5v-5H5V6Zm6 6h10m-10 4h7" /></svg>;
  if (name === "class") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M11 25H4V7h24v18H17m-7-9 4-4 3 3 5-5" /><circle {...props} cx="14" cy="24" r="3" /></svg>;
  if (name === "star") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="m16 3 4 8 9 1-6.5 6 2 9-8.5-4.5L7.5 27l2-9L3 12l9-1 4-8Z" /></svg>;
  if (name === "people") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle {...props} cx="16" cy="9" r="4" /><circle {...props} cx="6" cy="12" r="3" /><circle {...props} cx="26" cy="12" r="3" /><path {...props} d="M9 27v-3c0-4 2.5-7 7-7s7 3 7 7v3H9ZM2 26v-3c0-3 1.5-5 4.5-5M30 26v-3c0-3-1.5-5-4.5-5" /></svg>;
  if (name === "headset") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M5 17v-3a11 11 0 0 1 22 0v3M5 16h5v9H7c-1 0-2-1-2-2v-7Zm22 0h-5v9h3c1 0 2-1 2-2v-7Zm-5 9c0 3-2 4-6 4" /></svg>;
  if (name === "swap") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="M24 7h-8a9 9 0 0 0-8 5l-2 4m2-9-3 5 5 3m-2 10h8a9 9 0 0 0 8-5l2-4m-2 9 3-5-5-3" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...props} d="m16 3 11 6-11 6L5 9l11-6Zm-11 6v14l11 6 11-6V9M16 15v14" /></svg>;
}

function StickyNote({ note }: { note: Note }) {
  return <div className={[styles.note, styles[note.color], styles[note.className]].join(" ")}>
    <Icon name={note.icon} /><span>{note.label}</span><i aria-hidden="true" />
  </div>;
}

export function WhatWeDo() {
  const [active, setActive] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + items.length) % items.length;
    setActive(next);
    buttons.current[next]?.focus();
  };

  return <section className={styles.section} id="prueba" data-reveal>
    <div className={styles.paperTop} aria-hidden="true" />
    <div className={styles.paperBottom} aria-hidden="true" />
    <div className={styles.books} aria-hidden="true"><i /><i /><i /></div>
    <div className={styles.inner}>
      <div className={styles.copy}>
        <header className={styles.heading}>
          <p>Qué es Teselando</p>
          <h2><span>Un profesor que encaja</span><span>y una academia que responde.</span></h2>
        </header>
        <div className={styles.timeline} role="tablist" aria-label="Qué hace Teselando">
          {items.map((item, index) => <button
            key={item.title}
            ref={(node) => { buttons.current[index] = node; }}
            id={"what-tab-" + (index + 1)}
            type="button"
            role="tab"
            aria-controls={"what-panel-" + (index + 1)}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            className={active === index ? styles.active : undefined}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <span className={styles.number}>0{index + 1}</span>
            <span className={styles.stepCopy}><strong>{item.title}</strong><small>{item.description}</small></span>
          </button>)}
        </div>
      </div>
      <div className={styles.visual} aria-live="polite">
        {items.map((item, index) => <div
          key={item.title}
          id={"what-panel-" + (index + 1)}
          role="tabpanel"
          aria-labelledby={"what-tab-" + (index + 1)}
          aria-hidden={active !== index}
          data-panel={index + 1}
          className={[styles.panel, active === index ? styles.panelActive : ""].join(" ")}
        >
          <div className={styles.photos}>
            {item.photos.map((photo, photoIndex) => <figure key={photo.src} className={[styles.photo, styles[photo.className]].join(" ")}>
              <Image src={sitePath(photo.src)} alt={active === index ? photo.alt : ""} fill sizes="(max-width: 760px) 82vw, 47vw" priority={index === 0 && photoIndex === 0} />
            </figure>)}
          </div>
          {item.aside ? <p className={styles.aside}>{item.aside}</p> : null}
          {item.notes.map((note) => <StickyNote key={note.label} note={note} />)}
        </div>)}
      </div>
    </div>
  </section>;
}
