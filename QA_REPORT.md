# CampusPulse — Comprehensive Quality Assurance & Repository Audit Report
**Date:** 2026-10-25 | **Challenge:** BenQ × Hackyard 2026 @ IIT Guwahati

---

## 1. Executive Summary

This QA audit evaluates the CampusPulse prototype against the authoritative challenge constraints:
- **Challenge:** "Contribute to building a Smarter Campus using technology"
- **Constraints:** Any platform, free/paid vibe-coding tools permitted, 1-hour build time, 5-minute pitch time.
- **Criteria:** 1. Quality of the idea, 2. Quality of the pitch, 3. Quality and functionality of the working prototype.
- **Strict Evidence Integrity:** No unverified claims of institutional deployment at IIT Guwahati, official BenQ hardware API integrations, physical IoT utility sensor readings, or live cross-device cloud synchronization without a backend server.
- **Enhanced Verification:** Covers evidence-aware resolution, transparent environmental provenance, and live same-origin cross-tab synchronization with loop breaking.

---

## 2. Verified Working Functionality

The repository contains a clean, robust, client-side web application built with React 19, TypeScript 5.7, Vite 6.2, and Tailwind CSS 3.4:
- **Build & Bundle:** `tsc && vite build` successfully produces a minified bundle with zero compilation errors (built in ~2.1s).
- **Navigation & URL Routing:** Cleanly routes between Experience A (Student Reporting), Experience B (Operations Command Hub), and Experience C (BenQ Campus Signage), including URL hash (`#kiosk`, `#operations`, `#report`) and query parameter (`?role=kiosk`) support.
- **Cross-Tab Synchronization:** Tab 1 (Operations) and Tab 2 (Public Signage) synchronize state dynamically on the same origin via native browser `storage` events without page reloads or infinite write-back echo loops.
- **Core Triage Loop:** Complete 5-stage closed loop: Report $\to$ Prioritize $\to$ Act $\to$ Resolve $\to$ Communicate.
- **Resolution Evidence States:** Distinct lifecycle status (`RESOLVED`) and evidence status (`STATUS_RECORDED`, `OPERATOR_DOCUMENTED`, `EVIDENCE_ATTACHED`).
- **Storage Safety:** Image downscaling to $\le 600\text{px}$ canvas and fallback stripping on storage exhaustion to preserve issue records.
- **Deterministic Priority Engine:** Heuristic algorithm computes priority score (1–100) using 55% urgency, 35% category impact, and 10% unresolved-report age.
- **Environmental Data Provenance:** Honest segregation between physical utility sub-meters (`NOT MEASURED — No live utility-meter data connected`, value: `null`) and disclosed modeled heuristics.
- **Public Display Privacy:** Strictly strips reporter personal identifiers and internal free-text resolution notes from the public signage display.
- **Attachment Storage Integrity:** Storage quota exhaustion automatically downgrades `EVIDENCE_ATTACHED` to `OPERATOR_DOCUMENTED` or `STATUS_RECORDED`, ensuring no false evidence state is persisted or broadcast.

---

## 3. Audit Findings & Resolution Matrix

| Issue ID | Severity | Description | Resolution Status |
| :--- | :--- | :--- | :---: |
| **CRIT-01** | Critical | Missing root `PITCH.md` deliverable with 5-min runbook. | **RESOLVED** (`PITCH.md` created with 7-step runbook & judge Q&A) |
| **CRIT-02** | Critical | False "Measured: 0" environmental representation when no meter exists. | **RESOLVED** (Replaced with `NOT MEASURED — No live utility-meter data connected`, value: `null`) |
| **CRIT-03** | Critical | False `EVIDENCE_ATTACHED` state retained when image storage quota failed. | **RESOLVED** (Trial write tests storage; downgrades to `OPERATOR_DOCUMENTED`/`STATUS_RECORDED` and preserves note) |
| **HIGH-01** | High | Overstated hardware protocol claims in BenQ kiosk view. | **RESOLVED** (Reframed as browser-rendered layout designed for 16:9 displays) |
| **HIGH-02** | High | Free-text internal resolution notes exposed on public signage ticker. | **RESOLVED** (Removed free-text notes from public display; standardized badges only) |
| **HIGH-03** | High | Storage corruption vulnerability on invalid JSON. | **RESOLVED** (Defensive schema validation & seed fallback implemented) |
| **MED-01** | Medium | Conflation of modeled estimates with physical meter savings. | **RESOLVED** (Explicit provenance: Measured = null, Modeled = Disclosed heuristic formula) |
| **MED-02** | Medium | Ambiguous "verification" and "proof" terminology in operations. | **RESOLVED** (Reframed to `Status Recorded`, `Resolution Note Recorded`, `Photo Attached`) |
| **MED-03** | Medium | Priority utility lacked input bounds against `NaN`/negative values. | **RESOLVED** (Sanitized in `priority.ts`, SLA age reframed to report age) |
| **MED-04** | Medium | Kiosk QR code cross-device ambiguity. | **RESOLVED** (Explicitly labeled as in-app simulated demonstration shortcut) |
| **MED-05** | Medium | Unsubstantiated competitive claims regarding Anytime Help & IntelliGrid. | **RESOLVED** (Rewritten `COMPETITIVE_ANALYSIS.md` citing 8 primary sources) |
| **MED-06** | Medium | Attributing demonstration numerical constants to IITG Green Office. | **RESOLVED** (Clarified as prototype demonstration constants in seed data & UI) |
| **LOW-01** | Low | Missing semantic `id`/`htmlFor` pairings on report form inputs. | **RESOLVED** (Accessible pairings implemented in `StudentReportView.tsx`) |

