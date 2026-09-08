"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  OPEN_CONSENT_PREFERENCES_EVENT,
  readConsent,
  writeConsent,
} from "@/lib/consent";

type View = "notice" | "preferences";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("notice");
  const [analytics, setAnalytics] = useState(false);
  const [hasDecision, setHasDecision] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const existing = readConsent(window.localStorage);
    const frame = requestAnimationFrame(() => {
      setHasDecision(Boolean(existing));
      setAnalytics(existing?.analytics ?? false);
      setOpen(!existing);
    });
    const reopen = () => {
      const current = readConsent(window.localStorage);
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setHasDecision(Boolean(current));
      setAnalytics(current?.analytics ?? false);
      setView("preferences");
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, reopen);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, reopen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("button, input, a")?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open, view]);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => previousFocus.current?.focus());
  }

  function choose(value: boolean) {
    writeConsent(window.localStorage, value);
    setAnalytics(value);
    setHasDecision(true);
    setAnnouncement(value ? "Preferencias guardadas. Analítica aceptada." : "Preferencias guardadas. Analítica rechazada.");
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: { analytics: value } }));
    close();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && hasDecision) {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]") ?? [])];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      {open && (
        <div className="consent-backdrop">
          <div
            className="consent"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            aria-describedby="consent-description"
            onKeyDown={handleKeyDown}
          >
            {view === "notice" ? (
              <>
                <p className="consent-kicker">Tu elección</p>
                <h2 id="consent-title">Cookies y analítica</h2>
                <p id="consent-description">Usamos almacenamiento necesario para recordar tu elección. La analítica es opcional y solo se activará si la aceptas. <Link href="/legal/cookies/">Consulta la Política de cookies.</Link></p>
                <div className="consent-actions">
                  <button className="consent-choice" type="button" autoFocus onClick={() => choose(false)}>Rechazar</button>
                  <button className="consent-choice" type="button" onClick={() => choose(true)}>Aceptar</button>
                  <button className="consent-configure" type="button" onClick={() => setView("preferences")}>Configurar</button>
                </div>
              </>
            ) : (
              <>
                <p className="consent-kicker">Preferencias</p>
                <h2 id="consent-title">Configura tus cookies</h2>
                <p id="consent-description">Puedes cambiar esta elección cuando quieras. Las funciones esenciales siguen disponibles aunque rechaces la analítica.</p>
                <div className="consent-options">
                  <label><span><strong>Necesarias</strong><small>Recuerdan tu elección y permiten funciones esenciales.</small></span><input type="checkbox" checked disabled aria-label="Tecnologías necesarias, siempre activas" /></label>
                  <label><span><strong>Analítica</strong><small>Ayuda a comprender de forma agregada cómo se usa la web.</small></span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /></label>
                </div>
                <div className="consent-actions">
                  <button className="consent-choice" type="button" autoFocus onClick={() => choose(false)}>Rechazar</button>
                  <button className="consent-choice" type="button" onClick={() => choose(analytics)}>Guardar preferencias</button>
                  <button className="consent-configure" type="button" onClick={() => choose(true)}>Aceptar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
