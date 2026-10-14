"use client";

import { useEffect } from "react";

const RUNNING = "running";
const PAUSED = "paused";

export function MotionBudget() {
  useEffect(() => {
    const regions = [...document.querySelectorAll<HTMLElement>(".home-page > section")];
    if (!regions.length || !("IntersectionObserver" in window)) return;

    const visible = new WeakMap<HTMLElement, boolean>();

    const applyState = (region: HTMLElement) => {
      const nextState = !document.hidden && visible.get(region) ? RUNNING : PAUSED;
      if (region.dataset.motionState !== nextState) region.dataset.motionState = nextState;
    };

    const refreshVisibility = () => {
      regions.forEach((region) => {
        const bounds = region.getBoundingClientRect();
        visible.set(region, bounds.bottom >= -150 && bounds.top <= window.innerHeight + 150);
        applyState(region);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const region = entry.target as HTMLElement;
          visible.set(region, entry.isIntersecting);
          applyState(region);
        });
      },
      { rootMargin: "150px 0px", threshold: 0 },
    );

    regions.forEach((region) => {
      observer.observe(region);
    });
    // Start visible entrances immediately, including restored/back-forward pages.
    refreshVisibility();

    const onVisibilityChange = () => {
      if (document.hidden) regions.forEach(applyState);
      else refreshVisibility();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", refreshVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", refreshVisibility);
      regions.forEach((region) => delete region.dataset.motionState);
    };
  }, []);

  return null;
}
