"use client";

import { OPEN_CONSENT_PREFERENCES_EVENT } from "@/lib/consent";

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      className={className}
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_PREFERENCES_EVENT))}
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}
