# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CVack is a vanilla HTML/CSS/JS CV/resume builder with no backend, no build step, and no dependencies (no `package.json`, no npm, no bundler).

## Commands

Run through a local server — opening the HTML files via `file://` breaks JavaScript functionality (module-like restrictions on some browsers, FileReader/photo upload issues):

```bash
python -m http.server 8000
# or: python3 -m http.server 8000
```

Then visit `http://localhost:8000`. There is no build, lint, or test tooling in this repo.

## Architecture

- `index.html` — home page linking to the two CV editors (`cv-general.html`, `cv-dev.html`), styled by `css/home.css`.
- `cv-general.html` + `js/general.js` — general-purpose CV editor.
- `cv-dev.html` + `js/script.js` — developer-focused CV editor (adds technologies/tools/framework/version control/project fields to employment entries).
- `css/styles.css` — shared styles for both editors' layout, forms, A4 preview paper, and print rules.

`general.js` and `script.js` are two independent, near-duplicate copies of the same editor logic (not shared modules), each with its own `empty` data schema tailored to its CV type. There is no shared JS file between them — a fix or feature added to one (e.g. render/bind/preview logic, import/export, photo handling) must be manually ported to the other if it should apply to both.

Each script follows the same pattern:
- `empty` — the default data shape for that CV type.
- `data` — the live in-memory CV object, initialized from `localStorage` (key `orange-cv`) or cloned from `empty`.
- `render()` — rebuilds the entire editor form from `data` and calls `bind()` to reattach listeners (it re-renders the whole editor innerHTML on every change, no diffing/virtual DOM).
- `bind()` — wires up all inputs/buttons via `data-*` attributes (`data-p`, `data-edu`, `data-job`, `data-skill`, `data-lang`, `data-hobby`, `data-collapse`, `data-del*`, `data-up`/`data-down`) so edits mutate `data` and call `save()`.
- `preview()` — renders the read-only A4 CV preview HTML from `data`.
- `save()` — persists `data` to `localStorage` under `orange-cv` and re-renders the preview.
- Import/export use the File/Blob APIs directly (`exportJSON`/`importJSON`/`download`); PDF export just triggers `window.print()` after temporarily renaming `document.title` to control the suggested filename.

**Important**: both `general.js` and `script.js` use the same `localStorage` key (`orange-cv`). Opening both `cv-general.html` and `cv-dev.html` in the same browser means they read/overwrite each other's saved data — there is no per-CV-type storage separation.

All user-provided text rendered into the DOM must go through the `esc()` helper (HTML-escaping) to avoid XSS, since both `render()` and `preview()` build HTML via template-string interpolation.

## Google Drive backup

Both editors have "Back up with Google" and "Restore from Google" buttons backed by an identical block appended near the end of `general.js` and `script.js` (same duplication pattern as the rest of the file). It uses Google Identity Services (`https://accounts.google.com/gsi/client`, loaded via `<script>` tag in each HTML file) to get an OAuth access token client-side (no backend, no client secret — `GOOGLE_CLIENT_ID` is public and safe to commit) with the `drive.appdata` scope, then reads/writes `data` as JSON directly against the Drive API v3 via `fetch`, in the user's hidden Application Data folder (`parents: ["appDataFolder"]` on create).

- The backup file is invisible in the user's normal Drive UI and only reachable through this app (or a full Google Takeout export) — this was a deliberate choice over the visible `drive.file` scope, since the app already offers "Export Json" for a user-manageable copy.
- `requestDriveAccessToken(onToken)` lazily creates a single shared `driveTokenClient` (via `initTokenClient`) and reassigns its `.callback` per call before invoking `requestAccessToken()` — this is how one token client is reused for both the backup (`uploadBackupToDrive`) and restore (`downloadBackupFromDrive`) flows instead of hardcoding the callback at init time.
- The resolved OAuth access token is cached in `sessionStorage` (key `orange-cv-drive-token`, tab-scoped, cleared when the tab closes) with its expiry, so repeated backup/restore clicks within the same token lifetime (~1h) skip Google's login/consent popup entirely. A `401` response from Drive clears this cache and asks the user to retry, which triggers a fresh popup on the next click — there is no real refresh token in this client-only flow (that requires a backend holding a client secret), so a new login is unavoidable once the cached token expires or the tab is closed.
- The Drive file id is cached in `localStorage` under `orange-cv-drive-file-id`; backups `PATCH` that same file instead of creating a new one each time, and restore uses it to `GET .../files/{id}?alt=media` directly. If the id isn't cached (e.g. a new browser/device), both flows fall back to `findDriveBackupFileId()`, which queries `spaces=appDataFolder` by file name ordered by `modifiedTime desc` — this keeps a single backup file per Google account even across browsers, and self-heals by always targeting the newest match if stale duplicate files exist from earlier testing/bugs. A 404 on either path clears the cached id (backup retries as a create; restore just reports the backup is gone).
- Restore reuses the existing `importJSON()` (parses, merges with `empty`, persists to `localStorage`, re-renders) — it's the same code path as the "Import Json" file button, just fed by Drive content instead of a local file. It's gated behind a `confirm()`, matching the "New CV" button's pattern of warning before discarding unsaved local edits.
- `GOOGLE_CLIENT_ID` must be a real OAuth Web Client ID from Google Cloud Console, with the deployed origin(s) (e.g. `https://alrobe.github.io`, no path) and `http://localhost:8000` registered as Authorized JavaScript origins.
- The `drive.appdata` scope is classified as sensitive by Google (same tier as `drive.file`): since CVack is public, the OAuth consent screen eventually needs Google verification (privacy policy required) once usage grows beyond the ~100-test-user "Testing" mode cap — until verified, public users see an "unverified app" warning screen.
