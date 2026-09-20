"use client";

import { useEffect } from "react";

export function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = 0;

    const paint = () => {
      hero.style.setProperty("--hero-photo-x", `${pointerX * -7}px`);
      hero.style.setProperty("--hero-photo-y", `${pointerY * -5 + scrollY * 0.02}px`);
      hero.style.setProperty("--hero-shape-x", `${pointerX * 12}px`);
      hero.style.setProperty("--hero-shape-y", `${pointerY * 9 + scrollY * 0.04}px`);
      frame = 0;
    };

    const queuePaint = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;
      queuePaint();
    };

    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      queuePaint();
    };

    const onScroll = () => {
      scrollY = Math.min(window.scrollY, hero.offsetHeight);
      queuePaint();
    };

    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
