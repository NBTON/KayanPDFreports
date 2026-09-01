# Progress Report PDF Generator

A production-ready, client-side web application built for **KAYAN CAPITAL HOLDINGS** to generate exact, executive-grade two-page project progress valuation PDFs directly in the browser.

[![Deploy to GitHub Pages](https://github.com/NBTON/KayanPDFreports/actions/workflows/deploy.yml/badge.svg)](https://github.com/NBTON/KayanPDFreports/actions/workflows/deploy.yml)

---

## 🚀 Key Features

- **Exact Two-Page PDF Layout**:
  - **Page 1 (Cover Page)**: Clean executive overview featuring company branding, project details, timeline metrics, inclusive day counts, and net progress.
  - **Page 2 (Project Scope Summary)**: Formatted table with activity descriptions, contractual prices, computed activity weightages, net progress, and progress values alongside an overall completion valuation card.
- **100% Client-Side & Zero-Backend Privacy**:
  - All calculations, form management, and PDF rendering occur entirely inside the user's browser.
  - Zero network transmission of sensitive financial or contractual data.
  - Bundled local fonts and vector assets guaranteeing full offline functionality.
- **Dynamic Valuation Calculations**:
  - **Inclusive Project Duration**: $\text{End Date} - \text{Start Date} + 1$ calendar days.
  - **Day Number**:
    - *Before start date*: Displays `—`.
    - *During project*: $\text{Report Date} - \text{Start Date} + 1$ (uses selected report date).
    - *After end date*: Displays `Past due`.
  - **Activity Weightage**: $\frac{\text{Scope Amount}}{\text{Project Amount}}$ (calculated without intermediate rounding).
  - **Net Progress**: $\text{Activity Weightage} \times \text{Physical Completion Decimal}$.
  - **Progress Value**: $\text{Scope Amount} \times \text{Physical Completion Decimal}$.
  - **Overall Net Progress**: $\sum \text{Net Progress}$.
  - **Total Progress Value**: $\sum \text{Progress Value}$.
- **Scope Reconciler & Discrepancy Warnings**:
  - Automatically identifies any difference between the sum of itemized scope lines and the authoritative contract Project Amount (e.g. Ghazlan reference workbook discrepancy).
  - Non-blocking warning banner with optional footnote inclusion on Page 2.
- **Responsive & Accessible UI**:
  - Side-by-side desktop layout with responsive stacking for mobile/tablet devices.
  - Automatic draft persistence in `localStorage` with smooth autosave status.
  - Full keyboard accessibility, clear input error messages, and immediate live PDF preview.
  - Standardized sanitized export filename format: `Progress_Report_[Project_Name]_[YYYY-MM-DD].pdf`.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Bundler & Build Tool**: Vite 6
- **PDF Engine**: `@react-pdf/renderer` v4
- **Form & Validation**: `react-hook-form` + `@hookform/resolvers` + `zod`
- **Styling**: Tailwind CSS + Lucide React icons
- **Testing**: Vitest with `@testing-library/react` and `@testing-library/jest-dom`

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── fonts/                   # Bundled local fonts
│   └── logo.png                 # Official high-resolution Kayan logo
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── logoBase64.ts        # Self-contained base64 asset for offline PDF rendering
│   ├── components/
│   │   ├── Header.tsx           # Global navigation with Load Example / Reset / Clear
│   │   ├── PdfPreviewPanel.tsx  # Live preview and PDF download controller
│   │   ├── ProjectInfoForm.tsx  # Area 1: Project Information form fields & live metrics
│   │   ├── ReconciliationBanner.tsx # Non-blocking reconciliation discrepancy alert
│   │   └── ScopeTableForm.tsx   # Area 2: Scope table management (Add/Remove/Reorder)
│   ├── pdf/
│   │   ├── CoverPage.tsx        # PDF Page 1 (Cover Page layout)
│   │   ├── ReportDocument.tsx   # Root React-PDF Document component
│   │   ├── SummaryPage.tsx      # PDF Page 2 (Scope & Valuation layout)
│   │   └── styles.ts            # Standardized PDF typography, geometry, and styling
│   ├── test/
│   │   ├── calculations.test.ts # Comprehensive math and validation test suite
│   │   ├── generateSamplePdf.test.ts # Sample PDF artifact generator test
│   │   ├── pdf.test.tsx         # PDF structure and page count verification tests
│   │   └── setup.ts
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces and Zod validation schemas
│   ├── utils/
│   │   ├── calculations.ts      # Core mathematical and date valuation logic
│   │   ├── defaults.ts          # Generic demo data and Ghazlan reference datasets
│   │   └── storage.ts           # Safe localStorage persistence helpers
│   ├── App.tsx                  # Master responsive page layout
│   ├── index.css                # Tailwind CSS base styles
│   └── main.tsx                 # React DOM entrypoint
├── index.html                   # HTML entrypoint
├── package.json
├── tsconfig.json
└── vite.config.ts               # Configured for GitHub Pages subpaths
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- npm 9+

### 2. Installation
```bash
git clone https://github.com/NBTON/KayanPDFreports.git
cd KayanPDFreports
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated Tests

Run the complete Vitest test suite:
```bash
npm run test
```
The test suite validates:
- Activity weightages, net progress, progress values, and overall totals.
- Inclusive project duration calculation ($\text{End} - \text{Start} + 1$).
- Day number behaviors: before start date (`—`), during project ($\text{Report} - \text{Start} + 1$), and after end date (`Past due`).
- Scope/project amount reconciliation discrepancy detection.
- Percentage bounds ($0\% - 100\%$) and non-positive project amounts.
- Strict 8-row scope limit for 2-page layout guarantee.
- Multi-platform filename sanitization.
- Verification that generated PDFs contain exactly 2 pages with embedded logo and header blocks.

---

## 🏗️ Production Build & Verification

To create an optimized production build:
```bash
npm run build
```
To test and preview the production build locally:
```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`).

1. Push your changes to the `main` branch:
   ```bash
   git push origin main
   ```
2. Enable GitHub Pages in your repository settings:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The workflow will automatically test, build, and deploy the application to:
   `https://nbton.github.io/KayanPDFreports/`

---

## 📄 License & Confidentiality

Internal corporate tool developed for **KAYAN CAPITAL HOLDINGS**. All rights reserved.
