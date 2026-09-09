# CVack — CV Builder

A lightweight CV/resume builder built with vanilla HTML, CSS, and JavaScript.

CVack allows users to create, edit, preview, save, import, and export professional CV data directly in the browser.

The application requires no backend and no external dependencies.

## Features

* Personal details editor
* Professional description
* Education history
* Employment history
* Technologies
* Tools
* Frameworks
* Version control
* Project management
* Projects
* Skills with proficiency levels
* Languages with proficiency levels
* Profile photo upload
* Live CV preview
* A4 resume layout
* Local browser storage
* JSON export
* JSON import
* Print / Save as PDF
* Responsive layout
* No backend required
* No external dependencies

## Project Structure

```text
cvack/

├── index.html
├── cv-general.html
├── cv-dev.html
├── README.md
│
├── css/
│   ├── home.css
│   └── styles.css
│
└── js/
    ├── script.js
    └── general.js
```

## CV Types

CVack provides a home page where users can choose the type of CV they want to create.

### General CV

The general CV is designed for users who need a standard professional resume.

### Developer CV

The developer CV includes additional fields specifically useful for software development experience, including:

* Technologies
* Tools
* Framework
* Version control
* Project management
* Project
* Description / achievements

## Requirements

You only need:

* A modern web browser
* Python 3.x

Recommended browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

No Node.js installation is required.

## Important: Run Through a Local Server

The application should be opened through a local web server.

Do **not** open the HTML files directly with a double-click.

Opening the project using a `file://` URL can cause browser restrictions and prevent some JavaScript functionality from working correctly.

## Start the Application

### 1. Open a terminal

Navigate to the project directory.

Example:

```bash
cd path/to/cvack
```

### 2. Start the Python development server

Run:

```bash
python -m http.server 8000
```

On some systems, you may need:

```bash
python3 -m http.server 8000
```

### 3. Open the application

Open your browser and visit:

```text
http://localhost:8000
```

The CVack home page should now load.

From there, select the desired CV type.

## Stop the Server

Return to the terminal and press:

```text
Ctrl + C
```

## Using the Application

### Create a CV

From the home page, select the desired CV type.

The developer CV editor contains the following sections:

* Personal details
* Skills
* Employment
* Education
* Languages

The personal details section includes:

* Name
* Last name
* Desired position
* Email
* Phone
* LinkedIn
* Website
* Description
* Profile photo

Changes are reflected immediately in the CV preview.

## Personal Details

The personal information section allows you to enter your main contact and professional information.

Available fields:

* Name
* Last name
* Desired position
* Email
* Phone
* LinkedIn
* Website
* Description
* Profile photo

The description is displayed in the CV preview under the **Profile** section.

## Add Education

Click:

```text
＋ Añadir formación
```

You can add multiple education entries.

Each education entry contains:

* Title / education
* Institution
* Start date
* End date
* Description

Education entries can be reordered or removed.

## Add Employment

Click:

```text
＋ Añadir experiencia
```

You can add multiple employment entries and reorder them.

Each employment entry contains:

* Position
* Company / client
* Start date
* End date
* Technologies
* Tools
* Framework
* Version control
* Project management
* Project
* Description / achievements

This structure is especially useful for documenting software development experience.

## Add Skills

Click:

```text
＋ Añadir skill
```

Each skill can have a proficiency level.

Available levels:

* Beginner
* Moderate
* Good
* Very good
* Excellent

Skills are displayed in the CV preview with a visual proficiency indicator.

## Add Languages

Click:

```text
＋ Añadir idioma
```

Available language levels include:

* Beginner
* Moderate
* Good
* Very good
* Fluent
* A1
* A2
* B1
* B2
* C1
* C2

Languages are displayed in the CV preview together with their selected level.

## Profile Photo

The application supports an optional profile photo.

Click:

```text
Añadir foto
```

Select an image from your computer.

The image is converted to a data URL and stored locally with the CV data.

You can remove the photo at any time using:

```text
Eliminar
```

## Live Preview

The CV preview updates automatically whenever information is changed.

The preview uses an A4-style resume layout containing:

### Sidebar

* Profile photo
* Name
* Desired position
* Personal details
* Skills
* Languages

### Main content

* Profile
* Employment
* Education

The editor uses **Description** as the field name, while the generated CV displays this information under the **Profile** heading.

## Local Storage

The application automatically stores CV data in the browser using `localStorage`.

The storage key is:

```text
orange-cv
```

This allows the current CV to remain available when the browser is closed and reopened.

### Important

Local storage belongs to the specific browser and device being used.

If browser storage is cleared, the saved CV data may be deleted.

For backup purposes, use the application's:

```text
Export JSON
```

function.

## JSON Export

The application can export the complete CV data as a JSON file.

Click:

```text
Export
```

The generated file contains the CV data, including:

* Personal information
* Description
* Education
* Employment
* Technologies
* Tools
* Framework
* Version control
* Project management
* Project
* Skills
* Languages
* Profile photo

The filename is generated using the person's name and the current date.

Example:

```text
RESUME_John_Doe-09092026.json
```

## JSON Import

Click:

