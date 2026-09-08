"use client";

import { useEffect, useRef, useState } from "react";
import { homeRail } from "@/lib/content";

function RailIcon({ id }: { id: string }) {
  return <span className="rail-dot" data-section={id} aria-hidden="true" />;
}

export function ScrollExperience() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const directionRef = useRef<"up" | "down">("down");

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const sections = homeRail.map((item) => document.getElementById(item.id)).filter((node): node is HTMLElement => Boolean(node));
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const final = document.getElementById("contacto");
    let previousY = window.scrollY;
    let scrollFrame = 0;
    if (!reduced) document.documentElement.classList.add("motion-ready");

    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-revealed");
    }), { rootMargin: "0px 0px -12%", threshold: .08 });
    revealNodes.forEach((node) => reduced ? node.classList.add("is-revealed") : revealObserver.observe(node));

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Math.max(0, sections.indexOf(visible.target as HTMLElement)));
    }, { rootMargin: "-28% 0px -54%", threshold: [0, .15, .35, .6] });
    sections.forEach((section) => sectionObserver.observe(section));

    const boundaryObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.target === hero) setShown(entry.boundingClientRect.bottom <= 1);
      if (entry.target === final && entry.isIntersecting) setShown(false);
    }), { threshold: .08 });
    if (hero) boundaryObserver.observe(hero);
    if (final) boundaryObserver.observe(final);

    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        const delta = window.scrollY - previousY;
        if (Math.abs(delta) >= 14) {
          const next = delta > 0 ? "down" : "up";
          if (next !== directionRef.current) {
            directionRef.current = next;
            setDirection(next);
          }
          previousY = window.scrollY;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => { revealObserver.disconnect(); sectionObserver.disconnect(); boundaryObserver.disconnect(); window.removeEventListener("scroll", onScroll); if (scrollFrame) cancelAnimationFrame(scrollFrame); document.documentElement.classList.remove("motion-ready"); };
  }, []);

  return <nav className={`home-rail ${shown ? "is-shown" : ""} is-${direction} rail-at-${active}`} aria-label="Secciones de la página" data-direction={direction}>
    <span className="rail-track" aria-hidden="true"><span className="rail-travel" /></span>
    {homeRail.map((item, index) => <a key={item.id} href={`#${item.id}`} className={active === index ? "is-active" : ""} aria-label={item.label} aria-current={active === index ? "location" : undefined}><span className="rail-label">{item.label}</span><span className="rail-icon"><RailIcon id={item.id} /></span></a>)}
  </nav>;
}
