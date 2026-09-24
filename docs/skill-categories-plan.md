# Plan: Categorías de skills (solo en el CV de Developer)

> Nota: este documento retoma el trabajo revertido en el commit "revert: remove
> skill categories from developer CV". Sirve como punto de partida para
> continuar la funcionalidad más adelante.

## Contexto

El usuario quiere que los skills del **CV de Developer** (`js/script.js`) tengan
una categoría (ej. "Programming Languages", "Databases"), para poder
agruparlos visualmente en el preview en vez de mostrarlos como una lista
plana sin organizar. Esto es explícitamente **solo para dev** — el CV General
(`js/general.js`) no lleva esta funcionalidad.

## Categorías de referencia (14) — inspiración tomada de LinkedIn

1. AI
2. Automation Building Tools
3. Automation Tools and Frameworks
4. Databases
5. Other Frameworks/Libraries/Tools
6. Platforms
7. Programming/Scripting/Markup Languages
8. Project Management/Defects/Test Cases Tools
9. Soft Skills
10. Test Context & Approaches
11. Test Techniques & Types
12. Version Control
13. Virtualization
14. Web Frameworks

## Categorías recomendadas (8) — versión simplificada para CVack

1. Programming Languages
2. Frameworks & Libraries
3. Databases
4. Cloud & Platforms
5. DevOps & Automation
6. Version Control
7. AI & Machine Learning
8. Soft Skills

**Cómo se ve en el preview:** agrupado con un subtítulo chico por cada
categoría que tenga al menos un skill cargado (las categorías vacías no
aparecen), en el orden de la lista de arriba — no en el orden en que se
cargaron los skills.

## Punto clave de arquitectura: `skill()` es compartido

`function skill(x, i)`, el binding genérico `[data-skill]`, y `addSkill` viven
los tres en `js/common.js` (compartidos entre ambos editores). El CV General
usa esta misma función y **no** debe mostrar ningún campo de categoría. La
solución, consistente con el patrón ya establecido en el proyecto
(`ITEM_TEMPLATES`, `MIGRATIONS`, `CV_TYPE` — constantes por archivo que
`common.js` referencia condicionalmente): agregar una constante
`SKILL_CATEGORIES` **solo en `script.js`**, y hacer que `skill()` en
`common.js` chequee si existe antes de renderizar el campo extra. `general.js`
nunca la define, así que sus skills se renderizan exactamente igual que hoy.

El binding genérico `[data-skill]` en `bindCommon()` ya funciona para
cualquier `data-key` sin cambios — el nuevo `<select data-key="category">` va
a actualizar `data.skills[i].category` automáticamente, sin tocar esa parte.

## Nada de migración de schema necesaria

Agregar `category` a `ITEM_TEMPLATES.skills` (solo en script.js) es
exactamente el caso que `pickFields`/`sanitizeData` ya maneja de forma
transparente: un skill viejo sin `category` simplemente recibe el valor por
defecto de la plantilla la primera vez que se sanitiza (al cargar o
importar). No hace falta tocar `MIGRATIONS` ni subir `SCHEMA_VERSION` — este
es justamente el tipo de cambio aditivo para el que se diseñó `pickFields`.

## Cambios

### 1. `js/script.js`

- Agregar constante, cerca de `ITEM_TEMPLATES`:
  ```js
  const SKILL_CATEGORIES = [
      "Programming Languages",
      "Frameworks & Libraries",
      "Databases",
      "Cloud & Platforms",
      "DevOps & Automation",
      "Version Control",
      "AI & Machine Learning",
      "Soft Skills"
  ];
  ```
- `ITEM_TEMPLATES.skills` pasa de `{ skill: "", level: "Good" }` a
  `{ skill: "", level: "Good", category: SKILL_CATEGORIES[0] }` (una skill
  nueva arranca en "Programming Languages" por defecto, no en un estado
  "sin categoría").
