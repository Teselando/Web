# Teselando leads — Google Apps Script

This script is the production server layer for the static GitHub Pages site. It receives the initial phone lead and updates the same private Google Sheet row after the diagnostic.

## One-time setup

1. Create a Google Apps Script project at <https://script.google.com/>.
2. Copy `Code.gs` and `appsscript.json` into that project.
3. Run `setupTeselando()` once and approve the requested Google Sheets permission. The function uses the bound spreadsheet, or creates **Teselando — Leads** when the script is standalone.
4. Choose **Deploy → New deployment → Web app**.
5. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
6. Copy the deployment URL ending in `/exec`.
7. In the GitHub repository, create the Actions variable `GOOGLE_APPS_SCRIPT_URL` with that URL.

The spreadsheet ID and all Google authorization stay inside Apps Script. The website receives only an opaque lead ID and never receives a Sheet row number or Google credential.

When `Code.gs` changes, create a new Apps Script deployment version (or edit the active deployment) and keep the GitHub variable pointed at its `/exec` URL.
