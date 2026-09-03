"use client";

import { useEffect, useRef, useState } from "react";
import { homeRail } from "@/lib/content";

export function ScrollExperience() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [shown, setShown] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealNodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (!reduced) {
      const revealObserver = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-revealed")),
        { rootMargin: "0px 0px -12%", threshold: 0.12 },
      );
      revealNodes.forEach((node) => revealObserver.observe(node));

      const onScroll = () => {
        const y = window.scrollY;
        if (Math.abs(y - lastY.current) > 8) setDirection(y > lastY.current ? "down" : "up");
        lastY.current = y;
        const final = document.getElementById("contacto");
        setShown(y > innerHeight * .82 && (!final || final.getBoundingClientRect().top > innerHeight * .7));
        document.documentElement.style.setProperty("--scroll-shift", `${Math.min(y * 0.025, 28)}px`);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        revealObserver.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    }
    revealNodes.forEach((node) => node.classList.add("is-revealed"));
  }, []);

  useEffect(() => {
    const sections = homeRail
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const candidate = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * 0.4) - Math.abs(b.boundingClientRect.top - innerHeight * 0.4))[0];
        if (candidate) setActive(Math.max(0, homeRail.findIndex((item) => item.id === candidate.target.id)));
      },
      { rootMargin: "-34% 0px -54%", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`home-rail direction-${direction} ${shown ? "is-shown" : ""}`} aria-label="Secciones de la página">
      {homeRail.map((item, index) => (
        <a key={item.id} href={`#${item.id}`} className={active === index ? "is-active" : ""} aria-label={item.label}>
          <span className="rail-label">{item.label}</span><span className="rail-marker" />
        </a>
      ))}
    </nav>
  );
}