- `preview()`: reemplazar la línea actual de Skills:
  ```js
  ${data.skills.some(x => x.skill) ? `<h3>Skills</h3>${data.skills.filter(x => x.skill).map(x => `<div class="cvskill"><span>${esc(x.skill)}</span>${dots(x.level)}</div>`).join("")}` : ""}
  ```
  por una versión que agrupa por `SKILL_CATEGORIES` en orden, mostrando cada
  categoría como un subtítulo solo si tiene al menos un skill con nombre:
  ```js
  ${data.skills.some(x => x.skill) ? `<h3>Skills</h3>${SKILL_CATEGORIES.map(cat => {
      const items = data.skills.filter(x => x.skill && x.category === cat);
      if (!items.length) return "";
      return `<div class="skill-category">${esc(cat)}</div>${items.map(x => `<div class="cvskill"><span>${esc(x.skill)}</span>${dots(x.level)}</div>`).join("")}`;
  }).join("")}` : ""}
  ```

### 2. `js/common.js`

- `skill(x, i)`: agregar el `<select data-key="category">` solo si
  `SKILL_CATEGORIES` está definida (chequeo
  `typeof SKILL_CATEGORIES !== "undefined"`, mismo patrón defensivo que ya
  usa el resto de `common.js` para constantes por archivo), y agregar la
  clase `has-category` al contenedor en ese caso para que el CSS pueda
  darle 4 columnas en vez de 3:
  ```js
  function skill(x, i) {
      const hasCategories = typeof SKILL_CATEGORIES !== "undefined";
      return `<div class="skill${hasCategories ? " has-category" : ""}">
          <input data-skill="${i}" data-key="skill" value="${esc(x.skill)}">
          ${hasCategories ? `<select data-skill="${i}" data-key="category">${SKILL_CATEGORIES.map(c => `<option ${c == x.category ? "selected" : ""}>${c}</option>`).join("")}</select>` : ""}
          <select data-skill="${i}" data-key="level">${skillLevels.map(v => `<option ${v == x.level ? "selected" : ""}>${v}</option>`).join("")}</select>
          <button class="icon danger" data-del-skill="${i}">×</button>
      </div>`;
  }
  ```
  (Formato multilínea solo para claridad acá; en el archivo real sigue el
  estilo compacto de una sola línea que ya usa el resto de `common.js`.)

### 3. `css/styles.css`

- Separar `.skill` de `.lang` en la regla de grid (ya no comparten el mismo
  layout siempre), y agregar el caso de 4 columnas:
  ```css
  .skill,
  .lang {
      display: grid;
      grid-template-columns: 1fr 145px 38px;
      gap: 8px;
      margin-bottom: 9px
  }

  .skill.has-category {
      grid-template-columns: 1fr 150px 110px 38px
  }
  ```
- Agregar el mismo ajuste en el media query `@media(max-width:650px)`
  existente, donde hoy `.skill, .lang { grid-template-columns: 1fr 120px 38px }`,
  agregando `.skill.has-category { grid-template-columns: 1fr 1fr 100px 38px }`
  o similar (a definir el valor exacto en el momento, ajustándolo
  visualmente).
- Agregar estilo para el subtítulo de categoría en el preview (nuevo, dentro
  del sidebar):
  ```css
  .skill-category {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      opacity: .7;
      margin: 8px 0 4px
  }
  ```

## Verificación

1. **General CV no cambia**: abrir `cv-general.html`, confirmar que la fila
   de skill sigue siendo de 3 columnas (nombre, nivel, borrar), sin ningún
   selector de categoría, y que el preview de Skills sigue en lista plana
   sin subtítulos.
2. **Dev CV — editor**: abrir `cv-dev.html`, agregar un skill nuevo,
   confirmar que aparece con 4 columnas (nombre, categoría, nivel, borrar)
   y que la categoría por defecto es "Programming Languages".
3. **Dev CV — preview agrupado**: cargar varios skills en categorías
   distintas (ej. "JavaScript" en Programming Languages, "React" en
   Frameworks & Libraries, dejar una categoría sin ningún skill), confirmar
   que el preview muestra un subtítulo por cada categoría *usada*, en el
   orden de `SKILL_CATEGORIES`, y que las categorías vacías no aparecen.
4. **Import/export/Drive**: exportar el JSON del dev CV, confirmar que cada
   skill incluye `category`; importar un JSON de skills sin `category`
   (formato viejo) y confirmar que se completa con el valor por defecto sin
   errores (probando que `pickFields` cubre esto sin necesitar migración).
5. **Regresión rápida**: borrar/reordenar skills en el dev CV, confirmar que
   el campo de categoría persiste correctamente después de `render()` (el
   binding genérico ya debería cubrir esto, pero conviene confirmarlo en
   vivo).
