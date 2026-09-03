"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setOpen(!localStorage.getItem("teselando:consent"))); return () => cancelAnimationFrame(frame); }, []);
  function choose(value: "necessary" | "analytics") {
    localStorage.setItem("teselando:consent", value); setOpen(false);
  }
  if (!open) return <button className="cookie-reopen" onClick={() => setOpen(true)}>Preferencias de cookies</button>;
  return <aside className="consent" aria-label="Preferencias de cookies"><p>Usamos cookies necesarias para que la web funcione. Las analíticas solo se activan con tu permiso. <Link href="/legal/cookies/">Más información</Link></p><div><button className="button button-ghost" onClick={() => choose("necessary")}>Rechazar analíticas</button><button className="button" onClick={() => choose("analytics")}>Aceptar analíticas</button></div></aside>;
}
