"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sendLeadAction } from "@/lib/google-apps-script";
export function Completion() {
  const [summary, setSummary] = useState("");
  const [callSaved, setCallSaved] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setSummary(sessionStorage.getItem("teselando:summary") || "")); return () => cancelAnimationFrame(frame); }, []);
  async function preferCall() {
    const leadId = sessionStorage.getItem("teselando:lead");
    const raw = sessionStorage.getItem("teselando:diagnostic");
    if (!leadId || !raw) return;
    try {
      await sendLeadAction({ action: "updateDiagnostic", leadId, ...JSON.parse(raw), callPreference: true });
      setCallSaved(true);
    } catch {
      setCallSaved(false);
    }
  }
  return <main id="contenido" className="completion-page"><div><p className="eyebrow">LISTO</p><h1>✓ Ya tenemos lo necesario para empezar</h1>{summary && <p className="completion-summary">{summary}</p>}<p>{callSaved ? "✓ Preferencia guardada." : "Te escribiremos por WhatsApp para continuar."}</p><div className="completion-actions"><button className="button button-ghost" onClick={preferCall} disabled={callSaved}>Prefiero que me llaméis</button><Link href="/solicitud/">Corregir algún dato</Link><Link href="/">Volver al inicio</Link></div></div></main>;
}
