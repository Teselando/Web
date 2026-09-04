"use client";

import { useEffect, useRef, useState } from "react";
import { homeRail } from "@/lib/content";

function RailIcon({ id }: { id: string }) {
  const paths: Record<string, React.ReactNode> = {
    prueba: <><path d="M5 12h14M12 5v14" /><circle cx="12" cy="12" r="3" /></>,
    proceso: <><path d="M4 7l5 5-5 5M9 12h11" /></>,
    encaje: <><circle cx="7" cy="12" r="2.5" /><circle cx="17" cy="12" r="2.5" /><path d="M9.5 12h5" /></>,
    profesores: <><circle cx="12" cy="8" r="3" /><path d="M6.5 19c.8-3.3 2.6-5 5.5-5s4.7 1.7 5.5 5" /></>,
    proteccion: <path d="M12 3l7 3v5c0 4.7-2.7 7.8-7 10-4.3-2.2-7-5.3-7-10V6l7-3z" />,
    precio: <><circle cx="12" cy="12" r="8.5" /><path d="M15 8.5c-.7-.9-1.7-1.4-3-1.4-1.7 0-3 1-3 2.4 0 3.6 6.2 1.3 6.2 4.9 0 1.5-1.4 2.5-3.2 2.5-1.4 0-2.6-.5-3.4-1.5" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g>{paths[id]}</g></svg>;
}

export function ScrollExperience() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [shown, setShown] = useState(false);
  const lastY = useRef(0);
  const directionRef = useRef<"up" | "down">("down");
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const railSections = homeRail
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const heroElement = document.querySelector<HTMLElement>("[data-hero]");
    let frame = 0;
    let heroVisible = true;
    if (!reduced) document.documentElement.classList.add("motion-ready");

    const syncHeroActivity = () => {
      heroElement?.classList.toggle("is-active", heroVisible && !document.hidden);
    };

    const heroObserver = heroElement
      ? new IntersectionObserver(([entry]) => {
          heroVisible = entry.isIntersecting;
          syncHeroActivity();
        }, { threshold: .05 })
      : null;
    if (heroElement && heroObserver) heroObserver.observe(heroElement);
    document.addEventListener("visibilitychange", syncHeroActivity);

    const updateRail = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      const nextDirection = Math.abs(delta) > 8 ? (delta > 0 ? "down" : "up") : directionRef.current;
      if (Math.abs(delta) > 8) {
        directionRef.current = nextDirection;
        setDirection(nextDirection);
        lastY.current = y;
      }

      const anchors = railSections.map((section) => section.offsetTop);
      const readingLine = y + innerHeight * .4;
      let position = 0;
      if (anchors.length > 1 && readingLine >= anchors[0]) {
        position = anchors.length - 1;
        for (let index = 0; index < anchors.length - 1; index += 1) {
          if (readingLine < anchors[index + 1]) {
            const span = Math.max(1, anchors[index + 1] - anchors[index]);
            position = index + Math.max(0, Math.min(1, (readingLine - anchors[index]) / span));
            break;
          }
        }
      }

      const lastIndex = Math.max(0, homeRail.length - 1);
      const activeIndex = Math.max(0, Math.min(lastIndex, nextDirection === "down" ? Math.floor(position) : Math.ceil(position)));
      const start = Math.min(activeIndex, position);
      setActive(activeIndex);
      railRef.current?.style.setProperty("--rail-start", `${lastIndex ? (start / lastIndex) * 100 : 0}%`);
      railRef.current?.style.setProperty("--rail-length", `${lastIndex ? (Math.abs(position - activeIndex) / lastIndex) * 100 : 0}%`);

      const final = document.getElementById("contacto");
      const hasLeftHero = !heroElement || heroElement.getBoundingClientRect().bottom < innerHeight * .72;
      const beforeFinal = !final || final.getBoundingClientRect().top > innerHeight * .72;
      setShown(hasLeftHero && beforeFinal);
      document.documentElement.style.setProperty("--scroll-shift", `${Math.min(y * 0.025, 28)}px`);

      revealNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > innerHeight + 120) return;
        const progress = Math.max(0, Math.min(1, (innerHeight * .9 - rect.top) / (innerHeight * .62)));
        const drift = Math.max(-1, Math.min(1, (innerHeight * .5 - (rect.top + rect.height * .5)) / (innerHeight + rect.height) * 2));
        const motionY = (1 - progress) * 26;
        node.style.setProperty("--motion-opacity", progress.toFixed(3));
        node.style.setProperty("--motion-y", `${motionY.toFixed(2)}px`);
        node.style.setProperty("--motion-y-2", `${(motionY + 7 * (1 - progress)).toFixed(2)}px`);
        node.style.setProperty("--motion-y-3", `${(motionY + 14 * (1 - progress)).toFixed(2)}px`);
        node.style.setProperty("--motion-y-4", `${(motionY + 21 * (1 - progress)).toFixed(2)}px`);
        node.style.setProperty("--motion-x", `${((1 - progress) * 24).toFixed(2)}px`);
        node.style.setProperty("--motion-x-reverse", `${((progress - 1) * 24).toFixed(2)}px`);
        node.style.setProperty("--motion-scale", (.975 + progress * .025).toFixed(4));
        node.style.setProperty("--motion-drift", `${(drift * 12).toFixed(2)}px`);
        node.style.setProperty("--motion-clip", `${((1 - progress) * 100).toFixed(2)}%`);
      });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateRail);
    };

    if (!reduced) {
      const revealObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-revealed")),
        { rootMargin: "0px 0px -12%", threshold: 0.12 },
      );
      revealNodes.forEach((node) => revealObserver.observe(node));
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      updateRail();
      return () => {
        revealObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        document.removeEventListener("visibilitychange", syncHeroActivity);
        heroObserver?.disconnect();
        heroElement?.classList.remove("is-active");
        document.documentElement.classList.remove("motion-ready");
        if (frame) cancelAnimationFrame(frame);
      };
    }
    revealNodes.forEach((node) => node.classList.add("is-revealed"));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateRail();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", syncHeroActivity);
      heroObserver?.disconnect();
      heroElement?.classList.remove("is-active");
      document.documentElement.classList.remove("motion-ready");
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav
      ref={railRef}
      className={`home-rail direction-${direction} ${shown ? "is-shown" : ""}`}
      aria-label="Secciones de la página"
    >
      <span className="rail-track" aria-hidden="true"><span className="rail-travel" /></span>
      {homeRail.map((item, index) => (
        <a key={item.id} href={`#${item.id}`} className={active === index ? "is-active" : ""} aria-label={item.label} aria-current={active === index ? "location" : undefined}>
          <span className="rail-label">{item.label}</span><span className="rail-icon"><RailIcon id={item.id} /></span>
        </a>
      ))}
    </nav>
  );
}
