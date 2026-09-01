# Progress Report PDF Generator (v2.0 Multi-Page & Analytics)

A production-ready, client-side web application built for **KAYAN CAPITAL HOLDINGS** to generate executive-grade, multi-page project progress valuation reports and analytics directly in the browser.

[![Deploy to GitHub Pages](https://github.com/NBTON/KayanPDFreports/actions/workflows/deploy.yml/badge.svg)](https://github.com/NBTON/KayanPDFreports/actions/workflows/deploy.yml)

---

## 🚀 Key Features

- **Multi-Page Dynamic PDF Reports**:
  - **Unlimited Scope Activities**: No 8-row limitation. Add any number of activities (1, 8, 20, 50+ rows).
  - **Dynamic Pagination**: Automatic page breaks that never cut rows, cards, or charts in half (`wrap={false}`).
  - **Repeating Table Headers**: Table headers seamlessly repeat on subsequent pages when the table overflows across multiple pages.
  - **Consistent Page Numbers & Footers**: Clean, fixed headers and footers with dynamic `Page X of Y` numbering.
  - **Executive Cover Page**: High-impact executive overview with Kayan logo, key metrics, timeline calculations, and project parameters.
- **Rich Analytics & Data Visualization**:
  - **Interactive SVG Donut Chart**: Weightage distribution with hover inspection, center totals, and color-coded activity breakdown.
  - **Progress Value Bars**: Activity-by-activity execution tracking with physical completion percentages, earned valuation, and total scope values.
  - **Executive KPI Cards**: Earned Valuation, Remaining Balance, Net Progress, and Timeline Duration / Days Elapsed.
  - **Smart Aggregation**: Handles empty states, single-category datasets (full 360° ring), and large datasets (>6 activities) with aggregated remainder categories.
- **100% Client-Side & Zero-Backend Privacy**:
  - All calculations, form state, and PDF generation occur entirely within the user's browser.
  - Zero network transmission of sensitive financial, contractual, or client data.
  - Bundled local fonts and vector assets guaranteeing full offline functionality.
  - Automatic `localStorage` draft auto-saving with instant recovery.
- **Dynamic Valuation & Financial Calculations**:
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
  - Automatically identifies differences between the sum of itemized scopes and the authoritative contract Project Amount.
  - Non-blocking warning banner with optional footnote inclusion on the generated PDF.
- **Modern Responsive & Accessible UI**:
  - Side-by-side desktop layout with responsive stacking for tablets and mobile devices.
  - Live PDF preview iframe with immediate re-rendering upon data changes.
  - Instant presets: Ghazlan reference (4 rows), Multi-Page large project (20 rows), Reset, and Clear All.
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
│   │   ├── AnalyticsSection.tsx # Interactive vector charts & KPI metric cards
│   │   ├── Header.tsx           # Global navigation with Presets / Reset / Clear
│   │   ├── PdfPreviewPanel.tsx  # Live preview and PDF download controller
│   │   ├── ProjectInfoForm.tsx  # Area 1: Project Information form fields & live metrics
│   │   ├── ReconciliationBanner.tsx # Non-blocking reconciliation discrepancy alert
│   │   └── ScopeTableForm.tsx   # Area 2: Scope table management (Add/Remove/Reorder/Filter)
│   ├── pdf/
│   │   ├── CoverPage.tsx        # PDF Page 1 (Cover Page layout)
│   │   ├── PdfCharts.tsx        # Vector SVG Donut Chart & Executive KPI Grid
│   │   ├── ReportDocument.tsx   # Root React-PDF Document component
│   │   ├── SummaryPage.tsx      # PDF Multi-Page (Analytics, Scope Table & Valuation)
│   │   └── styles.ts            # Standardized PDF typography, geometry, and styling
│   ├── test/
│   │   ├── calculations.test.ts # Comprehensive math, date, and validation test suite
│   │   ├── generateSamplePdf.test.ts # Sample PDF artifact generator test
│   │   ├── pdf.test.tsx         # Multi-page, scaling, and analytics PDF verification tests
│   │   └── setup.ts
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces and Zod validation schemas
│   ├── utils/
│   │   ├── calculations.ts      # Core mathematical, chart geometry, and valuation logic
│   │   ├── defaults.ts          # Generic demo, Ghazlan reference, and large 20-row datasets
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
- Activity weightages, net progress, progress values, and overall totals without intermediate rounding.
- Inclusive project duration calculation ($\text{End} - \text{Start} + 1$).
- Day number behaviors: before start date (`—`), during project ($\text{Report} - \text{Start} + 1$), and after end date (`Past due`).
- Scope/project amount reconciliation discrepancy detection.
- Percentage bounds ($0\% - 100\%$) and non-positive project amounts.
- Multi-row scaling: verified across 0, 1, 4, 8, 9, 20, and 55+ row datasets.
- Vector SVG chart generation with empty, single-category, and multi-category data.
- Multi-page PDF generation with repeating headers, repeated table headers, and dynamic page counts.
- Multi-platform filename sanitization.

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

The repository includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

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

