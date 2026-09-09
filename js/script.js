const empty = {
    personal: { 
        name: "", 
        headline: "", 
        headline2:"",
        email: "", 
        phone: "", 
        address: "", 
        postcode: "", 
        city: "", 
        website: "", 
        linkedin: "", 
        dob: "", 
        birthPlace: "", 
        license: "", 
        gender: "", 
        nationality: "", 
        civilStatus: "", 
        photo: "" 
    },
    profile: "",
    education: [],
    employment: [],
    skills: [],
    languages: [],
    hobbies: []
};
let data = JSON.parse(localStorage.getItem("orange-cv") || "null") || structuredClone(empty);
const skillLevels = ["Beginner", "Moderate", "Good", "Very good", "Excellent"];
const langLevels = ["A1", "A2", "B1", "B2", "C1", "C2", "Fluent"];
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
const save = () => { localStorage.setItem("orange-cv", JSON.stringify(data)); preview() };
const toast = t => { let e = document.getElementById("toast"); e.textContent = t; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 1700) };
function field(label, key, val, cls = "", attrs = "") { 
    return `<div class="field ${cls}"><label>${label}</label><input ${attrs} value="${esc(val)}"></div>` 
}
function itemButtons(type, i) { return `<div class="item-actions"><div class="reorder"><button title="Subir" data-up="${type}:${i}">↑</button><button title="Bajar" data-down="${type}:${i}">↓</button></div><button class="icon danger" data-del="${type}:${i}">×</button></div>` }
function render() {
    const p = data.personal;
    document.getElementById("editor").innerHTML = `
 <section class="section" data-section="personal">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Datos personales</div><button class="circle" data-collapse="personal">⌃</button></div>
  <div class="section-body">
   <div class="photo-row"><div class="photo-box">${p.photo ? `<img src="${p.photo}">` : "<span>＋</span>"}</div><div class="photo-info"><b>Foto</b><br>Opcional. Recomendación: imagen profesional cuadrada.<br><button class="btn small" id="photoBtn">Añadir foto</button><button class="btn small hidden" id="removePhoto">Eliminar</button><input id="photoFile" type="file" accept="image/*" hidden></div></div>
   <div class="grid">
    ${field("Nombre","name",p.name,"",`data-p="name"`)}
    ${field("Apellido / nombre completo","headline",p.headline,"",`data-p="headline"`)}
    ${field("Puesto deseado","headline2",p.headline2||"","",`data-p="headline2"`)}
    ${field("Email","email",p.email,"",`data-p="email"`)}
    ${field("Teléfono","phone",p.phone,"",`data-p="phone"`)}
    ${field("Dirección","address",p.address,"full",`data-p="address"`)}
    ${field("Código postal","postcode",p.postcode,"",`data-p="postcode"`)}
    ${field("Ciudad","city",p.city,"",`data-p="city"`)}
    ${field("Website","website",p.website,"",`data-p="website"`)}
    ${field("LinkedIn","linkedin",p.linkedin,"",`data-p="linkedin"`)}
    ${field("Fecha de nacimiento","dob",p.dob,"",`data-p="dob"`)}
    ${field("Lugar de nacimiento","birthPlace",p.birthPlace,"",`data-p="birthPlace"`)}
    ${field("Licencia de conducir","license",p.license,"",`data-p="license"`)}
    ${field("Género","gender",p.gender,"",`data-p="gender"`)}
    ${field("Nacionalidad","nationality",p.nationality,"",`data-p="nationality"`)}
    ${field("Estado civil","civilStatus",p.civilStatus,"",`data-p="civilStatus"`)}
   </div>
  </div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Perfil</div><button class="circle" data-collapse="profile">⌃</button></div>
  <div class="section-body"><div class="field"><label>Descripción</label><textarea id="profile">${esc(data.profile)}</textarea></div></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Educación</div><button class="circle" data-collapse="education">⌃</button></div>
  <div class="section-body"><div id="edu">${data.education.map((x, i) => edu(x, i)).join("")}</div><button class="add" id="addEdu">＋ Añadir formación</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Experiencia laboral</div><button class="circle" data-collapse="employment">⌃</button></div>
  <div class="section-body"><div id="jobs">${data.employment.map((x, i) => job(x, i)).join("")}</div><button class="add" id="addJob">＋ Añadir experiencia</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Skills</div><button class="circle" data-collapse="skills">⌃</button></div>
  <div class="section-body"><div id="skills">${data.skills.map((x, i) => skill(x, i)).join("")}</div><button class="add" id="addSkill">＋ Añadir skill</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Idiomas</div><button class="circle" data-collapse="languages">⌃</button></div>
  <div class="section-body"><div id="langs">${data.languages.map((x, i) => lang(x, i)).join("")}</div><button class="add" id="addLang">＋ Añadir idioma</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Hobbies</div><button class="circle" data-collapse="hobbies">⌃</button></div>
  <div class="section-body"><div>${data.hobbies.map((x, i) => `<div class="hobby"><input data-hobby="${i}" value="${esc(x)}"><button class="icon danger" data-del-hobby="${i}">×</button></div>`).join("")}</div><button class="add" id="addHobby">＋ Añadir hobby</button>
  <div class="note">Todo se guarda automáticamente en este navegador. Usa Exportar CSV para hacer una copia o trasladar el CV a otro equipo.</div></div>
 </section>`;
    bind();
}
function edu(x, i) {
    return `<div class="item"><div class="item-head"><strong>Formación ${i + 1}</strong>${itemButtons("education", i)}</div><div class="grid">
 ${field("Título / formación", "title", x.title, "", `data-edu="${i}" data-key="title"`)}${field("Institución", "organization", x.organization, "", `data-edu="${i}" data-key="organization"`)}
 ${field("Inicio", "startDate", x.startDate, "", `data-edu="${i}" data-key="startDate"`)}${field("Fin", "endDate", x.endDate, "", `data-edu="${i}" data-key="endDate"`)}
 </div></div>`}
