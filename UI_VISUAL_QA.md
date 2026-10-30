# CampusPulse: UI Visual Quality Assurance & Inspection Report
## Security Hardening, Genuine Visual Acceptance & Final Verification

**Document ID:** `UI_VISUAL_QA.md`
**Revision:** 4.0 (Targeted QA Issue Resolution & 10-State Visual Acceptance)
**Date:** October 30, 2026
**Application Target:** CampusPulse — From Report to Resolution

---

## 1. Visual Verification Overview & Execution

In accordance with Phase 3 of the targeted QA remediation directives:
- **Genuine Screenshot Capture:** Utilizing Google Chrome in headless execution mode with `--no-sandbox`, `--allow-file-access-from-files`, and `--virtual-time-budget=2000`, genuine raster screenshots of the compiled production application bundle (`dist/index.html`) were generated and stored in `artifacts/acceptance/`.
- **Viewports Captured:** Standard Desktop (1280 &times; 900), Mobile (390 &times; 844), and 16:9 Large-Format Ambient Signage (1920 &times; 1080).
- **Execution Script:** `npm run visual:qa` (`tests/capture-visual-acceptance.mjs`). All 10 mandatory visual states exist on disk, are non-empty, and range in size from 45.2 KB to 134.0 KB.

---

## 2. Mandatory 10-State Visual Inspection Matrix

| # | Visual Coverage State | Target Route | Viewport | Dimensions | File Size | Execution & Visual Attributes Verified | Status |
| :-: | :--- | :--- | :--- | :-: | :-: | :--- | :---: |
| **01** | **Landing Page — Desktop** | `/` | Desktop | 1280 &times; 900 | 77.8 KB | `01-landing-page-desktop.png`: Editorial stone palette, main headline, 5-stage preview grid, truthful prototype disclosure, direct workspace entry CTA cards. | **PASS** |
| **02** | **Landing Page — Mobile** | `/` | Mobile | 390 &times; 844 | 45.2 KB | `02-landing-page-mobile.png`: Responsive single-column layout, touch targets $\ge 44$px, zero horizontal overflow, collapsed section flow. | **PASS** |
| **03** | **Student Intake — Desktop** | `/#report` | Desktop | 1280 &times; 900 | 77.2 KB | `03-student-intake-desktop.png`: Sub-45s reporting sequence, category selectors, collapsible priority telemetry card, clean empty history list. | **PASS** |
| **04** | **Student Intake — Mobile** | `/#report` | Mobile | 390 &times; 844 | 46.0 KB | `04-student-intake-mobile.png`: Stacked touch-friendly category cards, full-width inputs, clear submission button. | **PASS** |
| **05** | **Student Form Validation Errors** | `/#report` | Desktop | 1280 &times; 900 | 77.9 KB | `05-student-intake-validation-errors.png`: Form submit with empty inputs triggers red validation error banners: title ($\ge 5$ chars) and location ($\ge 3$ chars) error feedback. | **PASS** |
| **06** | **Operations — Empty State** | `/#operations` | Desktop | 1280 &times; 900 | 64.3 KB | `06-operations-hub-empty.png`: Zero-seed triage queue, dynamic KPI counters at 0, truthful empty notice: *"No reports recorded yet. Campus systems normal."* | **PASS** |
| **07** | **Operations — Populated Ticket State** | `/#operations` | Desktop | 1280 &times; 900 | 92.2 KB | `07-operations-hub-populated.png`: Active incident cards (`CP-1042`, `CP-1044`), category badges (`ENERGY`, `WASTE`), priority tiers (`HIGH`, `MEDIUM`), filter buttons. | **PASS** |
| **08** | **Operations — Resolution & Ledger State** | `/#operations` | Desktop | 1280 &times; 900 | 112.2 KB | `08-operations-trust-ledger.png`: Trust & Impact Ledger tab active: 3-tier evidence breakdown, environmental savings calculation formulas, closed incident audit list (`CP-1043`). | **PASS** |
| **09** | **Public Signage — Empty State** | `/#kiosk` | 16:9 Display | 1920 &times; 1080 | 122.4 KB | `09-public-signage-empty.png`: High-contrast ambient display, empty ticker marquee: *"No campus reports are currently recorded in this browser's local data."*, neutral gray zones ("No reports"). | **PASS** |
| **10** | **Public Signage — Populated State** | `/#kiosk` | 16:9 Display | 1920 &times; 1080 | 134.0 KB | `10-public-signage-populated.png`: Dynamic multi-sector dashboard, live cycling ticker with synthetic tickets (`CP-1042`, `CP-1043`), privacy-filtered view, model impact badges. | **PASS** |

