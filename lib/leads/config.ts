import "node:crypto";

import { LeadError } from "@/lib/leads/errors";

export type GoogleSheetsConfig = {
  privateKey: string;
  serviceAccountEmail: string;
  sheetName: string;
  spreadsheetId: string;
};

export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEET_NAME;
  if (!serviceAccountEmail || !privateKey || !spreadsheetId || !sheetName) {
    throw new LeadError("CONFIGURATION_ERROR", "No hemos podido guardar tu teléfono. Inténtalo de nuevo.");
  }
  return { privateKey, serviceAccountEmail, sheetName, spreadsheetId };
}