function job(x, i) {
    return `<div class="item"><div class="item-head"><strong>Experiencia ${i + 1}</strong>${itemButtons("employment", i)}</div><div class="grid">
 ${field("Puesto", "title", x.title, "", `data-job="${i}" data-key="title"`)}${field("Empresa / cliente", "organization", x.organization, "", `data-job="${i}" data-key="organization"`)}
 ${field("Inicio", "startDate", x.startDate, "", `data-job="${i}" data-key="startDate"`)}${field("Fin", "endDate", x.endDate, "", `data-job="${i}" data-key="endDate"`)}
 ${field("Tecnologías", "technologies", x.technologies, "full", `data-job="${i}" data-key="technologies"`)}${field("Herramientas", "tools", x.tools, "full", `data-job="${i}" data-key="tools"`)}
 ${field("Control de versiones", "versionControl", x.versionControl, "", `data-job="${i}" data-key="versionControl"`)}${field("Gestión de proyecto", "projectManagement", x.projectManagement, "", `data-job="${i}" data-key="projectManagement"`)}
 <div class="field full"><label>Descripción / logros</label><textarea data-job="${i}" data-key="description">${esc(x.description)}</textarea></div>
 </div></div>`}
function skill(x, i) { return `<div class="skill"><input data-skill="${i}" data-key="skill" value="${esc(x.skill)}"><select data-skill="${i}" data-key="level">${skillLevels.map(v => `<option ${v == x.level ? "selected" : ""}>${v}</option>`).join("")}</select><button class="icon danger" data-del-skill="${i}">×</button></div>` }
function lang(x, i) { return `<div class="lang"><input data-lang="${i}" data-key="language" value="${esc(x.language)}"><select data-lang="${i}" data-key="level">${langLevels.map(v => `<option ${v == x.level ? "selected" : ""}>${v}</option>`).join("")}</select><button class="icon danger" data-del-lang="${i}">×</button></div>` }

