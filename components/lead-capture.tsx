"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export function LeadCapture({ tone = "light" }: { tone?: "light" | "blue" }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").trim();
    if (phone.replace(/\D/g, "").length < 7) {
      setStatus("error"); setMessage("Introduce un número válido."); return;
    }
    setStatus("submitting"); setMessage("");
    try {
      const response = await fetch("/api/leads/", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": crypto.randomUUID() },
        body: JSON.stringify({ phone, website: data.get("website"), sourcePage: location.pathname }),
      });
      const result = await response.json();
      if (!response.ok || !result.leadId) throw new Error("save_failed");
      sessionStorage.setItem("teselando:lead", result.leadId);
      setStatus("success");
    } catch {
      setStatus("error"); setMessage("No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
    }
  }

  if (status === "success") {
    return <div className="lead-success" role="status"><strong>✓ Ya tenemos tu contacto.</strong><span>Responde a unas preguntas rápidas para ir más preparados.</span><Link className="button" href="/solicitud/">Continuar</Link></div>;
  }

  return (
    <form className={`lead-form lead-form-${tone}`} onSubmit={submit} noValidate>
      <label htmlFor={`phone-${tone}`}>Tu teléfono</label>
      <div className="lead-row">
        <input id={`phone-${tone}`} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} required aria-describedby={`phone-help-${tone}`} />
        <button className="button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Guardando…" : "Buscar profesor"}</button>
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p id={`phone-help-${tone}`} className={`form-note ${status === "error" ? "form-error" : ""}`} aria-live="polite">{message || "Te escribiremos por WhatsApp para continuar."}</p>
    </form>
  );
}
