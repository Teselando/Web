"use client";

import { FormEvent, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { flushPendingLeadData } from "@/lib/google-apps-script";

const callingCodes = [
  { code: "+1", country: "Estados Unidos", flag: "/flags/us.svg" },
  { code: "+33", country: "Francia", flag: "/flags/fr.svg" },
  { code: "+34", country: "España", flag: "/flags/es.svg" },
  { code: "+39", country: "Italia", flag: "/flags/it.svg" },
  { code: "+44", country: "Reino Unido", flag: "/flags/gb.svg" },
  { code: "+49", country: "Alemania", flag: "/flags/de.svg" },
  { code: "+52", country: "México", flag: "/flags/mx.svg" },
  { code: "+54", country: "Argentina", flag: "/flags/ar.svg" },
  { code: "+56", country: "Chile", flag: "/flags/cl.svg" },
  { code: "+57", country: "Colombia", flag: "/flags/co.svg" },
  { code: "+58", country: "Venezuela", flag: "/flags/ve.svg" },
  { code: "+351", country: "Portugal", flag: "/flags/pt.svg" },
] as const;

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
  const instanceId = useId().replaceAll(":", "");
  const phoneId = `phone-${instanceId}`;
  const helpId = `phone-help-${instanceId}`;
  const countryListId = `country-list-${instanceId}`;
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [callingCode, setCallingCode] = useState("+34");
  const [countryListOpen, setCountryListOpen] = useState(false);
  const selectedCountry = callingCodes.find(({ code }) => code === callingCode) ?? callingCodes[2];

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
      <label className={(showLabel ?? !countrySelector) ? undefined : "sr-only"} htmlFor={phoneId}>{label}</label>
      <div className="lead-row">
        {countrySelector ? (
          <div className="phone-field">
            <div
              className="country-select"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setCountryListOpen(false);
              }}
            >
              <button
                className="country-select-display"
                type="button"
                aria-label={`${selectedCountry.country}, prefijo ${selectedCountry.code}. Cambiar país`}
                aria-expanded={countryListOpen}
                aria-controls={countryListId}
                aria-haspopup="listbox"
                onClick={() => setCountryListOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setCountryListOpen(true);
                  }
                  if (event.key === "Escape") setCountryListOpen(false);
                }}
              >
                <Image className="country-select-flag" src={selectedCountry.flag} alt="" width={24} height={16} />
                <span className="country-select-code">{selectedCountry.code}</span>
                <span className="country-select-chevron" />
              </button>
              <input type="hidden" name="callingCode" value={callingCode} />
              {countryListOpen ? (
                <div id={countryListId} className="country-select-list" role="listbox" aria-label="Selecciona el prefijo telefónico">
                  {callingCodes.map(({ code, country, flag }) => (
                    <button
                      key={code}
                      className="country-select-option"
                      type="button"
                      role="option"
                      aria-selected={callingCode === code}
                      onClick={() => {
                        setCallingCode(code);
                        setCountryListOpen(false);
                      }}
                    >
                      <Image src={flag} alt="" width={24} height={16} />
                      <strong>{code}</strong>
                      <span>{country}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <input id={phoneId} name="phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={24} placeholder={phonePlaceholder} required aria-describedby={message || helperText ? helpId : undefined} />
          </div>
        ) : <input id={phoneId} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} placeholder={phonePlaceholder} required aria-describedby={message || helperText ? helpId : undefined} />}
        <button className="button" type="submit">Buscar profesor</button>
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {message || helperText ? <p id={helpId} className={`form-note ${status === "error" ? "form-error" : ""}`} aria-live="polite">{message || helperText}</p> : null}
      <p className="form-privacy"><Link href="/legal/privacidad/">{privacyLabel}</Link></p>
    </form>
  );
}
