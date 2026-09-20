"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { homeRail } from "@/lib/content";
import styles from "./scroll-experience.module.css";

type Direction = "up" | "down";

type RailStyle = CSSProperties & {
  "--rail-active": number;
  "--rail-progress": number;
};

const READING_LINE = 0.36;
const DIRECTION_THRESHOLD = 12;

function RailIcon({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.55,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (id) {
    case "prueba":
      return <svg {...common}><path d="M3.5 5.2c2.3-.8 4.5-.4 6.5 1.1v9c-2-1.5-4.2-1.9-6.5-1.1zM16.5 5.2c-2.3-.8-4.5-.4-6.5 1.1v9c2-1.5 4.2-1.9 6.5-1.1z" /></svg>;
    case "proceso":
      return <svg {...common}><circle cx="4" cy="5" r="1.35" /><circle cx="10" cy="10" r="1.35" /><circle cx="16" cy="15" r="1.35" /><path d="M5.3 5.8 8.7 9M11.3 11l3.4 3.2" /></svg>;
    case "encaje":
      return <svg {...common}><circle cx="10" cy="10" r="6.4" /><circle cx="10" cy="10" r="2.1" /><path d="M10 1.8v2M18.2 10h-2M10 18.2v-2M1.8 10h2" /></svg>;
    case "profesores":
      return <svg {...common}><circle cx="7" cy="7" r="2.4" /><circle cx="14" cy="8" r="1.8" /><path d="M2.8 16c.4-3 2-4.6 4.2-4.6s3.8 1.6 4.2 4.6M11.6 12.2c.7-.8 1.5-1.2 2.5-1.2 1.8 0 3 1.4 3.3 3.8" /></svg>;
    case "evidencia":
      return <svg {...common}><path d="m10 2.6 2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5-3.6-3.5 5-.7z" /></svg>;
    case "proteccion":
      return <svg {...common}><path d="M10 2.5 16 5v4.3c0 3.8-2.1 6.4-6 8.2-3.9-1.8-6-4.4-6-8.2V5z" /><path d="m7 10 2 2 4-4" /></svg>;
    case "precio":
      return <svg {...common}><path d="M14.5 5.3a5.3 5.3 0 1 0 0 9.4M3.3 8.2h8M3.3 11.8h7" /></svg>;
    default:
      return <svg {...common}><circle cx="10" cy="10" r="2.2" /></svg>;
  }
}

export function ScrollExperience() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);
  const [direction, setDirection] = useState<Direction>("down");
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const directionRef = useRef<Direction>("down");
  const directionOriginRef = useRef(0);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const sections = homeRail
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const finalCta = document.getElementById("contacto");
    let frame = 0;
    directionOriginRef.current = window.scrollY;

    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-revealed");
    }), { rootMargin: "0px 0px -12%", threshold: .08 });
    revealNodes.forEach((node) => reduced ? node.classList.add("is-revealed") : revealObserver.observe(node));

    const updateRail = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const delta = scrollY - directionOriginRef.current;

      if (Math.abs(delta) >= DIRECTION_THRESHOLD) {
        const nextDirection: Direction = delta > 0 ? "down" : "up";
        if (nextDirection !== directionRef.current) {
          directionRef.current = nextDirection;
          setDirection(nextDirection);
        }
        directionOriginRef.current = scrollY;
      }

      if (!sections.length) return;

      const readingY = scrollY + window.innerHeight * READING_LINE;
      const anchors = sections.map((section) => section.getBoundingClientRect().top + scrollY);
      let nextActive = 0;
      for (let index = 0; index < anchors.length; index += 1) {
        if (readingY >= anchors[index]) nextActive = index;
      }

      const nextAnchor = anchors[nextActive + 1];
      const currentAnchor = anchors[nextActive];
      const span = nextAnchor ? Math.max(1, nextAnchor - currentAnchor) : 1;
      const position = nextAnchor ? Math.min(1, Math.max(0, (readingY - currentAnchor) / span)) : 0;
      const directionalProgress = directionRef.current === "down" ? position : 1 - position;

      setActive(nextActive);
      setProgress(directionRef.current === "up" && nextActive === 0 ? 0 : directionalProgress);

      const heroBottom = hero ? hero.getBoundingClientRect().bottom + scrollY : anchors[0];
      const finalTop = finalCta ? finalCta.getBoundingClientRect().top + scrollY : Number.POSITIVE_INFINITY;
      setShown(readingY >= heroBottom && readingY < finalTop);
    };

    const scheduleRailUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateRail);
    };

    updateRail();
    window.addEventListener("scroll", scheduleRailUpdate, { passive: true });
    window.addEventListener("resize", scheduleRailUpdate);

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", scheduleRailUpdate);
      window.removeEventListener("resize", scheduleRailUpdate);
      if (frame) cancelAnimationFrame(frame);
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    };
  }, []);

  const revealMobileLabels = () => {
    setMobileExpanded(true);
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => setMobileExpanded(false), 5000);
  };

  const handleCompactLink = (event: MouseEvent<HTMLAnchorElement>) => {
    const isCompactMobile = matchMedia("(max-width: 900px) and (hover: none)").matches;
    if (isCompactMobile && !mobileExpanded) {
      event.preventDefault();
      revealMobileLabels();
    }
  };

  const handleDestination = () => {
    setMobileExpanded(false);
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
  };

  const railStyle: RailStyle = {
    "--rail-active": active,
    "--rail-progress": Number(progress.toFixed(4)),
  };

  return (
    <nav
      className={styles.rail}
      aria-label="Secciones de la página"
      data-direction={direction}
      data-expanded={mobileExpanded ? "true" : "false"}
      data-shown={shown ? "true" : "false"}
      onKeyDown={(event) => {
        if (event.key === "Escape") setMobileExpanded(false);
      }}
      style={railStyle}
    >
      <div className={styles.mobilePanel} aria-hidden={!mobileExpanded}>
        <p>Ir a una sección</p>
        <div>
          {homeRail.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === index ? styles.panelActive : undefined}
              aria-current={active === index ? "location" : undefined}
              onClick={handleDestination}
              tabIndex={mobileExpanded ? 0 : -1}
            >
              <span className={styles.panelIcon}><RailIcon id={item.id} /></span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <span className={styles.track} aria-hidden="true">
        <span className={styles.movingSegment} />
      </span>

      <div className={styles.points}>
        {homeRail.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={active === index ? styles.active : undefined}
            aria-label={item.label}
            aria-current={active === index ? "location" : undefined}
            onClick={handleCompactLink}
          >
            <span className={styles.label}>{item.label}</span>
            <span className={styles.point}><RailIcon id={item.id} /></span>
          </a>
        ))}
      </div>
    </nav>
  );
}
