const empty = {
    personal: {
        name: "",
        lastname: "",
        headline2: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        linkedin: "",
        website: "",
        description: "",
        photo: ""
    },
    skills: [],
    employment: [],
    education: [],
    languages: [],
    theme: "classic"
};
const ARRAY_FIELDS = ["education", "employment", "skills", "languages"];
const ITEM_TEMPLATES = {
    education: { title: "", organization: "", startDate: "", endDate: "", description: "" },
    employment: { title: "", organization: "", startDate: "", endDate: "", technologies: "", tools: "", framework: "", versionControl: "", projectManagement: "", project: "", description: "" },
    skills: { skill: "", level: "Good" },
    languages: { language: "", level: "B2" }
};
const STORAGE_KEY = "cvack-dev";
const DRIVE_BACKUP_NAME = "cvack-dev.json";
const DRIVE_FILE_ID_KEY = "cvack-dev-drive-file-id";
let data = sanitizeData(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

function render() {
    const p = data.personal;

    const collapsedSections = new Set(
        [...document.querySelectorAll(".section.collapsed [data-collapse]")]
            .map(el => el.dataset.collapse)
    );

    document.getElementById("editor").innerHTML = `
 <section class="section" data-section="personal">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Personal details</div><button class="circle" data-collapse="personal">⌃</button></div>
  <div class="section-body">
   <div class="photo-row"><div class="photo-box">${p.photo ? `<img src="${p.photo}">` : "<span>＋</span>"}</div><div class="photo-info"><b>Photo</b><br>Optional. Recommendation: square professional image.<br><button class="btn small" id="photoBtn">Add photo</button><button class="btn small hidden" id="removePhoto">Remove</button><input id="photoFile" type="file" accept="image/*" hidden></div></div>
   <div class="grid">
    ${field("First name", "name", p.name, "", `data-p="name"`)}
    ${field("Last name", "lastname", p.lastname, "", `data-p="lastname"`)}
    ${field("Desired position", "headline2", p.headline2, "full", `data-p="headline2"`)}
    ${field("Email", "email", p.email, "", `data-p="email"`)}
    ${field("Phone", "phone", p.phone, "", `data-p="phone"`)}
    ${field("Address", "address", p.address, "full", `data-p="address"`)}
    ${field("City", "city", p.city, "full", `data-p="city"`)}
    ${field("LinkedIn", "linkedin", p.linkedin, "", `data-p="linkedin"`)}
    ${field("Website", "website", p.website, "", `data-p="website"`)}
    ${richField("Description", p.description, "full", `id="description"`)}
   </div>
  </div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Skills</div><button class="circle" data-collapse="skills">⌃</button></div>
  <div class="section-body"><div id="skills">${data.skills.map((x, i) => skill(x, i)).join("")}</div><button class="add" id="addSkill">＋ Add skill</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Work experience</div><button class="circle" data-collapse="employment">⌃</button></div>
  <div class="section-body"><div id="jobs">${data.employment.map((x, i) => job(x, i)).join("")}</div><button class="add" id="addJob">＋ Add experience</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Education</div><button class="circle" data-collapse="education">⌃</button></div>
  <div class="section-body"><div id="edu">${data.education.map((x, i) => edu(x, i)).join("")}</div><button class="add" id="addEdu">＋ Add education</button></div>
 </section>

 <section class="section">
  <div class="section-head"><div class="section-title"><span class="grip">⠿</span>Languages</div><button class="circle" data-collapse="languages">⌃</button></div>
  <div class="section-body"><div id="langs">${data.languages.map((x, i) => lang(x, i)).join("")}</div><button class="add" id="addLang">＋ Add language</button></div>
 </section>`;
    bind();
    document.querySelectorAll("[data-collapse]").forEach(button => {
        if (collapsedSections.has(button.dataset.collapse)) {
            button.closest(".section").classList.add("collapsed");
        }
    });
}
function job(x, i) {
    return `<div class="item">
        <div class="item-head">
            <strong>Experience ${i + 1}</strong>
            ${itemButtons("employment", i)}
        </div>

        <div class="grid">

            ${field(
        "Position",
        "title",
        x.title,
        "",
        `data-job="${i}" data-key="title"`
    )}

            ${field(
        "Company / client",
        "organization",
        x.organization,
        "",
        `data-job="${i}" data-key="organization"`
    )}

            ${field(
        "Start",
        "startDate",
        x.startDate,
        "",
        `data-job="${i}" data-key="startDate"`
    )}

            ${field(
        "End",
        "endDate",
        x.endDate,
        "",
        `data-job="${i}" data-key="endDate"`
    )}

            ${field(
        "Technologies",
        "technologies",
        x.technologies,
        "full",
        `data-job="${i}" data-key="technologies"`
    )}

            ${field(
        "Tools",
        "tools",
        x.tools,
        "full",
        `data-job="${i}" data-key="tools"`
    )}

            ${field(
        "Framework",
        "framework",
        x.framework,
        "full",
        `data-job="${i}" data-key="framework"`
    )}

            ${field(
        "Version control",
        "versionControl",
        x.versionControl,
        "",
        `data-job="${i}" data-key="versionControl"`
    )}

            ${field(
        "Project management",
        "projectManagement",
        x.projectManagement,
        "",
        `data-job="${i}" data-key="projectManagement"`
    )}

            ${field(
        "Project",
        "project",
        x.project,
        "full",
        `data-job="${i}" data-key="project"`
    )}

            ${richField(
        "Description / achievements",
        x.description,
        "full",
        `data-job="${i}" data-key="description"`
    )}

        </div>
    </div>`
}

function bind() {
    bindCommon();
    document.getElementById("addJob").onclick = () => {
        data.employment.push(structuredClone(ITEM_TEMPLATES.employment));

        render();
        save();
    };
}

function preview() {
    let p = data.personal;
    let addressLines = [p.address, p.city].filter(Boolean);
    let contact = [
        p.email && { value: p.email, icon: EMAIL_ICON },
        p.phone && { value: p.phone, icon: PHONE_ICON },
        addressLines.length && { lines: addressLines, icon: HOME_ICON },
        p.linkedin && { value: p.linkedin, icon: LINKEDIN_ICON },
        p.website && { value: p.website, icon: WEBSITE_ICON }
    ].filter(Boolean);
    const navy = data.theme === "navy";
    document.getElementById("themeLabel").textContent = `${navy ? "Navy" : "Classic"} Resume · A4`;
    document.getElementById("themeToggle").textContent = `Switch to ${navy ? "Classic" : "Navy"}`;
    document.getElementById("preview").innerHTML = `<div class="paper${navy ? " navy" : ""}">
 <aside class="side">
  ${p.photo ? `<div class="photo"><img src="${p.photo}"></div>` : ""}
  <h1>${esc([p.name, p.lastname].filter(Boolean).join(" ") || "Your name")}</h1>
  ${p.headline2 ? `<div class="headline">${esc(p.headline2)}</div>` : ""}
  <h3>Personal details</h3>
  <div class="contact">${contact.map(c => c.lines ? `<div class="contact-row">${c.icon}<div>${c.lines.map(esc).join("<br>")}</div></div>` : `<div>${c.icon || ""}${esc(c.value)}</div>`).join("") || '<div style="opacity:.6">Email · phone · LinkedIn · Website</div>'}</div>
  ${data.skills.some(x => x.skill) ? `<h3>Skills</h3>${data.skills.filter(x => x.skill).map(x => `<div class="cvskill"><span>${esc(x.skill)}</span>${dots(x.level)}</div>`).join("")}` : ""}
  ${data.languages.some(x => x.language) ? `<h3>Languages</h3>${data.languages.filter(x => x.language).map(x => `<div class="cvskill"><span>${esc(x.language)}</span>${langDots(x.level)}</div>`).join("")}` : ""}
  </aside>
  <main class="main">
  <section>
    <h2>Summary</h2>
    <div class="profile">
        ${p.description
            ? toRichHTML(p.description)
            : '<span class="empty">Add a professional description.</span>'}
    </div>
  </section>
  ${data.employment.filter(x => x.title || x.organization).length ? `<section><h2>Experience</h2>${data.employment.filter(x => x.title || x.organization).map(x => `<div class="job"><div class="date">${esc(x.startDate)}${x.endDate ? ` - ${esc(x.endDate)}` : ""}</div><div><div class="role">${esc(x.title)}</div><div class="org">${esc(x.organization)}</div>
  ${x.technologies ? `<div><b>Technologies:</b> ${esc(x.technologies)}</div>` : ""}
  ${x.tools ? `<div><b>Tools:</b> ${esc(x.tools)}</div>` : ""}
  ${x.framework ? `<div><b>Framework:</b> ${esc(x.framework)}</div>` : ""}
  ${x.versionControl ? `<div><b>Version Control:</b> ${esc(x.versionControl)}</div>` : ""}
  ${x.projectManagement ? `<div><b>Project Management:</b> ${esc(x.projectManagement)}</div>` : ""}
  ${x.project ? `<div><b>Project:</b> ${esc(x.project)}</div>` : ""}
  ${x.description ? `<div style="margin-top:4px"><b>Description:</b> </br>${toRichHTML(x.description)}</div>` : ""}
  </div></div>`).join("")}</section>` : ""}
  ${data.education.filter(x => x.title || x.organization).length ? `<section><h2>Education</h2>${data.education.filter(x => x.title || x.organization).map(x => `<div class="edu"><div class="date">${esc(x.startDate)}${x.endDate ? ` - ${esc(x.endDate)}` : ""}</div><div><div class="role">${esc(x.title)}</div><div class="org">${esc(x.organization)}</div>${x.description ? `<div style="margin-top:4px">${toRichHTML(x.description)}</div>` : ""}</div></div>`).join("")}</section>` : ""}
  </main></div>`;
}

render(); preview();
