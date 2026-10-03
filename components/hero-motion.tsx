"use client";

import { useEffect } from "react";

export function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let inView = false;
    let listening = false;

    const paint = () => {
      hero.style.setProperty("--hero-photo-x", `${pointerX * -7}px`);
      hero.style.setProperty("--hero-photo-y", `${pointerY * -5}px`);
      hero.style.setProperty("--hero-shape-x", `${pointerX * 12}px`);
      hero.style.setProperty("--hero-shape-y", `${pointerY * 9}px`);
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

    const startListening = () => {
      if (listening || document.hidden || !inView) return;
      listening = true;
      hero.addEventListener("pointermove", onPointerMove, { passive: true });
      hero.addEventListener("pointerleave", onPointerLeave);
    };

    const stopListening = () => {
      if (!listening) return;
      listening = false;
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) startListening();
      else stopListening();
    });
    observer.observe(hero);

    const onVisibilityChange = () => {
      if (document.hidden) stopListening();
      else startListening();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopListening();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
