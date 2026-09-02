"use client";

import { useRef, useState } from "react";
import { PrimaryButton } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextInput } from "@/components/ui/TextInput";
import { TextLink } from "@/components/ui/TextLink";
import { track } from "@/lib/analytics";

type CaptureState = "idle" | "validating" | "submitting" | "success" | "error";

type LeadCaptureProps = {
  id?: string;
  onLeadCreated?: (leadId: string) => void;
  privacyPolicyHref?: string;
};

function normalizePhoneForValidation(value: string): string | null {
  const compact = value.trim().replace(/[\s().-]/g, "");
  const normalized = compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
  return /^\+?\d{7,15}$/.test(normalized) ? normalized : null;
}

function createIdempotencyKey(): string {
  return crypto.randomUUID().replaceAll("-", "");
}

function sourceContext() {
  const search = new URLSearchParams(window.location.search);
  const get = (key: string) => search.get(key) ?? undefined;
  return { landingPath: window.location.pathname, sourcePage: window.location.pathname, utmCampaign: get("utm_campaign"), utmContent: get("utm_content"), utmMedium: get("utm_medium"), utmSource: get("utm_source") };
}

function publicError(code?: string): string {
  if (code === "VALIDATION_ERROR") return "Introduce un número válido.";
  if (code === "RATE_LIMITED") return "Espera un momento antes de volver a intentarlo.";
  return "No hemos podido guardar tu teléfono. Inténtalo de nuevo.";
}

export function LeadCapture({ id = "captacion-telefono", onLeadCreated, privacyPolicyHref }: LeadCaptureProps) {
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<CaptureState>("idle");
  const [error, setError] = useState<string>();
  const attemptRef = useRef<{ idempotencyKey: string; phone: string } | undefined>(undefined);
  const leadIdRef = useRef<string | undefined>(undefined);
  const formStartedRef = useRef(false);
  const isSubmitting = state === "submitting";
  const fieldId = `${id}-phone`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    track("phone_submit_attempt");
    setState("validating");
    setError(undefined);
    const normalizedPhone = normalizePhoneForValidation(phone);
    if (!normalizedPhone) {
      setError("Introduce un número válido.");
      setState("error");
      document.getElementById(fieldId)?.focus();
      return;
    }
    const attempt = attemptRef.current?.phone === normalizedPhone ? attemptRef.current : { idempotencyKey: createIdempotencyKey(), phone: normalizedPhone };
    attemptRef.current = attempt;
    setState("submitting");
    try {
      const response = await fetch("/api/leads", { body: JSON.stringify({ context: sourceContext(), phone, website: honeypot }), headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.idempotencyKey }, method: "POST" });
      const payload: unknown = await response.json().catch(() => undefined);
      if (!response.ok || !payload || typeof payload !== "object" || typeof (payload as { leadId?: unknown }).leadId !== "string") {
        const code = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "object" && payload.error && "code" in payload.error && typeof payload.error.code === "string" ? payload.error.code : undefined;
        throw new Error(code);
      }
      const leadId = (payload as { leadId: string }).leadId;
      leadIdRef.current = leadId;
      track("lead_created");
      setState("success");
      onLeadCreated?.(leadId);
    } catch (submissionError) {
      track("lead_error");
      setError(publicError(submissionError instanceof Error ? submissionError.message : undefined));
      setState("error");
    }
  }

  if (state === "success") {
    return <section aria-labelledby={`${id}-success-title`} className="lead-capture lead-capture--success" id={id}><StatusMessage kind="success"><span id={`${id}-success-title`}>Ya tenemos tu contacto.</span></StatusMessage><p>Responde a unas preguntas rápidas para ir más preparados.</p></section>;
  }

  return <section aria-label="Solicitud de profesor" className="lead-capture" id={id}><form noValidate onFocus={() => { if (!formStartedRef.current) { formStartedRef.current = true; track("form_start"); } }} onSubmit={handleSubmit}><FormField error={error} id={fieldId} label="Tu teléfono" required>{({ describedBy, inputId, invalid }) => <TextInput aria-describedby={describedBy} autoComplete="tel" data-lead-capture-phone disabled={isSubmitting} id={inputId} inputMode="tel" invalid={invalid} name="phone" onChange={(event) => { setPhone(event.target.value); setError(undefined); if (state === "error") setState("idle"); }} placeholder="Tu número de teléfono" type="tel" value={phone} />}</FormField><div aria-hidden="true" className="lead-capture__honeypot"><label htmlFor={`${id}-website`}>Sitio web</label><input autoComplete="off" id={`${id}-website`} name="website" onChange={(event) => setHoneypot(event.target.value)} tabIndex={-1} type="text" value={honeypot} /></div><PrimaryButton isLoading={isSubmitting} type="submit">{isSubmitting ? "Guardando…" : "Buscar profesor"}</PrimaryButton>{state === "submitting" ? <StatusMessage kind="loading">Guardando…</StatusMessage> : null}<p className="lead-capture__expectation">Usaremos tu teléfono para gestionar tu solicitud y contactarte por WhatsApp.</p>{privacyPolicyHref ? <p className="lead-capture__privacy"><TextLink href={privacyPolicyHref}>Consulta la política de privacidad.</TextLink></p> : null}</form></section>;
}
