# CampusPulse: From Report to Resolution
### Campus Infrastructure Reporting, Operations Command & Ambient Signage
**Architecture:** 100% Self-Contained Client-Side Web Application (React 19, TypeScript 5.7, Tailwind CSS, Vite)

---

## 🌟 Product Overview

Sprawling university campuses frequently face an **"Operational Black Hole"**:
1. **Reporting Friction:** When students or staff observe energy waste (e.g., HVAC left running in an empty lecture hall), water leaks, or pathway lighting faults, reports either never get submitted or disappear into an opaque administrative void.
2. **Prioritization Paralysis:** Operations and maintenance crews receive fragmented emails and phone calls without objective urgency scoring.
3. **Communication Blindspot:** The campus community never knows when an issue is acknowledged, leading to duplicate reports and user apathy.

**CampusPulse** closes this loop completely through a 5-stage lifecycle:
$$\textbf{Report} \longrightarrow \textbf{Prioritize} \longrightarrow \textbf{Act} \longrightarrow \textbf{Resolve} \longrightarrow \textbf{Communicate}$$

By connecting fast student reporting with a **transparent heuristic priority engine**, an audit-grade **Trust & Impact Ledger**, and **ambient public signage with real-time cross-tab synchronization** (designed for 16:9 large-format screens), CampusPulse turns passive bystanders into active campus stewards and celebrates institutional accountability.

---

## 🌐 Application Architecture & Four Connected Surfaces

CampusPulse is organized into a public product homepage and three synchronized operational workspaces:

### 0. 🏛️ Public Product Landing Page (Root Route `/`)
- **Product Overview & Mission:** Introduces the Report-to-Resolution mission, the 5-stage closed loop, and key operational capabilities.
- **Closed-Loop Workflow Preview:** Interactive conceptual preview illustrating how issues transition across the 5 stages from initial detection to verified resolution and ambient signage broadcast.
- **Feature Pillars:** Explains the 3-tier Resolution Evidence Ladder, the environmental provenance framework, and provides direct workspace launch actions.
- **Always Accessible:** Can be revisited at any time from any workspace by clicking the CampusPulse wordmark or the "Overview" button in the global header.

### 1. 📱 Student & Campus Reporting View (`/#report`)
- **Sub-45s Submission:** Clean category selector (Energy, Water, Waste, Safety, Facilities), campus zone picker, and location details.
- **Dynamic Heuristic Engine Preview:** Informational mathematical scoring (1–100) based on Urgency (55%), Category/Eco Impact (35%), and Unresolved-Report Age (10%).
- **Clean Baseline & Empty State:** Starts with a clean zero-seed baseline. When no reports are recorded, displays a clear informative empty state. Newly submitted reports appear immediately in the local feed.
- **Privacy First:** Student identities remain strictly in internal operational records and are never broadcast on public signage screens.

### 2. 🛠️ Operations Command Hub & Trust & Impact Ledger (`/#operations`)
- **Real-Time KPI Suite:** Total Active Tickets, Critical Priority count, In Progress count, and Documented Resolutions—derived dynamically from current records.
- **Multi-Filter & Search:** Filter by Status (`Reported`, `Triaged`, `In Progress`, `Resolved`), Category, Zone, or keyword with Table and Card view modes.
- **Trust & Impact Ledger:**
  - **Explicit Evidence States:** Resolving an issue categorizes it into:
    - `STATUS_RECORDED`: Status closed in queue without formal notes.
    - `OPERATOR_DOCUMENTED`: Technician work note ($\ge 10$ chars) recorded on file.
    - `EVIDENCE_ATTACHED`: Technician work-completion photo attached.
  - **Local Storage Quota Protection:** Uploaded images are validated (JPEG, PNG, WebP $\le 2$ MB) and downscaled client-side via an offscreen HTML canvas to max 600px JPEG (~25-40 KB), ensuring reliable persistence within browser storage quotas without blowing 5MB limits.
  - **Closed Incident Ledger Table:** Searchable audit table listing all closed tickets with their evidence level badge, technician notes, and an inline modal to inspect attached physical evidence.
  - **Environmental Provenance Transparency:** Explicitly classifies sustainability data as `MEASURED` (`NOT MEASURED — No live utility-meter data connected`, value: `null`), `MODELLED` (calculated from disclosed equipment power ratings and illustrative downtime constants), or `NOT_MEASURED` (unapplicable for civil hardware).
  - **Cross-Tab Launch Link:** "Open Signage Tab" (`#kiosk`) directly from the header for immediate multi-window demonstration.
