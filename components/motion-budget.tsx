"use client";

import { useEffect } from "react";

const RUNNING = "running";
const PAUSED = "paused";

export function MotionBudget() {
  useEffect(() => {
    const regions = [...document.querySelectorAll<HTMLElement>(".home-page > section")];
    if (!regions.length) return;

    const visible = new WeakMap<HTMLElement, boolean>();

    const applyState = (region: HTMLElement) => {
      region.dataset.motionState = !document.hidden && visible.get(region) ? RUNNING : PAUSED;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const region = entry.target as HTMLElement;
          visible.set(region, entry.isIntersecting);
          applyState(region);
        });
      },
      { rootMargin: "35% 0px 35%", threshold: 0 },
    );

    regions.forEach((region) => {
      visible.set(region, false);
      region.dataset.motionState = PAUSED;
      observer.observe(region);
    });

    const onVisibilityChange = () => regions.forEach(applyState);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      regions.forEach((region) => delete region.dataset.motionState);
    };
  }, []);

  return null;
}
