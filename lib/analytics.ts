import { readConsent } from "@/lib/consent";
export const analyticsEvents = ["page_view", "cta_click", "form_start", "phone_submit_attempt", "lead_created", "lead_error", "diagnostic_start", "diagnostic_step_complete", "diagnostic_complete", "call_preference"] as const;
export type AnalyticsEvent = typeof analyticsEvents[number];
export function track(event: AnalyticsEvent, parameters?: Record<string, string>) { const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID; if (typeof window === "undefined" || !measurementId || !readConsent()?.analytics) return; window.gtag?.("event", event, parameters); }
declare global { interface Window { gtag?: (...args: unknown[]) => void; } }