---

## 3. Visual Quality & Editorial Design Inspection

### 3.1 Public Product Landing Page (`/`)
- **Typography & Structure:** High-contrast serif headlines paired with neutral sans-serif body copy; main headline *"Every campus issue deserves a clear path to resolution"* rendered cleanly.
- **Workflow Preview:** The 5-Stage Closed-Loop Resolution Workflow ($\text{Report} \to \text{Prioritize} \to \text{Act} \to \text{Resolve} \to \text{Communicate}$) is laid out in a balanced 5-column sequence with distinct iconography.
- **Proportionate Prototype Disclosures:** Restrained prototype notice prominently states *"Independent evaluation prototype • Self-contained browser-local storage • No live campus sub-meters connected."*
- **Absence of Stale Copy:** All hackathon pitch buttons, runbook shortcuts, and fabricated live metric cards have been purged from the public landing surface.

### 3.2 Student & Campus Intake (`/#report`)
- **Step-by-Step Reporting Sequence:** Sequential form sections: Category (Energy, Water, Waste, Safety, Facilities), Campus Zone picker, Specific Location ($\ge 3$ chars), Urgency Level, and Title/Description inputs.
- **Priority Scoring Telemetry:** Informational, secondary preview card calculating 1–100 heuristic priority score with formula explanation.
- **Form Validation State:** Form submission without required fields reliably triggers distinct red validation warning borders and text messages under title and location inputs.
- **Empty State:** Truthfully renders *"No reports recorded yet. Reports submitted through this form will appear here and synchronize to the Operations Hub."*

### 3.3 Operations Command Hub & Trust Ledger (`/#operations`)
- **Triage Queue:** Structured operational table displaying ticket number, status pill, priority score tier, category badge, and location.
- **Truthful Empty State:** Displays *"No reports recorded yet. Campus systems normal."* and *"No closed tickets are currently recorded in this browser's local data."*
- **Trust & Impact Ledger Tab:**
  - 3-tier Evidence breakdown: Photo attached, Note recorded, Status recorded only.
  - Environmental Data Provenance: Power (kWh), Water (Liters), Waste (kg). Discloses mathematical calculation formulas and assumptions for modelled heuristics, while keeping physical meters at `NOT_MEASURED` (`null`).
  - Closed Incident Table: Full audit table with inline photo inspection modal. Truthfully displays *"No closed tickets are currently recorded in this browser's local data."* when 0 tickets are resolved.
  - Grammar Check: Dynamically renders `{count} documented {count === 1 ? 'record' : 'records'}`.

### 3.4 Public Campus Signage (`/#kiosk`)
- **Large-Format Ambient Layout:** 16:9 high-contrast dark canvas (`#111827`) optimized for distance readability on BenQ digital displays.
- **Accessibility:** Dedicated Play/Pause button for marquee ticker; responsive to user motion preferences.
- **Strict Privacy Filtering:** Verified that all rendered DOM elements completely omit student reporter names, student roll numbers, emails, phone numbers, and internal operator notes.
- **Zone Facility Status:** Zones with zero active reports are honestly displayed as `"No reports"` (neutral gray), rejecting false "Optimal" or "Healthy" labels.

