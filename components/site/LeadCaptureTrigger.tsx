"use client";

import { PrimaryButton } from "@/components/ui/Button";
import { track } from "@/lib/analytics";

type LeadCaptureTriggerProps = { className?: string; label: string; targetId?: string };

// This is the small client boundary where the approved capture interaction will
// live. The Phase 2 anchor is an explicit development placeholder only.
export function LeadCaptureTrigger({ className, label, targetId }: LeadCaptureTriggerProps) {
  if (targetId) {
    return <PrimaryButton className={className} href={`#${targetId}`} onClick={(event) => {
      track("cta_click");
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
      window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`#${targetId} [data-lead-capture-phone]`)?.focus({ preventScroll: true }));
    }}>{label}</PrimaryButton>;
  }

  return <PrimaryButton className={className} disabled>{label}</PrimaryButton>;
}
