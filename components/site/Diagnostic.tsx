"use client";

import { useEffect, useRef, useState } from "react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/Button";
import { ChoiceGroup } from "@/components/ui/ChoiceGroup";
import { FormField } from "@/components/ui/FormField";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { TextInput } from "@/components/ui/TextInput";
import { TextLink } from "@/components/ui/TextLink";
import { track } from "@/lib/analytics";
import type { DiagnosticFields, DiagnosticUpdate, NeedType, StudyType } from "@/types/leads";

type View = "studyType" | "bachCourse" | "university" | "otherStudies" | "subjects" | "need" | "pauRegion" | "examTiming" | "otherNeed" | "review" | "summary";
type SavePayload = { callPreference?: "call"; completeDiagnostic?: boolean; diagnostic?: DiagnosticUpdate };

const views: View[] = ["studyType", "bachCourse", "university", "otherStudies", "subjects", "need", "pauRegion", "examTiming", "otherNeed", "review", "summary"];

function safeError(code?: string) {
  if (code === "VALIDATION_ERROR") return "Revisa la información e inténtalo de nuevo.";
  if (code === "RATE_LIMITED") return "Espera un momento antes de volver a intentarlo.";
  return "No hemos podido guardar tu respuesta. Inténtalo de nuevo.";
}

function cleanAnswers(input: DiagnosticFields): DiagnosticFields {
  const next = { ...input };
  if (next.studyType !== "bachillerato") next.bachCourse = undefined;
  if (next.studyType !== "university") { next.university = undefined; next.degree = undefined; next.universityCourse = undefined; }
  if (next.studyType !== "other") next.otherStudies = undefined;
  if (!(next.studyType === "bachillerato" && next.bachCourse === "second") && next.needType === "pau") { next.needType = undefined; next.pauRegion = undefined; }
  if (next.needType !== "pau") next.pauRegion = undefined;
  if (next.needType !== "exam") next.examTiming = undefined;
  if (next.needType !== "other") next.otherNeedText = undefined;
  return next;
}

function nextAfterNeed(needType: NeedType): View {
  if (needType === "pau") return "pauRegion";
  if (needType === "exam") return "examTiming";
  if (needType === "other") return "otherNeed";
  return "review";
}

function previousView(view: View, answers: DiagnosticFields): View | null {
  if (view === "studyType") return null;
  if (view === "bachCourse" || view === "university" || view === "otherStudies") return "studyType";
  if (view === "subjects") return answers.studyType === "bachillerato" ? "bachCourse" : answers.studyType === "university" ? "university" : "otherStudies";
  if (view === "need") return "subjects";
  if (view === "review") return "need";
  if (view === "summary") return "review";
  return "need";
}

function studySummary(answers: DiagnosticFields): string | undefined {
  if (answers.studyType === "bachillerato") return answers.bachCourse === "second" ? "2.º Bachillerato" : answers.bachCourse === "first" ? "1.º Bachillerato" : "Bachillerato";
  if (answers.studyType === "university") return [answers.degree, answers.university, answers.universityCourse ? { first: "1º", second: "2º", third: "3º", fourth: "4º", fifth_or_more: "5º+" }[answers.universityCourse] : undefined].filter(Boolean).join(" · ");
  return answers.otherStudies;
}

function needSummary(answers: DiagnosticFields): string | undefined {
  if (answers.needType === "pau") return ["PAU", answers.pauRegion].filter(Boolean).join(" · ");
  if (answers.needType === "exam") return { this_week: "Examen esta semana", one_to_two_weeks: "Examen en 1–2 semanas", more_than_two_weeks: "Examen en más de 2 semanas" }[answers.examTiming ?? "this_week"];
  if (answers.needType === "ongoing") return "Seguimiento durante el curso";
  return answers.otherNeedText;
}