---

## 4. Test Suite Execution & Acceptance Verification

All 67 automated verification assertions passed successfully (`node tests/verify-user-journey.mjs`):

### Group 1: Resolution Evidence Workflow (VT-01 .. VT-08, BEH-01 .. BEH-08, SEC10-05 .. SEC10-07)
- ✅ `[BEH-01]` Rejection of empty resolution note when documented is selected
- ✅ `[BEH-01]` Rejection of whitespace-only resolution note
- ✅ `[BEH-01]` Rejection of note shorter than 10 characters
- ✅ `[BEH-02]` Acceptance of valid resolution note ($\ge 10$ characters)
- ✅ `[BEH-03]` Status-only resolution does not require a note
- ✅ `[BEH-06]` Prevent `EVIDENCE_ATTACHED` without an attachment
- ✅ `[BEH-05]` Evidence attachment with valid note is accepted
- ✅ `[VT-01]` A report with only a status change does not receive an unsupported evidence state
- ✅ `[VT-02]` A valid resolution note produces the operator-documented state
- ✅ `[VT-03]` Attaching valid evidence produces the evidence-attached state
- ✅ `[VT-04]` Oversized attachment (>2MB) is rejected
- ✅ `[VT-04]` Invalid file format is rejected
- ✅ `[BEH-04]` Attachment validation accepts valid WebP under 2MB
- ✅ `[SEC10-06]` Failed attachment persistence does not leave false evidence-attached state
- ✅ `[SEC10-07]` Valid resolution note remains available after attachment fails
- ✅ `[VT-05]` Attachment-storage failures handled safely without corrupting issue record
- ✅ `[SEC10-05]` Attachment can be reopened after save & reload
- ✅ `[VT-06]` Evidence metadata persists cleanly across serialization roundtrips
- ✅ `[VT-07]` Evidence remains strictly associated with its specific parent issue
- ✅ `[VT-08]` Existing status lifecycle transitions still work cleanly

### Group 2: Public Display Transparency & Privacy (VT-09 .. VT-13, BEH-09 .. BEH-13, SEC10-08)
- ✅ `[BEH-10]` Active items display `IN PROGRESS` badge
- ✅ `[VT-09]` Display identifies `EVIDENCE ATTACHED` badge
- ✅ `[VT-09]` Display identifies `RESOLUTION RECORDED` badge
- ✅ `[VT-09]` Display identifies `STATUS RECORDED` badge
- ✅ `[VT-10]` Public signage content excludes reporter identity
- ✅ `[BEH-11]` Public signage content excludes reporter email and contact details
- ✅ `[SEC10-08]` Public signage does not display reporter identity or unrestricted internal resolution notes
- ✅ `[VT-11]` Newly updated issue appears correctly in public signage ticker list
- ✅ `[VT-12]` Public display handles issues without evidence cleanly
- ✅ `[VT-13]` Ticker continuous looping list remains functional

### Group 3: Environmental Provenance (VT-14 .. VT-17, BEH-12 .. BEH-13, SEC10-01 .. SEC10-04)
- ✅ `[SEC10-01]` No connected meter produces `NOT_MEASURED` (value: null), not `MEASURED: 0`
- ✅ `[SEC10-02]` Measured, modeled and unavailable states remain distinct
- ✅ `[SEC10-03]` Modelled estimates not included in measured totals
- ✅ `[SEC10-04]` Retained formulas have consistent units
- ✅ `[VT-16]` Environmental outputs use correct standardized units (`kWh`, `Liters`, `kg`)
- ✅ `[BEH-13]` Safety category outputs `NOT_MEASURED` with zero resource claim
- ✅ `[BEH-13]` Facilities category outputs `NOT_MEASURED` with zero resource claim

### Group 4: Cross-Tab Synchronization & Routing (BEH-14 .. BEH-17, SEC10-09 .. SEC10-11)
- ✅ `[SEC10-11]` Malformed/invalid storage events handled safely
- ✅ `[SEC10-09]` Cross-tab issue updates work without reloading
- ✅ `[BEH-16]` Cross-tab storage listener sets loop-breaker flag to prevent write-back loops
- ✅ `[SEC10-10]` Cross-tab metric updates work where applicable
- ✅ `[BEH-16]` Cross-tab storage listener breaks metrics write-back loops
- ✅ `[BEH-17]` URL hash `#kiosk` initializes public signage role
- ✅ `[BEH-17]` URL hash `#operations` initializes operations command hub role
- ✅ `[BEH-17]` URL hash `#report` initializes student reporter role
- ✅ `[BEH-17]` URL query `?role=kiosk` initializes public signage role