```text
Import
```

Select a previously exported JSON file.

The application validates the imported data and updates:

* The editor
* The CV preview
* Local browser storage

For best compatibility, use a JSON file generated by CVack's own export function.

## JSON Data Structure

The general structure of the CV data is:

```json
{
  "personal": {
    "name": "",
    "lastname": "",
    "headline2": "",
    "email": "",
    "phone": "",
    "linkedin": "",
    "website": "",
    "description": "",
    "photo": ""
  },
  "education": [],
  "employment": [],
  "skills": [],
  "languages": []
}
```

An employment entry contains:

```json
{
  "title": "",
  "organization": "",
  "startDate": "",
  "endDate": "",
  "technologies": "",
  "tools": "",
  "framework": "",
  "versionControl": "",
  "projectManagement": "",
  "project": "",
  "description": ""
}
```

## Download the CV as PDF

Click:

```text
Download CV
```

The browser print dialog will open.

Choose:

```text
Save as PDF
```

For the best result:

* Paper size: A4
* Margins: None or Default
* Scale: 100%
* Background graphics: Enabled

The application uses print-specific CSS to hide the editor and navigation controls.

## New CV

To start a new CV, click:

```text
New
```

The application will ask for confirmation before replacing the current CV.

The current CV data should be exported first if you want to keep a backup.

## Development

This project uses native browser technologies:

```text
HTML
CSS
JavaScript
localStorage
FileReader API
Blob API
Browser Print API
```

There is no build process.

There is no bundler.

There are no npm dependencies.

## JavaScript Responsibilities

### `script.js`

Handles the developer CV editor and application logic.

Responsibilities include:

* Define the CV data structure
* Load saved CV data
* Render the editor
* Render the CV preview
* Handle personal information
* Handle education
* Handle employment
* Handle skills
* Handle languages
* Add and remove items
* Reorder items
* Handle photo uploads
* Handle collapsed sections
* Save data to local storage
* Import JSON
* Export JSON
* Generate the PDF filename
* Trigger browser printing

### `general.js`

Handles the general CV editor.

Responsibilities may include:

* General CV data structure
* Personal information
* Education
* Employment
* Skills
* Languages
* CV preview
* JSON import/export
* Local storage

### `styles.css`

Contains the styles for the CV editor and developer CV preview.

Responsibilities include:

* Editor layout
* Form fields
* Buttons
* CV sections
* A4 paper layout
* Sidebar
* Main CV content
* Skills indicators
* Responsive behavior
* Print styles

### `home.css`

Contains the styles for the CVack home page.

Responsibilities include:

* Home page layout
* CV type selector
* General CV card
* Developer CV card
* Header
* Responsive behavior

## Troubleshooting

### The page does not load correctly

First verify that you are running the project through a local server.

Use:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Do not open the project directly using:

```text
file:///path/to/cvack/index.html
```

### JavaScript is not working

Open the browser developer tools.

Usually:

```text
F12 → Console
```

Look for errors displayed in red.

Common problems include:

```text
Uncaught ReferenceError
```

```text
Uncaught TypeError
```

```text
Failed to load resource
```

These usually indicate a JavaScript error, incorrect file path, missing file, or incorrect DOM element ID.

### CSS is not loading

Verify that the HTML file contains the correct stylesheet reference.

For the developer CV:

```html
<link rel="stylesheet" href="./css/styles.css">
```

For the home page:

```html
<link rel="stylesheet" href="./css/home.css">
```

Also verify that the files exist in:

```text
css/styles.css
css/home.css
```

### The preview is empty

Check the browser console first.

The preview depends on the JavaScript responsible for rendering the CV.

An error in the editor or preview logic can prevent the CV from rendering correctly.

Also verify that the preview container exists in the HTML.

### Imported JSON does not work

Make sure the selected file is valid JSON.

For best compatibility, use a JSON file generated by the application's own **Export** function.

If the JSON was created with an older version of CVack, some fields may not exist in the imported data.

### Old CV data is appearing

CVack uses:

```text
orange-cv
```

as its local storage key.

If an older version of the application was previously used in the same browser, old fields may remain in local storage.

To completely reset the stored data, use the **New** button or clear the site's local storage through the browser developer tools.

## Reset the Application

To start from a completely empty CV, use:

```text
New
```

The application will ask for confirmation before replacing the current CV.

For a complete reset, you can also clear the browser's local storage for the application.

## Security and Privacy

The application does not require a backend server.

CV data is stored locally in the browser using `localStorage`.

Imported files are processed directly in the browser.

No CV information is intentionally uploaded to a remote server by the application.

Profile photos are stored locally as part of the CV data.

## License

This project can be adapted and modified according to the needs of the project owner.

## Future Improvements

Possible future features include:

* Multiple CV templates
* Drag-and-drop section ordering
* Custom colors
* Custom fonts
* PDF generation without the browser print dialog
* Dark mode
* Multiple CV profiles
* Cloud synchronization
* Additional export formats
* Template customization
* Undo / redo support
* More detailed form validation
* Better JSON validation
* Additional developer-specific fields
* CV sharing
* Multilingual CV support
