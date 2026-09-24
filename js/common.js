// Shared logic between general.js and script.js.
// Loaded via its own <script> tag before each page's own script (no bundler
// in this project, so a classic script + load order is how sharing works).
// Everything here assumes `empty`, `ARRAY_FIELDS`, `data`, `render()`, and
// `preview()` are declared by the page-specific script that loads after this
// one — they're referenced only inside functions, so they don't need to
// exist yet at the time this file itself runs, only by the time these
// functions are actually called.

const EMAIL_ICON = `<svg class="contact-icon" viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4.5" width="16" height="11" rx="1.5"/><path d="M3 5.5l7 6 7-6"/></svg>`;
const PHONE_ICON = `<svg class="contact-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
const LINKEDIN_ICON = `<svg class="contact-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7.5" y1="10.5" x2="7.5" y2="17"/><circle cx="7.5" cy="6.8" r=".9" fill="currentColor" stroke="none"/><line x1="11.5" y1="10.5" x2="11.5" y2="17"/><path d="M11.5 13.2a2.3 2.3 0 0 1 4.6 0V17"/></svg>`;
const WEBSITE_ICON = `<svg class="contact-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const HOME_ICON = `<svg class="contact-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;

const skillLevels = ["Beginner", "Moderate", "Good", "Very good", "Excellent"];
const langLevels = ["Beginner", "Moderate", "Good", "Very good", "Fluent", "A1", "A2", "B1", "B2", "C1", "C2"];

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const save = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); preview() };
const toast = t => { let e = document.getElementById("toast"); e.textContent = t; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 1700) };

const RTE_ALLOWED_TAGS = new Set(["B", "I", "U", "STRONG", "EM", "UL", "OL", "LI", "BR", "DIV", "P"]);
function sanitizeHTML(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    (function clean(parent) {
        [...parent.childNodes].forEach(node => {
            if (node.nodeType === 1) {
                clean(node);
                if (!RTE_ALLOWED_TAGS.has(node.tagName)) {
                    while (node.firstChild) parent.insertBefore(node.firstChild, node);
                    parent.removeChild(node);
                } else {
                    [...node.attributes].forEach(attr => node.removeAttribute(attr.name));
                }
            } else if (node.nodeType !== 3) {
                parent.removeChild(node);
            }
        });
    })(container);
    return container.innerHTML;
}
function toRichHTML(val) {
    if (!val) return "";
    return /<(b|i|u|strong|em|ul|ol|li|br|div|p)[\s>/]/i.test(val) ? sanitizeHTML(val) : esc(val).replace(/\n/g, "<br>");
}
const getVal = e => e.isContentEditable ? sanitizeHTML(e.innerHTML) : e.value;

function field(label, key, val, cls = "", attrs = "") {
    return `<div class="field ${cls}"><label>${label}</label><input ${attrs} value="${esc(val)}"></div>`
}
function richField(label, val, cls = "", attrs = "") {
    return `<div class="field ${cls}"><label>${label}</label><div class="rte-toolbar">
 <button type="button" class="rte-btn" data-cmd="bold" title="Bold"><b>B</b></button>
 <button type="button" class="rte-btn" data-cmd="italic" title="Italic"><i>I</i></button>
 <button type="button" class="rte-btn" data-cmd="underline" title="Underline"><u>U</u></button>
 <button type="button" class="rte-btn" data-cmd="insertOrderedList" title="Numbered list">1.</button>
 <button type="button" class="rte-btn" data-cmd="insertUnorderedList" title="Bulleted list">•</button>
 </div><div class="rte" contenteditable="true" ${attrs}>${toRichHTML(val)}</div></div>`
}
function itemButtons(type, i) { return `<div class="item-actions"><div class="reorder"><button title="Move up" data-up="${type}:${i}">↑</button><button title="Move down" data-down="${type}:${i}">↓</button></div><button class="icon danger" data-del="${type}:${i}">×</button></div>` }