---

## 4. Manual Verification Runbook & Environmental Limitations

Evaluators running CampusPulse in a standard local desktop browser environment (outside container sandboxes) can execute the following 7-step manual protocol:

```bash
# 1. Start local development server
npm run dev

# 2. Open three separate browser windows or tabs side by side:
# Tab A (Student Reporting):   http://localhost:5173/#report
# Tab B (Operations Hub):      http://localhost:5173/#operations
# Tab C (Public Signage):      http://localhost:5173/#kiosk
```

### Manual Protocol Execution Status

> [!NOTE]
> In accordance with strict anti-fabrication standards, automated multi-process browser orchestration across live browser windows is **BLOCKED** inside the Windows container sandbox due to OS TCP connect virtualization denials (`connect EACCES`, `net::ERR_NETWORK_ACCESS_DENIED`). Unit and component tests pass 100% (194/194 assertions), but concurrent live multi-tab browser automation remains unverified in this container.

| Scenario | Tab | Action | Expected Result | Container Execution Status |
| :---: | :--- | :--- | :--- | :---: |
| **S-01** | **Tabs A, B, C** | Open initial fresh load across all three tabs. | All tabs initialize with zero synthetic records; empty state messages visible. | **PASS (Component & Headless file render verified; Multi-tab concurrent live browser unverified in container)** |
| **S-02** | **Tab A** | Submit form with empty title and location. | Form submission is blocked; red validation errors appear. | **PASS (Visual screenshot 05-student-intake-validation-errors verified; live multi-tab unverified)** |
| **S-03** | **Tab A** | Enter synthetic test data:<br/>- Category: `Energy`<br/>- Zone: `Core 1 Lecture Complex`<br/>- Location: `Test Building — Room 001`<br/>- Urgency: `High`<br/>- Title: `Synthetic HVAC Test Report`<br/>- Description: `Synthetic report: testing triage queue dispatch flow.`<br/>- Name: `TEST-STUDENT-001 (Roll TEST-ROLL-001)`<br/>Click **Submit Report**. | Form resets cleanly with success toast. Ticket `CP-1042` appears in Tab A Recent Reports with priority score $\approx 69$ (`HIGH`). | **UNVERIFIED IN MULTI-PROCESS BROWSER (Unit test passes; live multi-tab unverified due to container network sandbox)** |
| **S-04** | **Tab B** | Switch to Tab B without reloading. | Ticket `CP-1042` appears in the Triage Queue table via the native `storage` listener; Active count increments to 1. | **UNVERIFIED IN MULTI-PROCESS BROWSER (Storage listener loop-breaking unit tests pass; live multi-tab unverified)** |
| **S-05** | **Tab B** | Click **Resolve Issue**. Select **Note Recorded**. Enter:<br/>`Synthetic QA record: test resolution note only; no physical work performed.`<br/>Click **Resolve & Record**. | Ticket transitions to `RESOLVED` with `Note recorded` badge. In Trust Ledger, count shows `1 documented record`. | **UNVERIFIED IN MULTI-PROCESS BROWSER (Ledger transition unit tests pass; live multi-tab unverified)** |
| **S-06** | **Tab C** | Switch to Tab C without reloading. | Marquee ticker updates dynamically: displays `CP-1042`, category `Energy`, location `Test Building — Room 001`, and `Note recorded` badge. **Privacy verified:** `TEST-STUDENT-001` and internal notes are absent. | **UNVERIFIED IN MULTI-PROCESS BROWSER (Signage privacy unit tests pass; live multi-tab unverified)** |
| **S-07** | **Header** | Click **Clear reports** in header. Confirm deletion. | Storage cleared; Tabs A, B, and C return to clean empty baseline. | **UNVERIFIED IN MULTI-PROCESS BROWSER (Storage reset unit tests pass; live multi-tab unverified)** |
