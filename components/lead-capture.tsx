"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { sendLeadAction } from "@/lib/google-apps-script";

const callingCodes = ["+34", "+33", "+351", "+39", "+44", "+49", "+1", "+52", "+54", "+56", "+57", "+58"];

export function LeadCapture({ tone = "light", countrySelector = false, helperText = "Te escribiremos por WhatsApp para continuar." }: { tone?: "light" | "blue"; countrySelector?: boolean; helperText?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    const data = new FormData(event.currentTarget);
    const number = String(data.get("phone") ?? "").trim();
    const callingCode = String(data.get("callingCode") ?? "+34");
    const phone = number.startsWith("+") ? number : `${callingCode}${number}`;
    if (number.replace(/\D/g, "").length < 7) {
      setStatus("error"); setMessage("Introduce un número válido."); return;
    }
    setStatus("submitting"); setMessage("");
    try {
      const result = await sendLeadAction({
        action: "createLead",
        phone,
        website: data.get("website"),
        sourcePage: location.pathname,
        idempotencyKey: crypto.randomUUID(),
      });
      if (!result.leadId) throw new Error("save_failed");
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
      <label className={countrySelector ? "sr-only" : undefined} htmlFor={`phone-${tone}`}>Tu teléfono</label>
      <div className="lead-row">
        {countrySelector ? <div className="phone-field"><select name="callingCode" defaultValue="+34" aria-label="Código de país">{callingCodes.map((code) => <option key={code} value={code}>{code}</option>)}</select><input id={`phone-${tone}`} name="phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={24} placeholder="Tu número de teléfono" required aria-describedby={`phone-help-${tone}`} /></div> : <input id={`phone-${tone}`} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} required aria-describedby={`phone-help-${tone}`} />}
        <button className="button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Guardando…" : "Buscar profesor"}</button>
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <p id={`phone-help-${tone}`} className={`form-note ${status === "error" ? "form-error" : ""}`} aria-live="polite">{message || helperText}</p>
      <p className="form-privacy"><Link href="/legal/privacidad/">Consulta la Política de privacidad.</Link></p>
    </form>
  );
}
