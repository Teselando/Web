export type PhoneCountry = {
  code: string;
  country: string;
  flag: string;
  nationalLengths: readonly number[];
  mobilePattern: RegExp;
  mobileHint?: string;
  removeNationalTrunkPrefix?: boolean;
};

export const phoneCountries: readonly PhoneCountry[] = [
  { code: "+1", country: "Estados Unidos", flag: "/flags/us.svg", nationalLengths: [10], mobilePattern: /^[2-9]\d{2}[2-9]\d{6}$/, mobileHint: "El código de área y el bloque central deben empezar por un número del 2 al 9." },
  { code: "+33", country: "Francia", flag: "/flags/fr.svg", nationalLengths: [9], mobilePattern: /^[67]\d{8}$/, mobileHint: "Los móviles franceses empiezan por 6 o 7. No incluyas el 0 inicial.", removeNationalTrunkPrefix: true },
  { code: "+34", country: "España", flag: "/flags/es.svg", nationalLengths: [9], mobilePattern: /^[67]\d{8}$/, mobileHint: "Los móviles españoles empiezan por 6 o 7." },
  { code: "+39", country: "Italia", flag: "/flags/it.svg", nationalLengths: [10], mobilePattern: /^3\d{9}$/, mobileHint: "Los móviles italianos empiezan por 3." },
  { code: "+44", country: "Reino Unido", flag: "/flags/gb.svg", nationalLengths: [10], mobilePattern: /^7\d{9}$/, mobileHint: "Los móviles británicos empiezan por 7. No incluyas el 0 inicial.", removeNationalTrunkPrefix: true },
  { code: "+49", country: "Alemania", flag: "/flags/de.svg", nationalLengths: [10, 11], mobilePattern: /^1[5-7]\d{8,9}$/, mobileHint: "Los móviles alemanes empiezan por 15, 16 o 17. No incluyas el 0 inicial.", removeNationalTrunkPrefix: true },
  { code: "+52", country: "México", flag: "/flags/mx.svg", nationalLengths: [10], mobilePattern: /^\d{10}$/ },
  { code: "+54", country: "Argentina", flag: "/flags/ar.svg", nationalLengths: [11], mobilePattern: /^9\d{10}$/, mobileHint: "Para WhatsApp en Argentina, escribe el 9 antes del código de área y no incluyas el 0 ni el 15." },
  { code: "+56", country: "Chile", flag: "/flags/cl.svg", nationalLengths: [9], mobilePattern: /^9\d{8}$/, mobileHint: "Los móviles chilenos empiezan por 9." },
  { code: "+57", country: "Colombia", flag: "/flags/co.svg", nationalLengths: [10], mobilePattern: /^3\d{9}$/, mobileHint: "Los móviles colombianos empiezan por 3." },
  { code: "+58", country: "Venezuela", flag: "/flags/ve.svg", nationalLengths: [10], mobilePattern: /^4(?:12|14|16|24|26)\d{7}$/, mobileHint: "Usa un prefijo móvil venezolano válido: 412, 414, 416, 424 o 426." },
  { code: "+351", country: "Portugal", flag: "/flags/pt.svg", nationalLengths: [9], mobilePattern: /^9[1236]\d{7}$/, mobileHint: "Los móviles portugueses empiezan por 91, 92, 93 o 96." },
] as const;

type PhoneValidationResult =
  | { ok: true; phone: string }
  | { ok: false; message: string };

function digitsLabel(lengths: readonly number[]) {
  if (lengths.length === 1) return `${lengths[0]} dígitos`;
  return `${lengths.slice(0, -1).join(", ")} u ${lengths.at(-1)} dígitos`;
}

function looksLikePlaceholder(number: string) {
  return /^(\d)\1+$/.test(number)
    || "0123456789012345".includes(number)
    || "9876543210987654".includes(number);
}

function countryByCode(code: string) {
  return phoneCountries.find((country) => country.code === code) ?? phoneCountries[2];
}

function countryFromInternationalDigits(digits: string) {
  return [...phoneCountries]
    .sort((left, right) => right.code.length - left.code.length)
    .find((country) => digits.startsWith(country.code.slice(1)));
}

export function validatePhoneNumber(rawValue: string, selectedCode = "+34", enforceSelectedCountry = true): PhoneValidationResult {
  const raw = rawValue.trim();
  if (!raw) return { ok: false, message: "Escribe tu número de teléfono." };

  const plusCount = (raw.match(/\+/g) ?? []).length;
  if (/[^\d+\s().-]/.test(raw) || plusCount > 1 || (plusCount === 1 && !raw.startsWith("+"))) {
    return { ok: false, message: "Usa únicamente números. Puedes separarlos con espacios, guiones o paréntesis." };
  }

  let country = countryByCode(selectedCode);
  let nationalNumber = raw.replace(/\D/g, "");

  if (raw.startsWith("+")) {
    const detectedCountry = countryFromInternationalDigits(nationalNumber);
    if (!detectedCountry) {
      return { ok: false, message: "Ese prefijo internacional no está disponible. Selecciona uno de los países de la lista." };
    }
    if (enforceSelectedCountry && detectedCountry.code !== country.code) {
      return {
        ok: false,
        message: `El número comienza por ${detectedCountry.code}, pero has seleccionado ${country.country} (${country.code}). Cambia el país o elimina el prefijo escrito.`,
      };
    }
    country = detectedCountry;
    nationalNumber = nationalNumber.slice(country.code.length - 1);
  } else {
    const codeDigits = country.code.slice(1);
    const longestNationalLength = Math.max(...country.nationalLengths);
    if (nationalNumber.length > longestNationalLength && nationalNumber.startsWith(codeDigits)) {
      nationalNumber = nationalNumber.slice(codeDigits.length);
    }
  }

  if (
    country.removeNationalTrunkPrefix
    && nationalNumber.startsWith("0")
    && country.nationalLengths.includes(nationalNumber.length - 1)
  ) {
    nationalNumber = nationalNumber.slice(1);
  }

  const shortestLength = Math.min(...country.nationalLengths);
  const longestLength = Math.max(...country.nationalLengths);
  if (nationalNumber.length < shortestLength) {
    const missing = shortestLength - nationalNumber.length;
    return {
      ok: false,
      message: `Falta${missing === 1 ? "" : "n"} ${missing} dígito${missing === 1 ? "" : "s"}. En ${country.country} el número debe tener ${digitsLabel(country.nationalLengths)}.`,
    };
  }
  if (nationalNumber.length > longestLength) {
    const extra = nationalNumber.length - longestLength;
    return {
      ok: false,
      message: `Sobra${extra === 1 ? "" : "n"} ${extra} dígito${extra === 1 ? "" : "s"}. En ${country.country} el número debe tener ${digitsLabel(country.nationalLengths)}.`,
    };
  }
  if (!country.nationalLengths.includes(nationalNumber.length)) {
    return { ok: false, message: `En ${country.country} el número debe tener ${digitsLabel(country.nationalLengths)}.` };
  }
  if (!country.mobilePattern.test(nationalNumber)) {
    return {
      ok: false,
      message: country.mobileHint ?? `El número no tiene un formato móvil válido para ${country.country}.`,
    };
  }
  if (looksLikePlaceholder(nationalNumber)) {
    return { ok: false, message: "Ese número parece de prueba. Introduce tu número real para que podamos escribirte." };
  }

  return { ok: true, phone: `${country.code}${nationalNumber}` };
}
