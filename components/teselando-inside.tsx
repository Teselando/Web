"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { sitePath } from "@/lib/site-path";
import styles from "./teselando-inside.module.css";

const moments = [
  { src: "/images/teselando/inside-07.webp", alt: "La comunidad de Teselando reunida en un aula universitaria.", caption: "La comunidad Teselando" },
  { src: "/images/teselando/inside-04.webp", alt: "Una persona compartiendo una idea durante una actividad de Teselando.", caption: "Ideas que se comparten" },
  { src: "/images/teselando/inside-03.webp", alt: "Tres estudiantes explicando un problema matemático.", caption: "Aprender entre todos" },
  { src: "/images/teselando/inside-02.webp", alt: "Estudiantes siguiendo una presentación en un aula.", caption: "Escuchar y participar" },
  { src: "/images/teselando/inside-01.webp", alt: "Taller creativo de papiroflexia organizado por Teselando.", caption: "Talleres que nos unen" },
  { src: "/images/teselando/inside-05.webp", alt: "Un grupo de personas de la comunidad Teselando posando juntas.", caption: "Personas que acompañan" },
  { src: "/images/teselando/inside-06.webp", alt: "Cinco integrantes de la comunidad Teselando sonriendo juntos.", caption: "Una comunidad cercana" },
  { src: "/images/teselando/inside-08.webp", alt: "Integrantes de Teselando reunidos después de una actividad.", caption: "Momentos que dejan huella" },
] as const;

function CommunityIcon() {
  return <svg viewBox="0 0 48 40" aria-hidden="true"><circle cx="16" cy="12" r="6" /><circle cx="32" cy="12" r="6" /><path d="M4 36v-7c0-6 5-10 12-10s12 4 12 10v7M22 23c2-3 5-4 10-4 7 0 12 4 12 10v7" /></svg>;
}

function LearningIcon() {
  return <svg viewBox="0 0 48 40" aria-hidden="true"><path d="m3 13 21-10 21 10-21 10L3 13Z" /><path d="M12 18v10c5 5 19 5 24 0V18M44 15v13" /></svg>;
}

function CareIcon() {
  return <svg viewBox="0 0 48 40" aria-hidden="true"><path d="M24 36 7 20C-2 10 12-1 24 10 36-1 50 10 41 20L24 36Z" /></svg>;
}

const values = [
  { key: "community", label: <>Comunidad<br />real</>, icon: <CommunityIcon /> },
  { key: "learning", label: <>Aprendizaje<br />colaborativo</>, icon: <LearningIcon /> },
  { key: "care", label: <>Personas<br />que te acompañan</>, icon: <CareIcon /> },
] as const;

export function TeselandoInside() {
  const [active, setActive] = useState(0);
  const touchStart = useRef({ x: 0, y: 0 });
  const thumbnailRail = useRef<HTMLDivElement>(null);
  const previous = (active - 1 + moments.length) % moments.length;
  const next = (active + 1) % moments.length;
  const move = (direction: -1 | 1) => setActive((current) => (current + direction + moments.length) % moments.length);

  useEffect(() => {
    const rail = thumbnailRail.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth + 1) return;

    const selectedThumbnail = rail.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!selectedThumbnail) return;

    const targetLeft = selectedThumbnail.offsetLeft - (rail.clientWidth - selectedThumbnail.offsetWidth) / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({ left: targetLeft, behavior: reduceMotion ? "auto" : "smooth" });
  }, [active]);

  return <section className={styles.section} id="profesores" data-reveal>
    <div className={styles.cornerPlane} aria-hidden="true" />
    <div className={styles.inner}>
      <div className={styles.story}>
        <p className={styles.eyebrow}><span>Nosotros</span><i aria-hidden="true" /></p>
        <h2>Teselando<br />por dentro</h2>
        <p className={styles.lead}>Aprender también es sentirse acompañado.</p>
        <p className={styles.body}>Detrás de cada clase hay personas, conversaciones y una academia que sigue presente durante el proceso.</p>

        <ul className={styles.values} aria-label="Lo que nos define">
          {values.map((value) => <li key={value.key}><span>{value.icon}</span><p>{value.label}</p></li>)}
        </ul>

        <blockquote className={styles.quote}>
          <span aria-hidden="true">“</span>
          <p>Más que una academia,<br />una comunidad que cree en ti.</p>
          <footer>Teselando</footer>
        </blockquote>
      </div>

      <div className={styles.gallery}>
        <div className={styles.galleryHeading}>
          <h3>Algunos momentos de Teselando</h3>
          <p>Más que una academia</p>
        </div>

        <div
          className={styles.stage}
          aria-live="polite"
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStart.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={(event) => {
            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - touchStart.current.x;
            const deltaY = touch.clientY - touchStart.current.y;
            if (Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY)) move(deltaX > 0 ? -1 : 1);
          }}
        >
          <figure className={`${styles.sideFrame} ${styles.sideLeft}`} aria-hidden="true"><Image key={moments[previous].src} src={sitePath(moments[previous].src)} alt="" fill sizes="14vw" /></figure>
          <figure className={styles.mainFrame}>
            <Image key={moments[active].src} src={sitePath(moments[active].src)} alt={moments[active].alt} fill sizes="(max-width: 760px) calc(100vw - 40px), 62vw" />
            <figcaption key={`caption-${moments[active].src}`}><strong>{String(active + 1).padStart(2, "0")}</strong><span>/ {String(moments.length).padStart(2, "0")}</span><em>{moments[active].caption}</em></figcaption>
          </figure>
          <figure className={`${styles.sideFrame} ${styles.sideRight}`} aria-hidden="true"><Image key={moments[next].src} src={sitePath(moments[next].src)} alt="" fill sizes="14vw" /></figure>
          <button className={`${styles.stageArrow} ${styles.stagePrevious}`} type="button" onClick={() => move(-1)} aria-label="Ver imagen anterior"><span aria-hidden="true">‹</span></button>
          <button className={`${styles.stageArrow} ${styles.stageNext}`} type="button" onClick={() => move(1)} aria-label="Ver imagen siguiente"><span aria-hidden="true">›</span></button>
        </div>

        <div ref={thumbnailRail} className={styles.thumbnails} role="tablist" aria-label="Elegir un momento de Teselando">
          {moments.map((moment, index) => <button key={moment.src} type="button" role="tab" aria-selected={active === index} aria-label={`Ver imagen ${index + 1}: ${moment.caption}`} onClick={() => setActive(index)}><Image src={sitePath(moment.src)} alt="" fill sizes="140px" /></button>)}
        </div>

        <div className={styles.galleryFooter}>
          <div className={styles.dots} aria-hidden="true">{moments.map((moment, index) => <i key={moment.src} className={active === index ? styles.activeDot : undefined} />)}</div>
          <div className={styles.footerArrows}>
            <button type="button" onClick={() => move(-1)} aria-label="Ver imagen anterior"><span aria-hidden="true">←</span></button>
            <button type="button" onClick={() => move(1)} aria-label="Ver imagen siguiente"><span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