function edu(x, i) {
    return `<div class="item"><div class="item-head"><strong>Education ${i + 1}</strong>${itemButtons("education", i)}</div><div class="grid">
 ${field("Degree / program", "title", x.title, "", `data-edu="${i}" data-key="title"`)}${field("Institution", "organization", x.organization, "", `data-edu="${i}" data-key="organization"`)}
 ${field("Start", "startDate", x.startDate, "", `data-edu="${i}" data-key="startDate"`)}${field("End", "endDate", x.endDate, "", `data-edu="${i}" data-key="endDate"`)}
 ${richField("Description", x.description, "full", `data-edu="${i}" data-key="description"`)}
 </div></div>`
}
function skill(x, i) { return `<div class="skill"><input data-skill="${i}" data-key="skill" value="${esc(x.skill)}"><select data-skill="${i}" data-key="level">${skillLevels.map(v => `<option ${v == x.level ? "selected" : ""}>${v}</option>`).join("")}</select><button class="icon danger" data-del-skill="${i}">×</button></div>` }
function lang(x, i) { return `<div class="lang"><input data-lang="${i}" data-key="language" value="${esc(x.language)}"><select data-lang="${i}" data-key="level">${langLevels.map(v => `<option ${v == x.level ? "selected" : ""}>${v}</option>`).join("")}</select><button class="icon danger" data-del-lang="${i}">×</button></div>` }

function move(spec, dir) { let [t, i] = spec.split(":"); i = +i; let j = i + dir; if (j < 0 || j >= data[t].length) return;[data[t][i], data[t][j]] = [data[t][j], data[t][i]]; render(); save() }

function dotsMarkup(n) {
    return `
        <span class="dots">
            ${"●".repeat(n)}<span style="opacity:.38">${"●".repeat(5 - n)}</span>
        </span>
    `;
}
function dots(level) {
    let n = skillLevels.indexOf(level) + 1;

    if (n < 1) n = 3;

    return dotsMarkup(n);
}
const LANG_DOTS = { "Beginner": 1, "Moderate": 2, "Good": 3, "Very good": 4, "Fluent": 5, "A1": 1, "A2": 1, "B1": 2, "B2": 3, "C1": 4, "C2": 5 };
function langDots(level) {
    return dotsMarkup(LANG_DOTS[level] || 3);
}

function bindCommon() {
    document.querySelectorAll("[data-p]").forEach(e => e.addEventListener("input", () => { data.personal[e.dataset.p] = e.value; save() }));
    document.getElementById("description").oninput = e => { data.personal.description = sanitizeHTML(e.target.innerHTML); save() };
    document.querySelectorAll("[data-edu]").forEach(e => e.oninput = () => { data.education[+e.dataset.edu][e.dataset.key] = getVal(e); save() });
    document.querySelectorAll("[data-job]").forEach(e => e.oninput = () => { data.employment[+e.dataset.job][e.dataset.key] = getVal(e); save() });
    document.querySelectorAll(".rte-toolbar").forEach(toolbar => {
        const editable = toolbar.nextElementSibling;
        const buttons = [...toolbar.querySelectorAll("[data-cmd]")];
        const updateActive = () => buttons.forEach(b => {
            let isActive = false;
            try { isActive = document.queryCommandState(b.dataset.cmd) } catch { }
            b.classList.toggle("active", isActive);
        });
        buttons.forEach(btn => {
            btn.onmousedown = e => e.preventDefault();
            btn.onclick = () => {
                editable.focus();
                document.execCommand("styleWithCSS", false, false);
                document.execCommand(btn.dataset.cmd, false, null);
                editable.dispatchEvent(new Event("input", { bubbles: true }));
                updateActive();
            };
        });
        editable.addEventListener("keyup", updateActive);
        editable.addEventListener("mouseup", updateActive);
        editable.addEventListener("focus", updateActive);
    });
    document.querySelectorAll("[data-skill]").forEach(e => { e.oninput = () => { data.skills[+e.dataset.skill][e.dataset.key] = e.value; save() }; e.onchange = e.oninput });
    document.querySelectorAll("[data-lang]").forEach(e => { e.oninput = () => { data.languages[+e.dataset.lang][e.dataset.key] = e.value; save() }; e.onchange = e.oninput });
    document.querySelectorAll("[data-collapse]").forEach(b => b.onclick = () => b.closest(".section").classList.toggle("collapsed"));
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { let [t, i] = b.dataset.del.split(":"); data[t].splice(+i, 1); render(); save() });
    document.querySelectorAll("[data-del-skill]").forEach(b => b.onclick = () => { data.skills.splice(+b.dataset.delSkill, 1); render(); save() });
    document.querySelectorAll("[data-del-lang]").forEach(b => b.onclick = () => { data.languages.splice(+b.dataset.delLang, 1); render(); save() });
    document.querySelectorAll("[data-up]").forEach(b => b.onclick = () => move(b.dataset.up, -1));
    document.querySelectorAll("[data-down]").forEach(b => b.onclick = () => move(b.dataset.down, 1));
    document.getElementById("addEdu").onclick = () => {
        data.education.push({
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: ""
        });
        render();
        save()
    };
    document.getElementById("addSkill").onclick = () => { data.skills.push({ skill: "", level: "Good" }); render(); save() };
    document.getElementById("addLang").onclick = () => { data.languages.push({ language: "", level: "B2" }); render(); save() };
    const pf = document.getElementById("photoFile"), pb = document.getElementById("photoBtn"), rp = document.getElementById("removePhoto");
    if (data.personal.photo) { rp.classList.remove("hidden") }
    pb.onclick = () => pf.click(); rp.onclick = () => { data.personal.photo = ""; render(); save() };
    pf.onchange = e => { let f = e.target.files[0]; if (!f) return; let r = new FileReader(); r.onload = () => { data.personal.photo = r.result; render(); save() }; r.readAsDataURL(f) }
}

