"use client";

import { useEffect } from "react";

export function HeroMotion() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layers = [...hero.querySelectorAll<HTMLElement>("[data-hero-motion]")];
    const photoLayer = hero.querySelector<HTMLElement>("[data-hero-photo]");

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let inView = hero.getBoundingClientRect().bottom > 0;
    let listening = false;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;

    const paint = () => {
      // Keep pointer-driven style invalidation out of the text and form subtree.
      photoLayer?.style.setProperty("--hero-photo-x", `${pointerX * -7}px`);
      photoLayer?.style.setProperty("--hero-photo-y", `${pointerY * -5}px`);
      layers.forEach((layer) => {
        layer.style.setProperty("--hero-shape-x", `${pointerX * 12}px`);
        layer.style.setProperty("--hero-shape-y", `${pointerY * 9}px`);
      });
      frame = 0;
    };

    const queuePaint = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX = event.clientX / viewportWidth - 0.5;
      pointerY = event.clientY / viewportHeight - 0.5;
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

    const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) startListening();
      else stopListening();
    }) : null;
    observer?.observe(hero);
    startListening();

    const onResize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    const onVisibilityChange = () => {
      if (document.hidden) stopListening();
      else startListening();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopListening();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