function bind() {
    document.querySelectorAll("[data-p]").forEach(e => e.addEventListener("input", () => { data.personal[e.dataset.p] = e.value; save() }));
    document.getElementById("profile").oninput = e => { data.profile = e.target.value; save() };
    document.querySelectorAll("[data-edu]").forEach(e => e.oninput = () => { data.education[+e.dataset.edu][e.dataset.key] = e.value; save() });
    document.querySelectorAll("[data-job]").forEach(e => e.oninput = () => { data.employment[+e.dataset.job][e.dataset.key] = e.value; save() });
    document.querySelectorAll("[data-skill]").forEach(e => { e.oninput = () => { data.skills[+e.dataset.skill][e.dataset.key] = e.value; save() }; e.onchange = e.oninput });
    document.querySelectorAll("[data-lang]").forEach(e => { e.oninput = () => { data.languages[+e.dataset.lang][e.dataset.key] = e.value; save() }; e.onchange = e.oninput });
    document.querySelectorAll("[data-hobby]").forEach(e => e.oninput = () => { data.hobbies[+e.dataset.hobby] = e.value; save() });
    document.querySelectorAll("[data-collapse]").forEach(b => b.onclick = () => b.closest(".section").classList.toggle("collapsed"));
    document.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { let [t, i] = b.dataset.del.split(":"); data[t].splice(+i, 1); render(); save() });
    document.querySelectorAll("[data-del-skill]").forEach(b => b.onclick = () => { data.skills.splice(+b.dataset.delSkill, 1); render(); save() });
    document.querySelectorAll("[data-del-lang]").forEach(b => b.onclick = () => { data.languages.splice(+b.dataset.delLang, 1); render(); save() });
    document.querySelectorAll("[data-del-hobby]").forEach(b => b.onclick = () => { data.hobbies.splice(+b.dataset.delHobby, 1); render(); save() });
    document.querySelectorAll("[data-up]").forEach(b => b.onclick = () => move(b.dataset.up, -1));
    document.querySelectorAll("[data-down]").forEach(b => b.onclick = () => move(b.dataset.down, 1));
    document.getElementById("addEdu").onclick = () => { data.education.push({ title: "", organization: "", startDate: "", endDate: "" }); render(); save() };
    document.getElementById("addJob").onclick = () => { data.employment.push({ title: "", organization: "", startDate: "", endDate: "", technologies: "", tools: "", versionControl: "", projectManagement: "", description: "" }); render(); save() };
    document.getElementById("addSkill").onclick = () => { data.skills.push({ skill: "", level: "Good" }); render(); save() };
    document.getElementById("addLang").onclick = () => { data.languages.push({ language: "", level: "B2" }); render(); save() };
    document.getElementById("addHobby").onclick = () => { data.hobbies.push(""); render(); save() };
    const pf = document.getElementById("photoFile"), pb = document.getElementById("photoBtn"), rp = document.getElementById("removePhoto");
    if (data.personal.photo) { rp.classList.remove("hidden") }
    pb.onclick = () => pf.click(); rp.onclick = () => { data.personal.photo = ""; render(); save() };
    pf.onchange = e => { let f = e.target.files[0]; if (!f) return; let r = new FileReader(); r.onload = () => { data.personal.photo = r.result; render(); save() }; r.readAsDataURL(f) }
}
function move(spec, dir) { let [t, i] = spec.split(":"); i = +i; let j = i + dir; if (j < 0 || j >= data[t].length) return;[data[t][i], data[t][j]] = [data[t][j], data[t][i]]; render(); save() }

function dots(level) { let n = skillLevels.indexOf(level) + 1; if (n < 1) n = 3; return `<span class="dots">{"●".repeat(n)}<span style="opacity:.38">{"●".repeat(5-n)}</span></span>` }
function preview() {
    let p = data.personal;
    let contact = [p.email, p.phone, p.address, p.city, p.linkedin, p.website].filter(Boolean);
    document.getElementById("preview").innerHTML = `<div class="paper">
 <aside class="side">
  ${p.photo ? `<div class="photo"><img src="${p.photo}"></div>` : ""}
  <h1>${esc(p.name || "Tu nombre")}</h1>
  ${p.headline2 ? `<div class="headline">${esc(p.headline2)}</div>` : ""}
  <h3>Personal details</h3>
  <div class="contact">${contact.map(v => `<div>${esc(v)}</div>`).join("") || '<div style="opacity:.6">Email · teléfono · ciudad</div>'}</div>
  ${data.skills.some(x => x.skill) ? `<h3>Skills</h3>${data.skills.filter(x => x.skill).map(x => `<div class="cvskill"><span>${esc(x.skill)}</span>${dots(x.level)}</div>`).join("")}` : ""}
  ${data.languages.some(x => x.language) ? `<h3>Languages</h3>${data.languages.filter(x => x.language).map(x => `<div class="cvskill"><span>${esc(x.language)}</span><span>${esc(x.level)}</span></div>`).join("")}` : ""}
  ${data.hobbies.filter(Boolean).length ? `<h3>Hobbies</h3><div class="contact">${data.hobbies.filter(Boolean).map(x => `<div>${esc(x)}</div>`).join("")}</div>` : ""}
 </aside>
 <main class="main">
  <section><h2>Profile</h2><p class="profile">${data.profile ? esc(data.profile).replace(/\n/g, "<br>") : '<span class="empty">Añade una descripción profesional.</span>'}</p></section>
  ${data.education.filter(x => x.title || x.organization).length ? `<section><h2>Education</h2>${data.education.filter(x => x.title || x.organization).map(x => `<div class="edu"><div class="date">${esc(x.startDate)}${x.endDate ? ` - ${esc(x.endDate)}` : ""}</div><div><div class="role">${esc(x.title)}</div><div class="org">${esc(x.organization)}</div></div></div>`).join("")}</section>` : ""}
  ${data.employment.filter(x => x.title || x.organization).length ? `<section><h2>Employment</h2>${data.employment.filter(x => x.title || x.organization).map(x => `<div class="job"><div class="date">${esc(x.startDate)}${x.endDate ? ` - ${esc(x.endDate)}` : ""}</div><div><div class="role">${esc(x.title)}</div><div class="org">${esc(x.organization)}</div>
  ${x.technologies ? `<div><b>Technologies:</b> ${esc(x.technologies)}</div>` : ""}${x.tools ? `<div><b>Tools:</b> ${esc(x.tools)}</div>` : ""}${x.versionControl ? `<div><b>Version Control:</b> ${esc(x.versionControl)}</div>` : ""}${x.projectManagement ? `<div><b>Project Management:</b> ${esc(x.projectManagement)}</div>` : ""}${x.description ? `<div style="margin-top:4px">${esc(x.description).replace(/\n/g, "<br>")}</div>` : ""}</div></div>`).join("")}</section>` : ""}
 </main></div>`;
}

