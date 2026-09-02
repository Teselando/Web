export const CONSENT_STORAGE_KEY = "teselando-consent-v1";
export type ConsentState = { analytics: boolean; version: 1 };
export function readConsent(): ConsentState | undefined { if (typeof window === "undefined") return undefined; try { const value: unknown = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) ?? ""); return value && typeof value === "object" && (value as ConsentState).version === 1 && typeof (value as ConsentState).analytics === "boolean" ? value as ConsentState : undefined; } catch { return undefined; } }
export function writeConsent(analytics: boolean) { const value: ConsentState = { analytics, version: 1 }; window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value)); window.dispatchEvent(new Event("teselando-consent")); }
