"use client";

import { useEffect, useState } from "react";

const railPoints = [
  ["prueba-inmediata", "No te dejamos buscando entre cientos de perfiles."],
  ["como-funciona", "Cómo funciona"],
  ["seleccion", "Selección y encaje"],
  ["proteccion", "Protección"],
  ["precio", "Precio y condiciones"],
  ["solicitud", "Buscar profesor"],
] as const;

type Direction = "up" | "down";

function RailIcon({ id }: { id: (typeof railPoints)[number][0] }) {
  if (id === "como-funciona") return <svg aria-hidden="true" className="homepage-rail__icon" viewBox="0 0 24 24"><path d="M4 18h16v3H4zm3-6h5v3H7zm5-6h5v3h-5z" /></svg>;
  if (id === "seleccion") return <svg aria-hidden="true" className="homepage-rail__icon" viewBox="0 0 24 24"><path d="M4 4h7v7H4zm9 0h7v7h-7zM8.5 13h7v7h-7z" /></svg>;
  if (id === "proteccion") return <svg aria-hidden="true" className="homepage-rail__icon" viewBox="0 0 24 24"><path d="M12 2 20 5v6c0 5.1-3.4 9.2-8 11-4.6-1.8-8-5.9-8-11V5zm0 5.2L8 8.7v2.1c0 2.8 1.6 5.2 4 6.5 2.4-1.3 4-3.7 4-6.5V8.7z" /></svg>;
  if (id === "precio") return <svg aria-hidden="true" className="homepage-rail__icon" viewBox="0 0 24 24"><path d="M3 7.2 11.2 3H21v9.8L16.8 21 3 7.2Zm12.7.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Z" /></svg>;
  if (id === "solicitud") return <svg aria-hidden="true" className="homepage-rail__icon" viewBox="0 0 24 24"><path d="M3 11h11.2l-3.6-3.6L13.4 4 22 12l-8.6 8-2.8-3.4 3.6-3.6H3z" /></svg>;
  return <svg aria-hidden="true" className="homepage-rail__icon" viewBox="0 0 24 24"><path d="m12 2 9.5 10L12 22 2.5 12z" /></svg>;
}

export function HomepageRail() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>("down");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;
    let activeIndex = -1;
    let diagnosticOpen = false;
    const syncDiagnostic = () => {
      const next = Boolean(document.querySelector(".diagnostic"));
      if (next !== diagnosticOpen) { diagnosticOpen = next; schedule(); }
    };
    const update = () => {
      frame = 0;
      const finalCta = document.getElementById("solicitud");
      const readingLine = window.innerHeight * 0.4;
      if (diagnosticOpen || (finalCta?.getBoundingClientRect().top ?? Infinity) <= readingLine) {
        setActiveId(null);
        return;
      }
      const candidateIndex = railPoints.reduce<number>((current, [id], index) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= readingLine ? index : current;
      }, -1);
      const hysteresis = Math.min(32, window.innerHeight * 0.04);
      if (activeIndex < 0) activeIndex = candidateIndex;
      else if (candidateIndex > activeIndex) {
        const nextSection = document.getElementById(railPoints[activeIndex + 1]?.[0] ?? "");
        if (nextSection && nextSection.getBoundingClientRect().top <= readingLine - hysteresis) activeIndex = candidateIndex;
      } else if (candidateIndex < activeIndex) {
        const currentSection = document.getElementById(railPoints[activeIndex]?.[0] ?? "");
        if (currentSection && currentSection.getBoundingClientRect().top > readingLine + hysteresis) activeIndex = candidateIndex;
      }
      setActiveId(activeIndex >= 0 ? railPoints[activeIndex][0] : null);
      const delta = window.scrollY - previousY;
      if (Math.abs(delta) > 8) setDirection(delta > 0 ? "down" : "up");
      previousY = window.scrollY;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new MutationObserver(syncDiagnostic);
    observer.observe(document.body, { childList: true, subtree: true });
    syncDiagnostic();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); observer.disconnect(); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  return <nav aria-label="Navegación contextual" className="homepage-rail" data-direction={direction} data-expanded={expanded || undefined} data-visible={activeId ? "true" : "false"}><ol>{railPoints.map(([id, label]) => <li key={id}><a aria-current={activeId === id ? "location" : undefined} href={`#${id}`} onClick={() => setExpanded(true)}><span className="homepage-rail__point"><RailIcon id={id} /></span><span className="homepage-rail__label">{label}</span></a></li>)}</ol></nav>;
}