export function Diagnostic({ leadId }: { leadId: string }) {
  const [answers, setAnswers] = useState<DiagnosticFields>({ subjects: [] });
  const [view, setView] = useState<View>("studyType");
  const [subjectInput, setSubjectInput] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [callRequested, setCallRequested] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const initializedHistory = useRef(false);
  const restoringHistory = useRef(false);

  useEffect(() => { requestAnimationFrame(() => headingRef.current?.focus()); }, [view]);
  useEffect(() => { track("diagnostic_start"); }, []);
  useEffect(() => {
    const historyState = { ...history.state, teselandoDiagnosticView: view };
    if (!initializedHistory.current) { history.replaceState(historyState, ""); initializedHistory.current = true; return; }
    if (restoringHistory.current) { restoringHistory.current = false; return; }
    history.pushState(historyState, "");
  }, [view]);
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const target = event.state?.teselandoDiagnosticView;
      if (typeof target === "string" && views.includes(target as View)) { restoringHistory.current = true; setView(target as View); }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  async function save(payload: SavePayload): Promise<boolean> {
    setSaving(true); setError(undefined);
    try {
      const response = await fetch(`/api/leads/${leadId}`, { body: JSON.stringify(payload), headers: { "Content-Type": "application/json" }, method: "PATCH" });
      if (!response.ok) {
        const result: unknown = await response.json().catch(() => undefined);
        const code = result && typeof result === "object" && "error" in result && result.error && typeof result.error === "object" && "code" in result.error && typeof result.error.code === "string" ? result.error.code : undefined;
        throw new Error(code);
      }
      if (payload.diagnostic) track("diagnostic_step_complete");
      return true;
    } catch (saveError) {
      setError(safeError(saveError instanceof Error ? saveError.message : undefined));
      return false;
    } finally { setSaving(false); }
  }

  function changeView(next: View) { setError(undefined); setView(next); }
  function back() { const previous = previousView(view, answers); if (previous) changeView(previous); }
  function updateAnswers(update: Partial<DiagnosticFields>) { setAnswers((current) => cleanAnswers({ ...current, ...update })); }

  async function submitStudy() {
    if (!answers.studyType) { setError("Elige una opción para continuar."); return; }
    let diagnostic: DiagnosticUpdate;
    if (answers.studyType === "bachillerato") {
      if (!answers.bachCourse) { setError("Elige una opción para continuar."); return; }
      diagnostic = { studyType: "bachillerato", bachCourse: answers.bachCourse, degree: null, otherStudies: null, university: null, universityCourse: null };
    } else if (answers.studyType === "university") {
      if (!answers.degree?.trim() || !answers.university?.trim() || !answers.universityCourse) { setError("Completa los campos para continuar."); return; }
      diagnostic = { studyType: "university", bachCourse: null, degree: answers.degree.trim(), otherStudies: null, university: answers.university.trim(), universityCourse: answers.universityCourse };
    } else {
      if (!answers.otherStudies?.trim()) { setError("Completa el campo para continuar."); return; }
      diagnostic = { studyType: "other", bachCourse: null, degree: null, otherStudies: answers.otherStudies.trim(), university: null, universityCourse: null };
    }
    if (await save({ diagnostic })) changeView("subjects");
  }

  function addSubject() {
    const subject = subjectInput.trim().replace(/\s+/g, " ");
    if (!subject || subject.length > 120 || (answers.subjects ?? []).some((item) => item.toLocaleLowerCase("es") === subject.toLocaleLowerCase("es"))) { setError("Introduce una asignatura válida."); return; }
    if ((answers.subjects?.length ?? 0) >= 6) { setError("Puedes añadir hasta 6 asignaturas."); return; }
    updateAnswers({ subjects: [...(answers.subjects ?? []), subject] }); setSubjectInput(""); setError(undefined);
  }

  async function submitSubjects() {
    if (!answers.subjects?.length) { setError("Introduce al menos una asignatura."); return; }
    if (await save({ diagnostic: { subjects: answers.subjects } })) changeView("need");
  }

  async function submitNeed() {
    if (!answers.needType) { setError("Elige una opción para continuar."); return; }
    const diagnostic: DiagnosticUpdate = { needType: answers.needType, examTiming: null, otherNeedText: null, pauRegion: null };
    if (await save({ diagnostic })) changeView(nextAfterNeed(answers.needType));
  }

  async function submitConditional() {
    if (view === "pauRegion") {
      if (!answers.pauRegion?.trim()) { setError("Completa el campo para continuar."); return; }
      if (await save({ diagnostic: { pauRegion: answers.pauRegion.trim() } })) changeView("review");
    }
    if (view === "examTiming") {
      if (!answers.examTiming) { setError("Elige una opción para continuar."); return; }
      if (await save({ diagnostic: { examTiming: answers.examTiming } })) changeView("review");
    }
    if (view === "otherNeed") {
      if (!answers.otherNeedText?.trim()) { setError("Completa el campo para continuar."); return; }
      if (await save({ diagnostic: { otherNeedText: answers.otherNeedText.trim() } })) changeView("review");
    }
  }

  async function complete() { if (await save({ completeDiagnostic: true })) { track("diagnostic_complete"); changeView("summary"); } }
  async function requestCall() { if (await save({ callPreference: "call" })) { track("call_preference"); setCallRequested(true); } }

  const stage = view === "studyType" || view === "bachCourse" || view === "university" || view === "otherStudies" || view === "subjects" ? "studies" : view === "summary" ? "complete" : "need";
  const canChoosePau = answers.studyType === "bachillerato" && answers.bachCourse === "second";

  return <section aria-labelledby="diagnostico-titulo" className="diagnostic"><ol aria-label="Progreso de la solicitud" className="diagnostic__progress"><li>Contacto <span aria-label="completado">✓</span></li><li aria-current={stage === "studies" ? "step" : undefined}>Estudios</li><li aria-current={stage === "need" ? "step" : undefined}>Necesidad</li><li aria-current={stage === "complete" ? "step" : undefined}>Listo</li></ol>{error ? <StatusMessage kind="error">{error}</StatusMessage> : null}{saving ? <StatusMessage kind="loading">Guardando…</StatusMessage> : null}<div className="diagnostic__step">
    {view === "studyType" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿Qué estás estudiando?</h2><ChoiceGroup legend="¿Qué estás estudiando?" name="study-type" onChange={(value) => updateAnswers({ studyType: value as StudyType })} options={[{ label: "Bachillerato", value: "bachillerato" }, { label: "Universidad", value: "university" }, { label: "Otros estudios", value: "other" }]} value={answers.studyType} /><PrimaryButton disabled={saving || !answers.studyType} onClick={() => changeView(answers.studyType === "bachillerato" ? "bachCourse" : answers.studyType === "university" ? "university" : "otherStudies")}>Continuar</PrimaryButton></> : null}
    {view === "bachCourse" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿En qué curso estás?</h2><ChoiceGroup legend="¿En qué curso estás?" name="bach-course" onChange={(value) => updateAnswers({ bachCourse: value as DiagnosticFields["bachCourse"] })} options={[{ label: "1º", value: "first" }, { label: "2º", value: "second" }]} value={answers.bachCourse} /><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitStudy}>Continuar</PrimaryButton></div></> : null}
    {view === "university" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>Cuéntanos tu contexto académico</h2><FormField id="degree" label="Carrera" required>{({ inputId, describedBy, invalid }) => <TextInput aria-describedby={describedBy} id={inputId} invalid={invalid} onChange={(event) => updateAnswers({ degree: event.target.value })} value={answers.degree ?? ""} />}</FormField><FormField id="university" label="Universidad" required>{({ inputId, describedBy, invalid }) => <TextInput aria-describedby={describedBy} id={inputId} invalid={invalid} onChange={(event) => updateAnswers({ university: event.target.value })} value={answers.university ?? ""} />}</FormField><ChoiceGroup legend="Curso" name="university-course" onChange={(value) => updateAnswers({ universityCourse: value as DiagnosticFields["universityCourse"] })} options={[{ label: "1º", value: "first" }, { label: "2º", value: "second" }, { label: "3º", value: "third" }, { label: "4º", value: "fourth" }, { label: "5º+", value: "fifth_or_more" }]} value={answers.universityCourse} /><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitStudy}>Continuar</PrimaryButton></div></> : null}
    {view === "otherStudies" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿Qué estudias?</h2><FormField id="other-studies" label="Cuéntanoslo brevemente" required>{({ inputId, describedBy, invalid }) => <TextInput aria-describedby={describedBy} id={inputId} invalid={invalid} onChange={(event) => updateAnswers({ otherStudies: event.target.value })} value={answers.otherStudies ?? ""} />}</FormField><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitStudy}>Continuar</PrimaryButton></div></> : null}
    {view === "subjects" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿Con qué asignatura necesitas ayuda?</h2><FormField id="subject" label="Asignatura" required>{({ inputId, describedBy, invalid }) => <TextInput aria-describedby={describedBy} id={inputId} invalid={invalid} onChange={(event) => setSubjectInput(event.target.value)} value={subjectInput} />}</FormField><SecondaryButton disabled={saving} onClick={addSubject}>+ Añadir otra asignatura</SecondaryButton>{answers.subjects?.length ? <ul className="diagnostic__subjects">{answers.subjects.map((subject) => <li key={subject}><span>✓ {subject}</span><button aria-label={`Eliminar ${subject}`} onClick={() => updateAnswers({ subjects: answers.subjects?.filter((item) => item !== subject) })} type="button">Eliminar</button></li>)}</ul> : null}<div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitSubjects}>Continuar</PrimaryButton></div></> : null}
    {view === "need" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿Qué necesitas ahora?</h2><ChoiceGroup legend="¿Qué necesitas ahora?" name="need-type" onChange={(value) => updateAnswers({ needType: value as NeedType })} options={[...(canChoosePau ? [{ label: "PAU/Selectividad", value: "pau" }] : []), { label: "Preparar un examen", value: "exam" }, { label: "Seguimiento durante el curso", value: "ongoing" }, { label: "Otra situación", value: "other" }]} value={answers.needType} /><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitNeed}>Continuar</PrimaryButton></div></> : null}
    {view === "pauRegion" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿En qué comunidad te examinas?</h2><FormField id="pau-region" label="Comunidad autónoma" required>{({ inputId, describedBy, invalid }) => <TextInput aria-describedby={describedBy} id={inputId} invalid={invalid} onChange={(event) => updateAnswers({ pauRegion: event.target.value })} value={answers.pauRegion ?? ""} />}</FormField><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitConditional}>Continuar</PrimaryButton></div></> : null}
    {view === "examTiming" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>¿Cuándo?</h2><ChoiceGroup legend="¿Cuándo?" name="exam-timing" onChange={(value) => updateAnswers({ examTiming: value as DiagnosticFields["examTiming"] })} options={[{ label: "Esta semana", value: "this_week" }, { label: "En 1–2 semanas", value: "one_to_two_weeks" }, { label: "En más de 2 semanas", value: "more_than_two_weeks" }]} value={answers.examTiming} /><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitConditional}>Continuar</PrimaryButton></div></> : null}
    {view === "otherNeed" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>Cuéntanos brevemente</h2><FormField id="other-need" label="Cuéntanos brevemente" required>{({ inputId, describedBy, invalid }) => <TextInput aria-describedby={describedBy} id={inputId} invalid={invalid} onChange={(event) => updateAnswers({ otherNeedText: event.target.value })} value={answers.otherNeedText ?? ""} />}</FormField><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={submitConditional}>Continuar</PrimaryButton></div></> : null}
    {view === "review" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>Revisa tu solicitud</h2><dl className="diagnostic__summary"><div><dt>Estudios</dt><dd>{studySummary(answers)}</dd></div><div><dt>Asignaturas</dt><dd>{answers.subjects?.join(" · ")}</dd></div><div><dt>Necesidad</dt><dd>{needSummary(answers)}</dd></div></dl><div className="diagnostic__actions"><SecondaryButton disabled={saving} onClick={back}>Volver</SecondaryButton><PrimaryButton disabled={saving} onClick={complete}>Continuar</PrimaryButton></div></> : null}
    {view === "summary" ? <><h2 id="diagnostico-titulo" ref={headingRef} tabIndex={-1}>✓ Ya tenemos lo necesario para empezar</h2><dl className="diagnostic__summary"><div><dt>Estudios</dt><dd>{studySummary(answers)}</dd></div><div><dt>Asignaturas</dt><dd>{answers.subjects?.join(" · ")}</dd></div><div><dt>Necesidad</dt><dd>{needSummary(answers)}</dd></div></dl><p>Te escribiremos por WhatsApp para continuar.</p>{callRequested ? <StatusMessage kind="information">Preferencia de llamada guardada.</StatusMessage> : null}<div className="diagnostic__actions"><SecondaryButton disabled={saving || callRequested} onClick={requestCall}>Prefiero que me llaméis</SecondaryButton><SecondaryButton disabled={saving} onClick={() => changeView("studyType")}>Corregir algún dato</SecondaryButton></div><TextLink href="/">Volver al inicio</TextLink></> : null}
  </div></section>;
}
