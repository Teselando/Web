"use client";

import { useEffect, useState } from "react";

const railPoints = [
  ["prueba-inmediata", "No te dejamos buscando entre cientos de perfiles."],
  ["como-funciona", "Cómo funciona"],
  ["seleccion", "Selección y encaje"],
  ["profesores", "Profesores reales"],
  ["prueba-social", "Prueba social"],
  ["proteccion", "Protección"],
  ["precio", "Precio y condiciones"],
  ["solicitud", "Buscar profesor"],
] as const;

type Direction = "up" | "down";

export function HomepageRail() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [direction, setDirection] = useState<Direction>("down");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const diagnosticOpen = Boolean(document.querySelector(".diagnostic"));
      const finalCta = document.getElementById("solicitud");
      const readingLine = window.innerHeight * 0.4;
      const finalReached = finalCta ? finalCta.getBoundingClientRect().top <= readingLine : false;

      if (diagnosticOpen || finalReached) {
        setActiveId(null);
        return;
      }

      const next = railPoints.reduce<string | null>((current, [id]) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= readingLine ? id : current;
      }, null);
      setActiveId(next);

      const delta = window.scrollY - previousY;
      if (Math.abs(delta) > 8) setDirection(delta > 0 ? "down" : "up");
      previousY = window.scrollY;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="homepage-rail" data-direction={direction} data-expanded={expanded || undefined} data-visible={activeId ? "true" : "false"}>
      <ol>
        {railPoints.map(([id, label]) => (
          <li key={id}>
            <a aria-current={activeId === id ? "location" : undefined} href={`#${id}`} onClick={() => setExpanded(true)}>
              <span aria-hidden="true" className="homepage-rail__point" />
              <span className="homepage-rail__label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