function getResumeFileName(extension) {
    const p = data.personal;

    const name = [p.name, p.lastname]
        .filter(Boolean)
        .join("_");

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return `RESUME_${name || "CV"}-${day}${month}${year}.${extension}`;
}

function download(name, text, type) {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    a.click();

    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportJSON() {
    const json = JSON.stringify(data, null, 2);
    download(
        getResumeFileName("json"),
        json,
        "application/json;charset=utf-8"
    );

    toast("CV exported successfully");
}

function importJSON(s) {
    const imported = JSON.parse(s);

    // Basic validation
    if (!imported || typeof imported !== "object") {
        throw new Error("Invalid JSON");
    }

    data = {
        ...structuredClone(empty),
        ...imported,
        personal: {
            ...structuredClone(empty.personal),
            ...(imported.personal || {})
        }
    };
    ARRAY_FIELDS.forEach(f => {
        data[f] = Array.isArray(imported[f]) ? imported[f] : [];
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    render();
    preview();

    toast("CV imported successfully");
}
document.getElementById("export").onclick = () => {
    exportJSON();
};
document.getElementById("import").onclick = () => {
    document.getElementById("file").click();
};
document.getElementById("file").onchange = e => {
    let f = e.target.files[0];

    if (!f) return;

    let r = new FileReader();

    r.onload = () => {
        try {
            importJSON(r.result);
        } catch (err) {
            console.error(err);
            alert("Invalid JSON");
        }
    };

    r.readAsText(f, "utf-8");

    e.target.value = "";
};
document.getElementById("themeToggle").onclick = () => {
    data.theme = data.theme === "navy" ? "classic" : "navy";
    save();
};
document.getElementById("pdf").onclick = () => {
    const originalTitle = document.title;

    document.title = getResumeFileName("pdf").replace(/\.pdf$/i, "");

    setTimeout(() => {
        window.print();

        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    }, 250);
};
// --- Google Drive backup ---
// OAuth Client ID (public, not a secret): replace with the one generated in
// Google Cloud Console > APIs & Services > Credentials.
const GOOGLE_CLIENT_ID = "321086939910-smdq0cs6dhijrdiauq7bmk2fntj8lmip.apps.googleusercontent.com";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";
const DRIVE_BACKUP_NAME = "CVack-Backup.json";
const DRIVE_FILE_ID_KEY = "orange-cv-drive-file-id";
const DRIVE_TOKEN_KEY = "orange-cv-drive-token";

let driveTokenClient = null;

function getCachedDriveAccessToken() {
    try {
        const cached = JSON.parse(sessionStorage.getItem(DRIVE_TOKEN_KEY) || "null");
        if (!cached || Date.now() >= cached.expiresAt) return null;
        return cached.accessToken;
    } catch {
        return null;
    }
}

function cacheDriveAccessToken(accessToken, expiresInSeconds) {
    sessionStorage.setItem(DRIVE_TOKEN_KEY, JSON.stringify({
        accessToken,
        expiresAt: Date.now() + (expiresInSeconds * 1000) - 60000 // 1 min safety margin
    }));
}

function clearCachedDriveAccessToken() {
    sessionStorage.removeItem(DRIVE_TOKEN_KEY);
}

function requestDriveAccessToken(onToken) {
    const cachedToken = getCachedDriveAccessToken();
    if (cachedToken) {
        onToken(cachedToken);
        return;
    }
    if (!window.google?.accounts?.oauth2) {
        toast("Google hasn't loaded yet, try again in a few seconds");
        return;
    }
    if (!driveTokenClient) {
        driveTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: DRIVE_SCOPE,
            callback: () => {}
        });
    }
    driveTokenClient.callback = resp => {
        if (resp.error) {
            console.error(resp);
            toast("Could not connect to Google");
            return;
        }
        cacheDriveAccessToken(resp.access_token, resp.expires_in);
        onToken(resp.access_token);
    };
    driveTokenClient.requestAccessToken();
}

function driveBackup() {
    requestDriveAccessToken(uploadBackupToDrive);
}

function driveRestore() {
    if (!confirm("Replace the current CV with the backup saved in Google Drive? Unsaved changes will be lost.")) return;
    requestDriveAccessToken(downloadBackupFromDrive);
}

async function findDriveBackupFileId(accessToken) {
    const params = new URLSearchParams({
        spaces: "appDataFolder",
        q: `name='${DRIVE_BACKUP_NAME}' and trashed=false`,
        orderBy: "modifiedTime desc",
        pageSize: "1",
        fields: "files(id)"
    });
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error(`Drive API error ${res.status}`);
    const result = await res.json();
    return result.files?.[0]?.id || null;
}

async function uploadBackupToDrive(accessToken) {
    try {
        const fileId = localStorage.getItem(DRIVE_FILE_ID_KEY) || await findDriveBackupFileId(accessToken);
        const boundary = "cvack-" + Date.now();
        const metadata = fileId ? {} : { name: DRIVE_BACKUP_NAME, mimeType: "application/json", parents: ["appDataFolder"] };
        const body =
            `--${boundary}\r\n` +
            `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
            `${JSON.stringify(metadata)}\r\n` +
            `--${boundary}\r\n` +
            `Content-Type: application/json\r\n\r\n` +
            `${JSON.stringify(data, null, 2)}\r\n` +
            `--${boundary}--`;

        const url = fileId
            ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
            : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

        const res = await fetch(url, {
            method: fileId ? "PATCH" : "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": `multipart/related; boundary=${boundary}`
            },
            body
        });

        if (res.status === 401) {
            clearCachedDriveAccessToken();
            toast("The Google session expired, try again");
            return;
        }
        if (res.status === 404 && fileId) {
            localStorage.removeItem(DRIVE_FILE_ID_KEY);
            return uploadBackupToDrive(accessToken);
        }
        if (!res.ok) throw new Error(`Drive API error ${res.status}`);

        const result = await res.json();
        localStorage.setItem(DRIVE_FILE_ID_KEY, result.id);
        toast("Backup saved to Google Drive");
    } catch (err) {
        console.error(err);
        toast("Error backing up to Google Drive");
    }
}

async function downloadBackupFromDrive(accessToken) {
    try {
        const fileId = localStorage.getItem(DRIVE_FILE_ID_KEY) || await findDriveBackupFileId(accessToken);
        if (!fileId) {
            toast("There is no backup saved in Google Drive");
            return;
        }

        const fileRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (fileRes.status === 401) {
            clearCachedDriveAccessToken();
            toast("The Google session expired, try again");
            return;
        }
        if (fileRes.status === 404) {
            localStorage.removeItem(DRIVE_FILE_ID_KEY);
            toast("The backup no longer exists in Google Drive");
            return;
        }
        if (!fileRes.ok) throw new Error(`Drive API error ${fileRes.status}`);

        const text = await fileRes.text();
        localStorage.setItem(DRIVE_FILE_ID_KEY, fileId);
        importJSON(text);
    } catch (err) {
        console.error(err);
        toast("Error restoring from Google Drive");
    }
}

document.getElementById("googleBackup").onclick = () => driveBackup();
document.getElementById("googleRestore").onclick = () => driveRestore();