### Group 5: Regression Verifications (VT-18 .. VT-25, BEH-18 .. BEH-20, SEC10-12 .. SEC10-18)
- ✅ `[SEC10-12]` Issue submission valid/invalid checks pass
- ✅ `[VT-18]` Existing report submission form validation rejects invalid input
- ✅ `[VT-19]` Priority Engine: `EMERGENCY` + `SAFETY` scores in `CRITICAL` tier
- ✅ `[VT-19]` Priority Engine: `HIGH` + `ENERGY` scores in `HIGH` tier
- ✅ `[VT-19]` Priority Engine: `LOW` + `FACILITIES` scores in `LOW` tier
- ✅ `[SEC10-13]` Priority calculations remain correct
- ✅ `[BEH-18]` Priority Engine: `NaN` age handled safely without `NaN` propagation
- ✅ `[VT-20]` Active KPI count matches active issues (5)
- ✅ `[VT-20]` Resolved KPI count matches closed issues (2)
- ✅ `[VT-21]` Category filter correctly isolates `ENERGY` records
- ✅ `[VT-21]` Status filter correctly isolates `REPORTED` records
- ✅ `[SEC10-15]` KPI counts and filters remain correct
- ✅ `[SEC10-16]` Audit history remains consistent
- ✅ `[SEC10-14]` Status transitions remain correct
- ✅ `[SEC10-17]` Demo reset restores intended state
- ✅ `[BEH-19]` Demo-data reset preserves baseline evidence states
- ✅ `[VT-24]` Storage loader recovers gracefully from corrupted JSON
- ✅ `[BEH-20]` Storage loader recovers gracefully from empty array
- ✅ `[VT-25]` Sequential ticket numbers and IDs are guaranteed unique
- ✅ `[SEC10-18]` Test suite completes all assertions without failures

---

## 5. Build Verification
- **Command:** `npm run build` (`tsc && vite build`)
- **Status:** **PASS** (Zero TypeScript compilation errors; production build succeeded in 2.61s).
- **Bundle Breakdown:**
  - `dist/index.html`: 1.14 kB (gzip: 0.66 kB)
  - `dist/assets/index-Dg2GRLwR.css`: 38.58 kB (gzip: 6.94 kB)
  - `dist/assets/index-BE4qhusL.js`: 381.25 kB (gzip: 101.41 kB)
- **Deployment Readiness:** 100% self-contained static client application ready for deployment.

---

## 6. Post-Challenge Productization & Data-Integrity Audit (October 29, 2026)

### 6.1 Clean Runtime Data & Removal of Fabricated Metrics
- **Zero-Seed Baseline:** `src/context/CampusPulseContext.tsx` initializes with an empty array `[]` when no stored user records exist.
- **Test Fixture Isolation:** Pre-populated demonstration records moved to `tests/fixtures/testSeedData.ts`. `src/data/seedData.ts` exports empty arrays. Zero runtime files in `src/` import seed data.
- **Dynamic Metric Computation:** All operational counts and sustainability models derive dynamically via `computeEcoMetrics(issues)` strictly from user-created records.
- **Deliberate Local Data Management:** Replaced destructive demo resets with a deliberate "Clear reports" modal with user confirmation.
- **Zone Report Activity:** Zones with 0 active reports display `"No reports"` (neutral gray), preventing false claims of "Optimal" health without reports.

### 6.2 Public Landing Page & UI Content Audit
- **Obsolete Evaluator Copy Removed:** Removed all evaluator runbook labels, pitch buttons, demo preset chips, and competition badges from the running interface.
- **Accurate Evidence Terminology:** Replaced "Verified photo proof" with "Photo attached" and "Photo attachments on record".
- **Hash Routing Integrity:** Verified that `/` renders the landing page, `/#report` opens student intake, `/#operations` opens operations hub, `/#kiosk` opens public signage, and in-page anchors (`#how-it-works`, `#workspaces`, `#trust-ledger`) preserve the landing page without accidental role switches.

### 6.3 Test Verification Results
- **Core User Journey Suite:** 67 / 67 tests passing (`tests/verify-user-journey.mjs`).
- **Landing Page & Integrity Suite:** 45 / 45 tests passing (`tests/verify-landing-and-data-integrity.mjs`).
- **Total Automated Test Assertions:** **112 / 112 PASS**.
- **Visual Acceptance Status:** Due to container GPU/display boundaries in headless Windows sandbox execution, raster screenshot generation is documented as `UNVERIFIED` in `UI_VISUAL_QA.md`, while structural DOM/CSS audit passes completely. Manual verification instructions provided in `UI_VISUAL_QA.md`.
