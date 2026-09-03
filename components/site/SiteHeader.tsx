"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import type { CSSProperties } from "react";
import { TeselandoLogo } from "@/components/brand/TeselandoLogo";
import { LeadCaptureTrigger } from "@/components/site/LeadCaptureTrigger";
import { PageContainer } from "@/components/ui/PageContainer";

type NavbarTheme = "ivory" | "ice" | "blue" | "dark";

const homeSectionIds = ["hero", "prueba-inmediata", "como-funciona", "seleccion", "profesores", "prueba-social", "proteccion", "precio", "solicitud"];

const sectionThemes: Record<string, NavbarTheme> = {
  hero: "ivory",
  "prueba-inmediata": "ice",
  "como-funciona": "ivory",
  seleccion: "blue",
  profesores: "ivory",
  "prueba-social": "ice",
  proteccion: "ivory",
  precio: "ice",
  solicitud: "dark",
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothStep(value: number) {
  return value * value * (3 - 2 * value);
}

export function SiteHeader() {
  const [reveal, setReveal] = useState(0);
  const [theme, setTheme] = useState<NavbarTheme>("ivory");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("hero");
      if (!hero) { setReveal(1); return; }
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (reducedMotion) {
        setReveal(heroBottom <= 0 ? 1 : 0);
      } else {
        const enterAt = window.innerHeight * .98;
        const settleAt = window.innerHeight * .12;
        setReveal(smoothStep(clamp((enterAt - heroBottom) / (enterAt - settleAt))));
      }

      const probeY = Math.min(window.innerHeight - 1, 76);
      const section = homeSectionIds
        .map((id) => document.getElementById(id))
        .find((element) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return rect.top <= probeY && rect.bottom > probeY;
        });
      setTheme(sectionThemes[section?.id ?? "hero"] ?? "ivory");
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== "/") return;
    const hero = document.getElementById("hero");
    if (!hero) return;
    event.preventDefault();
    hero.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }

  const headerStyle = { "--header-reveal": reveal, "--header-offset": `${(reveal - 1) * 132}%` } as CSSProperties;
  return <header className="site-header" data-interactive={reveal > .82 || undefined} data-theme={theme} style={headerStyle}><PageContainer className="site-header__inner"><Link aria-label="Teselando, inicio" className="site-header__logo" href="/" onClick={handleLogoClick}><TeselandoLogo priority /></Link><LeadCaptureTrigger label="Buscar profesor" targetId="captacion-telefono" /></PageContainer></header>;
}
