"use client";
export function CookiePreferencesTrigger() { return <button className="text-link" onClick={() => window.dispatchEvent(new Event("teselando-open-preferences"))} type="button">Preferencias de cookies</button>; }