const headers = ["section", "name", "headline", "headline2", "email", "phone", "address", "postcode", "city", "website", "linkedin", "dob", "birthPlace", "license", "gender", "nationality", "civilStatus", "photo", "description", "title", "organization", "startDate", "endDate", "technologies", "tools", "versionControl", "projectManagement", "skill", "level", "language", "hobby"];
const ce = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
function csv() {
    let rows = [headers];
    const p = data.personal;
    rows.push(["personal", p.name, p.headline, p.headline2, p.email, p.phone, p.address, p.postcode, p.city, p.website, p.linkedin, p.dob, p.birthPlace, p.license, p.gender, p.nationality, p.civilStatus, p.photo]);
    rows.push(["profile", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", data.profile]);
    data.education.forEach(x => rows.push(["education", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", x.title, x.organization, x.startDate, x.endDate]));
    data.employment.forEach(x => rows.push(["employment", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", x.description, x.title, x.organization, x.startDate, x.endDate, x.technologies, x.tools, x.versionControl, x.projectManagement]));
    data.skills.forEach(x => rows.push(["skill", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", x.skill, x.level]));
    data.languages.forEach(x => rows.push(["language", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", x.language, x.level]));
    data.hobbies.forEach(x => rows.push(["hobby", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", x]));
    return rows.map(r => headers.map((_, i) => ce(r[i])).join(",")).join("\r\n");
}
function download(name, text, type) { let a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000) }
function parseCSV(s) {
    let rows = [], row = [], cell = "", q = false;
    for (let i = 0; i < s.length; i++) { let c = s[i], n = s[i + 1]; if (c == '"' && q && n == '"') { cell += '"'; i++; continue } if (c == '"') { q = !q; continue } if (c == "," && !q) { row.push(cell); cell = ""; continue } if ((c == "\n" || c == "\r") && !q) { if (c == "\r" && n == "\n") i++; row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = ""; continue } cell += c }
    row.push(cell); if (row.some(Boolean)) rows.push(row); return rows;
}
function importCSV(s) {
    let rs = parseCSV(s), h = rs[0]; let I = k => h.indexOf(k), g = (r, k) => I(k) >= 0 ? (r[I(k)] || "") : "";
    data = structuredClone(empty);
    rs.slice(1).forEach(r => {
        let sec = g(r, "section");
        if (sec == "personal") Object.keys(data.personal).forEach(k => data.personal[k] = g(r, k));
        else if (sec == "profile") data.profile = g(r, "description");
        else if (sec == "education") data.education.push({ title: g(r, "title"), organization: g(r, "organization"), startDate: g(r, "startDate"), endDate: g(r, "endDate") });
        else if (sec == "employment") data.employment.push({ title: g(r, "title"), organization: g(r, "organization"), startDate: g(r, "startDate"), endDate: g(r, "endDate"), technologies: g(r, "technologies"), tools: g(r, "tools"), versionControl: g(r, "versionControl"), projectManagement: g(r, "projectManagement"), description: g(r, "description") });
        else if (sec == "skill") data.skills.push({ skill: g(r, "skill"), level: g(r, "level") || "Good" });
        else if (sec == "language") data.languages.push({ language: g(r, "language"), level: g(r, "level") || "B2" });
        else if (sec == "hobby") data.hobbies.push(g(r, "hobby"));
    });
    localStorage.setItem("orange-cv", JSON.stringify(data)); render(); preview(); toast("CV importado correctamente");
}
document.getElementById("export").onclick = () => download("cv-data.csv", csv(), "text/csv;charset=utf-8");
document.getElementById("import").onclick = () => document.getElementById("file").click();
document.getElementById("file").onchange = e => { let f = e.target.files[0]; if (!f) return; let r = new FileReader(); r.onload = () => { try { importCSV(r.result) } catch (err) { alert("CSV no válido") } }; r.readAsText(f, "utf-8"); e.target.value = "" };
document.getElementById("pdf").onclick = () => { toast("Abriendo impresión: elige Guardar como PDF"); setTimeout(() => window.print(), 250) };
document.getElementById("new").onclick = () => { if (confirm("¿Crear un CV nuevo? Exporta primero tu CSV si quieres conservar este.")) { data = structuredClone(empty); localStorage.removeItem("orange-cv"); render(); preview(); toast("CV nuevo") } };
render(); preview();