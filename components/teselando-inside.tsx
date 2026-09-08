"use client";

import Image from "next/image";
import { PointerEvent, UIEvent, useEffect, useRef, useState } from "react";
import { sitePath } from "@/lib/site-path";

const moments = [
  { src: "/images/teselando/inside-04.webp", alt: "Persona hablando junto a una proyección con una representación matemática." },
  { src: "/images/teselando/inside-02.webp", alt: "Personas sentadas observando una presentación en un aula universitaria." },
  { src: "/images/teselando/inside-06.webp", alt: "Cinco personas posando juntas frente a una pantalla de proyección." },
] as const;

export function TeselandoInside() {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); }, []);

  const moveTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(moments.length - 1, index));
    const target = track.children[next] as HTMLElement | undefined;
    if (target) track.scrollTo({ left: target.offsetLeft, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setActive(next);
  };

  const syncActive = (event: UIEvent<HTMLDivElement>) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const track = event.currentTarget;
    frameRef.current = requestAnimationFrame(() => {
      const cards = [...track.children] as HTMLElement[];
      const closest = cards.reduce((best, card, index) => {
        const distance = Math.abs(card.offsetLeft - track.scrollLeft);
        return distance < best.distance ? { index, distance } : best;
      }, { index: 0, distance: Number.POSITIVE_INFINITY });
      setActive(closest.index);
    });
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = event.currentTarget;
    dragRef.current = { active: true, startX: event.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
    track.dataset.dragging = "true";
  };
  const drag = (event: PointerEvent<HTMLDivElement>) => { if (dragRef.current.active) event.currentTarget.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX); };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    event.currentTarget.dataset.dragging = "false";
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return <section className="section inside-section" id="profesores" data-reveal>
    <header className="inside-heading"><p>Teselando por dentro</p><h2>Aprender también es sentirse acompañado.</h2><p>Detrás de cada clase hay personas, conversaciones y una academia que sigue presente durante el proceso.</p></header>
    <div className="inside-gallery-shell">
      <div className="inside-gallery-plane" aria-hidden="true"><i /><i /></div>
      <div ref={trackRef} className="inside-gallery" role="region" aria-label="Algunos momentos de Teselando" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); moveTo(active + (event.key === "ArrowRight" ? 1 : -1)); } }} onScroll={syncActive} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        {moments.map((moment, index) => <figure key={moment.src} className={`inside-moment inside-moment-${index + 1}`}><Image src={sitePath(moment.src)} alt={moment.alt} fill sizes="(max-width: 700px) 82vw, (max-width: 1100px) 46vw, 39vw" draggable={false} /></figure>)}
      </div>
      <div className="inside-gallery-controls"><p>Algunos momentos de Teselando.</p><div><button type="button" onClick={() => moveTo(active - 1)} disabled={active === 0} aria-label="Imagen anterior">←</button><span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(moments.length).padStart(2, "0")}</span><button type="button" onClick={() => moveTo(active + 1)} disabled={active === moments.length - 1} aria-label="Imagen siguiente">→</button></div></div>
    </div>
  </section>;
}
