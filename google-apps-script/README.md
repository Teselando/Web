# Teselando leads — Google Apps Script

This script is the production server layer for the static GitHub Pages site. It receives the initial phone lead and updates the same private Google Sheet row after the diagnostic.

## One-time setup

1. Create a Google Apps Script project at <https://script.google.com/>.
2. Copy `Code.gs` and `appsscript.json` into that project.
3. Run `setupTeselando()` once and approve the requested Google Sheets and email permissions. The function uses the bound spreadsheet, or creates **Teselando — Leads** when the script is standalone. Notifications are sent to `ceo@teselando.es` by default.
4. Choose **Deploy → New deployment → Web app**.
5. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
6. Copy the deployment URL ending in `/exec`.
7. In the GitHub repository, create the Actions variable `GOOGLE_APPS_SCRIPT_URL` with that URL.

The spreadsheet ID and all Google authorization stay inside Apps Script. The website receives only an opaque lead ID and never receives a Sheet row number or Google credential.

When `Code.gs` changes, create a new Apps Script deployment version (or edit the active deployment) and keep the GitHub variable pointed at its `/exec` URL.

## Email notifications

The script sends one notification containing the phone number when a new valid contact is received. It sends a second notification containing the phone number and all submitted academic details when the questionnaire is completed. Two timestamp columns in the private sheet prevent browser retries from sending the same notification twice.

To change the recipient later, run this function once in the Apps Script editor:

```javascript
setNotificationEmail("correo@teselando.es");
```

After changing `Code.gs`, update the active web-app deployment to a new version and accept the additional email permission. Existing website code and the public deployment URL do not need to change.
