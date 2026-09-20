"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { flushPendingLeadData } from "@/lib/google-apps-script";

const callingCodes = ["+34", "+33", "+351", "+39", "+44", "+49", "+1", "+52", "+54", "+56", "+57", "+58"];

type LeadCaptureProps = {
  tone?: "light" | "blue";
  countrySelector?: boolean;
  helperText?: string;
  label?: string;
  phonePlaceholder?: string;
  privacyLabel?: string;
  showLabel?: boolean;
};

export function LeadCapture({
  tone = "light",
  countrySelector = false,
  helperText = "Te escribiremos por WhatsApp para continuar.",
  label = "Tu teléfono",
  phonePlaceholder = "Tu número de teléfono",
  privacyLabel = "Consulta la Política de privacidad.",
  showLabel,
}: LeadCaptureProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const number = String(data.get("phone") ?? "").trim();
    const callingCode = String(data.get("callingCode") ?? "+34");
    const phone = number.startsWith("+") ? number : `${callingCode}${number}`;
    if (number.replace(/\D/g, "").length < 7) {
      setStatus("error"); setMessage("Introduce un número válido."); return;
    }
    const leadId = crypto.randomUUID();
    const payload = {
      action: "createLead",
      leadId,
      phone,
      website: data.get("website"),
      sourcePage: location.pathname,
      idempotencyKey: crypto.randomUUID(),
    };

    sessionStorage.setItem("teselando:lead", leadId);
    sessionStorage.setItem("teselando:pending-lead", JSON.stringify(payload));
    setStatus("success");
    void flushPendingLeadData();
  }

  if (status === "success") {
    return <div className="lead-success" role="status"><strong>✓ Ya tenemos tu contacto.</strong><span>Responde a unas preguntas rápidas para ir más preparados.</span><Link className="button" href="/solicitud/">Continuar</Link></div>;
  }

  return (
    <form className={`lead-form lead-form-${tone}`} onSubmit={submit} noValidate>
      <label className={(showLabel ?? !countrySelector) ? undefined : "sr-only"} htmlFor={`phone-${tone}`}>{label}</label>
      <div className="lead-row">
        {countrySelector ? <div className="phone-field"><select name="callingCode" defaultValue="+34" aria-label="Código de país">{callingCodes.map((code) => <option key={code} value={code}>{code}</option>)}</select><input id={`phone-${tone}`} name="phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={24} placeholder={phonePlaceholder} required aria-describedby={message || helperText ? `phone-help-${tone}` : undefined} /></div> : <input id={`phone-${tone}`} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} placeholder={phonePlaceholder} required aria-describedby={message || helperText ? `phone-help-${tone}` : undefined} />}
        <button className="button" type="submit">Buscar profesor</button>
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {message || helperText ? <p id={`phone-help-${tone}`} className={`form-note ${status === "error" ? "form-error" : ""}`} aria-live="polite">{message || helperText}</p> : null}
      <p className="form-privacy"><Link href="/legal/privacidad/">{privacyLabel}</Link></p>
    </form>
  );
}
