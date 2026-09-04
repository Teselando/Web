"use client";

import { useEffect, useRef, useState } from "react";
import { homeRail } from "@/lib/content";

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
    const heroVideo = document.querySelector<HTMLVideoElement>(".hero-water video");
    let frame = 0;
    let heroVisible = true;
    if (!reduced) document.documentElement.classList.add("motion-ready");

    const syncHeroVideo = () => {
      if (!heroVideo || reduced) return;
      if (document.hidden || !heroVisible) heroVideo.pause();
      else void heroVideo.play().catch(() => undefined);
    };

    const heroVideoObserver = heroVideo && !reduced
      ? new IntersectionObserver(([entry]) => {
          heroVisible = entry.isIntersecting;
          syncHeroVideo();
        }, { threshold: .05 })
      : null;
    if (heroVideo && heroVideoObserver) heroVideoObserver.observe(heroVideo);
    document.addEventListener("visibilitychange", syncHeroVideo);

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

      const hero = document.querySelector<HTMLElement>("[data-hero]");
      const final = document.getElementById("contacto");
      const hasLeftHero = !hero || hero.getBoundingClientRect().bottom < innerHeight * .72;
      const beforeFinal = !final || final.getBoundingClientRect().top > innerHeight * .72;
      setShown(hasLeftHero && beforeFinal);
      document.documentElement.style.setProperty("--scroll-shift", `${Math.min(y * 0.025, 28)}px`);

      revealNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > innerHeight + 120) return;
        const progress = Math.max(0, Math.min(1, (innerHeight * .9 - rect.top) / (innerHeight * .62)));
        const drift = Math.max(-1, Math.min(1, (innerHeight * .5 - (rect.top + rect.height * .5)) / (innerHeight + rect.height) * 2));
        const motionY = (1 - progress) * 72;
        node.style.setProperty("--motion-opacity", progress.toFixed(3));
        node.style.setProperty("--motion-y", `${motionY.toFixed(2)}px`);
        node.style.setProperty("--motion-y-2", `${(motionY * 1.15).toFixed(2)}px`);
        node.style.setProperty("--motion-y-3", `${(motionY * 1.3).toFixed(2)}px`);
        node.style.setProperty("--motion-y-4", `${(motionY * 1.45).toFixed(2)}px`);
        node.style.setProperty("--motion-x", `${((1 - progress) * 54).toFixed(2)}px`);
        node.style.setProperty("--motion-x-reverse", `${((progress - 1) * 54).toFixed(2)}px`);
        node.style.setProperty("--motion-scale", (.94 + progress * .06).toFixed(4));
        node.style.setProperty("--motion-drift", `${(drift * 24).toFixed(2)}px`);
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
        document.removeEventListener("visibilitychange", syncHeroVideo);
        heroVideoObserver?.disconnect();
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
      document.removeEventListener("visibilitychange", syncHeroVideo);
      heroVideoObserver?.disconnect();
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
          <span className="rail-label">{item.label}</span><span className="rail-marker" />
        </a>
      ))}
    </nav>
  );
}