- **Audit Trail:** Complete timestamped lifecycle history for every ticket.

### 3. 📺 Campus Signage Mode (`/#kiosk`, Designed for 16:9 Large Displays)
- **Ambient 16:9 Display:** High-contrast ambient layout formatted for 16:9 displays; hardware and proprietary signage platforms are not implemented.
- **Live Cross-Tab Synchronization:** Tab 1 (Operations) and Tab 2 (Public Signage) synchronize dynamically on the same origin via native browser `storage` events without page reloads or infinite write-back echo loops.
- **Evidence-Aware Resolution Marquee Ticker:** Continuously scrolls recently resolved tickets with standardized badges (`PHOTO ATTACHED`, `NOTE RECORDED`, `STATUS RECORDED`). Active items show `IN PROGRESS`. Personal identifiers and internal notes are completely suppressed for privacy.
- **Accessible Motion Controls:** Dedicated ticker Pause/Play control button and `@media (prefers-reduced-motion: reduce)` support in accordance with WCAG 2.2 Success Criterion 2.2.2.
- **Report Activity by Campus Zone:** Honestly reflects active report counts by campus sector, displaying `"No reports"` for sectors without active incidents (rejecting false claims of "Optimal" health without reports).
- **Eco-Impact Provenance Card:** Displays `NOT MEASURED` for live telemetry, and discloses illustrative formulas for modelled heuristics.

---

## 🎨 Warm, Editorial Campus Service UI/UX & Accessibility

The user interface adopts a **warm, editorial, human-centered campus service design**:
- **Design Tokens:** Warm off-white canvas (`#F6F6F1`), crisp white surfaces (`#FFFFFF`), hairline borders (`#DCE2D9`), deep ink typography (`#202720`), and forest green primary accents (`#246348`).
- **Single-Column Reporting Sequence:** Student Intake follows an intuitive single-column flow (Category $\to$ Zone $\to$ Location $\to$ Urgency $\to$ Title & Description $\to$ Optional Reporter Name $\to$ Submit).
- **Secondary Estimated Priority:** Algorithmic scoring remains deterministic and transparent under the hood, but is presented as an informational estimate with collapsible calculation details.
- **Zero-Seed Runtime Baseline:** A fresh installation initializes with an empty issue collection and zeroed metrics. Pre-existing legacy demonstration seed records are cleanly migrated and removed while preserving legitimate user records.
- **Deliberate Local Data Management:** A deliberate "Clear reports" modal allows users to safely clear browser-stored reports with an explicit confirmation step.
- **WCAG 2.2 AA Accessibility Compliance:**
  - **Modal Dialog Trapping:** Resolution, Assignment, and Confirmation modals implement focus trapping (Tab cycling), `Escape` key dismissal, and `role="dialog"`.
  - **Live Regions:** Dynamic priority calculation updates and toast notifications announce changes to assistive technologies (`role="status"`, `aria-live="polite"`).
  - **Accessible Names:** Icon buttons and filter inputs possess descriptive `aria-label` attributes.
  - **Motion Controls:** Marquee ticker animation respects user OS reduced-motion preferences (`prefers-reduced-motion: reduce`) and provides an inline pause/play toggle button.

---

## 🧪 Verification & Acceptance Tests

Our automated test suite exercises **112 test assertions** across two comprehensive test suites:

### Suite 1: Core Journey & Trust Ledger (`tests/verify-user-journey.mjs` — 67 Tests)
- Report creation and field validation (`VT-18`, `SEC10-12`).
- Deterministic priority scoring, tier boundaries, and edge cases (NaN/negative hours, unknown categories) (`VT-19`, `BEH-18`, `SEC10-13`).
- Resolution input validation: rejects missing/whitespace notes for documented resolutions, prevents `EVIDENCE_ATTACHED` without attachments (`BEH-01 .. BEH-06`).
- Full resolution evidence workflow (`STATUS_RECORDED`, `OPERATOR_DOCUMENTED`, `EVIDENCE_ATTACHED`) (`VT-01 .. VT-08`, `SEC10-05 .. SEC10-07`).
- Public display evidence-state segregation (`IN PROGRESS`, `PHOTO ATTACHED`, `RESOLUTION NOTE RECORDED`, `STATUS RECORDED`), ticker updates, and privacy filtering (`VT-09 .. VT-13`, `BEH-09 .. BEH-11`, `SEC10-08`).
- Disclosed environmental provenance and strict separation of unavailable measurements (`NOT_MEASURED`, null) from modelled metrics (`VT-14 .. VT-17`, `BEH-12 .. BEH-13`, `SEC10-01 .. SEC10-04`).
- Cross-tab synchronization via native browser storage events with loop breaking and safe handling of storage clear / malformed JSON (`BEH-14 .. BEH-16`, `SEC10-09 .. SEC10-11`).
- URL hash and query role routing (`#kiosk`, `#operations`, `#report`, `?role=kiosk`) (`BEH-17`).
- Sequential ticket identification and uniqueness (`VT-25`).

### Suite 2: Landing Page & Data Integrity (`tests/verify-landing-and-data-integrity.mjs` — 45 Tests)
- Runtime source files do not import seedData or test fixtures (`REQ16-01`).
- Clean zero-seed baseline export in static configuration (`REQ16-02`, `REQ16-03`).
- Absence of obsolete evaluator/competition copy from public landing page (`REQ02-01`).
- Main product headline, in-page section navigation, and workspace actions (`REQ04-01 .. REQ04-04`).
- Honest evidence terminology ("Photo attached", avoiding "Verified photo proof") (`REQ03-02`, `REQ03-03`).
- Absence of 1-click evaluation demo presets from StudentReportView (`REQ16-04`, `REQ16-05`).
- Truthful empty states in Student Intake, Operations Hub, and Public Signage (`REQ16-06`, `REQ16-07`, `REQ16-11`).
- Campus signage zone report status (rejection of false "Optimal" labels) (`REQ16-09`, `REQ16-10`).
- Deliberate local reports clearing action with confirmation modal (`REQ16-13`).
- Hash routing and in-page anchor conflict prevention (`ROUTING-01 .. ROUTING-08`).
- Targeted storage migration filtering known seed records while preserving user records (`MIGRATION-01 .. MIGRATION-03`).
- Dynamic eco-metrics computation derived strictly from resolved user issues (`METRICS-01`, `METRICS-02`).

```bash
# Run all automated test suites (112/112 passed)
npm test

# Build production bundle (TypeScript compile + Vite build)
npm run build
```

---

## 💻 Quick Start & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser:
# Root Landing Page:     http://localhost:5173/
# Student Intake View:   http://localhost:5173/#report
# Operations Command:    http://localhost:5173/#operations
# Public Campus Signage: http://localhost:5173/#kiosk

# To test live cross-tab synchronization:
# Window 1 (Operations Hub): http://localhost:5173/#operations
# Window 2 (Public Signage): http://localhost:5173/#kiosk
```

---

## 📚 Disclosures & Limitations

1. **Independent Evaluation Prototype:** CampusPulse is an independent prototype application. Demonstration records and reports created are stored strictly in the browser's local storage.
2. **No Hardware or Live System Integration:** No live utility sub-meters, physical IoT hardware, institutional databases, or native BenQ X-Sign systems are connected.
3. **Environmental Metrics Scope:** Modelled environmental figures (e.g. avoided power in kWh) are calculated using transparent downtime heuristics. Physical utility meter measurements display `NOT_MEASURED` (`null`) to preserve scientific integrity.
4. **Visual Acceptance Status:** Due to container GPU/display boundaries in headless Windows sandbox execution, raster pixel screenshot capture cannot be generated programmatically and is documented as `UNVERIFIED` in [UI_VISUAL_QA.md](./UI_VISUAL_QA.md). Evaluators are invited to review the rendered application live using `npm run dev`.
