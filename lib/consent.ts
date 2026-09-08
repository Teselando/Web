export const CONSENT_STORAGE_KEY = "teselando-consent-v2";
export const LEGACY_CONSENT_STORAGE_KEY = "teselando:consent";
export const CONSENT_VERSION = 2;
export const CONSENT_VALIDITY_MS = 24 * 30.4375 * 24 * 60 * 60 * 1000;
export const OPEN_CONSENT_PREFERENCES_EVENT = "teselando:open-consent-preferences";
export const CONSENT_CHANGED_EVENT = "teselando:consent-changed";

export type ConsentPreference = {
  version: typeof CONSENT_VERSION;
  analytics: boolean;
  decidedAt: string;
};

export function parseConsent(raw: string | null, now = Date.now()): ConsentPreference | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentPreference>;
    const decidedAt = typeof value.decidedAt === "string" ? Date.parse(value.decidedAt) : Number.NaN;
    if (value.version !== CONSENT_VERSION || typeof value.analytics !== "boolean" || !Number.isFinite(decidedAt)) return null;
    if (decidedAt > now || now - decidedAt >= CONSENT_VALIDITY_MS) return null;
    return value as ConsentPreference;
  } catch {
    return null;
  }
}

export function readConsent(storage: Storage, now = Date.now()) {
  const raw = storage.getItem(CONSENT_STORAGE_KEY);
  const preference = parseConsent(raw, now);
  if (raw && !preference) storage.removeItem(CONSENT_STORAGE_KEY);
  storage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
  return preference;
}

export function writeConsent(storage: Storage, analytics: boolean, now = new Date()): ConsentPreference {
  const preference: ConsentPreference = {
    version: CONSENT_VERSION,
    analytics,
    decidedAt: now.toISOString(),
  };
  storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preference));
  return preference;
}
