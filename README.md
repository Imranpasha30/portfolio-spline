# Universal Premium Portfolio Website

> Inspired by the editorial, dark aesthetic of [touquirakhtar.com](https://touquirakhtar.com/), built with React, Vite, CSS Custom Properties, and modular data architecture. Compatible with the [Swarm Rebuild](https://chromewebstore.google.com/detail/swarm-rebuild/diaeaocnhdhbknkbfbnkjikfcgokainm?pli=1) animation tool.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ How to Customize with Your Own Details

All personal content is separated from the UI components so you can update everything from dedicated configuration files:

### 1. Master Personal Details & Settings: `src/config/site.js`
Open [`src/config/site.js`](./src/config/site.js) to change:
- **Identity**: Full Name, Display Name, Profession, Hero Greeting, Headline, Role Description, and Bio.
- **Portrait**: Put your portrait in `public/assets/portrait.webp` and update `portrait` path in config (or leave blank to use the built-in monogram artwork).
- **Contact Details**: Public email, phone number, WhatsApp, and location.
- **Social Profiles**: GitHub, LinkedIn, Twitter/X, Dribbble, etc.
- **Metrics**: Years of experience, completed projects count, client rating.
- **Skills & Methodology**: Technical categories, skill badges, and 4-step engineering process.
- **Preferences**: Toggle sections on/off (`showAwards`, `showTestimonials`, `showExperience`, etc.).

### 2. Projects & Case Studies: `src/data/projects.js`
Open [`src/data/projects.js`](./src/data/projects.js) to add or edit your work:
- Title, Subtitle, Category ("Full Stack", "Web Apps", "Mobile Apps", "UI/UX Systems")
- Year, Summary, Detailed Architecture Story
- Live Demo URL and GitHub Source URL
- Key Impact Metrics (e.g. Query speed, node counts, conversion gains)
- Technical tools & stack badges

### 3. Career Timeline & Testimonials: `src/data/experience.js`
Open [`src/data/experience.js`](./src/data/experience.js) to update:
- Work experience timeline (Role, Company, Dates, Bullet points, Tech stack)
- Education & Certifications
- Client testimonials & endorsements
- Industry awards & recognitions

---

## ⚡ Native Swarm Rebuild Animation Built-In

This portfolio includes the **complete official Swarm Rebuild engine built directly into the website's own source code** (no Chrome extension required for your visitors):

* **Trigger anytime:**
  * Click the **`⚡ REBUILD`** button in the top navigation header.
  * Click the floating **`⚡ SWARM REBUILD [S]`** pill at the bottom right.
  * Press **`S`** (or `Alt + Shift + S`) on your keyboard anywhere on the page.
* **What happens:**
  * 36+ multiplayer cursors flock into the screen.
  * The actual DOM elements of your portfolio (headline, studio portrait, project cards, buttons) are scanned in real-time.
  * The swarm dynamically draws wireframe bounding boxes with crosshairs, snaps rulers and guides, and types text letter-by-letter.
  * Built-in Web Audio synthesis generates real typing taps and click sounds.
  * Top HUD controls let visitors adjust speed (1x / 2x / 3x), toggle Tour mode, pause, or exit.
  * Smoothly dissolves back into the live interactive website.
- **Fonts**: `Anton` (Monumental display), `Manrope` (Body), and `Caveat` (Handwritten accent).
- **Subtle Film Grain**: Built-in SVG fractal noise texture overlay.
- **Motion Toggle**: On/Off button in header with `localStorage` persistence and `prefers-reduced-motion` compliance.
- **Project Dialog**: Full modal case study viewer with keyboard trapping and Escape key support.
- **Swarm Rebuild**: Semantic markup ready for dynamic page rebuild recording via the Swarm Chrome extension (`Alt + Shift + S`).
- **Live Local Time**: Automatically shows current time in your configured city timezone in the footer.

