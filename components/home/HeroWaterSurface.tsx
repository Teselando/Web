"use client";

import { useEffect, useRef, useState } from "react";

type Ripple = { id: number; x: number; y: number };

const interactiveSelector = ".homepage-hero__copy, .lead-capture, a, button, input, textarea, select, label, [role='button']";

export function HeroWaterSurface() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const pointerFrame = useRef<number>(0);
  const pendingPointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const surface = surfaceRef.current;
    if (!hero || !surface) return undefined;
    const surfaceElement = surface;

    function isReducedMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function updatePointerLight(event: PointerEvent) {
      if (event.pointerType !== "mouse" || window.innerWidth < 768 || isReducedMotion()) return;
      const bounds = surfaceElement.getBoundingClientRect();
      pendingPointer.current = {
        x: ((event.clientX - bounds.left) / bounds.width) * 100,
        y: ((event.clientY - bounds.top) / bounds.height) * 100,
      };
      if (pointerFrame.current) return;
      pointerFrame.current = window.requestAnimationFrame(() => {
        pointerFrame.current = 0;
        const point = pendingPointer.current;
        if (!point) return;
        surfaceElement.style.setProperty("--water-x", `${point.x}%`);
        surfaceElement.style.setProperty("--water-y", `${point.y}%`);
      });
    }

    function createRipple(event: PointerEvent) {
      const target = event.target;
      if (isReducedMotion() || !(target instanceof Element) || target.closest(interactiveSelector)) return;
      const bounds = surfaceElement.getBoundingClientRect();
      const ripple = { id: nextRippleId.current++, x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      setRipples((current) => [...current.slice(-2), ripple]);
      const timer = window.setTimeout(() => {
        setRipples((current) => current.filter(({ id }) => id !== ripple.id));
        timers.current = timers.current.filter((item) => item !== timer);
      }, 1300);
      timers.current.push(timer);
    }

    hero.addEventListener("pointermove", updatePointerLight, { passive: true });
    hero.addEventListener("pointerdown", createRipple, { passive: true });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      surfaceElement.classList.toggle("hero-water-surface--paused", !entry.isIntersecting);
    }, { threshold: 0.01 });
    visibilityObserver.observe(hero);
    const syncPageVisibility = () => {
      surfaceElement.classList.toggle("hero-water-surface--paused", document.visibilityState !== "visible");
    };
    document.addEventListener("visibilitychange", syncPageVisibility);
    return () => {
      hero.removeEventListener("pointermove", updatePointerLight);
      hero.removeEventListener("pointerdown", createRipple);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPageVisibility);
      if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
      timers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div aria-hidden="true" className="hero-water-surface" ref={surfaceRef}>
      <span className="hero-water-field hero-water-field--broad" />
      <span className="hero-water-field hero-water-field--surface" />
      <svg className="hero-water-refraction" preserveAspectRatio="none" viewBox="0 0 1000 600">
        <defs>
          <filter id="hero-water-displacement">
            <feTurbulence baseFrequency=".006 .018" numOctaves="3" seed="8" type="fractalNoise">
              <animate attributeName="baseFrequency" dur="19s" repeatCount="indefinite" values=".006 .018;.012 .011;.008 .024;.005 .016;.006 .018" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="hero-water-caustic-distortion">
            <feTurbulence baseFrequency=".015 .038" numOctaves="2" seed="13" type="fractalNoise">
              <animate attributeName="baseFrequency" dur="13s" repeatCount="indefinite" values=".015 .038;.021 .03;.012 .045;.018 .034;.015 .038" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="18" />
          </filter>
          <linearGradient id="hero-water-light" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#FAF8F3" stopOpacity=".18" />
            <stop offset=".34" stopColor="#B6EEFF" stopOpacity=".3" />
            <stop offset=".66" stopColor="#2BCAFF" stopOpacity=".08" />
            <stop offset="1" stopColor="#008DE9" stopOpacity=".16" />
          </linearGradient>
          <pattern height="150" id="hero-water-caustics" patternUnits="userSpaceOnUse" width="260">
            <path d="M-20 92 C 42 58, 86 126, 148 84 S 250 46, 286 95" fill="none" stroke="#B6EEFF" strokeOpacity=".33" strokeWidth="3" />
            <path d="M-15 42 C 38 28, 78 74, 132 49 S 222 18, 276 58" fill="none" stroke="#2BCAFF" strokeOpacity=".16" strokeWidth="2" />
            <path d="M24 132 C 72 111, 118 158, 170 125 S 254 102, 300 134" fill="none" stroke="#FFD166" strokeOpacity=".1" strokeWidth="2" />
          </pattern>
        </defs>
        <rect fill="url(#hero-water-light)" filter="url(#hero-water-displacement)" height="600" width="1000" />
        <rect className="hero-water-caustic-map" fill="url(#hero-water-caustics)" filter="url(#hero-water-caustic-distortion)" height="600" width="1000" />
      </svg>
      <span className="hero-water-current hero-water-current--one" />
      <span className="hero-water-current hero-water-current--two" />
      <span className="hero-water-field hero-water-field--glints" />
      {ripples.map(({ id, x, y }) => <span className="hero-water-ripple" key={id} style={{ left: x, top: y }} />)}
    </div>
  );
}
