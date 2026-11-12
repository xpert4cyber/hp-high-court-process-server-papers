# HPProcessServerPapers (HPPSP)
## Himachal Pradesh High Court Process Server Examination Preparation Website

[![Deploy to GitHub Pages](https://github.com/think/HPProcessServerPapers/actions/workflows/deploy.yml/badge.svg)](https://github.com/think/HPProcessServerPapers/actions/workflows/deploy.yml)
[![Validation Test](https://github.com/think/HPProcessServerPapers/actions/workflows/test.yml/badge.svg)](https://github.com/think/HPProcessServerPapers/actions/workflows/test.yml)
[![Static Site](https://img.shields.io/badge/Stack-100%25%20Static-emerald.svg)](#technology-stack)
[![Zero Backend](https://img.shields.io/badge/Backend-None%20(Pure%20Client--Side)-blue.svg)](#technology-stack)

---

## 1. Project Overview & Mission

**HPProcessServerPapers (HPPSP)** is an open-access, independent educational and competitive examination preparation platform designed specifically for candidates preparing for the **Process Server** recruitment examination under the **Establishment of District Judiciary in Himachal Pradesh**.

### Core Objectives
1. Provide verified **previous-year question papers** (including the fully solved 18 December 2022 screening paper).
2. Offer a free, interactive, client-side **50-Mark, 60-Minute Screening Mock Examination Simulator** with real-time countdown, question palette, and detailed explanations.
3. Build a scalable **500+ question bank** across Himachal Pradesh GK, Indian General Knowledge, 10+2 Mathematics, General Science, English, Hindi, and Mental Ability.
4. Provide structured **Hindi Essay Writing (~250 words)** and **English Application Writing (~100 words)** practice with live word-counter editors for the 40-mark Written Examination.
5. Provide a completely private **Student Dashboard** powered by browser `LocalStorage` that tracks test history, average score, bookmarked questions, and revision drills without requiring user accounts or backend servers.

---

## 2. Technology Stack — 100% GitHub Pages Compatible

This website is engineered strictly in compliance with GitHub Pages static hosting requirements:

- **Core Technologies:** HTML5, CSS3, Vanilla JavaScript (ES6+), JSON, SVG.
- **Client-Side Persistence:** Browser `LocalStorage` for test history, accuracy metrics, bookmarked questions, and written essay drafts.
- **Progressive Web App (PWA):** `manifest.webmanifest` and `service-worker.js` with cache versioning and offline capability.
- **Base-Path Normalization:** Dynamic base-path resolution in `assets/js/config.js` supporting both nested GitHub Pages URLs (`https://USERNAME.github.io/HPProcessServerPapers/`) and custom root domains (`https://yourdomain.com/`).
- **Automation & CI/CD:** GitHub Actions (`deploy.yml`, `test.yml`, `research-updates.yml`).

### Prohibited Technologies Audit Confirmation
| Category | Status | Confirmation |
|---|---|---|
| Python / Django / Flask / FastAPI | **NONE** | Zero `.py` scripts, no `requirements.txt`, no Python virtualenv. |
| Node.js Production Server / Express | **NONE** | No backend runtime; purely static client assets. |
| Databases (SQL / MongoDB / Redis) | **NONE** | No database servers; data stored in static JSON and browser storage. |
| PHP / Laravel | **NONE** | No PHP files. |
| Docker / Containers | **NONE** | Static hosting only. |

---

## 3. Brand Identity & Color Palette

- **Brand Name:** HPProcessServerPapers
- **Short Monogram:** HPPSP
- **Brand Colors:**
  - **Deep Navy Blue:** `#0f172a` (Primary foundation, structure)
  - **Royal Blue:** `#1d4ed8` / `#2563eb` (Action buttons, branding accent)
  - **Himachali Green:** `#059669` / `#10b981` (Pine forest accent, success states)
  - **Saffron Warm Gold:** `#d97706` / `#f59e0b` (Alerts, highlights)
  - **Surface Light:** `#ffffff` and `#f8fafc`
  - **Dark Mode Surface:** `#0b1120` and `#1e293b`
- **Logo Concept:** Himalayan snow-capped mountain peaks rising above an open educational book, symbolizing judicial wisdom, learning, and Himachal's geographical identity.

---

## 4. Website Page Directory & Structure

```text
HPProcessServerPapers/
├── index.html                                 # Main conversion-focused homepage
├── 404.html                                   # Custom 404 page
├── sitemap.xml                                # Search engine XML sitemap
├── robots.txt                                 # Crawling directives
├── manifest.webmanifest                       # PWA Web App Manifest
├── service-worker.js                          # Offline caching service worker
├── favicon.svg                                # Vector favicon
├── favicon.ico                                # Standard 32x32 ICO favicon
│
├── previous-year-question-papers/
│   ├── index.html                             # Past papers repository hub
│   ├── hp-process-server-2022/index.html      # 18 Dec 2022 authentic paper & simulator
│   └── solved-papers/index.html               # Verified solved papers archive
│
├── mock-tests/
│   ├── index.html                             # Mock tests hub
│   ├── full-length-screening-test/index.html  # 50-mark 60-min CBT exam simulator
│   ├── subject-wise/index.html                # Subject-wise tests selector
│   └── daily-practice/index.html              # Daily 15-question revision drill
│
├── question-bank/
│   ├── index.html                             # Searchable, filterable 500+ MCQ bank
│   ├── himachal-pradesh-gk/index.html         # HP GK Centre & revision notes
│   ├── general-knowledge/index.html           # Indian Constitution, History, Geography
│   ├── mathematics/index.html                 # 10+2 Arithmetic, Percentages, Ratios
│   ├── general-science/index.html             # Everyday Physics, Chemistry, Biology
│   ├── english/index.html                     # Grammar, Vocabulary, Idioms
│   ├── hindi/index.html                       # हिंदी व्याकरण, सन्धि, समास, मुहावरे
│   └── reasoning/index.html                   # Series, Coding, Direction, Analogies
│
├── written-test/
│   ├── index.html                             # 40-mark written test overview
│   ├── hindi-essay/index.html                 # Hindi essay practice (~250 words) editor
│   └── english-application/index.html         # English application (~100 words) editor
│
├── syllabus/index.html                        # Official Rules 2022 syllabus
├── exam-pattern/index.html                    # 3-stage pattern & evaluation breakdown
├── exam-preparation/index.html                # 60-day study timetable & booklist
├── recruitment-updates/index.html             # Recruitment notifications archive
├── study-material/index.html                  # Quick revision tables & high-yield facts
├── answer-keys/index.html                     # Official answer keys archive & objections
├── results/index.html                         # Cutoffs, merit list & 1:5 ratio analysis
├── faq/index.html                             # Comprehensive candidate FAQ
├── dashboard/index.html                       # Student dashboard (LocalStorage analytics)
│
├── about/index.html                           # Mission, background & editorial team
├── contact/index.html                         # Contact & corrections submission form
├── privacy-policy/index.html                  # Privacy policy & LocalStorage disclosure
├── disclaimer/index.html                      # Statutory non-affiliation disclaimer
├── terms-and-conditions/index.html            # Terms of service
├── sitemap/index.html                         # HTML Sitemap directory
│
├── assets/
│   ├── css/
│   │   ├── style.css                          # Core CSS design system
│   │   ├── responsive.css                     # Mobile & tablet breakpoints
│   │   ├── animations.css                     # Transitions & reduced-motion rules
│   │   └── print.css                          # Print & PDF clean stylesheet
│   ├── js/
│   │   ├── config.js                          # Dynamic base-path resolver & theme
│   │   ├── storage.js                         # LocalStorage data persistence
│   │   ├── main.js                            # Global UI & PWA registration
│   │   ├── exam-engine.js                     # 50-question 60-min CBT test engine
│   │   ├── question-bank.js                   # Real-time search & filter engine
│   │   ├── dashboard.js                       # Dashboard analytics & charts
│   │   └── search.js                          # Global search modal (Ctrl+K)
│   └── images/                                # SVG logos and vector banners
│
├── brand/
│   ├── logo/                                  # Primary, compact, icon, and monochrome SVGs
│   ├── favicon/                               # Favicon package (16x16, 32x32, 180, 192, 512)
│   └── social/                                # Open Graph banner (1200x630)
│
├── data/
│   ├── questions/                             # Subject JSON datasets
│   ├── papers.json                            # Past paper metadata
│   ├── syllabus.json                          # Official syllabus schema
│   └── updates.json                           # Recruitment notices
│
├── research/
│   ├── sources.json                           # Tier-1 and Tier-2 research records
│   └── verification-log.json                  # Date-stamped audit logs
│
└── .github/workflows/
    ├── deploy.yml                             # Automated GitHub Pages deployment
    ├── test.yml                               # Static asset & JSON validator
    └── research-updates.yml                   # Scheduled research source auditor
```

---

## 5. Official Examination Structure (Rules 2022)

Based on *The Himachal Pradesh District Judiciary Staff Rules, 2022*:

1. **Stage-I: Screening Test (50 Marks, 60 Minutes)**
   - 50 Multiple Choice Questions (1 mark each).
   - No negative marking.
   - Subjects: HP GK, General Knowledge, 10+2 Mathematics, Science, English, Hindi, and Mental Ability.
   - Shortlisting: Exactly **1:5 ratio** (5 candidates per vacancy) qualify for Stage-II.
2. **Stage-II: Written Test (40 Marks, 60 Minutes)**
   - **Hindi Essay (25 Marks):** Approx. 250 words on one of three given topics.
   - **English Application/Letter (15 Marks):** Approx. 100 words in formal court layout.
   - Special weightage awarded for neat, legible handwriting.
   - Forms **80% of final appointment merit**.
3. **Stage-III: Evaluation & Interview (10 Marks)**
   - Educational Qualification (Max 3 Marks): 10+2 pass = 1, 10+2 1st div = 2, Graduation = 3.
   - Experience in Courts/Govt (Max 3 Marks).
   - Personality Test / Interview (4 Marks).
4. **Final Appointment Merit:** Calculated out of **50 Marks** (40 Written Test + 10 Evaluation).

---

## 6. How to Deploy to GitHub Pages

### Step 1: Push Repository to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Complete HPProcessServerPapers website"
git branch -M main
git remote add origin https://github.com/USERNAME/HPProcessServerPapers.git
git push -u origin main
```

### Step 2: Configure GitHub Pages Settings
1. On GitHub, navigate to your repository **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow will automatically trigger, validate all static assets, and deploy your site to:
   ```text
   https://USERNAME.github.io/HPProcessServerPapers/
   ```

### Step 3: (Optional) Custom Domain Configuration
1. In repository **Settings** &rarr; **Pages**, enter your custom domain (e.g., `hpprocessserverpapers.org`).
2. Add a `CNAME` record in your DNS provider pointing to `USERNAME.github.io`.
3. Check the box for **Enforce HTTPS**.
4. Update `productionDomain` in `assets/js/config.js` to match your domain.

### Step 4: Google Search Console Submission
1. Add your property in [Google Search Console](https://search.google.com/search-console).
2. Submit your sitemap URL:
   `https://USERNAME.github.io/HPProcessServerPapers/sitemap.xml` (or custom domain sitemap).

---

## 7. Non-Affiliation Legal Disclaimer

**HPProcessServerPapers (HPPSP)** is an independent educational examination preparation platform. It is **NOT** affiliated with, endorsed by, sponsored by, or connected to the High Court of Himachal Pradesh or any official judicial authority. All official recruitment announcements, statutory rules, and application forms must be accessed directly from the official portal at [highcourt.hp.gov.in](https://highcourt.hp.gov.in/).
